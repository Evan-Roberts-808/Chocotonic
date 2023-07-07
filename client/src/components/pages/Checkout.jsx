import React, { useEffect, useState, useContext} from 'react'
import {Container} from 'react-bootstrap'
import UserContext from "../../context/UserContext";
import EnterPayment from "../EnterPayment"
import EnterAddress from '../EnterAddress';
import ConfirmOrder from '../ConfirmOrder'


function Checkout() {

  const { user, setUser } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState('payment');

  return (
    <Container>
      {currentStep === 'payment' && <EnterPayment onNext={() => setCurrentStep('address')} />}
      {currentStep === 'address' && <EnterAddress onNext={() => setCurrentStep('confirm')}/>}
      {currentStep === 'confirm' && <ConfirmOrder />}
    </Container>
  )
}

export default Checkout