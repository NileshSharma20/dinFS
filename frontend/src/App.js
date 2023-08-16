import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar';
import QuickRes from './pages/IndiaMartRes/QuickRes';
import Products from './pages/Products/Products';
import Landing from './pages/Landing/Landing';
import Product from './pages/Products/Product';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Users from './pages/UserManagement/Users';

import './App.css';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
    <Router>

    <div className="container">
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path="/indiamart-templates" element={<QuickRes />} />
        <Route path="/products" element={<Products />} />
        <Route path='/products/:sku' element={<Product /> }/> 
        <Route path='/user-management' element={<Users />} />

        <Route path='*' element={<NotFound /> } />
      </Routes>

      <Footer />
    </div>
    </Router>
    </>
  );
}

export default App;
