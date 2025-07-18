from flask import Blueprint, request, jsonify
from backend.models.beneficiary import Beneficiary
from backend.config import db

beneficiaries_bp = Blueprint('beneficiaries_bp', __name__, url_prefix='/beneficiaries')

@beneficiaries_bp.route('/', methods=['GET'])
def get_beneficiaries():
    b_list = Beneficiary.query.all()
    return jsonify([{
        'id': b.id,
        'charity_id': b.charity_id,
        'name': b.name,
        'school': b.school,
        'supplies_received': b.supplies_received
    } for b in b_list]), 200

@beneficiaries_bp.route('/<int:id>', methods=['GET'])
def get_beneficiary(id):
    b = Beneficiary.query.get(id)
    if not b:
        return jsonify({'error': 'Beneficiary not found'}), 404

    return jsonify({
        'id': b.id,
        'charity_id': b.charity_id,
        'name': b.name,
        'school': b.school,
        'supplies_received': b.supplies_received
    }), 200

@beneficiaries_bp.route('/', methods=['POST'])
def create_beneficiary():
    data = request.get_json()
    b = Beneficiary(
        charity_id=data.get('charity_id'),
        name=data.get('name'),
        school=data.get('school'),
        supplies_received=data.get('supplies_received')
    )
    db.session.add(b)
    db.session.commit()
    return jsonify({'message': 'Beneficiary created', 'id': b.id}), 201

@beneficiaries_bp.route('/<int:id>', methods=['PATCH'])
def update_beneficiary(id):
    b = Beneficiary.query.get(id)
    if not b:
        return jsonify({'error': 'Beneficiary not found'}), 404

    data = request.get_json()
    for field in ['name', 'school', 'supplies_received']:
        if field in data:
            setattr(b, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Beneficiary updated'}), 200

@beneficiaries_bp.route('/<int:id>', methods=['DELETE'])
def delete_beneficiary(id):
    b = Beneficiary.query.get(id)
    if not b:
        return jsonify({'error': 'Beneficiary not found'}), 404

    db.session.delete(b)
    db.session.commit()
    return jsonify({'message': 'Beneficiary deleted'}), 200
