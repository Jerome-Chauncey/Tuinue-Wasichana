from flask import Blueprint, request, jsonify
from backend.models.donation import Donation
from backend.config import db

donations_bp = Blueprint('donations_bp', __name__, url_prefix='/donations')

@donations_bp.route('/', methods=['GET'])
def get_donations():
    donations = Donation.query.all()
    return jsonify([{
        'id': d.id,
        'amount': d.amount,
        'user_id': d.user_id,
        'charity_id': d.charity_id,
        'is_recurring': d.is_recurring,
        'is_anonymous': d.is_anonymous,
        'payment_method': d.payment_method,
        'transaction_id': d.transaction_id
    } for d in donations]), 200

@donations_bp.route('/<int:id>', methods=['GET'])
def get_donation(id):
    donation = Donation.query.get(id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404

    return jsonify({
        'id': donation.id,
        'amount': donation.amount,
        'user_id': donation.user_id,
        'charity_id': donation.charity_id,
        'is_recurring': donation.is_recurring,
        'is_anonymous': donation.is_anonymous,
        'payment_method': donation.payment_method,
        'transaction_id': donation.transaction_id
    }), 200

@donations_bp.route('/', methods=['POST'])
def create_donation():
    data = request.get_json()
    donation = Donation(
        amount=data.get('amount'),
        user_id=data.get('user_id'),
        charity_id=data.get('charity_id'),
        is_recurring=data.get('is_recurring', False),
        is_anonymous=data.get('is_anonymous', False),
        payment_method=data.get('payment_method'),
        transaction_id=data.get('transaction_id')
    )
    db.session.add(donation)
    db.session.commit()
    return jsonify({'message': 'Donation created', 'id': donation.id}), 201

@donations_bp.route('/<int:id>', methods=['PATCH'])
def update_donation(id):
    donation = Donation.query.get(id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404

    data = request.get_json()
    for field in ['amount', 'is_recurring', 'is_anonymous', 'payment_method']:
        if field in data:
            setattr(donation, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Donation updated'}), 200

@donations_bp.route('/<int:id>', methods=['DELETE'])
def delete_donation(id):
    donation = Donation.query.get(id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404

    db.session.delete(donation)
    db.session.commit()
    return jsonify({'message': 'Donation deleted'}), 200
