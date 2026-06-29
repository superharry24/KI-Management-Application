from hashlib import sha256
import hashlib

from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .DB_utils import *
from decimal import Decimal
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta

def clean_data(rows):
    clean_rows = []

    for row in rows:
        clean_row = []

        for value in row:
            if isinstance(value, Decimal):
                clean_row.append(float(value))
            elif isinstance(value, (datetime, date)):
                clean_row.append(value.isoformat())
            else:
                clean_row.append(value)

        clean_rows.append(clean_row)

    return clean_rows

def reset_repeatable_tasks(): #finds all repeatable tasks, if they're past their reset date, sets the new reset date and sets status to assigned
    tasks = exec_get_all("""
        SELECT id,
               repeat_interval,
               interval_amount,
               repeat_threshold,
               status
        FROM tasks
        WHERE repeat_interval != 0
          AND repeat_threshold IS NOT NULL
          AND status IN (2,3)
    """)

    now = datetime.now()

    for task in tasks:
        if now > task[3]:
            new_time = task[3]
            while new_time <= now:
                if(task[1] == 1):
                    new_time += timedelta(days = task[2])
                elif(task[1] == 2):
                    new_time += timedelta(weeks = task[2])
                elif(task[1] == 3):
                    new_time += relativedelta(months=task[2])
                elif(task[1] == 4):
                    new_time += relativedelta(years=task[2])
            exec_commit("""
                UPDATE tasks
                SET status = 1,
                repeat_threshold = %s,
                complete_data = NULL
                WHERE id = %s
            """, (new_time, task["id"]))

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


