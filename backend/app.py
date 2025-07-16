import os
from dotenv import load_dotenv

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


# Instantiate Flask application via factory
app = create_app()
jwt = JWTManager(app)