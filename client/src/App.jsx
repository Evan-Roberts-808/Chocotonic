import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './stylesheets/style.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Login.jsx';
import Signup from './components/pages/Signup.jsx';
import About from './components/pages/About.jsx';
import Causes from './components/pages/Causes.jsx';
import Product from './components/pages/Product.jsx';
import Shop from './components/pages/Shop.jsx';
import ShopByCategory from './components/pages/ShopByCategory.jsx';
import Sustainability from './components/pages/Sustainability.jsx';
import Checkout from './components/pages/Checkout.jsx'
import OrderById from './components/pages/OrderById.jsx'
import Cart from './components/pages/Cart.jsx'
import ProfileDetails from './components/pages/ProfileDetails.jsx'
import UserContext from './context/UserContext';

function App() {

  const [user, setUser] = useState(null)
  
  useEffect(() => {
    if (user == null) {
      fetch('/api/check_session')
      .then(response => {
        if (response.ok) {
          response.json().then(user => {setUser(user)})
        }
      })
    }
  },[])

  return (
    <UserContext.Provider value={{user, setUser}}>
    <div className="app-container">
    <Router>
      <Header />
      <div className="content-container">
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ShopByCategory />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/:order_id" element={<OrderById />} />
        <Route path="/profile-details" element={<ProfileDetails />} />
      </Routes>
      </div>
      <Footer />
    </Router>
    </div>
</UserContext.Provider>
  )
}

export default App
