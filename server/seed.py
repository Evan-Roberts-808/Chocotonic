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


# def restore_categories():

#     db.session.query(Category).delete()

#     with open('data-backup/categories_backup.pickle', 'rb') as file:
#         data = pickle.load(file)

#     for category in data:
#         category = Category(
#             name=category.name
#         )
#         db.session.add(category)

#     db.session.commit()



if __name__ == "__main__":
    with app.app_context():

        pass
