from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///default.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-secret-key')
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default-secret-key')
    
    origins = [
        "http://localhost:5173",  # Development
        "https://tuinue-wasichana-ui-dw85.onrender.com",  
        "https://tuinue-wasichana-api-jauh.onrender.com"  
    ]
    
    CORS(
        app,
        resources={
            r"/*": {
                "origins": origins,
                "supports_credentials": True,
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
                "expose_headers": ["Content-Type", "Authorization", "X-Total-Count"],
                "max_age": 86400  
            }
        }
    )

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from backend.routes.routes import init_routes
        init_routes(app)

    return app

app = create_app()