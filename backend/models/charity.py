from datetime import datetime
from backend.config import db

class Charity(db.Model):
    __tablename__ = 'charities'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    approved = db.Column(db.Boolean, default=False)
    logo_url = db.Column(db.String)

stories = db.relationship('Story', backref='charity', lazy=True)
donations = db.relationship('Donation', backref='charity', lazy=True)
beneficiaries = db.relationship('Beneficiary', backref='charity', lazy=True)

created_at = db.Column(db.DateTime, default=datetime.utcnow)