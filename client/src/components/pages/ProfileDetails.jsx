import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../context/UserContext'
import { Container, Table, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Address from '../Address.jsx'
import PaymentDetails from '../PaymentDetails.jsx'

function ProfileDetails() {

  const { user } = useContext(UserContext)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/api/user/orders')
    .then(r => r.json())
    .then((orders) => {
      setOrders(orders)
    })
  }, [user])

  if (!user) {
    return <div>Loading...</div>;
  }

  const { name, username, email, id } = user;

  const orderData = orders.map((order) => {
    const date = new Date(order.created);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return (
      <tr key={order.order_id}>
        <td>{order.order_id}</td>
        <td>{formattedDate}</td>
        <td>${order.total_price}</td>
        <td>{order.status}</td>
        <td><Link to={`/order/${order.order_id}`}>View Details</Link></td>
      </tr>
    )
  })

  return (
    <Container>
      <Row>
        <h3>My Account</h3>
        <h5>Hello, {name}</h5>
        <p>Welcome to your profile page. Here you can view your order history as well as update any information we may have on record for you.</p>
      </Row>
      <Row>
        <h4>Payment Details</h4>
        <PaymentDetails />
      </Row>
      <Row>
        <h4>Addresses</h4>
        <Address />
      </Row>
      <Row>
        <h3>Order History</h3>
        <hr />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Order Date</th>
              <th>Total</th>
              <th>Order Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderData}
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}

export default ProfileDetails