#make api for all tables
class InventoryApi(Resource):
    def get(self):
        result1 = exec_get_all("SELECT * FROM items WHERE active = TRUE")
        result = clean_data(result1)
        return result

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('itemName', type=str)
        parser.add_argument('category', type=str)
        parser.add_argument('currentAmount', type=int)
        parser.add_argument('orderLevel', type=int)
        parser.add_argument('location', type=str)
        parser.add_argument('unitSize', type=str)
        parser.add_argument('unitCost', type=int)
        parser.add_argument('supplier', type=str)
        parser.add_argument('sku', type=str)
        parser.add_argument('userID', type=str)
        parser.add_argument('timestamp', type=str)
        parser.add_argument('description', type=str)
        args = parser.parse_args()
        sql = """
            INSERT INTO items(name, category, current_amount, order_level, unit_size, unit_cost, item_description, location, supplier, SKU)	
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """
        itemID = exec_commit(sql,(args['itemName'],args['category'],args['currentAmount'],args['orderLevel'],args['unitSize'],args['unitCost'],(args['description']),args['location'],args['supplier'],args['sku']), returning = True)
        sql = """
            INSERT INTO item_update_log(item_id, user_id, date, change_amount, created)	
            VALUES (%s, %s, %s, %s, TRUE)
            """
        exec_commit(sql,(itemID, args['userID'], args['timestamp'], args['currentAmount']))
        return {"status": "created"}, 201

    def put(self):
        parser = reqparse.RequestParser() #Type one is for adding ammount, type 2 decreases amount, type 3 edits item information, type 4 deactivates the item
        parser.add_argument('type', type=int) 
        args = parser.parse_args()
        if(args['type'] == 1 or args['type'] == 2):            
            parser.add_argument('amount', type=int)
            parser.add_argument('userID', type=int)    
            parser.add_argument('type', type=int)        
            parser.add_argument('item_id', type=int)
            parser.add_argument('timestamp', type=str)
            args = parser.parse_args()
            amount = 0
            new_ammount = exec_get_one("SELECT current_amount FROM items WHERE id = %s",(args['item_id'],))[0]
            if args['type'] == 1:
                new_ammount += args['amount']
                amount = args['amount']
            elif args['type'] == 2:
                new_ammount -= args['amount']
                amount = -args['amount']
            sql = """
                UPDATE items
                SET current_amount	= %s
                WHERE id = %s
                """
            exec_commit(sql,(new_ammount,args['item_id']))
            sql = """
                INSERT INTO item_update_log(item_id, user_id, date, change_amount)	
                VALUES (%s, %s, %s, %s)
                """
            exec_commit(sql,(args['item_id'], args['userID'], args['timestamp'], amount))
            if args['type'] == 1:
                return {"status": "increased"}, 201
            elif args['type'] == 2:
                return {"status": "decreased"}, 201

        elif(args['type'] == 3):
            parser.add_argument('itemName', type=str)
            parser.add_argument('category', type=str)
            parser.add_argument('orderLevel', type=int)
            parser.add_argument('location', type=str)
            parser.add_argument('unitSize', type=str)
            parser.add_argument('unitCost', type=int)
            parser.add_argument('supplier', type=str)
            parser.add_argument('sku', type=str)
            parser.add_argument('userID', type=str)
            parser.add_argument('timestamp', type=str)
            parser.add_argument('description', type=str)
            parser.add_argument('item_id', type=int)
            args = parser.parse_args()            
            sql = """
                UPDATE items
                SET name = %s,
                category = %s,
                order_level = %s,
                unit_size = %s,
                unit_cost = %s,
                item_description = %s,
                location = %s,
                supplier = %s,     
                SKU = %s   
                WHERE id = %s
                """
            exec_commit(sql,(args['itemName'],args['category'],args['orderLevel'],args['unitSize'],args['unitCost'],args['description'],args['location'],args['supplier'],args['sku'],args['item_id']))
            sql = """
                INSERT INTO item_update_log(item_id, user_id, date, edit)	
                VALUES (%s, %s, %s, %s)
                """
            exec_commit(sql,(args['item_id'], args['userID'], args['timestamp'], True))
            return {"status": "edited"}, 201
        elif(args['type'] == 4):            
            parser.add_argument('userID', type=int)    
            parser.add_argument('type', type=int)        
            parser.add_argument('item_id', type=int)
            parser.add_argument('timestamp', type=str)
            args = parser.parse_args() 
            sql = """
                UPDATE items
                SET active	= FALSE
                WHERE id = %s
                """
            exec_commit(sql,(args['item_id'],))
            sql = """
                INSERT INTO item_update_log(item_id, user_id, date, delete)	
                VALUES (%s, %s, %s, TRUE)
                """
            exec_commit(sql,(args['item_id'], args['userID'], args['timestamp']))
            if args['type'] == 1:
                return {"status": "increased"}, 201
        
class UpdateLogApi(Resource):
    def get(self):
        sql= """SELECT
                l.id AS log_id,
                l.item_id,
                i.name AS item_name,      
                l.user_id,
                u.name AS user_name,  
                l.change_amount,
                l.delete,
                l.edit,
                l.date,
                l.created
            FROM item_update_log l
            JOIN items i
                ON l.item_id = i.id
            JOIN users u
                ON l.user_id = u.id
            ORDER BY l.date DESC;"""
        result = clean_data(exec_get_all(sql))
        return result

