import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import * as Yup from "yup";

function ReviewForm({ product, onAdd }) {
  const initialValues = {
    rating: 0,
    review_text: "",
  };

  const validationSchema = Yup.object({
    rating: Yup.number()
      .required("Rating is required")
      .min(0, "Rating must be between 0 and 5")
      .max(5, "Rating must be between 0 and 5"),
    review_text: Yup.string().required("Review is required"),
  });

  const handleSubmit = (values) => {
    fetch(`/api/reviews/product/${product.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then(r => r.json())
      .then((newReviw) => {
        onAdd(newReviw)
      })
      .catch((error) => {
        console.error("Error posting review:", error);
      });
  };

  return (
    <div className="review-form-container">
      <h2 className="review-form-heading">Write a Review</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="rating" className="form-label">
                Rating
              </label>
              <Field
                as="select"
                name="rating"
                id="rating"
                className="form-control"
              >
                <option value={0} className="rating-option">
                  0
                </option>
                <option value={1} className="rating-option">
                  1
                </option>
                <option value={2} className="rating-option">
                  2
                </option>
                <option value={3} className="rating-option">
                  3
                </option>
                <option value={4} className="rating-option">
                  4
                </option>
                <option value={5} className="rating-option">
                  5
                </option>
              </Field>
              <ErrorMessage
                name="rating"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="review_text" className="form-label">
                Review
              </label>
              <Field
                as="textarea"
                name="review_text"
                id="review_text"
                rows={4}
                className="form-control"
              />
              <ErrorMessage
                name="review_text"
                component="div"
                className="error-message"
              />
            </div>
            <Button
              type="submit"
              className="custom-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ReviewForm;
