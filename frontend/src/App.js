import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import QuickRes from './components/IndiaMartRes/QuickRes';
import Products from './components/Products/Products';
import Landing from './pages/Landing/Landing';

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
      </Routes>

    
    </div>
    </Router>
    </>
  );
}

export default App;
