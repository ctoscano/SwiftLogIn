from flask import Flask,render_template,request,redirect,url_for,abort,session,jsonify
import requests
import json
from swype_data import swype_dictionary
#this is excluded from repo, place your own 
#credentials in mashape_auth.py
from mashape_auth import auth_header 

app = Flask(__name__,static_path='/static/')
#never enable this when externally visible
#app.config['DEBUG']=True

@app.route('/test_image',methods=['GET','POST'])
def test_image():
    if request.method=='POST':
        app.logger.error('got a post')
        f=request.files['the_file']
        headers={'X-Mashape-Authorization':auth_header}

        #hardcoded data set for demo
        album_name="sebvsteve"
        album_key="ef7fbb166d8ab6818fc6c602c1052d8f621dd5600eedb3d41d9dcff5992075cf"

        f.save('foo.jpg')
        myfiles = {'files': open('foo.jpg', 'rb')}
        payload={'album':album_name,'albumkey':album_key}
        recog_result=requests.post('https://lambda-sunday-face.p.mashape.com/recognize',files=myfiles,headers=headers,params=payload)
        app.logger.error(recog_result.content)
        confidence_values=json.loads(recog_result.content)['photos'][0]
        app.logger.error('photos body')
        app.logger.error(confidence_values)
        tags=confidence_values.get('tags',None)
        match_list=[]
        if len(tags) ==0:
            response={'status':'no faces','candidates':[]}
        else:
            app.logger.error('in else')
            candidates=tags[0]['uids']
            confidence_values=[i['confidence'] for i in  candidates]
            predictions=[i['prediction'] for i in  candidates]
            for j in range(len(confidence_values)):
                print predictions[j]
                match_list.append({'confidence':confidence_values[j],'name':predictions[j]})
            response={'status':'matched','candidates':match_list}
        
        app.logger.error(response)
        return jsonify(response)

if __name__ == '__main__':
    app.run()
