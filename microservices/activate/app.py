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

    def to_json(self):
        obj = {
            'username': self.username,
            'grade': self.grade.name,
            'active': self.active,
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


@app.route('/list', methods=['GET'])
def register_user():
    users = Users.query.all()
    response = {
        'error': False,
        'total': len(users),
        'users': [user.to_json() for user in users],
    }
    return jsonify(response), 200


@app.route('/validateUser', methods=['PUT'])
def activate_user():
    json = request.get_json(force=True)
    user = Users.query.filter_by(
        id=json.get('id'),
    ).first()
    if user is None:
        response = {
            'error': True,
        }
        return jsonify(response), 404
    user.active = not user.active
    db.session.add(user)
    db.session.commit()
    response = {
        'error': False,
        'data': user.to_json(),
    }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
