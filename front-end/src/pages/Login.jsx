import { React, useState } from "react";
import BasicButton from "../components/BasicButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {jwtDecode} from 'jwt-decode';

function Login({ setIsAuthenticated,setUserInfo }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");


  const popup = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const login = () => {
    const data = { username: username, password: password };

    axios
      .post("http://localhost:3001/", data)

      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          // Exit the function if there's an error
        } else {
          
          const accessToken = response.data.accessToken;
          sessionStorage.setItem("accessToken",accessToken );
          setIsAuthenticated(true);
          const values=jwtDecode(accessToken);
          setUserInfo(values.usertypeID);
          //console.log(values);
          if (values.usertype_name === 'Admin') {
            navigate('/admin-dashboard');
          } else if (values.usertype_name === 'Office') {
            navigate('/sales');
          } else if (values.usertype_name === 'SalesRep') {
            navigate('/get-loading');
          } else if (values.usertype_name === 'Warehouse') {
            navigate('/inventory');
          } else if (values.usertype_name === 'Supplier') {
            navigate('/admin-dashboard');
          } else if (values.usertype_name === 'Customer') {
            navigate('/product-catalog');
          }else
            navigate('/unauthorized')
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("Invalid username or password!");
        // Handle error response
      });
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/2 h-screen bg-white basis-1/2">
        <h1 className=" text-[#172445] text-2xl font-PoppinsB ml-[100px] pt-[100px]">
          Maleesha Agency
        </h1>
        <h1 className=" text-[#172445] text-5xl font-PoppinsB ml-[100px] pt-[100px]">
          Login to your account!
        </h1>
        <form className=" mt-[50px]">
          <div>
            <input
              className="h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]"
              placeholder="Username"
              required
              type="text"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </div>

          <div className="pt-3">
            <input
              className="h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]"
              placeholder="Password"
              required
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
        </form>
        <div className="ml-[385px] mt-[15px]">
          <button
            className="border-0  font-PoppinsR text-[13px] text-[#172445]"
            onClick={() => {
              //setOpenPopup(true);
              popup();
            }}
          >
            Forgot Password?
          </button>
        </div>
        <div className="text-red-500 ml-[100px] mb-[20px]">{error}</div>{" "}
        {/* Error message */}
        <div className=" ml-[100px] mt-[50px]">
          <BasicButton
            buttonName="Login"
            ButtonWidth="w-[400px]"
            ButtonColor="bg-sky-500"
            ButtonHeight="h-[50px]"
            ButtonHover="hover:bg-sky-700"
            onClick={login}
          />
        </div>
      </div>

      <div className=" basis-1/2 w-1/2 h-screen bg-[#172445]"></div>
    </div>
  );
}

export default Login;

// {
//   headers: {
//     accessToken: sessionStorage.getItem("accessToken"),
//   }
// }
