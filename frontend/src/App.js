import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { healthCheck } from './features/auth/authSlice';

import Navbar from './components/Navbar/Navbar';
import QuickRes from './pages/IndiaMartRes/QuickRes';
import Products from './pages/Products/Products';
import Landing from './pages/Landing/Landing';
import Product from './pages/Products/Product';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Users from './pages/UserManagement/Users';

import './App.css';

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const {token} = useSelector((state)=>state.auth)
  // const token = JSON.parse(sessionStorage.getItem('token')).accessToken

  const pollingFunctions=()=>{
    if(token || token!==""){
      // dispatch(getAllUsers())
    }else{
      <Link to="/" />
    }
  }
  
  useEffect(()=>{
    // const pollingInterval = setInterval(pollingFunctions,8*1000)
    // dispatch(healthCheck())

    // if(!token || token==="" ){
    //   clearInterval(pollingInterval)
    // }
  },[])

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

    
    </div>
    </Router>
    </>
  );
}

export default App;
