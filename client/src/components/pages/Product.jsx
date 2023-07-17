import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Carousel, Button } from "react-bootstrap";
import ReviewContainer from "../ReviewContainer.jsx";
import ReviewForm from "../ReviewForm.jsx";

function Product() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("/api/carts")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching cart items");
        }
      })
      .then((cart) => {
        const productIds = cart.items.map((item) => item.product_id);
        setCartItems(productIds);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((productData) => {
        setProduct(productData);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [id]);

  useEffect(() => {
    fetch(`/api/reviews/product/${id}`)
      .then((r) => r.json())
      .then((reviews) => {
        setReviews(reviews);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      const { image_1, image_2, image_3 } = product;
      const images = [];

      if (image_1) {
        images.push(image_1);
      }
      if (image_2) {
        images.push(image_2);
      }
      if (image_3) {
        images.push(image_3);
      }

      setImages(images);
    }
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleQuantityIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const switchView = (section) => {
    setActiveSection(section);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) {
      return "No Ratings Yet";
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating.toFixed(1);
  };

  const totalReviews = reviews.length;

  const addToCart = () => {
    const data = {
      product_id: product.id,
      quantity: quantity,
    };

    fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Item added to cart");
          setCartItems((prevCartItems) => [...prevCartItems, product.id]);
        } else {
          throw new Error("Error adding item to cart");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNewReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const isInCart = cartItems.includes(product.id);

  return (
    <Container>
      <Row>
        <Col md={6}>
          {images.length > 1 ? (
            <Carousel className="product-carousel" interval={null}>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="carousel-image"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : images.length === 1 ? (
            <img src={images[0]} alt="Product" className="product-image" />
          ) : null}
        </Col>
        <Col md={6}>
          <div className="product-details">
            <h3>{product.name}</h3>
            <h5>${product.price}</h5>
            <p>
              <span className="rating">Rating: {calculateAverageRating()}</span>{" "}
              |
              <span className="total-reviews">
                Total Reviews: {totalReviews}
              </span>
            </p>
            {user ? (
              isInCart ? (
                <Button
                  className="add-to-cart-button custom-btn-primary"
                  disabled
                  style={{
                    backgroundColor: "#599872",
                    borderColor: "#599872",
                    cursor: "not-allowed",
                  }}
                >
                  In Cart
                </Button>
              ) : (
                <div className="quantity-cart-buttons">
                  <Button
                    className="quantity-button custom-btn-primary"
                    onClick={handleQuantityDecrement}
                  >
                    -
                  </Button>
                  <span className="quantity-value">{quantity}</span>
                  <Button
                    className="quantity-button custom-btn-primary"
                    onClick={handleQuantityIncrement}
                  >
                    +
                  </Button>
                  <Button
                    className="add-to-cart-button custom-btn-primary"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <h4
            className={
              activeSection === "details" ? "details-tag active" : "details-tag"
            }
            onClick={() => switchView("details")}
          >
            Details
          </h4>
        </Col>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <h4
            className={
              activeSection === "reviews" ? "reviews-tag active" : "reviews-tag"
            }
            onClick={() => switchView("reviews")}
          >
            Reviews
          </h4>
        </Col>
      </Row>
      <hr />
      {activeSection === "details" ? (
        <Row>
          <Col md={6}>
            <h5 className="details-header">Description:</h5>
            <p>{product.description}</p>
            <h5 className="details-header">Ingredients:</h5>
            <p>{product.ingredients}</p>
          </Col>
          <Col md={6}>
            <h5 className="details-header">Allergens:</h5>
            <p>{product.allergens}</p>
            <h5 className="details-header">Chocolate Type:</h5>
            <p>{product.chocolate_type}</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={12}>
            <div className="review-container-wrapper">
              <ReviewContainer reviews={reviews} />
            </div>
            <hr />
            <div className="review-form-wrapper">
              {user ? (
                <ReviewForm onAdd={handleNewReview} product={product} />
              ) : (
                <h5>
                  Please <Link to="/login">sign in</Link> to leave a review
                </h5>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Product;
