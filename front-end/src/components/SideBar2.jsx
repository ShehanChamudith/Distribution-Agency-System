import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import MenuIcon from "@mui/icons-material/Menu";
import { SideBarData } from "./SideBarData";
import { Link } from "react-router-dom";
import Profile from "./Profile";

//border-2 border-gray-50

function SideBar2() {
  const [show, setShow] = useState(false);
  const [interfaceTitle, setInterfaceTitle] = useState("My Dashboard");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLinkClick = (title) => {
    setInterfaceTitle(title);
    handleClose(); // Close the Offcanvas after navigating
  };

  return (
    <>
      <div className="flex h-20 bg-[#172445]  w-full">
        <div className="flex w-[30%]  h-full items-center pl-10">
          <div className="flex items-center justify-between gap-3 ">
            <button onClick={handleShow}>
              <MenuIcon sx={{ fontSize: 32, color: "white" }} />
            </button>

            <Offcanvas
              show={show}
              onHide={handleClose}
              style={{ width: "20%" }}
            >
              <div className="flex w-full h-20 shadow-sm ">
                <Offcanvas.Header
                  closeButton
                  className="flex items-center justify-between w-full px-4"
                >
                  <Offcanvas.Title className=" font-PoppinsB">
                    <div className="">Maleesha Agency (Pvt) Ltd.</div>
                  </Offcanvas.Title>
                </Offcanvas.Header>
              </div>

              <div className="pt-4">
                <Offcanvas.Body>
                  <div className="">
                    <ul className="w-full h-full p-0">
                      {SideBarData.map((val, key) => (
                        <li key={key} className="">
                          <Link
                            to={val.link}
                            className="flex items-center h-12 space-x-2  hover:bg-[#d4e0ff] font-PoppinsM text-black justify-center no-underline hover:rounded-xl"
                            onClick={() => handleLinkClick(val.title)}
                          >
                            <div className="flex-[30%] grid justify-center">
                              {val.icon}
                            </div>
                            <div className="flex-[70%]">{val.title}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Offcanvas.Body>
              </div>
            </Offcanvas>

            <h3 className="mt-2 text-lg text-white font-PoppinsR">
              {interfaceTitle}
            </h3>
          </div>
        </div>

        <div className=" w-[40%] h-fit"></div>

        <div className="flex w-[30%]  h-full  justify-end pr-4">
  
          <div className="flex grid-cols-3 h-20 w-fit items-center ">
            <div className=" h-10 flex ">
              <div className=" flex h-full w-fit justify-center items-center pt-2">
                <h1 className=" font-PoppinsM text-sm text-white justify-end">Shehan Chamudith</h1>
              </div>

              <div className=" h-full">
                <Profile/>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar2;
