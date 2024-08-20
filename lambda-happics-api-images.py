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
    METHOD = event.get("Method")
    PATH = event.get("path")

    if(METHOD == "GET"):
        # List objects in the specified bucket and prefix
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PATH)

        images = []
        contnets = response.get("Contents")

        if(contnets):
            for obj in response.get("Contents"):
                key = obj['Key']
                # Get the image object
                img_response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
                image_data = img_response['Body'].read()
                # Encode the image to base64
                base64_image = base64.b64encode(image_data).decode('utf-8')
                images.append("data:image/png;base64,"+base64_image)

        response = images

        return json.dumps(response)

    else: #METHOD == POST
        images_data = parse_multipart_data(event)
        remove_s3_files_of(_bucket_name = BUCKET_NAME, _path =PATH)
        
        key_list = upload_images_to_s3(images_data, PATH)
        print(key_list)
        return {
            'statusCode': 200,
            'body': json.dumps([key_list]),
            'headers': {"Content-Type": "application/json"}
        }
            
            
def remove_s3_files_of(_bucket_name, _path):
    response = s3.list_objects_v2(Bucket=_bucket_name, Prefix=_path)
    if 'Contents' in response:
        objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]

        s3.delete_objects(Bucket=_bucket_name, Delete={'Objects': objects_to_delete})
        print(f"Deleted {len(objects_to_delete)} objects from {_path}")
    else:
        print(f"No objects found at {_path}")


def parse_multipart_data(event):
    """multipart/form-data에서 이미지 데이터 추출하는 함수"""
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
    images_data_files = form_data.get('image_list', [])

    return images_data_files



def upload_images_to_s3(_images_data, _path):
    """S3에 이미지들을 업로드하고 업로드된 폴더 이름을 반환하는 함수"""
    path_arr = []
    for idx, image_data in enumerate(_images_data):
        file_name = f"{idx+1}.png"
        path = _path + file_name
        path_arr.append(path)
        try:
            res = s3.put_object(Bucket=BUCKET_NAME, Key=path, Body=image_data,
                                 ContentType='image/png')
            print(res)
        except Exception as e:
            print("S3 Upload Error:", e)

    return path_arr
        