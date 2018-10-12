"""
Tiny microservice managing connection based on Flask.
"""
import os

import hashlib
from secrets import token_urlsafe

from flask import Flask, jsonify, request
from pymysql.err import IntegrityError
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQL_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Users(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)
    active = db.Column(db.Boolean)
    grade_id = db.Column(db.Integer, db.ForeignKey('grades.id'))
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(255))
    grade = db.relationship('Grades')


class Grades(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    p_read = db.Column(db.Boolean)
    p_edit = db.Column(db.Boolean)
    p_add = db.Column(db.Boolean)
    p_delete = db.Column(db.Boolean)
    p_validate = db.Column(db.Boolean)


@app.route('/')
def index():
    return jsonify({'ok': True})


@app.route('/connectUser', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    hashed = hashlib.sha256(bytes(password, 'utf-8')).hexdigest()
    user = Users.query.filter_by(
        username=username,
        password=hashed,
        active=True,
    ).first()
    if not user:
        return jsonify({'error': True}), 404
    token = token_urlsafe(64)
    user.token = token
    db.session.add(user)
    db.session.commit()
    response = {
        'error': False,
        'permissions': {
            'read': user.grade.p_read,
            'add': user.grade.p_add,
            'edit': user.grade.p_edit,
            'validate': user.grade.p_validate,
            'delete': user.grade.p_delete,
        },
        'token': user.token,
    }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
