from flask_migrate import Migrate
from sqlalchemy import func
from flask import Flask, request, session, make_response, jsonify, redirect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import generate_password_hash
from config import app, db, api, Resource
from models import db, User, Payment_Detail, Address, Product, Category, Review, Cart, Cart_Item, Order, OrderItem, Order_Status
import ipdb
import datetime
import traceback

migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)


# User and Login Routes


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()


class Signup(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            name=data['name'],
            email=data['email'],
        )
        new_user.password_hash = data['password']

        # Create a cart for the user
        new_cart = Cart()
        new_user.cart = new_cart  # Associate the cart with the user

        db.session.add(new_user)
        db.session.commit()

        login_user(new_user, remember=True)

        return new_user.to_dict(), 201


class Login(Resource):

    def post(self):
        try:
            data = request.get_json()
            identifier = data.get('identifier')  # Can be email or username
            password = data.get('password')

            user = User.query.filter(
                (User.email == identifier) | (User.username == identifier)
            ).first()

            if user:
                if user.authenticate(password):
                    login_user(user, remember=True)
                    return user.to_dict(), 200
            if not user:
                return {'error': '404 user not found'}, 404
        except:
            return {'error': '401 Unauthorized'}, 401


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return f'You have logged out. Goodbye'


class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            user = current_user.to_dict()
            return user, 200
        return {"error": "unauthorized"}, 401


api.add_resource(Login, '/login')
api.add_resource(Signup, '/signup')
api.add_resource(CheckSession, '/check_session')


# User Details Routes


class Users(Resource):
    @login_required
    def get(self):
        try:
            user = current_user
            if user:
                return {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }, 200
            else:
                return {"error": "User not found"}, 404
        except:
            return {"error": "An error occurred while fetching the user"}, 500

    @login_required
    def patch(self):
        try:
            user = current_user
            if user:
                data = request.get_json()
                user.email = data.get("email", user.email)

                # Hash the password before updating
                password = data.get("password")
                if password:
                    hashed_password = generate_password_hash(password)
                    user._password_hash = hashed_password

                db.session.commit()
                return {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }, 200
            else:
                return {"error": "User not found"}, 404
        except:
            return {"error": "An error occurred while updating the user"}, 500

    @login_required
    def delete(self):
        try:
            user = current_user
            if user:
                db.session.delete(user)
                db.session.commit()
                return {}, 204
            else:
                return {"error": "User not found"}, 404
        except:
            return {"error": "An error occurred while deleting the user"}, 500


class UserOrders(Resource):
    @login_required
    def get(self):
        try:
            user_id = current_user.id
            orders = Order.query.filter_by(user_id=user_id).all()
            order_history = []
            for order in orders:
                order_status = order.status.name if order.status else None
                order_history.append({
                    "order_id": order.id,
                    "total_price": order.total_price,
                    "status": order_status,
                    "created": order.created_at.isoformat() if order.created_at else None
                })
            return order_history, 200
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the order history", "message": str(e)}, 500


class UserOrderById(Resource):
    @login_required
    def get(self, order_id):
        try:
            user_id = current_user.id
            order = Order.query.filter_by(id=order_id, user_id=user_id).first()
            if order:
                order_items = [
                    {
                        "product_id": item.product_id,
                        "product_name": item.product.name,
                        "quantity": item.quantity,
                        "price": item.price
                    }
                    for item in order.order_items
                ]
                order_info = {
                    "order_id": order.id,
                    "total_price": order.total_price,
                    "order_items": order_items,
                    "order_status": order.status_id
                }
                return order_info, 200
            else:
                return {"error": "Order not found"}, 404
        except:
            return {"error": "An error occurred while fetching the order"}, 500

    @login_required
    def patch(self, order_id):
        try:
            user_id = current_user.id
            order = Order.query.filter_by(id=order_id, user_id=user_id).first()
            if order:
                order.status_id = 4
                db.session.commit()
                return {}, 200
            else:
                return {"error": "Order not found"}, 404
        except:
            return {"error": "An error occurred while cancelling the order"}, 500


