from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

from api.models import User, db

api = Blueprint("api", __name__)
CORS(api)


@api.route("/hello", methods=["GET", "POST"])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"msg": "El email y la contraseña son obligatorios."}), 400

    if len(password) < 6:
        return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Ya existe un usuario con ese email."}), 409

    user = User(
        email=email,
        password=generate_password_hash(password),
        is_active=True,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "msg": "Usuario creado correctamente.",
        "user": user.serialize(),
    }), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos."}), 401

    if not user.is_active:
        return jsonify({"msg": "Este usuario está desactivado."}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": token,
        "user": user.serialize(),
    }), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    user = User.query.get(int(get_jwt_identity()))

    if not user or not user.is_active:
        return jsonify({"msg": "El usuario no es válido."}), 401

    return jsonify({
        "msg": "Acceso autorizado.",
        "user": user.serialize(),
    }), 200
