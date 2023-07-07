import React, { useState, useEffect } from 'react'
import { Row, Col, Container} from "react-bootstrap";
import ProductCards from '../ProductCards.jsx'

function Shop() {

  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products')
    .then((r) => r.json())
    .then((products) => {
      setProducts(products)
    })
  }, [])

  return (
    <Container>
      <Row>
        <Col md={8}>
          <ProductCards products={products} />
        </Col>
        <Col md={4}>
        <input
              type="text"
              placeholder="Search..."
              onChange={(e) => handleChange(e)}
              className="form-control mr-2"
            />
          <hr />
          <h5>Categories</h5>
          <hr />
          <h5>Chocolate Type</h5>
          <hr />
          <h5>Price Range</h5>
        </Col>
      </Row>
    </Container>
  )
}

export default Shop