import json
import boto3
from boto3.dynamodb.conditions import Key
import uuid
import json
import base64
import os


class DatabaseAccess():
    def __init__(self, TABLE_NAME):
        self.dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-3')
        self.table = self.dynamodb.Table(TABLE_NAME)
    
    def get_data(self, _query_key, _query_value):
        response = self.table.query(KeyConditionExpression=Key(_query_key).eq(_query_value))
        if response['Items']:
            return response['Items'][0]
        else:
            return None
    def get_data(self, _query_key, _query_value, _db_index):
        if(_db_index):
            response = self.table.query(IndexName=_db_index, KeyConditionExpression=Key(_query_key).eq(_query_value))
        else:
            response = self.table.query(KeyConditionExpression=Key(_query_key).eq(_query_value))
        if response['Items']:
            return response['Items'][0]
        else:
            return None
    
    def put_data(self, input_data):
        response = self.table.put_item(
            Item =  input_data
        )
        return response
        

def lambda_handler(event, context):
    db_access = DatabaseAccess("happics-event-info")
    db_res = ""
    
    if event['Method'] == 'POST':
        eventID = str(uuid.uuid1()).split('-')[0]
        input_data = {
        "ID":eventID,
        "name":event['name'],
        "date":event['date'],
        "owner":event['owner']
        }
        db_access.put_data(input_data)
        db_res = {"ID":eventID}
    
    elif event['Method'] == 'GET':
        index = event.get("db_index")
        query_key = event.get("query_key")
        query_value = event.get("query_value")
        

        db_res = db_access.get_data(query_key, query_value,index)

        
    return {
        'statusCode': 200,
        'body': json.dumps(db_res, ensure_ascii=False)
    }