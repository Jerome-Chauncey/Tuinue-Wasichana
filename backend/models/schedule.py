from backend.config import db
from datetime import datetime

class Schedule(db.Model):
    __tablename__ = 'schedules'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'))
    amount = db.Column(db.Float, nullable=False)
    interval_days = db.Column(db.Integer, default=30)
    next_donation = db.Column(db.DateTime, nullable=False)
    active = db.Column(db.Boolean, default=True)