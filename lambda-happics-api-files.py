import base64
import boto3
import json
import cgi
import io
import base64
import os
from datetime import datetime

s3 = boto3.client('s3')
BUCKET_NAME = "happics"

def lambda_handler(event, context):
    event_name = event.get("event_name")
    method = event.get("Method")
    if(method == "GET"):
        # List objects in the specified bucket and prefix
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f"logo/{event_name}")
    
        # Check if any objects were found
        if 'Contents' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No images found'}),
                'headers': {"Content-Type": "application/json"}
            }
    
        images = []
        
        # Iterate through the found objects
        for obj in response['Contents']:
            key = obj['Key']
            # Get the image object
            img_response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
            image_data = img_response['Body'].read()
            # Encode the image to base64
            base64_image = base64.b64encode(image_data).decode('utf-8')
            images.append({
                'filename': key,  # Store the filename
                'base64': base64_image
            })
    
        return {
            'statusCode': 200,
            'body': json.dumps(images),  # Return the list of images
            'headers': {"Content-Type": "application/json"}
        }

    else:
        print("POST")
        title, images_data = parse_multipart_data(event)
    if images_data:
        logo_list = upload_images_to_s3(images_data, title)
        return json.dumps(logo_list)
    else:
        return {'status': 'Invalid title or image data'}


def parse_multipart_data(event):
    """multipart/form-data에서 title과 이미지 데이터를 추출하는 함수"""
    # body-json, params, stage-variables, context 등을 event에서 추출
    body_json = event.get('body-json', {})
    params = event.get('params', {})

    # base64 디코딩
    decoded_data = base64.b64decode(body_json)

    # Content-Type 헤더에서 boundary 값을 추출
    content_type_header = params.get('header', {}).get('content-type', '')

    # 멀티파트 헤더 정보 파싱
    pdict = cgi.parse_header(content_type_header)[1]
    
    if 'boundary' in pdict:
        pdict['boundary'] = pdict['boundary'].encode('utf-8')
    pdict['CONTENT-LENGTH'] = len(decoded_data)

    # multipart 데이터 파싱
    fp = io.BytesIO(decoded_data)
    form_data = cgi.parse_multipart(fp, pdict)

    # form에서 필요한 데이터를 추출
    title = form_data.get('event_name', [None])[0]
    images_data_files = form_data.get('logo_list', [])

    return title, images_data_files



def upload_images_to_s3(images_data, title):
    """S3에 이미지들을 업로드하고 업로드된 폴더 이름을 반환하는 함수"""
    path_arr = []
    for idx, image_data in enumerate(images_data):
        file_path = f"logo/{title}/{idx + 1}.jpg"
        path_arr.append(file_path)
        try:
            s3.put_object(Bucket=BUCKET_NAME, Key=file_path, Body=image_data,
                                 ContentType='image/jpeg')
        except Exception as e:
            print("S3 Upload Error:", e)

    return path_arr
        