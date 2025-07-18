from flask import Blueprint, request, jsonify
from backend.models.schedule import Schedule
from backend.config import db

schedules_bp = Blueprint('schedules_bp', __name__, url_prefix='/schedules')

@schedules_bp.route('/', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify([{
        'id': s.id,
        'user_id': s.user_id,
        'charity_id': s.charity_id,
        'amount': s.amount,
        'interval_days': s.interval_days,
        'next_donation': s.next_donation.isoformat(),
        'active': s.active
    } for s in schedules]), 200

@schedules_bp.route('/<int:id>', methods=['GET'])
def get_schedule(id):
    s = Schedule.query.get(id)
    if not s:
        return jsonify({'error': 'Schedule not found'}), 404

    return jsonify({
        'id': s.id,
        'user_id': s.user_id,
        'charity_id': s.charity_id,
        'amount': s.amount,
        'interval_days': s.interval_days,
        'next_donation': s.next_donation.isoformat(),
        'active': s.active
    }), 200

@schedules_bp.route('/', methods=['POST'])
def create_schedule():
    data = request.get_json()
    schedule = Schedule(
        user_id=data.get('user_id'),
        charity_id=data.get('charity_id'),
        amount=data.get('amount'),
        interval_days=data.get('interval_days', 30),
        next_donation=data.get('next_donation'),
        active=data.get('active', True)
    )
    db.session.add(schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule created', 'id': schedule.id}), 201

@schedules_bp.route('/<int:id>', methods=['PATCH'])
def update_schedule(id):
    s = Schedule.query.get(id)
    if not s:
        return jsonify({'error': 'Schedule not found'}), 404

    data = request.get_json()
    for field in ['amount', 'interval_days', 'next_donation', 'active']:
        if field in data:
            setattr(s, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Schedule updated'}), 200

@schedules_bp.route('/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    s = Schedule.query.get(id)
    if not s:
        return jsonify({'error': 'Schedule not found'}), 404

    db.session.delete(s)
    db.session.commit()
    return jsonify({'message': 'Schedule deleted'}), 200
