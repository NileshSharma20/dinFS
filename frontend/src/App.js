import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import QuickRes from './pages/IndiaMartRes/QuickRes';
import Products from './pages/Products/Products';
import Landing from './pages/Landing/Landing';
import Product from './pages/Products/Product';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <>
    <Router>

    <div className="container">
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/indiamart-templates" element={<QuickRes />} />
        <Route path="/products" element={<Products />} />
        <Route path='/products/:sku' element={<Product /> }/> 
        <Route path='*' element={<NotFound /> } />
      </Routes>

    
    </div>
    </Router>
    </>
  );
}

export default App;