class UserPayment(Resource):
    @login_required
    def get(self, user_id):
        try:
            user_payments = Payment_Detail.query.filter_by(
                user_id=user_id).all()
            if user_payments:
                payment_info = []
                for payment in user_payments:
                    payment_info.append({
                        "id": payment.id,
                        "card_number": payment.card_number,
                        "cardholder_name": payment.cardholder_name,
                        "expiration_month": payment.expiration_month,
                        "expiration_year": payment.expiration_year,
                        "cvv": payment.cvv
                    })
                return payment_info, 200
            else:
                return {"error": "Payment details not found"}, 404
        except:
            return {"error": "An error occurred while fetching the payment details"}, 500

    @login_required
    def post(self, user_id):
        try:
            data = request.get_json()
            card_number = data.get("card_number")
            cardholder_name = data.get("cardholder_name")
            expiration_month = data.get("expiration_month")
            expiration_year = data.get("expiration_year")
            cvv = data.get("cvv")

            if not card_number or not cardholder_name or not expiration_month or not expiration_year or not cvv:
                return {"error": "Missing required payment details"}, 400

            user_payment = Payment_Detail(
                user_id=user_id,
                card_number=card_number,
                cardholder_name=cardholder_name,
                expiration_month=expiration_month,
                expiration_year=expiration_year,
                cvv=cvv
            )

            db.session.add(user_payment)
            db.session.commit()

            new_payment_info = {
                "id": user_payment.id,
                "card_number": user_payment.card_number,
                "cardholder_name": user_payment.cardholder_name,
                "expiration_month": user_payment.expiration_month,
                "expiration_year": user_payment.expiration_year,
                "cvv": user_payment.cvv
            }

            return new_payment_info, 201
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while adding the payment details", "message": str(e)}, 500


class UserPaymentById(Resource):
    @login_required
    def get(self, user_id, payment_id):
        try:
            user_payment = Payment_Detail.query.filter_by(
                user_id=user_id, id=payment_id).first()
            if user_payment:
                payment_info = {
                    "id": user_payment.id,
                    "card_number": user_payment.card_number,
                    "cardholder_name": user_payment.cardholder_name,
                    "expiration_month": user_payment.expiration_month,
                    "expiration_year": user_payment.expiration_year,
                    "cvv": user_payment.cvv
                }
                return payment_info, 200
            else:
                return {"error": "Payment details not found"}, 404
        except:
            return {"error": "An error occurred while fetching the payment details"}, 500

    @login_required
    def patch(self, user_id, payment_id):
        try:
            user_payment = Payment_Detail.query.filter_by(
                user_id=user_id, id=payment_id).first()
            if not user_payment:
                return {"error": "Payment details not found"}, 404

            data = request.get_json()
            for key, value in data.items():
                setattr(user_payment, key, value)

            db.session.commit()

            payment_info = {
                "id": user_payment.id,
                "card_number": user_payment.card_number,
                "cardholder_name": user_payment.cardholder_name,
                "expiration_month": user_payment.expiration_month,
                "expiration_year": user_payment.expiration_year,
                "cvv": user_payment.cvv
            }

            return payment_info, 200
        except:
            return {"error": "An error occurred while updating the payment details"}, 500

    @login_required
    def delete(self, user_id, payment_id):
        try:
            user_payment = Payment_Detail.query.filter_by(
                user_id=user_id, id=payment_id).first()
            if user_payment:
                db.session.delete(user_payment)
                db.session.commit()
                return {}, 204
            else:
                return {"error": "Payment details not found"}, 404
        except:
            return {"error": "An error occurred while deleting the payment details"}, 500


class UserAddress(Resource):
    @login_required
    def get(self, user_id):
        try:
            addresses = Address.query.filter_by(user_id=user_id).all()
            address_list = []
            for address in addresses:
                address_info = {
                    "id": address.id,
                    "address_line1": address.address_line_1,
                    "address_line2": address.address_line_2,
                    "city": address.city,
                    "state": address.state,
                    "postal_code": address.postal_code,
                    "type": address.address_type
                }
                address_list.append(address_info)
            return address_list, 200
        except:
            return {"error": "An error occurred while fetching the addresses"}, 500

    @login_required
    def post(self, user_id):
        try:
            data = request.get_json()

            address = Address(
                user_id=user_id,
                address_line_1=data.get('address_line_1'),
                address_line_2=data.get('address_line_2', ''),
                city=data.get('city'),
                state=data.get('state'),
                postal_code=data.get('postal_code'),
                address_type=data.get('address_type')
            )

            db.session.add(address)
            db.session.commit()

            address_info = {
                'id': address.id,
                'address_line1': address.address_line_1,
                'address_line2': address.address_line_2,
                'city': address.city,
                'state': address.state,
                'postal_code': address.postal_code,
                'address_type': address.address_type
            }
            return address_info, 201
        except Exception as e:
            traceback.print_exc()
            return {'error': 'An error occurred while creating the address', "message": str(e)}, 500


class UserAddressById(Resource):

    @login_required
    def patch(self, user_id, address_id):
        try:
            data = request.get_json()

            address = Address.query.filter_by(
                id=address_id, user_id=user_id).first()
            if not address:
                return {"error": "Address not found"}, 404

            for attr in data:
                setattr(address, attr, data[attr])
            db.session.add(address)

            db.session.commit()

            return address.to_dict(), 200
        except Exception as e:
            print("Error occurred:", str(e))
            return {"error": "An error occurred while updating the address", "message": str(e)}, 500

    @login_required
    def delete(self, user_id, address_id):
        try:
            address = Address.query.filter_by(
                id=address_id, user_id=user_id).first()
            if not address:
                return {"error": "Address not found"}, 404

            db.session.delete(address)
            db.session.commit()

            return {}, 204
        except:
            return {"error": "An error occurred while deleting the address"}, 500


