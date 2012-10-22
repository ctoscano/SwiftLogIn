#!/usr/bin/python
import requests
import json
import sys
from album_details import album_name,album_key
#this is excluded from repo, place your own 
#credentials in mashape_auth.py
from mashape_auth import auth_header 

headers={'X-Mashape-Authorization': auth_header}


payload={'album':album_name,'albumkey':album_key}
view_result = requests.get('https://lambda-sunday-face.p.mashape.com/album',headers=headers,params=payload)
print view_result.content