class TasksManageApi(Resource):
    def get(self):
        reset_repeatable_tasks()
        result1 = clean_data(exec_get_all("SELECT * FROM tasks WHERE active = TRUE"))
        result2 = clean_data(exec_get_all("SELECT * FROM task_assigned_staff"))
        result3 = clean_data(exec_get_all("SELECT * FROM task_required_items"))
        return {
            "tasks": result1,
            "staff_assign": result2,
            "item_assign": result3
        }, 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('task_id', type=int)
        parser.add_argument('type', type=int) #type 1 updates status, type 2 edits task info
        parser.add_argument('status', type=int)
        parser.add_argument('name', type=str)
        parser.add_argument('category', type=str)
        parser.add_argument('priority', type=int)
        parser.add_argument('repeat_interval', type=int)
        parser.add_argument('interval_amount', type=int)
        parser.add_argument('first_repeat_date', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('location', type=str)
        #figure out image later, CURRENT_TIMESTAMP used for times
        args = parser.parse_args()   
        if(args['type'] == 1):
            sql = None
            if(args['status'] == 0):
                sql = """UPDATE tasks
                SET status = 0
                WHERE id = %s"""
            elif(args['status'] == 1):                
                sql = """UPDATE tasks
                SET status = 1
                WHERE id = %s"""
            elif(args['status'] == 2):
                sql = """UPDATE tasks
                SET status = 2
                WHERE id = %s"""
            elif(args['status'] == 3):
                sql = """UPDATE tasks
                SET status = 3,
                complete_date = CURRENT_TIMESTAMP
                WHERE id = %s"""
            exec_commit(sql, (args['task_id'],))
            return {"status": "status updated"}, 201
        elif(args['type'] == 2):
            sql = """UPDATE tasks
            SET name = %s,
            category = %s,
            priority = %s,
            repeat_interval = %s,
            interval_amount = %s,
            repeat_threshold = %s,
            description = %s,
            location = %s,
            image_path = %s
            WHERE id = %s"""
            exec_commit(sql, (args['name'], args['category'], args['priority'], args['repeat_interval'],
                              args['interval_amount'], args['first_repeat_date'], args['description'], args['location'], None, args['task_id'], ))
            return {"status": "task edited"}, 201
        

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('taskName', type=str)
        parser.add_argument('category', type=str)
        parser.add_argument('priority', type=int)
        parser.add_argument('repeat_interval', type=int)
        parser.add_argument('interval_amount', type=int)
        parser.add_argument('first_repeat_date', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('location', type=str)
        #parser.add_argument('image', type=str)
        args = parser.parse_args()
        sql = """
            INSERT INTO tasks(name, category, priority, repeat_interval, interval_amount, repeat_threshold, description, location, created_date, status)	
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, 0)
            RETURNING id
            """
        exec_commit(sql, (args['taskName'], args['category'], args['priority'], args['repeat_interval'], args['interval_amount'], args['first_repeat_date'], args['description'], args['location']))
        return {"status": "created"}, 201
        



class EventsManageApi(Resource):
    def get(self):
        x = 8

class UsersApi(Resource):
    def get(self):
        name = request.args.get("name")
        password = request.args.get("password")
        all = request.args.get("all")
        if all:
            users = exec_get_all("SELECT * FROM users WHERE active = TRUE")
            result = []
            for user in users:
                result.append([
                    user[0],  # id
                    user[1],  # name
                    user[4],  # admin
                    user[5].isoformat() if user[5] else None
                ])

            return result
            


        hashed_pass = hashlib.sha256(password.encode()).hexdigest()

        sql = "SELECT id, password_hash, admin FROM users WHERE active = TRUE AND name = %s"
        user = exec_get_one(sql, (name,))

        if user and user[1] == hashed_pass:
            sql = """
                UPDATE users
                SET last_login = CURRENT_TIMESTAMP
                WHERE name = %s
                """
            exec_commit(sql,(name,))
            return {"id": user[0], "admin": user[2]}

        return None

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('admin', type=bool)
        args = parser.parse_args()

        hashed_pass = hashlib.sha256(args['password'].encode()).hexdigest()

        sql = "SELECT id FROM users WHERE name = %s"
        user = exec_get_one(sql, (args['name'],))

        if user:
            return {"status": "user already exists"}, 418

        sql = """INSERT INTO users(name, password_hash, admin)	
            VALUES (%s, %s, %s)"""
        exec_commit(sql, (args['name'], hashed_pass, args['admin']))

        return {"status": "created"}, 201


        
class TasksApi(Resource):
    def put(self):
        x = 8


class RoomsApi(Resource):
    def put(self):
        x = 8


class LargeItemsApi(Resource):
    def put(self):
        x = 8


class SmallItemsApi(Resource):
    def put(self):
        x = 8


class EventsApi(Resource):
    def put(self):
        x = 8