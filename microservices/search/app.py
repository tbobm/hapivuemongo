"""
Search API for hapivuemongo crimes
"""
import os

from flask import request, jsonify
from flask_stupe import paginate, schema_required
from flask_stupe.json import Stupeflask
from marshmallow import Schema
from marshmallow.fields import String, Integer, Boolean
from pymongo import MongoClient
from bson import Binary, Code
from bson.json_util import dumps

app = Stupeflask(__name__)
crimes = MongoClient(os.environ.get('MONGO_URI')).hapivue.crimes


class CrimeSchema(Schema):
    compnos = Integer()
    shooting = Boolean()
    weapontype = String()
    year = Integer()
    domestic = Boolean()


@app.route("/crime", methods=["POST"])
@schema_required(CrimeSchema())
def post_user():
    result = crimes.insert_one(request.schema)
    request.schema.update(_id=result.inserted_id)
    return request.schema


@app.route("/crime/<ObjectId:id>")
def get_user(id):
    return crimes.find_one({"_id": id})


@app.route("/crimes", methods=['POST'])
def get_users():
    json_params = request.get_json(force=True)
    params = [
        'compnos',
        'reptdistrict',
        'domestic',
        'shooting',
        'weapontype',
        'year',
    ]
    query = dict()

    for param in params:
        tmp = json_params.get(param)
        if tmp is not None:
            query[param] = tmp
    offset = int(json_params.get('offset'));
    limit = int(json_params.get('limit'));
    crime_request = crimes.find(query);
    app.logger.info('Query : %r', query )
    crime_count = crime_request.count();
    app.logger.info('Count : %d', crime_count)
    crime_list = list(crime_request.limit(offset+limit))
    reduced_crime_list = crime_list[offset:(offset+limit)];
    response = {
        'error': False,
        'length': crime_count,
        'data': reduced_crime_list
    }
    app.logger.info('response : %r', response )
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5004)
