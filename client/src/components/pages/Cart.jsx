import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Container, Table, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("/api/carts")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching cart");
        }
      })
      .then((cart) => {
        setCart(cart);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  useEffect(() => {
    if (cart) {
      const items = cart.items.map((item) => (
        <tr key={item.item_id}>
          <td>{item.product_name}</td>
          <td>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.product_id, e.target.value)
              }
            />
          </td>
          <td>
            <Button
              className="custom-btn-primary"
              onClick={() => handleRemoveItem(item.item_id)}
            >
              Remove
            </Button>
          </td>
        </tr>
      ));
      setCartItems(items);
    }
  }, [cart]);

  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = Math.max(parseInt(quantity), 1);

    const updatedItems = cart.items.map((item) => {
      if (item.product_id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart({ ...cart, items: updatedItems });
    updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cart.items.filter((item) => item.item_id !== itemId);
    setCart({ ...cart, items: updatedItems });
    deleteCartItem(itemId);
  };

  const updateCartItem = (productId, quantity) => {
    fetch(`/api/carts`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating cart item");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteCartItem = (itemId) => {
    fetch(`/api/carts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item_id: itemId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting cart item");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (cart === null) {
    return <div>...Loading</div>;
  }

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <Container>
      <Row>
        <h3>Cart</h3>
      </Row>
      <Row>
        {cart && cart.items.length === 0 ? (
          <p>Your cart is empty...</p>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{cartItems}</tbody>
            </Table>
            <Row>
              <Button
                as={Link}
                to="/checkout"
                className="custom-btn-primary checkout-button"
              >
                Checkout
              </Button>
            </Row>
          </>
        )}
      </Row>
    </Container>
  );
}

export default Cart;
