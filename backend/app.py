import os
from dotenv import load_dotenv
from flask import Blueprint
# Load environment variables from .env
load_dotenv()

from flask import jsonify, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from decimal import Decimal

# Import application factory and extensions
from backend.config import create_app, db
from backend.models.charity import Charity

from backend.models.beneficiary import Beneficiary
from backend.models.donation import Donation
from backend.models.schedule import Schedule 
from backend.models.story import Story
from backend.models.user import User

# Instantiate app first
app = create_app()
jwt = JWTManager(app)

from routes.users import users_bp
from routes.charities import charities_bp
from routes.donations import donations_bp
from routes.schedules import schedules_bp
from routes.stories import stories_bp
from routes.beneficiaries import beneficiaries_bp

# Register each route group
app.register_blueprint(users_bp)
app.register_blueprint(charities_bp)
app.register_blueprint(donations_bp)
app.register_blueprint(schedules_bp)
app.register_blueprint(stories_bp)
app.register_blueprint(beneficiaries_bp)

# Instantiate Flask application via factory
app = create_app()
jwt = JWTManager(app)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5555))
    app.run(host="0.0.0.0", port=port, debug=(os.getenv("FLASK_ENV")!="production"))