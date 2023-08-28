from flask import Flask, redirect, url_for
from flask import Flask, abort, request, jsonify
from flask_cors import CORS
from flask import Flask
import requests
# r = requests.get('/discovery/v2/events.json?unit=miles&segmentId=KZFzniwnSyZfZ7v7nE&geoPoint=9q5cs&radius=10&keyword=University+of+Southern+California')
# print(r.status_code)




# payload = {'key1':'value1', 'key2': 'value2'}
# r = requests.get('https://api.github.com/events',params=payload)
# print(r.json())
# res = r.json()

ticketMatsterApi = "qNHGBwrCsREw50tqWDbzj99LyRfEJlc3"

app = Flask(__name__)
CORS(app)

 


# @app.route("/eventSearch")
# def eventSearch():
#     res = requests.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=qNHGBwrCsREw50tqWDbzj99LyRfEJlc3")
    
#     return jsonify(res.json())



@app.route('/')
def homepage():
    # app.send_static_file("script.js")
    # app.send_static_file("style.css")

    return app.send_static_file("index.html")


# @app.route('/examplejson')
# def example():
#     res = requests.get("https://app.ticketmaster.com/discovery/v2/events.json?keyword="
#                         + "concert" + 
#                         "&geoPoint=" + "9q5cs" + 
#                         "&radius=" + "10" +
#                         "&unit=miles" +
#                         "&apikey=" + ticketMatsterApi)
    
#     return jsonify(res.json())

@app.route("/eventSearchNoSeg/<geoPoint>/<radius>/<keyword>")
def eventSearch_non_seg(keyword, geoPoint, radius):
    res = requests.get("https://app.ticketmaster.com/discovery/v2/events.json?keyword="
                        + keyword + 
                        "&geoPoint=" + geoPoint + 
                        "&radius=" + radius +
                        "&unit=miles" +
                        "&apikey=" + ticketMatsterApi)
    
    return jsonify(res.json())


@app.route("/eventSearch/<geoPoint>/<radius>/<keyword>/<segmentId>")
def eventSearch_seg(keyword, geoPoint, radius, segmentId):
    res = requests.get("https://app.ticketmaster.com/discovery/v2/events.json?keyword="
                        + keyword + 
                        "&segmentId=" + segmentId + 
                        "&geoPoint=" + geoPoint + 
                        "&radius=" + radius +
                        "&unit=miles" +
                        "&apikey=" + ticketMatsterApi)
    
    return jsonify(res.json())

@app.route("/eventDetails/<id>")
def eventDetails(id):
    res = requests.get("https://app.ticketmaster.com/discovery/v2/events/"
                        + id + "?apikey=" + ticketMatsterApi)
    
    return jsonify(res.json())

@app.route("/venueDetails/<name>")
def venueDetails(name):
    res = requests.get("https://app.ticketmaster.com/discovery/v2/venues?apikey=" + ticketMatsterApi + "&keyword=" + name)
    
    return jsonify(res.json())


if __name__=='__main__':
    app.run(host = '0.0.0.0', port = '8888', debug = True)
    # app.run(debug = True)


