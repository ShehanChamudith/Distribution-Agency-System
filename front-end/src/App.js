import "./App.css";
import Admin from "./pages/Admin";
import { Bill } from "./pages/Bill";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";
import Inventory from "./pages/Inventory";
import TemporaryDrawer from "./components/TemporaryDrawer";
import React, { useState } from "react";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
              <Route path="/my-dashboard" element={<Admin />} />
              <Route path="/inventory" element={<Inventory />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


