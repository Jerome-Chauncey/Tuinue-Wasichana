from backend.config import db
from datetime import datetime

class PaypalDonation(db.Model):
    __tablename__ = 'paypal_donations'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String, unique=True)  # <-- renamed from payment_id
    payer_email = db.Column(db.String, nullable=False)
    payer_name = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default="USD")
    status = db.Column(db.String, default="pending")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'))
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'))

    donor = db.relationship("Donor", back_populates="paypal_donations")
    charity = db.relationship("Charity", backref="paypal_donations")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "payer_email": self.payer_email,
            "payer_name": self.payer_name,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "timestamp": self.timestamp.isoformat(),
            "donor_id": self.donor_id,
            "charity_id": self.charity_id
        }
