from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.config import db
from backend.models import Donor, Charity, Admin

# Request parsers
register_parser = reqparse.RequestParser()
register_parser.add_argument('email', required=True, help='Email is required')
register_parser.add_argument('password', required=True, help='Password is required')
register_parser.add_argument('name', required=True, help='Name is required')
register_parser.add_argument('role', required=True, help='Role is required')

login_parser = reqparse.RequestParser()
login_parser.add_argument('email', required=True, help='Email is required')
login_parser.add_argument('password', required=True, help='Password is required')

class Register(Resource):
    def post(self):
        data = register_parser.parse_args()
        
        if data['role'] == 'donor' and Donor.query.filter_by(email=data['email']).first():
            return {'message': 'Donor already exists'}, 400
        elif data['role'] == 'charity' and Charity.query.filter_by(email=data['email']).first():
            return {'message': 'Charity already exists'}, 400
        
        if data['role'] == 'donor':
            user = Donor(email=data['email'], name=data['name'])
        elif data['role'] == 'charity':
            user = Charity(email=data['email'], name=data['name'])
        else:
            return {'message': 'Invalid role'}, 400
            
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        
        return {'message': f'{data["role"].capitalize()} created successfully'}, 201

class Login(Resource):
    def post(self):
        data = login_parser.parse_args()
        
        # Try all user types
        user = Donor.query.filter_by(email=data['email']).first() or \
               Charity.query.filter_by(email=data['email']).first() or \
               Admin.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return {'message': 'Invalid credentials'}, 401
            
        access_token = create_access_token(identity={
            'email': user.email,
            'role': 'donor' if isinstance(user, Donor) else 
                   'charity' if isinstance(user, Charity) else 'admin'
        })
        
        return {'access_token': access_token}, 200

class Profile(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        role = identity['role']
        email = identity['email']
        
        if role == 'donor':
            user = Donor.query.filter_by(email=email).first()
        elif role == 'charity':
            user = Charity.query.filter_by(email=email).first()
        else:
            user = Admin.query.filter_by(email=email).first()
            
        if not user:
            return {'message': 'User not found'}, 404
            
        return {
            'email': user.email,
            'name': user.name,
            'role': role
        }, 200