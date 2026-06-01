from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .DB_utils import *
from decimal import Decimal
from datetime import datetime, date

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

#make api for all tables
class InventoryApi(Resource):
    def get(self):
        result1 = exec_get_all("SELECT * FROM items")
        result2 = exec_get_all("SELECT * FROM categories")
        result3 = exec_get_all("SELECT * FROM users")
        result4 = exec_get_all("SELECT * FROM item_update_log")
        result = [clean_data(result1), clean_data(result2), clean_data(result3), clean_data(result4)]
        return result

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('itemName', type=str)
        parser.add_argument('category', type=str)
        parser.add_argument('currentAmount', type=int)
        parser.add_argument('orderLevel', type=int)
        parser.add_argument('location', type=str)
        parser.add_argument('unitSize', type=int)
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
            INSERT INTO item_update_log(item_id, user_id, date, change_amount)	
            VALUES (%s, %s, %s, %s)
            """
        exec_commit(sql,(itemID, args['userID'], args['timestamp'], args['currentAmount']))
        return {"status": "created"}, 201

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=int)
        args = parser.parse_args()
        if(args['type'] == 1 or args['type'] == 2):            
            parser.add_argument('amount', type=int)
            parser.add_argument('userID', type=int)    
            parser.add_argument('type', type=int)        
            parser.add_argument('item_id', type=int)
            parser.add_argument('timestamp', type=str)
            args = parser.parse_args()
            new_ammount = exec_get_one("SELECT current_amount FROM items WHERE id = %s",(args['item_id'],))[0]
            if args['type'] == 1:
                new_ammount += args['amount']
            elif args['type'] == 2:
                new_ammount -= args['amount']
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
            exec_commit(sql,(args['item_id'], args['userID'], args['timestamp'], args['amount']))
            if args['type'] == 1:
                return {"status": "increased"}, 201
            elif args['type'] == 2:
                return {"status": "decreased"}, 201

        elif(args['type'] == 3):
            parser.add_argument('itemName', type=str)
            parser.add_argument('category', type=str)
            parser.add_argument('orderLevel', type=int)
            parser.add_argument('location', type=str)
            parser.add_argument('unitSize', type=int)
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
        


class TasksManageApi(Resource):
    def get(self):
        x = 8

class EventsManageApi(Resource):
    def get(self):
        x = 8

class UsersApi(Resource):
    def put(self):
        x = 8

class ItemsApi(Resource):
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=int)
        parser.add_argument('text', type=str)
        parser.add_argument('category', type=str)
        
        args = parser.parse_args()
        sql = """
            UPDATE ingredients 
            SET name = %s,
              category = %s,
              calories = %s,
              total_fat = %s,
              saturated_fat = %s,
              trans_fat = %s,
              protein = %s,
              carbohydrate = %s
              WHERE id = %s
            """
        exec_commit(sql,(args['name'],args['category'],args['calories'],args['totalFat'],args['satFat'],args['transFat'],args['protein'],args['carbs'],args['id']))
        return {"status": "updated"}, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('category', type=str)
        
        args = parser.parse_args()
        sql = """
            INSERT INTO ingredients(name, category, calories, total_fat, saturated_fat, trans_fat, protein, carbohydrate)	
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
        exec_commit(sql,(args['name'],args['category'],args['calories'],args['totalFat'],args['satFat'],args['transFat'],args['protein'],args['carbs']))
        return {"status": "created"}, 201
    
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=int, required=True, help="Ingredient ID is required")
        args = parser.parse_args()
        sql = "DELETE FROM ingredients WHERE id = %s"
        exec_commit(sql, (args['id'],))
        return {"status": "deleted"}, 200
        
        
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