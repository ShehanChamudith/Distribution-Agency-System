import './App.css';
import SideBar2 from './components/SideBar2';
import Admin from './pages/Admin';
import { Bill } from './pages/Bill';
// import FirebaseTest from './pages/FirebaseTest';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProductCatalog from './pages/ProductCatalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inventory from './pages/Inventory';
import TemporaryDrawer from './components/TemporaryDrawer';


function App() {
  return (
    <Router>
      <div className='flex flex-col w-full '>
          <ConditionalSideBar />
          <Routes>
              {/* <Route path='/' element={<FirebaseTest/>}/> */}
              <Route path='/' element={<Login/>}/>
              <Route path='/bill' element={<Bill/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/home' element={<ProductCatalog/>}/>
              <Route path='/my-dashboard' element={<Admin/>}/>
              <Route path='/inventory' element={<Inventory/>}/>
          </Routes>
        </div>
    </Router>
  );
}

export default App;

function ConditionalSideBar() {
  const location = useLocation();
  // Render Sidebar only if the current location is not the root path ("/") 
  if (location.pathname !== '/') {
    return <TemporaryDrawer />;
  }
  return null;
}
