import os
from dotenv import load_dotenv
from flask import Flask
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

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")  
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
    app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY")
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    app.config['CORS_SUPPORTS_CREDENTIALS'] = True
    app.config['SQLALCHEMY_ECHO'] = True


    CORS(app,
        origins=["http://localhost:5173","https://tuinue-wasichana-ui-dw85.onrender.com" ],
        supports_credentials=True,  
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type"],
        max_age=600)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    

    from backend.routes.routes import init_routes
    init_routes(app)



    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
