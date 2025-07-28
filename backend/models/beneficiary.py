from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.config import db

class Beneficiary(db.Model):
    __tablename__ = 'beneficiaries'

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String, nullable=False)
    charity_id = db.Column(Integer, ForeignKey('charities.id'), nullable=False)

    charity = db.relationship('Charity', back_populates='beneficiaries')
    stories = db.relationship('Story', back_populates='beneficiary', cascade='all, delete-orphan')
    inventory_items = db.relationship('Inventory', back_populates='beneficiary', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Beneficiary {self.name}>"