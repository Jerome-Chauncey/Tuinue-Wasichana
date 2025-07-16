from backend.config import db
from datetime import datetime


class Beneficiary(db.Model):
    __tabelname__ = 'beneficiaries'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'))
    name = db.Column(db.String(120))
    school = db.Column(db.String(120))
    supplies_received = db.Column(db.Text)  # e.g. sanitary towels, water
    received_at = db.Column(db.DateTime, default=datetime.utcnow)