api.add_resource(Users, '/users')
api.add_resource(UserOrders, '/user/orders')
api.add_resource(UserOrderById, '/user/orders/<int:order_id>')
api.add_resource(UserPayment, '/payments/<int:user_id>')
api.add_resource(UserPaymentById, '/payments/<int:user_id>/<int:payment_id>')
api.add_resource(UserAddress, '/addresses/<int:user_id>')
api.add_resource(UserAddressById, '/addresses/<int:user_id>/<int:address_id>')


# Category Routes


class Categories(Resource):
    def get(self):
        try:
            categories = [category.to_dict()
                          for category in Category.query.all()]
            return categories, 200
        except:
            return {"error": "Categories not found"}, 404


api.add_resource(Categories, '/categories')


# Product Routes


class Products(Resource):

    def get(self):
        try:
            products = [product.to_dict() for product in Product.query.all()]
            return products, 200
        except Exception as e:
            return {"error": "Failed to retrieve products", "message": str(e)}, 500

    def patch(self, id):
        try:
            data = request.get_json()
            product = Product.query.filter_by(id=id).first()

            if product:
                for attr, value in data.items():
                    setattr(product, attr, value)

                db.session.commit()
                return product.to_dict(), 200
            else:
                return {"error": "Product not found"}, 404
        except Exception as e:
            return {"error": "Failed to update product", "message": str(e)}, 500


class ProductByCategory(Resource):

    def get(self, category_id):
        try:
            products = Product.query.filter_by(category_id=category_id).all()
            products_data = [product.to_dict() for product in products]
            return products_data, 200
        except:
            return {"error": "Products not found for the specified category"}, 404


class ProductById(Resource):

    def get(self, id):
        try:
            product = Product.query.filter_by(id=id).first().to_dict()
            return product, 200
        except Exception as e:
            return {"error": "Failed to retrieve product", "message": str(e)}, 500


api.add_resource(Products, '/products')
api.add_resource(ProductById, '/products/<int:id>')
api.add_resource(ProductByCategory, '/products/category/<int:category_id>')

# Cart Resource


class Carts(Resource):
    @login_required
    def get(self):
        try:
            cart_items = current_user.cart.cart_items
            items = [
                {
                    'item_id': item.id,
                    'product_id': item.product_id,
                    'product_name': item.product.name,
                    'quantity': item.quantity
                }
                for item in cart_items
            ]
            cart_info = {
                'user_id': current_user.id,
                'items': items
            }
            return cart_info, 200
        except:
            return {'error': 'An error occurred while fetching the cart'}, 500

    @login_required
    def post(self):
        try:
            data = request.get_json()
            product_id = data.get('product_id')
            quantity = data.get('quantity')

            product = Product.query.filter_by(id=product_id).first()
            if not product:
                return {'error': 'Product not found'}, 404

            cart_item = Cart_Item.query.filter_by(
                cart_id=current_user.cart.id, product_id=product_id).first()
            if cart_item:
                cart_item.quantity += quantity
            else:
                cart_item = Cart_Item(
                    cart_id=current_user.cart.id,
                    product_id=product_id,
                    quantity=quantity
                )
                db.session.add(cart_item)

            db.session.commit()

            cart_items = current_user.cart.cart_items
            items = [
                {
                    'item_id': item.id,
                    'product_id': item.product_id,
                    'product_name': item.product.name,
                    'quantity': item.quantity
                }
                for item in cart_items
            ]
            cart_info = {
                'user_id': current_user.id,
                'items': items
            }
            return cart_info, 201
        except:
            return {'error': 'An error occurred while adding the item to the cart'}, 500

    @login_required
    def patch(self):
        try:
            data = request.get_json()
            product_id = data.get('product_id')
            quantity = data.get('quantity')

            cart_item = Cart_Item.query.filter_by(
                cart_id=current_user.cart.id, product_id=product_id).first()
            if cart_item:
                if quantity is not None:
                    cart_item.quantity = quantity
                db.session.commit()

                cart_items = current_user.cart.cart_items
                items = [
                    {
                        'item_id': item.id,
                        'product_id': item.product_id,
                        'product_name': item.product.name,
                        'quantity': item.quantity
                    }
                    for item in cart_items
                ]
                cart_info = {
                    'user_id': current_user.id,
                    'items': items
                }
                return cart_info, 200
            else:
                return {'error': 'Item not found in the cart'}, 404
        except:
            return {'error': 'An error occurred while updating the cart item'}, 500

    @login_required
    def delete(self):
        try:
            data = request.get_json()
            item_id = data.get('item_id')

            cart_item = Cart_Item.query.filter_by(
                cart_id=current_user.cart.id, id=item_id).first()
            if cart_item:
                db.session.delete(cart_item)
                db.session.commit()
                return {}, 204
            else:
                return {'error': 'Item not found in the cart'}, 404
        except:
            return {'error': 'An error occurred while deleting the item from the cart'}, 500


