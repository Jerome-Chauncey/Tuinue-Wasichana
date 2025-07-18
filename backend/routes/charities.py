from flask import Blueprint, request, jsonify
from backend.models.charity import Charity
from backend.config import db

charities_bp = Blueprint('charities_bp', __name__, url_prefix='/charities')

@charities_bp.route('/', methods=['GET'])
def get_charities():
    charities = Charity.query.all()
    return jsonify([{
        'id': c.id,
        'user_id': c.user_id,
        'name': c.name,
        'description': c.description,
        'approved': c.approved,
        'logo_url': c.logo_url
    } for c in charities]), 200

@charities_bp.route('/<int:id>', methods=['GET'])
def get_charity(id):
    charity = Charity.query.get(id)
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    return jsonify({
        'id': charity.id,
        'user_id': charity.user_id,
        'name': charity.name,
        'description': charity.description,
        'approved': charity.approved,
        'logo_url': charity.logo_url
    }), 200

@charities_bp.route('/', methods=['POST'])
def create_charity():
    data = request.get_json()
    charity = Charity(
        user_id=data.get('user_id'),
        name=data.get('name'),
        description=data.get('description'),
        approved=data.get('approved', False),
        logo_url=data.get('logo_url')
    )
    db.session.add(charity)
    db.session.commit()
    return jsonify({'message': 'Charity created', 'id': charity.id}), 201

@charities_bp.route('/<int:id>', methods=['PATCH'])
def update_charity(id):
    charity = Charity.query.get(id)
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    data = request.get_json()
    for field in ['name', 'description', 'approved', 'logo_url']:
        if field in data:
            setattr(charity, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Charity updated'}), 200

@charities_bp.route('/<int:id>', methods=['DELETE'])
def delete_charity(id):
    charity = Charity.query.get(id)
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    db.session.delete(charity)
    db.session.commit()
    return jsonify({'message': 'Charity deleted'}), 200
