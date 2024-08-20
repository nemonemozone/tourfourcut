import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key
import base64
import boto3
import json
import cgi
import io
import base64
import os
from datetime import datetime


class DatabaseAccess():
    def __init__(self, TABLE_NAME):
        self.dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-3')
        self.table = self.dynamodb.Table(TABLE_NAME)
    
    def get_data(self, query_name):
        response = self.table.query( KeyConditionExpression=Key('name').eq(query_name))
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
    db_access = DatabaseAccess("happics-event")
    db_res = ""
    
    if event['Method'] == 'POST':
        input_data = {
        "name":event['name'],
        "date":event['date'],
        "logo_list": event['logo_list']
        }
        db_res = db_access.put_data(input_data)
    
    elif event['Method'] == 'GET':
        event_name = event.get("name")
        db_res = db_access.get_data(event_name)
        print(db_res)
        
    return {
        'statusCode': 200,
        'body': json.dumps(db_res, ensure_ascii=False)
    }
    
