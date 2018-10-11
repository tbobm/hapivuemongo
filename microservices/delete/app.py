"""
Tiny microservice managing connection based on Flask.
"""
import os

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQL_URI')
db = SQLAlchemy(app)


class Users(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)


@app.route('/')
def index():
    return jsonify({'ok': True})


@app.route('/deleteUser', methods=['DELETE'])
def register_user():
    user = Users.query.filter_by(
        active=False,
    ).first()

    if user is None:
        response = {
            'error': True,
        }
        return jsonify(response), 404

    db.session.delete(user)
    response = {
        'error': False,
    }
    return jsonify(response), 204


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
