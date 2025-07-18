# backend/resources/auth.py
from flask_restful import Resource, reqparse
from flask import jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from backend.config import db
from backend.models.user import User

#request parsers
_register_parser = reqparse.RequestParser()
_register_parser.add_argument('full_name', required=True, help='full_name is required')
_register_parser.add_argument('email',     required=True, help='email is required')
_register_parser.add_argument('password',  required=True, help='password is required')
_register_parser.add_argument('role',      required=True, help='role is required')

_login_parser = reqparse.RequestParser()
_login_parser.add_argument('email',    required=True, help='email is required')
_login_parser.add_argument('password', required=True, help='password is required')


class Register(Resource):
    def post(self):
        args = _register_parser.parse_args()
        if User.query.filter_by(email=args['email']).first():
            return {"msg": "Email already registered"}, 409

        user = User(
            full_name=args['full_name'],
            email=args['email'],
            role=args['role']
        )
        user.set_password(args['password'])
        db.session.add(user)
        db.session.commit()
        return {"msg": "User created"}, 201


class Login(Resource):
    def post(self):
        args = _login_parser.parse_args()
        user = User.query.filter_by(email=args['email']).first()
        if not user or not user.check_password(args['password']):
            return {"msg": "Bad email or password"}, 401

        token = create_access_token(
            identity=user.id,
            additional_claims={"role": user.role}
        )
        return {"access_token": token}, 200


class Profile(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }, 200
