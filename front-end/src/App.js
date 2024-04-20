import './App.css';
import { SideBar } from './components/SideBar';
import { Admin } from './pages/Admin';
import { Bill } from './pages/Bill';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className='flex h-screen'>
        <SideBar />
        <div className='flex-1'>
          <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route path='/bill' element={<Bill/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/admin' element={<Admin/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


{/* <Route path='/' element={<SideBar/>}/> */}
