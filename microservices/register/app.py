"""
Tiny microservice registering users based on flask.
"""
import os

from flask import Flask, jsonify, request
from pymysql.err import IntegrityError
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQL_URI')
db = SQLAlchemy(app)


class Users(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)
    active = db.Column(db.Boolean)
    grade_id = db.Column(db.Integer, db.ForeignKey('grades.id'))
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)


class Grades(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)


@app.route('/')
def index():
    return jsonify({'ok': True})


@app.route('/registerUser', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    grade = data.get('grade')
    grade_name = Grades.query.filter_by(name=grade).first()
    new_user = Users(
        active=False,
        grade_id=grade,
        username=username,
        password=password,
    )
    db.session.add(new_user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': True}), 409
    return jsonify({'username': username, 'password': password, 'grade': grade_name.name})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
