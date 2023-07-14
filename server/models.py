from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from collections import OrderedDict
from flask_login import UserMixin, LoginManager
import re
from datetime import datetime

from config import db, bcrypt

############# Models Below #############


class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    cart = db.relationship("Cart", uselist=False,
                           back_populates="user", cascade="all, delete-orphan")
    reviews = db.relationship(
        "Review", back_populates="user", cascade="all, delete-orphan")
    addresses = db.relationship(
        "Address", back_populates="user", cascade="all, delete-orphan")
    orders = db.relationship(
        "Order", back_populates="user", cascade="all, delete-orphan")
    payment_details = db.relationship(
        "Payment_Detail", back_populates="user", cascade="all, delete-orphan")

    # Serialize Rules
    serialize_rules = ('-cart', '-reviews', '-addresses',
                       '-orders', '-payment_details')

    # Validations
    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError('Invalid email format')
        return email

    @validates('username')
    def validate_username(self, key, username):
        if not username and len(username) < 1:
            raise ValueError('Invalid username')
        return username

    # password hashing
    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))


class Payment_Detail(db.Model, SerializerMixin):
    __tablename__ = 'payment_details'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_number = db.Column(db.String, nullable=False)
    cardholder_name = db.Column(db.String, nullable=False)
    expiration_month = db.Column(db.Integer, nullable=False)
    expiration_year = db.Column(db.Integer, nullable=False)
    cvv = db.Column(db.Integer, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="payment_details")

    @validates('card_number')
    def validate_card_number(self, key, card_number):
        if not card_number or card_number.isspace():
            raise ValueError("Card number is required.")

        if not re.match(r'^[0-9]{16}$', card_number):
            raise ValueError("Invalid card number format.")

        return card_number

    @validates('cardholder_name')
    def validate_cardholder_name(self, key, cardholder_name):
        if not cardholder_name or cardholder_name.isspace():
            raise ValueError("Cardholder name is required.")
        return cardholder_name

    @validates('expiration_month')
    def validate_expiration_month(self, key, expiration_month):
        if expiration_month < 1 or expiration_month > 12:
            raise ValueError("Invalid expiration month.")
        return expiration_month

    @validates('expiration_year')
    def validate_expiration_year(self, key, expiration_year):
        current_year = datetime.now().year
        if expiration_year < current_year or expiration_year > (current_year + 10):
            raise ValueError("Invalid expiration year.")
        return expiration_year


class Address(db.Model, SerializerMixin):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    address_line_1 = db.Column(db.Text, nullable=False)
    address_line_2 = db.Column(db.Text, nullable=True)
    city = db.Column(db.Text, nullable=False)
    state = db.Column(db.String, nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    address_type = db.Column(db.String, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="addresses")

    # Serialize Rules
    serialize_rules = ("-user",)

    # Validations
    @validates('postal_code')
    def validate_postal_code(self, key, postal_code):
        pattern = r'^\d{5}$'

        if not re.match(pattern, str(postal_code)):
            raise ValueError('Invalid postal code')

        return postal_code

    @validates('state')
    def validate_state(self, key, state):
        valid_states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
                        'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
                        'VA', 'WA', 'WV', 'WI', 'WY']
        if state not in valid_states:
            raise ValueError('Invalid state')
        return state

    @validates('address_line_1', 'city', 'address_type')
    def validate_non_empty_fields(self, key, value):
        if value is not None and not value.strip():
            raise ValueError("Field must not be empty.")
        return value


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_1 = db.Column(db.String, nullable=False)
    image_2 = db.Column(db.String, nullable=True)
    image_3 = db.Column(db.String, nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=250)
    allergens = db.Column(db.Text)
    ingredients = db.Column(db.Text)
    chocolate_type = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    # Relationships
    category = db.relationship("Category", backref="products")
    order_items = db.relationship("OrderItem", back_populates="product")
    reviews = db.relationship("Review", back_populates="product")
    cart_items = db.relationship("Cart_Item", back_populates="product")

    # Serialize Rules
    serialize_rules = ("-order_items", "-reviews",
                       "-cart_items", "category.name", "category.id", '-category.products')


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    rating = db.Column(db.Integer)
    review_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships

    user = db.relationship("User", back_populates="reviews")
    product = db.relationship("Product", back_populates="reviews")

    # Validations

    @validates('rating')
    def validate_rating(self, key, rating):
        if not rating or rating < 0 or rating > 5:
            raise ValueError(' Invalid rating value, must be between 0 and 5')
        return rating


class Cart(db.Model, SerializerMixin):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships

    user = db.relationship("User", back_populates="cart")
    cart_items = db.relationship("Cart_Item", back_populates="cart", cascade="all, delete-orphan")

    # serialize rules
    serialize_rules = ("-user", "-cart_items")


class Cart_Item(db.Model, SerializerMixin):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer)

    # Relationships

    cart = db.relationship("Cart", back_populates="cart_items")
    product = db.relationship("Product", back_populates="cart_items")

    # Serialize Rules
    serialize_rules = ("-cart", "-product")


class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    total_price = db.Column(db.Float, nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey("order_statuses.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # relationships
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status = db.relationship("Order_Status", backref="orders")

    # Serialize Rules


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # relationships
    order = db.relationship("Order", back_populates="order_items")
    product = db.relationship("Product", back_populates="order_items")

    # Serialize Rules
    serialize_rules = ("-order", "-product")


class Order_Status(db.Model, SerializerMixin):
    __tablename__ = 'order_statuses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    # Serialize Rules
    serialize_rules = ("-orders",)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
