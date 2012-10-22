#!/usr/bin/python
import requests
import json
import sys
from album_details import album_name,album_key
#this is excluded from repo, place your own 
#credentials in mashape_auth.py
from mashape_auth import auth_header 

headers={'X-Mashape-Authorization': auth_header}

#recognize the person in the photo passed on the command line
files = {'files': open(sys.argv[1], 'rb')}
payload={'album':album_name,'albumkey':album_key}
recog_result=requests.post('https://lambda-sunday-face.p.mashape.com/recognize',files=files,headers=headers,params=payload)
print recog_result.content
confidence_values=json.loads(recog_result.content)['photos'][0]['tags'][0]['uids']
best_result=max(confidence_values,key=lambda(x):x['confidence'])
print "best match is: ",best_result['prediction']

