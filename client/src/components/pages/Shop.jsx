import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Image, Card } from "react-bootstrap";
import ProductCards from '../ProductCards.jsx'

function Shop() {

  const [products, setProducts] = useState([])
  console.log(products)
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

        </Col>
      </Row>
    </Container>
  )
}

export default Shop