from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.config import db

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(120), nullable=False)
    description = db.Column(db.String, nullable=True)  # add this
    quantity = db.Column(Integer, nullable=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    charity_id = db.Column(Integer, ForeignKey('charities.id'))
    beneficiary_id = db.Column(Integer, ForeignKey('beneficiaries.id'))

    charity = db.relationship("Charity", back_populates="inventories")        # ✅ match
    beneficiary = db.relationship("Beneficiary", back_populates="inventory_items")

    def __repr__(self):
        return f"<Inventory {self.name} x{self.quantity}>"