api.add_resource(Carts, '/carts')


class Checkout(Resource):
    @login_required
    def post(self):
        try:
            cart = Cart.query.filter_by(user_id=current_user.id).first()
            if cart:
                total_price = 0.0
                for cart_item in cart.cart_items:
                    total_price += cart_item.product.price * cart_item.quantity
                    product = Product.query.filter_by(
                        id=cart_item.product_id).first()
                    product.quantity -= cart_item.quantity
                    db.session.add(product)
                order = Order(
                    user_id=current_user.id,
                    total_price=total_price,
                    status_id=1
                )
                db.session.add(order)
                db.session.flush()

                for cart_item in cart.cart_items:
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=cart_item.product_id,
                        quantity=cart_item.quantity,
                        price=cart_item.product.price
                    )
                    db.session.add(order_item)

                cart.cart_items.clear()

                db.session.commit()

                return {'message': 'Order placed successfully'}, 200
            else:
                return {'error': 'Cart not found'}, 404
        except Exception as e:
            traceback.print_exc()
            db.session.rollback()
            return {'error': 'An error occurred while placing the order', 'details': str(e)}, 500


api.add_resource(Checkout, '/checkout')


# Review Resources


class ProductReviews(Resource):
    def get(self, product_id):
        try:
            reviews = Review.query.filter_by(product_id=product_id).all()
            review_list = []
            for review in reviews:
                review_info = {
                    'review_id': review.id,
                    'user_id': review.user_id,
                    'users_name': review.user.name,
                    'rating': review.rating,
                    'review_text': review.review_text,
                    'created_at': review.created_at.isoformat() if review.created_at else None
                }

                if review.updated_at:
                    review_info['updated_at'] = review.updated_at.isoformat()

                review_list.append(review_info)
            return review_list, 200
        except:
            return {'error': 'An error occurred while fetching the reviews'}, 500

    @login_required
    def post(self, product_id):
        try:
            user_id = current_user.id
            data = request.get_json()
            rating = int(data.get('rating'))
            review_text = data.get('review_text')

            product = Product.query.filter_by(id=product_id).first()
            if not product:
                return {'error': 'Product not found'}, 404

            review = Review(
                user_id=user_id,
                product_id=product_id,
                rating=rating,
                review_text=review_text
            )
            db.session.add(review)
            db.session.commit()

            review_info = {
                'review_id': review.id,
                'user_id': review.user_id,
                'users_name': review.user.name,
                'rating': review.rating,
                'review_text': review.review_text,
                'created_at': review.created_at.isoformat() if review.created_at else None
            }

            if review.updated_at:
                review_info['updated_at'] = review.updated_at.isoformat()

            return review_info, 201

        except Exception as e:
            print(e)
            return {'error': 'An error occurred while posting the review', 'message': str(e)}, 500


class UserReview(Resource):
    @login_required
    def patch(self, review_id):
        try:
            user_id = current_user.id
            review = Review.query.filter_by(
                id=review_id, user_id=user_id).first()
            if review:
                data = request.get_json()
                rating = data.get('rating')
                review_text = data.get('review_text')

                review.rating = rating
                review.review_text = review_text
                review.updated_at = datetime.datetime.now()

                db.session.commit()

                review_info = {
                    'review_id': review.id,
                    'user_id': review.user_id,
                    'rating': review.rating,
                    'review_text': review.review_text,
                    'created_at': review.created_at.isoformat() if review.created_at else None
                }

            if review.updated_at:
                review_info['updated_at'] = review.updated_at.isoformat()
                return review_info, 200
            else:
                return {'error': 'Review not found'}, 404
        except:
            return {'error': 'An error occurred while updating the review'}, 500

    @login_required
    def delete(self, review_id):
        try:
            user_id = current_user.id
            review = Review.query.filter_by(
                id=review_id, user_id=user_id).first()
            if review:
                db.session.delete(review)
                db.session.commit()
                return {}, 204
            else:
                return {'error': 'Review not found'}, 404
        except:
            return {'error': 'An error occurred while deleting the review'}, 500


api.add_resource(ProductReviews, '/reviews/product/<product_id>')
api.add_resource(UserReview, '/reviews/<review_id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
