#!/usr/bin/python
import requests
import json
import sys
from urlparse import urlparse
from album_details import album_name,album_key
#this is excluded from repo, place your own 
#credentials in mashape_auth.py
from mashape_auth import auth_header 

print len(sys.argv)
headers={'X-Mashape-Authorization': auth_header}
entry_id = sys.argv[1]
fname = sys.argv[2]
print "adding file %s to entryid: %s" %(fname,entry_id)
files = {'files': open(fname, 'rb')}
payload={'album':album_name,'albumkey':album_key,'entryid':entry_id}
train_result=requests.post('https://lambda-sunday-face.p.mashape.com/album_train',files=files,headers=headers,params=payload)
print train_result.content

#this should probably be its own script/function, 
#you only need to rebuild once after doing all training
payload={'album':album_name,'albumkey':album_key}
rebuild_result = requests.get('https://lambda-sunday-face.p.mashape.com/album_rebuild',headers=headers,params=payload)
print rebuild_result.content

