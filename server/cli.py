from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table
from flask import Flask
from config import app, db
from models import *


def main():
    console = Console()
    console.print("Welcome to Chocotonic Fulfillment Center!")
    console.print()

    while True:
        console.print("Please select an option:")
        console.print("[bold cyan]1[/bold cyan]. View inventory")
        console.print("[bold cyan]2[/bold cyan]. Order more inventory")
        console.print("[bold cyan]3[/bold cyan]. Fulfill pending orders")
        console.print("[bold cyan]e[/bold cyan]. Exit")
        console.print()

        choice = Prompt.ask("Selection", choices=["1", "2", "3", "e"])
        if choice == "1":
            view_inventory()
        elif choice == "2":
            order_inventory()
        elif choice == "3":
            fulfill_orders()
        elif choice == "e":
            break


def view_inventory():
    console = Console()
    console.print("[bold]View Inventory[/bold]")
    console.print()

    # Display all products and their quantities
    products = Product.query.all()
    if not products:
        console.print("[bold red]No products found in inventory.[/bold red]")
        return

    # Display products and their quantities
    table = Table(title="Inventory")
    table.add_column("ID")
    table.add_column("Name")
    table.add_column("Quantity")
    for product in products:
        table.add_row(str(product.id), product.name, str(product.quantity))
    console.print(table)
    console.print()

    # Prompt user for further options
    options = {
        "o": "Order",
        "e": "Exit"
    }
    options_menu = "\n".join(
        f"{key}. {value}" for key, value in options.items()
    )
    selected_option = Prompt.ask(
        f"Please select an option:\n{options_menu}",
        choices=list(options.keys()),
        default="o"
    )

    if selected_option == "o":
        order_inventory()
    elif selected_option == "e":
        console.print("[bold]Exiting view inventory...[/bold]")
        console.print()


def order_inventory():
    console = Console()
    console.print("[bold]Order Inventory[/bold]")
    console.print()

    # Display categories
    categories = Category.query.all()
    table = Table(title="Categories")
    table.add_column("ID")
    table.add_column("Name")
    for category in categories:
        table.add_row(str(category.id), category.name)
    console.print(table)
    console.print()

    # Prompt user to select a category
    category_id = Prompt.ask("Select a category", choices=[
                             str(category.id) for category in categories])

    # Get products in the selected category
    products = Product.query.filter_by(category_id=category_id).all()
    if not products:
        console.print(
            "[bold red]No products found in the selected category.[/bold red]")
        return

    # Display products and their quantities
    table = Table(title="Products")
    table.add_column("ID")
    table.add_column("Name")
    table.add_column("Quantity")
    for product in products:
        table.add_row(str(product.id), product.name, str(product.quantity))
    console.print(table)
    console.print()

    # Prompt user to select a product
    product_id = Prompt.ask("Select a product", choices=[
                            str(product.id) for product in products])

    # Prompt user to enter quantity
    quantity = int(Prompt.ask("Enter quantity to order"))

    # Update the quantity of the selected product
    product = Product.query.filter_by(id=product_id).first()
    if product:
        product.quantity += quantity
        db.session.commit()
        console.print(
            f"[bold green]Inventory for product {product.name} (ID: {product.id}) has been updated.[/bold green]")
    else:
        console.print(
            f"[bold red]Product with ID {product_id} not found.[/bold red]")


def fulfill_orders():
    console = Console()
    console.print("[bold]Fulfill Orders[/bold]")
    console.print()

    # Fetch pending orders
    pending_orders = Order.query.filter_by(status_id=1).all()
    if not pending_orders:
        console.print("[bold]No pending orders.[/bold]")
        return

    # Set the number of orders to display at a time
    orders_per_page = 10
    total_orders = len(pending_orders)
    num_pages = (total_orders // orders_per_page) + 1

    # Initialize variables for pagination
    current_page = 1
    start_index = (current_page - 1) * orders_per_page
    end_index = current_page * orders_per_page

    while True:
        # Display orders for the current page
        table = Table(
            title=f"Pending Orders (Page {current_page}/{num_pages})")
        table.add_column("Order ID")
        table.add_column("Total Price", justify="right")
        for index, order in enumerate(pending_orders[start_index:end_index]):
            formatted_price = "{:.2f}".format(order.total_price)
            table.add_row(str(order.id), formatted_price)
        console.print(table)
        console.print()

        # Prompt user to select an action or order
        options = {
            "1": "Next",
            "2": "Previous",
            "3": "Select Order",
            "e": "Exit"
        }
        options_menu = "\n".join(
            f"{key}. {value}" for key, value in options.items())
        selected_choice = Prompt.ask(
            f"Please select an option:\n{options_menu}",
            choices=list(options.keys()),
            default="1"
        )

        if selected_choice == "e":
            break
        elif selected_choice == "1":
            if current_page < num_pages:
                current_page += 1
                start_index = (current_page - 1) * orders_per_page
                end_index = current_page * orders_per_page
            else:
                console.print("[bold]No more orders to display.[/bold]")
                console.print()
        elif selected_choice == "2":
            if current_page > 1:
                current_page -= 1
                start_index = (current_page - 1) * orders_per_page
                end_index = current_page * orders_per_page
            else:
                console.print("[bold]Already on the first page.[/bold]")
                console.print()
        elif selected_choice == "3":
            try:
                # Check if the selected order ID is valid
                order_id = int(input("Enter the ID of the order to fulfill: "))
                selected_order = next(
                    (order for order in pending_orders if order.id == order_id), None
                )
                if selected_order:
                    # Get the list of status options
                    statuses = Order_Status.query.all()

                    # Display status choices in a table
                    status_table = Table(title="Status Choices")
                    status_table.add_column("ID")
                    status_table.add_column("Name")
                    for status in statuses:
                        status_table.add_row(str(status.id), status.name)
                    console.print(status_table)
                    console.print()

                    # Prompt user to select a status
                    selected_status_id = int(input("Select a status (ID): "))

                    selected_status = next(
                        (status for status in statuses if status.id ==
                         selected_status_id),
                        None
                    )
                    if selected_status:
                        # Update the status of the selected order
                        selected_order.status_id = selected_status_id
                        db.session.commit()
                        console.print(
                            f"[bold green]Order {selected_order.id} has been updated to status {selected_status_id}.[/bold green]"
                        )
                    else:
                        console.print(
                            "[bold red]Invalid status selection.[/bold red]"
                        )
                else:
                    console.print(
                        f"[bold red]Order with ID {order_id} not found.[/bold red]"
                    )
            except ValueError:
                console.print(
                    "[bold red]Invalid order ID. Please enter a valid integer.[/bold red]"
                )
                console.print()

    console.print("[bold]Exiting fulfill orders...[/bold]")
    console.print()


if __name__ == "__main__":
    with app.app_context():
        main()
