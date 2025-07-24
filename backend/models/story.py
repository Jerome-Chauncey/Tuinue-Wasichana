from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.config import db

class Story(db.Model):
    __tablename__ = 'stories'

    id = db.Column(Integer, primary_key=True)
    title = db.Column(String(150), nullable=False)
    content = db.Column(Text, nullable=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    charity_id = db.Column(Integer, ForeignKey('charities.id'))
    beneficiary_id = db.Column(Integer, ForeignKey('beneficiaries.id'))

    charity = db.relationship("Charity", back_populates="stories")          # ✅ match back_populates
    beneficiary = db.relationship("Beneficiary", back_populates="stories")  # ✅

    def __repr__(self):
        return f"<Story {self.title}>"
