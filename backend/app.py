import os
from dotenv import load_dotenv

load_dotenv()

from backend.config import create_app, db

from backend.models.charity import Charity
from backend.models.beneficiary import Beneficiary
from backend.models.donation import Donation
from backend.models.schedule import Schedule
from backend.models.story import Story
from backend.models.user import User

from flask_jwt_extended import JWTManager
app = create_app()
jwt = JWTManager(app)

from backend.routes.users import users_bp
from backend.routes.charities import charities_bp
from backend.routes.donations import donations_bp
from backend.routes.schedules import schedules_bp
from backend.routes.stories import stories_bp
from backend.routes.beneficiaries import beneficiaries_bp

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
