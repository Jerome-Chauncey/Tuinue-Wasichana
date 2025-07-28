import os
from dotenv import load_dotenv
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
api = Api()

def create_app():
    app = Flask(__name__)

    
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': os.getenv("DATABASE_URL"),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': os.getenv("JWT_SECRET_KEY"),
        'SECRET_KEY': os.getenv("FLASK_SECRET_KEY"),
        'JSONIFY_PRETTYPRINT_REGULAR': True,
        'CORS_SUPPORTS_CREDENTIALS': True,
        'SQLALCHEMY_ECHO': True,
        'JWT_TOKEN_LOCATION': ['headers', 'cookies'],  
        'PROPAGATE_EXCEPTIONS': True  # Better error handling
    })

    
    CORS(app,
        resources={
            r"/api/*": {  
                "origins": [
                    "http://localhost:5173",  
                    "https://tuinue-wasichana-ui-dw85.onrender.com",  
                    "https://tuinue-wasichana-ui.onrender.com"  
                ],
                "supports_credentials": True,
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "X-Requested-With",
                    "Access-Control-Allow-Credentials"
                ],
                "expose_headers": [
                    "Content-Type",
                    "X-Total-Count",  
                    "Access-Control-Allow-Origin"
                ],
                "max_age": 600
            }
        }
    )

    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)  

    
    from backend.routes.routes import init_routes
    init_routes(app)

    
    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers['Access-Control-Max-Age'] = 600
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            return response

    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)