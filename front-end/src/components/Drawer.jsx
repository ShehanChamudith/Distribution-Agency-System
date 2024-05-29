import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { SideBarData } from "./SideBarData";
import { Link } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Profile from "./Profile";
import {jwtDecode} from 'jwt-decode';


export default function TemporaryDrawer({ setIsAuthenticated }) {
  const [open, setOpen] = React.useState(false);
  const [interfaceTitle, setInterfaceTitle] = useState("My Dashboard");


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleClose = () => setOpen(false);

  const handleLinkClick = (title) => {
    setInterfaceTitle(title);
    handleClose(); // Close the Offcanvas after navigating
  };

    // Decode the token to get user role
    let userRole = '';
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.usertypeID;
  }
  
    // Filter sidebar items based on user role
    const filteredSidebarData = SideBarData.filter(item => item.roles.includes(userRole));

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <div>
        <div className="w-full h-20 font-PoppinsB border shadow-md flex items-center justify-center">
          Distribution Agency System
        </div>
      </div>
      
      <div className="">
        <ul className="w-full h-full p-0">
          {filteredSidebarData.map((val, key) => (
            <li key={key} className="">
              <Link
                to={val.link}
                className="flex items-center h-12 space-x-2  hover:bg-[#d4e0ff] font-PoppinsM text-black justify-center no-underline hover:rounded-xl"
                onClick={() => handleLinkClick(val.title)}
              >
                <div className="flex-[30%] grid justify-center">{val.icon}</div>
                <div className="flex-[70%]">{val.title}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );

  return (
    
    <div className=" flex h-20 bg-[#172445]  w-full">
      <div className="flex w-[30%]  h-full items-center pl-10">
        <div className="flex items-center justify-between gap-3">
          <button onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ fontSize: 32, color: "white" }} />
          </button>

          <MuiDrawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </MuiDrawer>

          <h3 className="text-lg text-white font-PoppinsR">
              {interfaceTitle}
          </h3>
        </div>
      </div>

      <div className=" w-[40%] h-fit"></div>

      <div className="flex w-[30%]  h-full  justify-end ">
        <div className="flex grid-cols-3 h-20 w-fit items-center ">
          <div className=" h-10 flex pr-10">
            <div className=" flex h-full w-fit justify-center items-center pt-2">
              <h1 className=" font-PoppinsM text-sm text-white justify-end">
                Shehan Chamudith
              </h1>
            </div>

            <div className=" h-full ">
              <Profile setIsAuthenticated={setIsAuthenticated} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
