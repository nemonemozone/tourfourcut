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
    
    def get_data(self, query_name):
        response = self.table.query( KeyConditionExpression=Key('ID').eq(query_name))
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
        "logo_list": event['logo_list']
        }
        db_access.put_data(input_data)
        db_res = {"ID":eventID}
    
    elif event['Method'] == 'GET':
        eventID = event.get("name")
        db_res = db_access.get_data(eventID)
        
    return {
        'statusCode': 200,
        'body': json.dumps(db_res, ensure_ascii=False)
    }
    
