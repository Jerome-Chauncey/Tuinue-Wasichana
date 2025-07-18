import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask

# Remote library imports
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
api = Api()

cors = CORS()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure app
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
    app.json.compact = False

    # Configure CORS with specific settings
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": [
                "#",
                "http://localhost:3000"  # For local development
            ],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"]
        }
    })

    metadata = MetaData(naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    })

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)
    from backend.resources.auth import Register, Login, Profile
    api.add_resource(Register, '/api/auth/register')
    api.add_resource(Login,    '/api/auth/login')
    api.add_resource(Profile,  '/api/auth/profile')



    with app.app_context():

        import backend.models.charity
        import backend.models.beneficiary
        import backend.models.donation
        import backend.models.schedule
        import backend.models.story
        import backend.models.user 

    return app

app = create_app()

