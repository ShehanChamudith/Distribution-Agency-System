import './App.css';
import { SideBar } from './components/SideBar';
import SideBar2 from './components/SideBar2';
import AddUser from './pages/AddUser';
import Admin from './pages/Admin';
import { Bill } from './pages/Bill';
// import FirebaseTest from './pages/FirebaseTest';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProductCatalog from './pages/ProductCatalog';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className=''>
          <ConditionalSideBar />
        <div className='flex-1 overflow-y-auto'>
          <Routes>
              {/* <Route path='/' element={<FirebaseTest/>}/> */}
              <Route path='/' element={<Login/>}/>
              <Route path='/bill' element={<Bill/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/home' element={<ProductCatalog/>}/>
              <Route path='/my-dashboard' element={<Admin/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

function ConditionalSideBar() {
  const location = useLocation();
  // Render Sidebar only if the current location is not the root path ("/") 
  if (location.pathname !== '/') {
    return <SideBar2 />;
  }
  return null;
}
