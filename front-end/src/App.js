import './App.css';
import { SideBar } from './components/SideBar';
import AddUser from './pages/AddUser';
import { Bill } from './pages/Bill';
// import FirebaseTest from './pages/FirebaseTest';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className='flex h-screen'>
          <ConditionalSideBar />
        <div className='flex-1 overflow-y-auto'>
          <Routes>
              {/* <Route path='/' element={<FirebaseTest/>}/> */}
              <Route path='/' element={<Login/>}/>
              <Route path='/bill' element={<Bill/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/home' element={<AddUser/>}/>
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
    return <SideBar />;
  }
  return null;
}
