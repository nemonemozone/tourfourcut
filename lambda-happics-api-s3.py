import json
import boto3
import json
import base64

s3 = boto3.client('s3')
BUCKET_NAME = "happics"

def get_files_from_s3(_bucket, _path):
    response = s3.list_objects_v2(Bucket=_bucket, Prefix=_path)
    if 'Contents' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'No images found'}),
            'headers': {"Content-Type": "application/json"}
        }

    files = []
    
    # Iterate through the found objects
    for obj in response['Contents']:
        key = obj['Key']
        # Get the image object
        file_response = s3.get_object(Bucket=_bucket, Key=key)
        files.append(file_response['Body'])

    return files

def lambda_handler(event, context):
    if event['Method'] == 'POST':
        pass
    
    elif event['Method'] == 'GET':
        res = get_files_from_s3(BUCKET_NAME, "/logo/aaa/1.jpg")
        
    return {
        'statusCode': 200,
        'body': json.dumps(res)
    }
    