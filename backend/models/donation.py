from datetime import datetime
from backend.config import db

class Donation(db.Model):
    __tablename__ = 'donations'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'))
    is_recurring = db.Column(db.Boolean, default=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    payment_method = db.Column(db.String(50))  # e.g., 'stripe', 'paypal'
    transaction_id = db.Column(db.String(100), unique=True)

donated_at = db.Column(db.DateTime, default=datetime.utcnow)