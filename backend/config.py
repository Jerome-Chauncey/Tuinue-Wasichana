from flask import Flask, jsonify, request
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
    
    cors_origins = [origin.strip() for origin in os.environ.get(
    'CORS_ORIGINS',
    'http://localhost:5173,https://tuinue-wasichana-ui-dw85.onrender.com'
    ).split(',')]


    CORS(
    app,
    origins=cors_origins,
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Type", "Authorization", "X-Total-Count"],
    max_age=86400
    )


    # @app.before_request
    # def handle_options():
    #     if request.method == 'OPTIONS':
    #         return jsonify({}), 200

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from backend.routes.routes import init_routes
        init_routes(app)

    return app

app = create_app()
