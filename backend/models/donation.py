from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.config import db

class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(Integer, primary_key=True)
    amount = db.Column(Float, nullable=False)
    donor_name = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=True)
    donor_id = db.Column(Integer, ForeignKey('donors.id'))
    frequency = db.Column(db.String(20), nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    charity_id = db.Column(Integer, ForeignKey('charities.id'))
    created_at = db.Column(DateTime, default=datetime.utcnow)

    donor = db.relationship("Donor", back_populates="donations")

    def __repr__(self):
        return f"<Donation ${self.amount}>"
