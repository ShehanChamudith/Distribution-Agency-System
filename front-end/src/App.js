import React, { useState, useEffect } from "react";
import "./App.css";
import Admin from "./pages/Admin";
import Bill from "./pages/Bill";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";
import Inventory from "./pages/Inventory";
import TemporaryDrawer from "./components/Drawer";
import ProtectedRoute from "./utils/ProtectedRoute";
import PreOrders from "./pages/PreOrders";
import { jwtDecode } from 'jwt-decode';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // useEffect(() => {
  //  const data = window.localStorage.getItem('authState');
  //  if (data !== null) setIsAuthenticated(JSON.parse(data))
  // }, []);

  // useEffect(() => {
  //   window.localStorage.setItem('authState', JSON.stringify(isAuthenticated))
  // }, [isAuthenticated]);
  
  useEffect(() => {
    // Decode token when component mounts
    decodeTokenFromLocalStorage();
  }, []);

  const decodeTokenFromLocalStorage = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken);
        setIsAuthenticated(true); // Set authentication state to true
        console.log(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false); // Set authentication state to false on error
      }
    } else {
      setIsAuthenticated(false); // No token found
    }
  };

  function ConditionalSideBar() {
    const location = useLocation();
    // Render Sidebar only if the current location is not the root path ("/")
    if (location.pathname !== "/") {
      return <TemporaryDrawer setIsAuthenticated={setIsAuthenticated} />;
    }
    return null;
  }

  return (
    
    <Router>
      <div className=" ">
        <ConditionalSideBar />
        <div className="">
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/bill" element={<Bill />} />
              <Route path="/product-catalog" element={<ProductCatalog />} />
              <Route path="/admin-dashboard" element={<Admin />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pre-orders" element={<PreOrders />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


