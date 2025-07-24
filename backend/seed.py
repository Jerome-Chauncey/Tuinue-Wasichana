from backend.models import db, Charity, Admin, Inventory, Donation, Story
from backend.app import app  
from faker import Faker
import random

fake = Faker()

def seed_database():
    print("Starting database seeding...")
    
    with app.app_context():
        db.session.query(Story).delete()
        db.session.query(Donation).delete()
        db.session.query(Inventory).delete()
        db.session.query(Admin).delete()
        db.session.query(Charity).delete()
        db.session.commit()

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
        
        admin = Admin(
            username="admin1",
            email="admin@tuinue.org"
        )
        admin.set_password("adminpass123")
        db.session.add(admin)
        db.session.commit()
        
        inventory_items = ["Sanitary Pads", "Soap", "Toothpaste", "Toothbrush", "Tissue", "Underwear"]
        for _ in range(10):
            db.session.add(Inventory(
                name=random.choice(inventory_items),
                quantity=random.randint(10, 100),
                description=fake.sentence(),
                charity_id=random.choice([c.id for c in charities])
            ))
        
        for _ in range(10):
            db.session.add(Donation(
                donor_name=fake.name(),
                amount=random.randint(500, 5000),
                message=fake.sentence(),
                charity_id=random.choice([c.id for c in charities])
            ))
        
        for _ in range(5):
            db.session.add(Story(
                title=fake.sentence(nb_words=6),
                content=fake.paragraph(nb_sentences=5),
                charity_id=random.choice([c.id for c in charities])
            ))
        
        db.session.commit()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()