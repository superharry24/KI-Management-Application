from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .DB_utils import *

#make api for all tables
class ItemsApi(Resource):
    def get(self):
       result = exec_get_all("SELECT * FROM ingredients")
       return result
    
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=int)
        parser.add_argument('name', type=str)
        parser.add_argument('category', type=str)
        parser.add_argument('calories', type=int)
        parser.add_argument('totalFat', type=int)
        parser.add_argument('satFat', type=int)
        parser.add_argument('transFat', type=int)
        parser.add_argument('protein', type=int)
        parser.add_argument('carbs', type=int)
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
        parser.add_argument('calories', type=int)
        parser.add_argument('totalFat', type=int)
        parser.add_argument('satFat', type=int)
        parser.add_argument('transFat', type=int)
        parser.add_argument('protein', type=int)
        parser.add_argument('carbs', type=int)
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
        
        
        