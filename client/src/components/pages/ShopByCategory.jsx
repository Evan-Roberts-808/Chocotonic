import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Row, Col, Container} from "react-bootstrap";
import ProductCards from '../ProductCards.jsx'

function ShopByCategory() {

  const { id } = useParams()
  const [products, setProducts] = useState([])
  console.log(products)
  useEffect(() => {
    fetch(`/api/products/category/${id}`)
    .then((r) => r.json())
    .then((products) => {
      setProducts(products)
    })
  }, [id])

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

export default ShopByCategory