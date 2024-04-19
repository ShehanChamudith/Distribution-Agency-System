import './App.css';
import { SideBar } from './components/SideBar';
import { Admin } from './pages/Admin';
import { Bill } from './pages/Bill';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className='h-screen'>
      
      <Router>
          {/* <div>
            <SideBar/>
          </div> */}
        <Routes>
        <Route path='/' element={<SideBar/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/bill' element={<Bill/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/admin' element={<Admin/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
