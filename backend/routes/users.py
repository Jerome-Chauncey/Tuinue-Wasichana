from flask import Blueprint, request, jsonify
from backend.models.user import User
from backend.config import db

users_bp = Blueprint('users_bp', __name__, url_prefix='/users')

@users_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'role': user.role,
        'is_active': user.is_active
    } for user in users]), 200

@users_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'role': user.role,
        'is_active': user.is_active
    }), 200

@users_bp.route('/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    for field in ['full_name', 'email', 'role', 'is_active']:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({'message': 'User updated'}), 200

@users_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200
