import React, { useState } from "react";
import { Container } from "react-bootstrap";
import EnterPayment from "../EnterPayment";
import EnterAddress from "../EnterAddress";
import ConfirmOrder from "../ConfirmOrder";

function Checkout() {
  const [currentStep, setCurrentStep] = useState("payment");
  console.log(currentStep)
  const handlePaymentNext = () => {
    setCurrentStep("address");
  };

  const handleAddressNext = () => {
    setCurrentStep("confirm");
  };

  return (
    <Container>
      {currentStep === "payment" && (
        <EnterPayment onNext={handlePaymentNext} />
      )}
      {currentStep === "address" && (
        <EnterAddress onNext={handleAddressNext} />
      )}
      {currentStep === "confirm" && <ConfirmOrder />}
    </Container>
  );
}

export default Checkout;
