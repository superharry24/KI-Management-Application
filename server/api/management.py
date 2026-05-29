from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .DB_utils import *
from decimal import Decimal

def clean_data(rows):
    clean_rows = []

    for row in rows:
        clean_row = []

        for value in row:
            if isinstance(value, Decimal):
                clean_row.append(float(value))
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