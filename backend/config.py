import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    api = Api(app)

    app.config.update({
        'SQLALCHEMY_DATABASE_URI': os.getenv("DATABASE_URL"),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': os.getenv("JWT_SECRET_KEY"),
        'SECRET_KEY': os.getenv("FLASK_SECRET_KEY"),
        'JSONIFY_PRETTYPRINT_REGULAR': True,
        'CORS_SUPPORTS_CREDENTIALS': True,
        'SQLALCHEMY_ECHO': True,
        'JWT_TOKEN_LOCATION': ['headers', 'cookies'],
        'PROPAGATE_EXCEPTIONS': True
    })

    # Configure CORS to handle all /api/* routes
    CORS(app,
         resources={
             r"/api/*": {
                 "origins": ["http://localhost:5173", "https://tuinue-wasichana-ui-dw85.onrender.com"],
                 "supports_credentials": True,
                 "methods": ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "expose_headers": ["Content-Type", "Authorization"]
             }
         }
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)

    from backend.routes.routes import init_routes
    init_routes(app)
    app.logger.info("API Blueprint registered via init_routes")

   
    @app.errorhandler(404)
    def not_found(error):
        response = jsonify({"error": "Not found"})
        return response, 404

    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)