import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { Card, Pagination, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductCards({ products, searchQuery }) {
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const paginationRange = 2;
  const [quantities, setQuantities] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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

  const addToCart = (product, quantity) => {
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

  const handleQuantityChange = (index, event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity)) {
      const updatedQuantities = [...quantities];
      updatedQuantities[index] = newQuantity;
      setQuantities(updatedQuantities);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const isInCart = (productId) => {
    return cartItems.includes(productId);
  };

  const renderAddToCartButton = (product, index) => {

    const quantity = quantities[index] || 1;

    if (isInCart(product.id)) {
      return (
        <Button
          className="add-to-cart"
          disabled
          style={{
            backgroundColor: "#599872",
            borderColor: "#599872",
            cursor: "not-allowed",
          }}
        >
          In Cart
        </Button>
      );
    } else {
      return (
        <>
          <input
            type="number"
            style={{ width: "35px", marginRight: "10px" }}
            value={quantity}
            onChange={(event) => handleQuantityChange(index, event)}
          />
          <Button
            className="add-to-cart"
            onClick={() => addToCart(product, quantity)}
          >
            Add to Cart
          </Button>
        </>
      );
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  const renderPaginationItems = () => {
    const paginationItems = [];

    // Previous arrow
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    paginationItems.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        {1}
      </Pagination.Item>
    );

    let lastPage = 1;
    let ellipsisDisplayed = false;

    for (let i = 2; i <= totalPages; i++) {
      if (
        i === currentPage ||
        (i >= currentPage - paginationRange &&
          i <= currentPage + paginationRange)
      ) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );

        lastPage = i;
        ellipsisDisplayed = false;
      } else if (!ellipsisDisplayed) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis" />);
        ellipsisDisplayed = true;
      }
    }

    // Last page
    if (lastPage < totalPages) {
      paginationItems.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next arrow
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return paginationItems;
  };

  return (
    <div>
      <div className="row">
        {currentProducts.map((product, index) => {
          const url = `/product/${product.id}`;
          const quantity = quantities[index] || 1;

          return (
            <div className="row mb-3" key={product.id}>
              <div className="col">
                <Card>
                  <div className="row g-0">
                    <div className="col-sm-3 d-flex align-items-center">
                    <Link to={url}>
                      <Card.Img src={product.image_1} className="mx-auto" />
                    </Link>
                    </div>
                    <div className="col-sm-8 align-items-center">
                      <div className="card-body">
                      <Link to={url} style={{ textDecoration: "none", color: "#000" }}>
                        <h5 className="card-title">{product.name}</h5>
                      </Link>
                        <p className="card-text">${product.price}</p>
                        {user ? (
                          <div className="d-flex align-items-center">
                            {renderAddToCartButton(product, index)}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination-container d-flex justify-content-center">
        <Pagination className="custom-pagination">
          {renderPaginationItems()}
        </Pagination>
      </div>
    </div>
  );
}

export default ProductCards;
