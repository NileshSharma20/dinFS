import { BrowserRouter as Router, HashRouter, Routes, Route } from 'react-router-dom'

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
import DemandSlip from './pages/DemandSlip/DemandSlip';
import DemandslipAnalytics from './pages/Analytics/DemandslipAnalytics';
import Billing from './pages/Billing/Billing';

function App() {
  return (
    <>
    <HashRouter>

    <div className="container">
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path="/indiamart-templates" element={<QuickRes />} />
        
        <Route path="/products" element={<Products />} />
        <Route path='/products/:sku' element={<Product /> }/> 
        
        <Route path='/user-management' element={<Users />} />
        
        <Route path='/demand-slip-generator' element={<DemandSlip />} />
        <Route path='/demand-slip-analytics' element={<DemandslipAnalytics />} />
        
        <Route path='/billing' element={<Billing />} />

        <Route path='*' element={<NotFound /> } />
      </Routes>

      <Footer />
    </div>
    
    </HashRouter>
    </>
  );
}

export default App;
