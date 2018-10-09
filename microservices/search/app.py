"""
Search API for hapivuemongo crimes
"""
import os

from flask import request
from flask_stupe import paginate, schema_required
from flask_stupe.json import Stupeflask
from marshmallow import Schema
from marshmallow.fields import String, Integer, Boolean
from pymongo import MongoClient


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
    json = request.get_json(force=True)
    params = [
        'compnos',
        'district',
        'domestic',
        'shooting',
        'weapontype',
        'year',
    ]
    query = dict()

    for param in params:
        tmp = json.get(param)

        if tmp is not None:
            query[param] = tmp

    return list(crimes.find(query))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5004)
