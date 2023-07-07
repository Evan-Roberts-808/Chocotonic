import React, { useState, useEffect, useContext} from 'react'
import { useParams } from "react-router-dom";
import UserContext from '../../context/UserContext'
import { Container, Table, Row } from 'react-bootstrap'

function OrderById() {

  const { user } = useContext(UserContext)
  const [order, setOrder] = useState(null)
  const {order_id} = useParams()
  console.log(order)
  useEffect(() => {
    fetch(`/api/user/orders/${order_id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching order details");
        }
      })
      .then((order) => {
        setOrder(order);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [order_id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const orderItems = order.order_items.map((item) => {
    return (
      <tr>
        <td>{item.product_name}</td>
        <td>{item.price}</td>
        <td>{item.quantity}</td>
      </tr>
    )
  })

  return (
    <Container>
    <Row>
      <h3>Order: {order_id}</h3>
    </Row>
    <Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
        {orderItems}
        <tr>
          <td></td>
          <td></td>
          <td>Total: ${order.total_price}</td>
        </tr>
        </tbody>
      </Table>
    </Row>
    </Container>
  )
}

export default OrderById