import React, { useState } from 'react';
import { Card, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProductCards({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products to display per page
  const paginationRange = 2; // Number of trailing numbers to display on each side of the current page

  // Calculate the index range of the products to display for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const productCards = currentProducts.map((product) => {
    const url = `/product/${product.id}`;
    return (
      <Card className="col-sm-3 product-cards" key={product.id}>
        <Link to={url}>
          <Card.Img variant="top" src={product.image_1} />
        </Link>
        <Card.Body>
          <Link to={url} style={{ textDecoration: 'none', color: '#000' }}>
            <Card.Subtitle>{product.name}</Card.Subtitle>
          </Link>
          <hr />
          <Card.Subtitle>${product.price}</Card.Subtitle>
          <button className="add-to-cart">Add to Cart</button>
        </Card.Body>
      </Card>
    );
  });

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0)
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
      if (i === currentPage || (i >= currentPage - paginationRange && i <= currentPage + paginationRange)) {
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
  }

   return (
    <div>
      <div className="row justify-content-center">{productCards}</div>
      <div className="pagination-container d-flex justify-content-center">
      <Pagination className="custom-pagination">{renderPaginationItems()}</Pagination>
      </div>
    </div>
  );
}

export default ProductCards;
