from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta 
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_cors import cross_origin
from backend.config import db
from backend.models.donor import Donor
from backend.models.donation import Donation
from backend.models.charity import Charity
from backend.models.story import Story
from backend.models.beneficiary import Beneficiary
from backend.models.admin import Admin
from backend.models.donor_charity import donors_charities
import os
from werkzeug.utils import secure_filename

api = Blueprint('api', __name__)


@api.route("/login", methods=["POST"])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([email, password, role]):
        return jsonify({"error": "Email, password, and role are required"}), 400

    if role not in ["charity", "donor", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    user = None
    if role == "charity":
        user = Charity.query.filter(db.func.lower(Charity.email) == email.lower()).first()
    elif role == "donor":
        user = Donor.query.filter(db.func.lower(Donor.email) == email.lower()).first()
    elif role == "admin":
        user = Admin.query.filter(db.func.lower(Admin.email) == email.lower()).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if role == "charity" and user.status != "approved":
        return jsonify({"error": f"Charity is {user.status}", "charityStatus": user.status}), 403

    access_token = create_access_token(identity={"email": email, "role": role})
    return jsonify({"token": access_token, "role": role, "charityStatus": user.status if role == "charity" else None}), 200


@api.route("/charity/status", methods=["GET"])
@jwt_required()
@cross_origin()
def charity_status():
    identity = get_jwt_identity()
    if identity["role"] != "charity":
        return jsonify({"error": "Unauthorized"}), 403
    charity = Charity.query.filter_by(email=identity["email"]).first()
    if not charity:
        return jsonify({"error": "Charity not found"}), 404
    return jsonify({"status": charity.status}), 200


@api.route("/charity-signup", methods=["POST", "OPTIONS"])
@cross_origin()
def charity_signup():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    data = request.get_json()
    # Your existing charity signup logic
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    mission = data.get("mission")
    location = data.get("location", "") 

    if not all([name, email, password, mission]):
        return jsonify({"error": "All fields are required"}), 400

    if Charity.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    new_charity = Charity(
        name=name,
        email=email,
        mission=mission,
        location=location,
        status="pending"
    )
    new_charity.set_password(password)
    db.session.add(new_charity)
    db.session.commit()

    return jsonify({"message": "Application submitted successfully"}), 201


@api.route("/charity/dashboard", methods=["GET"])
@jwt_required()
@cross_origin()
def charity_dashboard():
    identity = get_jwt_identity()
    if identity["role"] != "charity":
        return jsonify({"error": "Unauthorized"}), 403

    charity = Charity.query.filter_by(email=identity["email"]).first()
    if not charity:
        return jsonify({"error": "Charity not found"}), 404

    donors = (
        db.session.query(Donor, Donation)
        .join(Donation, Donor.id == Donation.donor_id)
        .join(donors_charities, Donor.id == donors_charities.c.donor_id)
        .filter(donors_charities.c.charity_id == charity.id)
        .all()
    )

    stories = Story.query.filter_by(charity_id=charity.id).all()

    return jsonify({
        "name": charity.name,
        "donors": [{
            "name": donor.name,
            "email": None if donor.is_anonymous else donor.email,
            "donationType": "monthly" if donation.frequency == "recurring" else donation.frequency,
            "amount": donation.amount or "$0",
            "date": donation.date if donation.date else None
        } for donor, donation in donors],
        "stories": [{
            "title": story.title,
            "description": story.description,
            "donor": Donor.query.get(story.donor_id).name if story.donor_id else "Unknown",
            "beneficiary": Beneficiary.query.get(story.beneficiary_id).name if story.beneficiary_id else "Unknown",
            "image": story.image or "/static/default.jpg"
        } for story in stories]
    }), 200


@api.route("/charities", methods=["GET", "POST"])
@cross_origin()
def charities():
    if request.method == "GET":
        charities = Charity.query.all()
        return jsonify([{
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "mission": c.mission,
            "status": c.status
        } for c in charities]), 200

    elif request.method == "POST":
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        mission = data.get("mission")
        password = data.get("password")

        if not all([name, email, mission, password]):
            return jsonify({"error": "All fields are required"}), 400

        if Charity.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        new_charity = Charity(
            name=name,
            email=email,
            mission=mission,
            status="pending"
        )
        new_charity.set_password(password)
        db.session.add(new_charity)
        db.session.commit()

        return jsonify({"message": "Charity created successfully"}), 201


@api.route("/donor-signup", methods=["POST", "OPTIONS"])
@cross_origin()
def donor_signup():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    anonymous = data.get("anonymous", False)

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400

    if Donor.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    new_donor = Donor(
        name=name,
        email=email,
        is_anonymous=anonymous
    )
    new_donor.set_password(password)
    db.session.add(new_donor)
    db.session.commit()

    return jsonify({"message": "Donor registered successfully"}), 201


@api.route("/donor-dashboard", methods=["GET"])
@jwt_required()
@cross_origin()
def donor_dashboard():
    identity = get_jwt_identity()
    if identity["role"] != "donor":
        return jsonify({"error": "Unauthorized"}), 403
    
    donor = Donor.query.filter_by(email=identity["email"]).first()
    if not donor:
        return jsonify({"error": "Donor not found"}), 404

    # Properly indented query
    donations = db.session.query(Donation, Charity.name)\
        .join(Charity, Donation.charity_id == Charity.id)\
        .filter(Donation.donor_id == donor.id)\
        .all()

    # Properly indented query
    charities = db.session.query(Charity)\
        .join(donors_charities, Charity.id == donors_charities.c.charity_id)\
        .filter(donors_charities.c.donor_id == donor.id)\
        .all()

    # Properly indented query - using charity relationship instead of donor_id
    stories = db.session.query(Story)\
        .join(Charity, Story.charity_id == Charity.id)\
        .filter(Charity.id.in_([c.id for c in donor.charities]))\
        .all()

    return jsonify({
        "name": donor.name,
        "email": donor.email,
        "donations": [{
            "charity": charity_name,
            "amount": donation.amount,
            "date": donation.date.strftime('%Y-%m-%d') if donation.date else None,
            "donationType": donation.frequency,
            "start_date": donation.start_date.strftime('%Y-%m-%d') if donation.start_date else None,
            "billing_date": donation.billing_date.strftime('%Y-%m-%d') if donation.billing_date else None
        } for donation, charity_name in donations],
        "charities": [{
            "name": charity.name,
            "mission": charity.mission
        } for charity in charities],
        "stories": [{
            "title": story.title,
            "description": story.description,
            "charity": story.charity.name if story.charity else None,
            "beneficiary": story.beneficiary.name if story.beneficiary else None,
            "image": story.image,
            "inventory": ", ".join([item.name for item in story.inventory_items]) if hasattr(story, 'inventory_items') else ""
        } for story in stories]
    }), 200

@api.route("/donate", methods=["POST"])
@jwt_required()
def create_donation():
    identity = get_jwt_identity()
    if identity["role"] != "donor":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    charity_id = data.get("charity_id")
    amount = data.get("amount")
    frequency = data.get("frequency", "one-time")
    anonymous = data.get("anonymous", False)

    if not all([charity_id, amount]):
        return jsonify({"error": "Missing required fields"}), 400

    donor = Donor.query.filter_by(email=identity["email"]).first()
    charity = Charity.query.get(charity_id)

    if not charity:
        return jsonify({"error": "Charity not found"}), 404

    new_donation = Donation(
        donor_id=donor.id,
        charity_id=charity.id,
        amount=amount,
        frequency=frequency,
        is_anonymous=anonymous
    )
    
    if frequency == "recurring":
        new_donation.start_date = datetime.utcnow()
        new_donation.billing_date = datetime.utcnow() + timedelta(days=30)
    
    db.session.add(new_donation)
    db.session.commit()

    return jsonify({
        "message": "Donation successful",
        "donation": {
            "id": new_donation.id,
            "amount": new_donation.amount,
            "frequency": new_donation.frequency
        }
    }), 201

@api.route("/admin/charities", methods=["GET", "PUT"])
@jwt_required()
@cross_origin()
def admin_charities():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == "GET":
        charities = Charity.query.all()
        return jsonify([{
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "status": c.status
        } for c in charities]), 200

    elif request.method == "PUT":
        data = request.get_json()
        charity_id = data.get("id")
        status = data.get("status")

        if not charity_id or not status:
            return jsonify({"error": "Charity ID and status are required"}), 400

        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({"error": "Charity not found"}), 404

        charity.status = status
        db.session.commit()
        return jsonify({"message": f"Charity status updated to {status}"}), 200


@api.route("/stories", methods=["POST"])
@jwt_required()
@cross_origin()
def create_story():
    identity = get_jwt_identity()
    if identity["role"] != "charity":
        return jsonify({"error": "Unauthorized"}), 403

    charity = Charity.query.filter_by(email=identity["email"]).first()
    if not charity or charity.status != "approved":
        return jsonify({"error": "Charity not approved"}), 403

    title = request.form.get("title")
    description = request.form.get("description")
    image = request.files.get("image")

    if not all([title, description, image]):
        return jsonify({"error": "All fields are required"}), 400

    filename = secure_filename(image.filename)
    image_path = os.path.join("static/uploads", filename)
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    image.save(image_path)

    new_story = Story(
        title=title,
        description=description,
        image=f"/{image_path}",
        charity_id=charity.id
    )
    db.session.add(new_story)
    db.session.commit()

    return jsonify({"message": "Story created successfully"}), 201


def init_routes(app):
    app.register_blueprint(api, url_prefix="/api")
