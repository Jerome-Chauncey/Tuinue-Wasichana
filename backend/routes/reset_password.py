from flask import Blueprint, request, jsonify
from models import User, db
from backend.token_service import generate_reset_token, confirm_reset_token
from backend.email_service import send_password_reset_email

reset_bp = Blueprint("reset_password", __name__)

@reset_bp.route("/api/request-password-reset", methods=["POST"])
def request_password_reset():
    data = request.get_json()
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If that email exists, a reset link will be sent."}), 200

    send_password_reset_email(user.email)
    return jsonify({"message": "Reset link sent if user exists."}), 200


@reset_bp.route("/api/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json()
    new_password = data.get("password")

    email = confirm_reset_token(token)
    if not email:
        return jsonify({"message": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password reset successful"}), 200
