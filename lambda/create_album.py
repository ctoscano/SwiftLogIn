#!/usr/bin/python
import requests
import json
import sys
#this is excluded from repo, place your own 
#credentials in mashape_auth.py
from mashape_auth import auth_header 

headers={'X-Mashape-Authorization': auth_header}
album_name=sys.argv[1]
fid=open('album_details.py','w')
stuff="album_name='"+sys.argv[1]+"'"
payload={'album':album_name}
create_result=requests.post('https://lambda-sunday-face.p.mashape.com/album',headers=headers,params=payload)
stuff+='\n'+"album_key='"+json.loads(create_result.content)['albumkey']+"'"
fid.write(stuff)
