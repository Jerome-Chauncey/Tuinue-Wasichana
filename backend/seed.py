from backend.models import db, Charity, Admin, Inventory, Donation, Story
from backend import app
from faker import Faker
import random

fake = Faker()

def seed_database():
    with app.app_context():
        print("Seeding database...")

        Story.query.delete()
        Donation.query.delete()
        Inventory.query.delete()
        Admin.query.delete()
        Charity.query.delete()

        db.session.commit()

        charities_data = [
            {
                "name": "Tuinue Wasichana Initiative",
                "email": "info@tuinuewasichana.org",
                "password": "secure123",
                "location": "Nairobi, Kenya",
                "mission": "Empowering girls through menstrual hygiene support and education.",
                "status": "Active"
            },
            {
                "name": "Pads for Progress",
                "email": "pads@progress.org",
                "password": "pads123",
                "location": "Mombasa, Kenya",
                "mission": "Providing access to menstrual products for underprivileged girls.",
                "status": "Active"
            }
        ]

        charity_objs = []
        for data in charities_data:
            charity = Charity(
                name=data["name"],
                email=data["email"],
                location=data["location"],
                mission=data["mission"],
                status=data["status"]
            )
            charity.set_password(data["password"]) 
            db.session.add(charity)
            charity_objs.append(charity)

        db.session.commit()

        admin = Admin(
            username="admin1",
            email="admin@tuinue.org",
        )
        admin.set_password("adminpass123") 
        db.session.add(admin)
        db.session.commit()

        inventory_items = ["Sanitary Pads", "Soap", "Toothpaste", "Toothbrush", "Tissue", "Underwear"]
        for _ in range(10):
            item = Inventory(
                name=random.choice(inventory_items),
                quantity=random.randint(10, 100),
                description=fake.sentence(),
                charity_id=random.choice(charity_objs).id
            )
            db.session.add(item)

        db.session.commit()

        for _ in range(10):
            donation = Donation(
                donor_name=fake.name(),
                amount=random.randint(500, 5000),
                message=fake.sentence(),
                charity_id=random.choice(charity_objs).id
            )
            db.session.add(donation)

        db.session.commit()

        for _ in range(5):
            story = Story(
                title=fake.sentence(nb_words=6),
                content=fake.paragraph(nb_sentences=5),
                charity_id=random.choice(charity_objs).id
            )
            db.session.add(story)

        db.session.commit()
        print("Done seeding!")

if __name__ == "__main__":
    seed_database()
