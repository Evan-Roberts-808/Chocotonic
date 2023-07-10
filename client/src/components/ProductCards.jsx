import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { Card, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductCards({ products, searchQuery }) {
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const paginationRange = 2;
  const [quantities, setQuantities] = useState([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
      <div className="row justify-content-center">
        {currentProducts.map((product, index) => {
          const url = `/product/${product.id}`;
          const quantity = quantities[index] || 1;

          return (
            <Card className="col-sm-3 product-cards" key={product.id}>
              <Link to={url}>
                <Card.Img variant="top" src={product.image_1} />
              </Link>
              <Card.Body>
                <Link
                  to={url}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <Card.Subtitle>{product.name}</Card.Subtitle>
                </Link>
                <hr />
                <Card.Subtitle>${product.price}</Card.Subtitle>
                {user ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="number"
                      style={{ width: "35px", marginRight: "10px" }}
                      value={quantity}
                      onChange={(event) => handleQuantityChange(index, event)}
                    />
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(product, quantity)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </Card.Body>
            </Card>
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
