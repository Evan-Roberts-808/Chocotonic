import React, { useState } from "react";
import { Card, Pagination } from "react-bootstrap";

function ReviewContainer({ reviews }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 9;

  // Calculate the index of the first and last review on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const reviewsList = currentReviews.map((review) => {
    console.log(review);
    const date = new Date(review.created_at);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <Card className="col-sm-3 offset-1" key={review.review_id}>
        <Card.Body>
          <Card.Title>{review.users_name}</Card.Title>
          <Card.Text>Review Left On: {formattedDate}</Card.Text>
          <Card.Subtitle>Rating: {review.rating}</Card.Subtitle>
          <Card.Text>{review.review_text}</Card.Text>
        </Card.Body>
      </Card>
    );
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div>
      <div className="row">{reviewsList}</div>
      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}

export default ReviewContainer;
