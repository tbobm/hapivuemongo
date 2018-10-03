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
    active = db.Column(db.Boolean)
    grade_id = db.Column(db.Integer, db.ForeignKey('grades.id'))
    username = db.Column(db.String(255), nullable=False)
    grade = db.relationship('Grades')

    def to_json():
        obj = {
            'username': self.username,
            'grade': self.grade.name,
            'id': self.id,
        }
        return obj


class Grades(db.Model):
    """Base Users."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)


@app.route('/')
def index():
    return jsonify({'ok': True})


@app.route('/listUnvalidated', methods=['GET'])
def register_user():
    users = Users.query.filter_by(
        active=False,
    ).all()
    response = {
        'error': False,
        'total': len(users),
        'users': [user.to_json() for user in users],
    }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
