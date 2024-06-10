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
import { jwtDecode } from 'jwt-decode';
import Unauthorized from "./pages/Unauthorized";
import CreateLoading from "./pages/CreateLoading";
import GetLoadings from "./pages/GetLoadings";
import DeliveryBill from "./pages/DeliveryBill";
import EditLoading from "./pages/EditLoading";
import CreatePreOrder from "./pages/CreatePreOrder";
import GetPreOrderReceived from "./pages/GetPreOrderReceived";
import GetPreOrderSent from "./pages/GetPreOrderSent";
import CreateLoadingPreOrders from "./pages/CreateLoadingPreOrders";
import SaleHistory from "./pages/SaleHistory";
import StockReq from "./pages/StockReq";
import SentStockRequests from "./pages/SentStockRequests";
import BillPreOrders from "./pages/BillPreOrders";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Decode token when component mounts
    decodeTokenFromLocalStorage();
  }, [isAuthenticated]);

  const decodeTokenFromLocalStorage = () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      try { 
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken.usertypeID);
        setUserID(decodedToken.userID);
        setIsAuthenticated(true); // Set authentication state to true
        //console.log(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false); // Set authentication state to false on error
      }
    } else {
      setIsAuthenticated(false); // No token found
    }
    setIsLoading(false);
  };

  function ConditionalSideBar() {
    const location = useLocation();
    // Render Sidebar only if the current location is not the root path ("/")
    if (location.pathname !== "/") {
      return <TemporaryDrawer setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo} />;
    }
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator until authentication status is determined
  }

  console.log("userID App.js:",userID);
  console.log("userType App.js:",userInfo);


  return (
    
    <Router>
      <div className=" ">
        <ConditionalSideBar />
        <div className="">
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo} />} />

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,2,3,4,5,6]} />}>
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[]} />}>
              
              <Route path="/product-catalog" element={<ProductCatalog />} />
              <Route path="/inventory" element={<Inventory userID= {userID} userInfo={userInfo} />} />
            </Route>

            {/* Billing */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,4]} />}>
              <Route path="/bill" element={<Bill userID= {userID} />} />
            </Route>

            {/* Sales History */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,2,3,4]} />}>
              <Route path="/sales" element={<SaleHistory userID= {userID} />} />
            </Route>

            {/* Warehouse */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,4]} />}>
              <Route path="/create-loading" element={<CreateLoading userID={userID} />} />
              <Route path="/create-loading-pre-orders" element={<CreateLoadingPreOrders userID={userID} />} />
              <Route path="/edit-loading" element={<EditLoading userID={userID} />} />
            </Route>

            {/* Admin Dashboard */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1]} />}>
              <Route path="/admin-dashboard" element={<Admin />} />
            </Route>

            {/* Stock Request */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1]} />}>
              <Route path="/stock-request" element={<StockReq userID={userID} />} />
              <Route path="/get-stock-request" element={<SentStockRequests userID={userID} />} />
            </Route>

            {/* Pre Orders */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[3,6]} />}>
              <Route path="/create-preorder" element={<CreatePreOrder userID={userID} userInfo={userInfo}/>} />
            </Route>

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,3,4]} />}>
              <Route path="/get-received-preorder" element={<GetPreOrderReceived userID={userID}/>} />
            </Route>

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[6]} />}>
              <Route path="/get-sent-preorder" element={<GetPreOrderSent userID={userID}/>} />
            </Route>

            {/* Loadings Delivary Bill */}

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,2,3,4]} />}>
              <Route path="/get-loading" element={<GetLoadings userID={userID}/>} />
            </Route>

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userInfo} roles={[1,3]} />}>
              <Route path="/delivary-bill" element={<DeliveryBill userID={userID}/>} />
              <Route path="/pre-delivery-bill" element={<BillPreOrders userID={userID}/>} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


