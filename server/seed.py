from app import app
from models import db, User, Payment_Detail, Address, Product, Category, Review, Cart, Cart_Item, Order, OrderItem, Order_Status
import pickle
from flask_bcrypt import Bcrypt
import random
import os
import ipdb
import json

bcrypt = Bcrypt()


def view_pickle_structure(filename):
    with open(filename, 'rb') as f:
        data = pickle.load(f)
    print(data)


def save_table_data_to_pickle(table_name):
    table_data = db.session.query(table_name).all()
    file_name = f"{table_name}.pickle"
    with open(file_name, "wb") as file:
        pickle.dump(table_data, file)
    print(f"Table data for {table_name} saved to {file_name}.")


def restore_categories():

    db.session.query(Category).delete()

    with open('data-backup/categories_backup.pickle', 'rb') as file:
        data = pickle.load(file)

    for category in data:
        category = Category(
            name=category.name
        )
        db.session.add(category)

    db.session.commit()


def restore_products():

    db.session.query(Product).delete()

    with open('data-backup/products_backup.pickle', 'rb') as file:
        data = pickle.load(file)

        for product in data:
            product = Product(
                name=product.name,
                description=product.description,
                price=product.price,
                image_1=product.image_1,
                image_2=product.image_2,
                image_3=product.image_3,
                quantity=250,
                allergens=product.allergens,
                ingredients=product.ingredients,
                chocolate_type=product.chocolate_type,
                category_id=product.category_id
            )
            db.session.add(product)

        db.session.commit()


def clear_tables():
    # db.session.query(User).delete()
    # db.session.query(Cart).delete()
    # db.session.query(Review).delete()
    db.session.query(Order).delete()
    # db.session.query(Payment_Detail).delete()
    # db.session.query(Address).delete()
    # db.session.query(Cart_Item).delete()
    db.session.query(OrderItem).delete()

    db.session.commit()


def add_http():
    products = Product.query.all()
    for product in products:
        if product.image_1 and not product.image_1.startswith('https://'):
            product.image_1 = f"https://{product.image_1}"

        if product.image_2 and not product.image_2.startswith('https://'):
            product.image_2 = f"https://{product.image_2}"

        if product.image_3 and not product.image_3.startswith('https://'):
            product.image_3 = f"https://{product.image_3}"
        db.session.add(product)
    db.session.commit()
    pass


def seed_users():
    users = [

    ]
    for user_data in users:
        try:
            password_hash = bcrypt.generate_password_hash(
                user_data['_password'])
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                username=user_data['username'],
            )
            user.password_hash = password_hash.decode('utf-8')
            db.session.add(user)
        except KeyError as e:
            print(f"KeyError: {e} not found in user_data: {user_data}")

    db.session.commit()


def seed_reviews():
    reviews = [

    ]

    for review_data in reviews:
        try:
            review = Review(
                product_id=review_data['product_id'],
                user_id=review_data['user_id'],
                rating=review_data['rating'],
                review_text=review_data['review_text'],
            )

            db.session.add(review)
        except KeyError as e:
            print(f"KeyError: {e} not found in review_data: {review_data}")
    db.session.commit()


def seed_orders():
    user_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]

    existing_products = Product.query.all()

    for user_id in user_ids:

        num_orders = random.randint(1, 5)

        for _ in range(num_orders):
            status_id = 1

            num_order_items = random.randint(1, 5)

            order_items = []
            total_price = 0.0

            for _ in range(num_order_items):
                product = random.choice(existing_products)
                quantity = random.randint(1, 3)
                price = product.price * quantity
                total_price += price

                order_item = OrderItem(
                    product_id=product.id,
                    quantity=quantity,
                    price=price
                )
                order_items.append(order_item)

            order = Order(
                user_id=user_id,
                total_price=total_price,
                status_id=status_id
            )
            db.session.add(order)
            db.session.flush()

            for order_item in order_items:
                order_item.order_id = order.id
                db.session.add(order_item)

    db.session.commit()


def seed_order_status():
    statuses = [

    ]

    for status in statuses:
        new_status = Order_Status(name=status)
        db.session.add(new_status)

    db.session.commit()


def update_order_statuses():

    orders = Order.query.all()

    order_statuses = Order_Status.query.all()

    for order in orders:

        random_status = random.choice(order_statuses)

        order.status_id = random_status.id

    db.session.commit()

    print("Order statuses updated successfully.")


if __name__ == "__main__":
    with app.app_context():
        # update_order_statuses()
        # seed_order_status()
        # save_table_data_to_pickle(Review)
        # view_pickle_structure("<class 'models.Product'>.pickle")
        # seed_orders()
        # seed_reviews()
        # seed_users()
        # restore_categories()
        # restore_products()
        # clear_tables()
        # add_http()
        pass
