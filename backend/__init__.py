from backend.config import app, db
from flask_migrate import Migrate

from backend.models import (
    Admin,
    Beneficiary,
    Charity,
    Donation,
    Donor,
    Inventory,
    Story,
    donors_charities,
    PaypalDonation,
)

migrate = Migrate(app, db)
