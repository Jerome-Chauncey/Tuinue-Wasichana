from backend.config import db

class Beneficiary(db.Model):
    __tablename__ = 'beneficiaries'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)

    stories = db.relationship('Story', back_populates='beneficiary', cascade='all, delete-orphan')
    inventory_items = db.relationship('Inventory', back_populates='beneficiary', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Beneficiary {self.name}>'