import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { Container, Table, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
console.log(cart)
  useEffect(() => {
    fetch('/api/carts')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching cart');
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
          <td>{item.quantity}</td>
        </tr>
      ));
      setCartItems(items);
    }
  }, [cart]);

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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{cartItems}</tbody>
        </Table>
      </Row>
      <Row>
        <Button as={Link} to="/checkout" className="custom-btn-primary checkout-button">
          Checkout
        </Button>
      </Row>
    </Container>
  );
}

export default Cart;
