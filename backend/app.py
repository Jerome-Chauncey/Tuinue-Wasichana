import os
from dotenv import load_dotenv


load_dotenv()

from config import create_app, db

from models.charity import Charity
from models.beneficiary import Beneficiary
from models.donation import Donation
from models.schedule import Schedule
from models.story import Story
from models.user import User

from flask_jwt_extended import JWTManager
app = create_app()
jwt = JWTManager(app)

from routes.users import users_bp
from routes.charities import charities_bp
from routes.donations import donations_bp
from routes.schedules import schedules_bp
from routes.stories import stories_bp
from routes.beneficiaries import beneficiaries_bp

app.register_blueprint(users_bp)
app.register_blueprint(charities_bp)
app.register_blueprint(donations_bp)
app.register_blueprint(schedules_bp)
app.register_blueprint(stories_bp)
app.register_blueprint(beneficiaries_bp)

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5555))
    debug = os.getenv("FLASK_ENV", "development") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug)
