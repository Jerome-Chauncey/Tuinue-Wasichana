# backend/models/donor.py
from datetime import datetime
from backend.config import db
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.donor_charity import donors_charities 

class Donor(db.Model):
    __tablename__ = 'donors'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    donations = db.relationship('Donation', back_populates='donor')
    charities = db.relationship(
        'Charity',
        secondary=donors_charities,  
        back_populates='donors'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)