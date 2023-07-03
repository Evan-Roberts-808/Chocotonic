from flask_migrate import Migrate
from flask import Flask, request, session, make_response, jsonify, redirect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import app, db, api, Resource
# from models import
import ipdb


migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
