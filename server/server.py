from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

from api.DB_utils import *
from api.management import *

app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(InventoryApi,'/inventory')
api.add_resource(UpdateLogApi,'/updateLog')
api.add_resource(TasksManageApi,'/tasks')
api.add_resource(EventsManageApi,'/events')
api.add_resource(UsersApi,'/user')
api.add_resource(RoomsApi,'/room')
api.add_resource(StaffAssignApi,'/task')
api.add_resource(LargeItemsApi,'/table')
api.add_resource(SmallItemsApi,'/chair')
api.add_resource(EventsApi,'/event')



if __name__ == '__main__':

    print("Loading db")
    exec_sql_file('management.sql')
    print("Starting flask")
    app.run(debug=True)



    