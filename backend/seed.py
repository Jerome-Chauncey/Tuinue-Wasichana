from backend.models import db
from backend.models.user import User
from backend.models.charity import Charity
from backend.models.schedule import Schedule
from backend.models.donation import Donation
from backend.models.story import Story
from backend.models.beneficiary import Beneficiary
from flask import Flask
from backend.app import app  # assumes app is initialized in backend/app.py
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

with app.app_context():
    print("Dropping and creating all tables...")
    db.drop_all()
    db.create_all()

    # Users
    print("Creating users...")
    admin = User(
    full_name="Admin", 
    email="admin@tuinue.org", 
    role ="admin",
    password_hash=generate_password_hash("adminpass"))

    donor1 = User(
    full_name="Alice Wanjiku", 
    email="alice@example.com",
    role="donor", 
    password_hash=generate_password_hash("donorpass1"))

    donor2 = User(
    full_name="John Otieno", 
    email="john@example.com",
    role="donor", 
    password_hash=generate_password_hash("donorpass2"))
    
    charity_user1 = User(
    full_name="Pads Org",
    email="pads@example.com",
    role="charity",
    password_hash=generate_password_hash("charitypass1"))

    charity_user2 = User(
    full_name="Dada Org",
    email="dadacare@example.com",
    role="charity",
    password_hash=generate_password_hash("charitypass2"))

    db.session.add_all([admin, donor1, donor2, charity_user1, charity_user2])
    db.session.commit()

    # Charities
    print("Creating charities...")
    charity1 = Charity(
    user_id=charity_user1.id,
    name="Pads for Hope",
    description="Providing pads to girls in rural areas",
    email="pads@example.com",
    approved=True
    )

    charity2 = Charity(
    user_id=charity_user2.id,
    name="Dada Care",
    description="Support menstrual health & education",
    email="dadacare@example.com",
    approved=True
    )

    db.session.add_all([charity1, charity2])
    db.session.commit()

    # Schedules
    print("Creating donation schedules...")
    schedule1 = Schedule(
    user_id=donor1.id,
    charity_id=charity1.id,
    amount=500.00,
    interval_days=30,
    next_donation=datetime.utcnow() + timedelta(days=30)
    )

    schedule2 = Schedule(
    user_id=donor2.id,
    charity_id=charity2.id,
    amount=1000.00,
    interval_days=30,
    next_donation=datetime.utcnow() + timedelta(days=30)
    )

    db.session.add_all([schedule1, schedule2])
    db.session.commit()

    # Donations
    print("Creating donations...")
    donation1 = Donation(
    user_id=donor1.id,
    charity_id=charity1.id,
    amount=500.00,
    is_recurring=True,
    is_anonymous=False,
    payment_method="stripe",
    transaction_id="txn_001"
    )

    donation2 = Donation(
    user_id=donor2.id,
    charity_id=charity2.id,
    amount=1000.00,
    is_recurring=False,
    is_anonymous=True,
    payment_method="paypal",
    transaction_id="txn_002"
    )

    db.session.add_all([donation1, donation2])
    db.session.commit()


    # Stories
    print("Creating stories...")
    story1 = Story(
    charity_id=charity1.id,
    title="Mary's Story",
    content="Mary was able to stay in school after receiving pads.",
    image_url="https://www.shutterstock.com/image-photo/abuja-nigeria-june-12-2023-600nw-2320804005.jpg"
    )

    story2 = Story(
    charity_id=charity2.id,
    title="Empowered Girls",
    content="We reached 300 girls in Kisii County.",
    image_url="https://www.shutterstock.com/image-photo/close-portrait-smiling-group-adolescent-600nw-2439214941.jpg"
    )

    db.session.add_all([story1, story2])
    db.session.commit()


    # Beneficiaries
    print("Creating beneficiaries...")

    b1 = Beneficiary(
    charity_id=charity1.id,
    name="Mary Achieng",
    school="Kisumu Girls",
    supplies_received="Sanitary towels x10"
    )

    b2 = Beneficiary(
    charity_id=charity2.id,
    name="Faith Wambui",
    school="Nyeri High",
    supplies_received="Pads, soap, wipes"
    )

    db.session.add_all([b1, b2])
    db.session.commit()


    print("✅ Done seeding!")