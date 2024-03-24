import './App.css';
import { SideBar } from './components/SideBar';
import { Bill } from './pages/Bill';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className='h-screen bg-[#172445]'>
      
      <Router>
          <div>
            <SideBar/>
          </div>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/bill' element={<Bill/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
