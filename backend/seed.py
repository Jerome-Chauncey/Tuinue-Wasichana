from backend.models import db, Charity, Admin, Inventory, Donation, Story, Donor
from backend.app import app  
from faker import Faker
import random
from datetime import datetime

fake = Faker()

def seed_database():
    print("Seeding database...")
    
    with app.app_context():
        if app.config.get('ENV') == 'development':
            db.session.query(Story).delete()
            db.session.query(Donation).delete()
            db.session.query(Inventory).delete()
            db.session.query(Admin).delete()
            db.session.query(Donor).delete()
            db.session.query(Charity).delete()
            db.session.commit()

        if Charity.query.count() == 0:
            charities = [
                Charity(
                    name="Tuinue Wasichana Initiative",
                    email="info@tuinuewasichana.org",
                    location="Nairobi, Kenya",
                    mission="Empowering girls through menstrual hygiene support and education.",
                    status="Active"
                ),
                Charity(
                    name="Pads for Progress",
                    email="pads@progress.org",
                    location="Mombasa, Kenya",
                    mission="Providing access to menstrual products for underprivileged girls.",
                    status="Active"
                )
            ]
            for charity in charities:
                charity.set_password("securepassword123")
                db.session.add(charity)
            db.session.commit()

        if Admin.query.count() == 0:
            admin = Admin(
                username="admin1",
                email="admin@tuinue.org"
            )
            admin.set_password("adminpass123")
            db.session.add(admin)
            db.session.commit()

        if Inventory.query.count() == 0:
            inventory_items = ["Sanitary Pads", "Soap", "Toothpaste", "Toothbrush", "Tissue", "Underwear"]
            charity_ids = [c.id for c in Charity.query.all()]
            for _ in range(10):
                db.session.add(Inventory(
                    name=random.choice(inventory_items),
                    quantity=random.randint(10, 100),
                    description=fake.sentence(),
                    charity_id=random.choice(charity_ids)
                ))

        if Donor.query.count() == 0:
            for _ in range(5):
                db.session.add(Donor(
                    name=fake.name(),
                    email=fake.email()
                ))

        if Donation.query.count() == 0:
            charity_ids = [c.id for c in Charity.query.all()]
            frequency_options = ['one-time', 'monthly', 'quarterly', 'annual']
            
            for _ in range(10):
                db.session.add(Donation(
                    amount=random.randint(500, 5000),
                    donor_name=fake.name(),
                    message=fake.sentence(),
                    frequency=random.choice(frequency_options),
                    is_anonymous=random.choice([True, False]),
                    charity_id=random.choice(charity_ids),
                    created_at=datetime.utcnow()
                ))

        if Story.query.count() == 0:
            charity_ids = [c.id for c in Charity.query.all()]
            for _ in range(5):
                db.session.add(Story(
                    title=fake.sentence(nb_words=6),
                    content=fake.paragraph(nb_sentences=5),
                    charity_id=random.choice(charity_ids)
                ))

        try:
            db.session.commit()
            print("Database seeded successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding database: {str(e)}")
            raise

if __name__ == "__main__":
    seed_database()