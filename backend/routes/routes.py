from flask import Blueprint, jsonify, request, current_app
import traceback
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_cors import cross_origin
from backend.config import db
from datetime import datetime
from backend.models.donor import Donor
from backend.models.donation import Donation
from backend.models.charity import Charity
from backend.models.story import Story
from backend.models.beneficiary import Beneficiary
from backend.models.admin import Admin
from backend.models.donor_charity import donors_charities
import os
from werkzeug.utils import secure_filename
from sqlalchemy import text

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


from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import traceback

api = Blueprint('api', __name__)

@api.route('/donor-dashboard', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)
def donor_dashboard():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'preflight'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    try:
        current_user = get_jwt_identity()
        current_app.logger.info(f"Current user: {current_user}")
        if not current_user or current_user.get('role') != 'donor':
            return jsonify({'error': 'Unauthorized'}), 403

        donor = Donor.query.filter_by(email=current_user['email']).first()
        current_app.logger.info(f"Donor found: {donor.id if donor else None}")
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        donations = []
        for d in donor.donations:
            current_app.logger.info(f"Processing donation: id={d.id}, charity_id={d.charity_id}")
            try:
                donation_data = {
                    'id': d.id,
                    'charity_id': d.charity_id,
                    'charity_name': d.charity.name if d.charity else None,
                    'amount': float(d.amount) if d.amount is not None else 0.0,
                    'frequency': d.frequency,
                    'donationType': d.frequency,  # Map frequency to donationType
                    'date': d.date.isoformat() if d.date else None,
                    'is_anonymous': d.is_anonymous,
                    'start_date': d.date.isoformat() if d.date else None,  # Fallback for recurring
                    'billing_date': d.date.isoformat() if d.date else None  # Fallback
                }
                donations.append(donation_data)
            except Exception as e:
                current_app.logger.error(f"Error processing donation {d.id}: {str(e)}")

        charities = [{
            'id': c.id,
            'name': c.name,
            'mission': c.mission
        } for c in donor.charities]

        stories = []
        for c in donor.charities:
            current_app.logger.info(f"Processing charity stories: {c.id}")
            for s in c.stories:
                try:
                    stories.append({
                        'id': s.id,
                        'title': s.title,
                        'description': s.description,
                        'image': s.image,
                        'charity_name': s.charity.name if s.charity else None,
                        'charity': s.charity.name if s.charity else None,  # Added for frontend
                        'created_at': s.created_at.isoformat() if s.created_at else None
                    })
                except Exception as e:
                    current_app.logger.error(f"Error processing story {s.id}: {str(e)}")

        response = jsonify({
            'name': donor.name,
            'email': donor.email,
            'donations': donations,
            'charities': charities,
            'stories': stories
        })
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    except Exception as e:
        current_app.logger.error(f'Donor dashboard error: {str(e)}, Traceback: {traceback.format_exc()}')
        return jsonify({'error': 'Internal server error'}), 500
    




@api.route('/donate', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)
def donate():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight successful'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    current_user = get_jwt_identity()
    if not current_user or current_user.get('role') != 'donor':
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required_fields = ['charity_id', 'amount']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        charity_id = int(data['charity_id'])
        amount = float(data['amount'])
        frequency = data.get('frequency', 'one-time')
        anonymous = bool(data.get('anonymous', False))

        if amount <= 0:
            return jsonify({'error': 'Amount must be positive'}), 400

        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'error': 'Charity not found'}), 404

        donor = Donor.query.filter_by(email=current_user['email']).first()
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        donation = Donation(
            donor_id=donor.id,
            charity_id=charity.id,
            amount=amount,
            frequency=frequency,
            is_anonymous=anonymous,
            donor_name='Anonymous' if anonymous else donor.name,
            date=datetime.utcnow()
        )
        current_app.logger.info(f"Created donation: id={donation.id}, amount={donation.amount}, frequency={donation.frequency}, date={donation.date}")
        db.session.add(donation)
        if charity not in donor.charities:
            donor.charities.append(charity)
        db.session.commit()

        return jsonify({
            'message': 'Donation successful',
            'donation_id': donation.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Donation error: {str(e)}, Traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500







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
