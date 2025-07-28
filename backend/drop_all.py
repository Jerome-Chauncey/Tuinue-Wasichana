from backend.app import app
from backend.config import db

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("All tables dropped successfully.")
