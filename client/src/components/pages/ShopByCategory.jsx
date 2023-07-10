import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import ProductCards from "../ProductCards.jsx";

function ShopByCategory() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedChocolateType, setSelectedChocolateType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);

    fetch(`/api/products/category/${id}`)
      .then((r) => r.json())
      .then((products) => {
        setProducts(products);
        setIsFetching(false);
      });
  }, [id]);

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedChocolateType) {
      filtered = filtered.filter(
        (product) => product.chocolate_type === selectedChocolateType
      );
    }

    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange.split("-");
      filtered = filtered.filter(
        (product) =>
          product.price >= Number(minPrice) && product.price <= Number(maxPrice)
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedChocolateType, selectedPriceRange]);

  const handleChocolateTypeChange = (chocolateType) => {
    setSelectedChocolateType(
      selectedChocolateType === chocolateType ? "" : chocolateType
    );
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(selectedPriceRange === priceRange ? "" : priceRange);
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          {isFetching ? (
            <p>Loading...</p>
          ) : (
            <ProductCards
              products={filteredProducts}
              searchQuery={searchQuery}
            />
          )}
        </Col>
        <Col md={4}>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control mr-2"
          />
          <hr />
          <h5 className="filter-heading">Chocolate Type</h5>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={selectedChocolateType === "Milk Chocolate"}
                onChange={() => handleChocolateTypeChange("Milk Chocolate")}
              />
              Milk Chocolate
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={selectedChocolateType === "Dark Chocolate"}
                onChange={() => handleChocolateTypeChange("Dark Chocolate")}
              />
              Dark Chocolate
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={selectedChocolateType === "White Chocolate"}
                onChange={() => handleChocolateTypeChange("White Chocolate")}
              />
              White Chocolate
            </label>
          </div>
          <hr />
          <div>
            <h5 className="filter-heading">Price Range</h5>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  className="filter-checkbox"
                  value="0-5"
                  checked={selectedPriceRange === "0-5"}
                  onChange={() => handlePriceRangeChange("0-5")}
                />
                $0.99 - $5.00
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  className="filter-checkbox"
                  value="5-10"
                  checked={selectedPriceRange === "5-10"}
                  onChange={() => handlePriceRangeChange("5-10")}
                />
                $5.01 - $10.00
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  className="filter-checkbox"
                  value="10-15"
                  checked={selectedPriceRange === "10-15"}
                  onChange={() => handlePriceRangeChange("10-15")}
                />
                $10.01 - $15.00
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  className="filter-checkbox"
                  value="15-20"
                  checked={selectedPriceRange === "15-20"}
                  onChange={() => handlePriceRangeChange("15-20")}
                />
                $15.01 - $20.00
              </label>
              <label>
                <input
                  type="radio"
                  name="priceRange"
                  className="filter-checkbox"
                  value="20-25"
                  checked={selectedPriceRange === "20-25"}
                  onChange={() => handlePriceRangeChange("20-25")}
                />
                $20.01 - $25.00
              </label>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ShopByCategory;
