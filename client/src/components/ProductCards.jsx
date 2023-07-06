import React from 'react'
import {Card} from "react-bootstrap"
function ProductCards({products}) {

    const productCards = products.map((product) => {
        return (
            <Card className="col-sm-3" key={product.id}>
                <Card.Img variant='top' src={product.image_1} />
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Subtitle>{product.price}</Card.Subtitle>
                </Card.Body>
            </Card>
        )
    })

  return (
    <div className="row">{productCards}</div>
  )
}

export default ProductCards