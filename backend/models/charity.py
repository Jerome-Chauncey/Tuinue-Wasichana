from datetime import datetime
from backend.config import db
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.donor_charity import donors_charities  # Import the association table

class Charity(db.Model):
    __tablename__ = 'charities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=True)
    _password_hash = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=True)
    mission = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)

    beneficiaries = db.relationship('Beneficiary', backref='charity', lazy=True)
    donations = db.relationship('Donation', backref='charity', lazy=True)
    inventories = db.relationship("Inventory", back_populates="charity")
    stories = db.relationship("Story", back_populates="charity", cascade='all, delete-orphan')
    donors = db.relationship(
        'Donor',
        secondary=donors_charities,  
        back_populates='charities'
    )
    

    def set_password(self, password):
        self._password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<Charity {self.name}>"