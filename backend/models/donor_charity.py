from datetime import datetime
from backend.config import db

donors_charities = db.Table('donors_charities',
    db.Column('donor_id', db.Integer, db.ForeignKey('donors.id'), primary_key=True),
    db.Column('charity_id', db.Integer, db.ForeignKey('charities.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)