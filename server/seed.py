from app import app
from models import db, User, Payment_Detail, Address, Product, Category, Review, Cart, Cart_Item, Order, OrderItem, Order_Status
import pickle
import os
import ipdb
import json


def view_pickle_structure(filename):
    with open(filename, 'rb') as f:
        data = pickle.load(f)
    print(data)


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
    db.session.query(User).delete()
    db.session.query(Cart).delete()
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

if __name__ == "__main__":
    with app.app_context():
        # restore_categories()
        # restore_products()
        # clear_tables()
        # add_http()
        pass
