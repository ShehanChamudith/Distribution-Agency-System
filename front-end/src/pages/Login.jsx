import { React, useState } from "react";
import BasicButton from "../components/BasicButton";
import Popup from "../components/Popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
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
        console.log(response.data);
        if (response.data.usertype === "admin") {
          // Navigate to admin page if usertype is admin
          navigate("/my-dashboard");
        } else if (response.data.usertype === "office") {
          // Navigate to user page if usertype is user
          navigate("/my-dashboard");
        } else {
          // Handle other user types or cases where usertype is not defined
          console.log("Invalid user type");
          setError("Invalid username or password!");
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
              placeholder="Enter Your Username"
              required
              type="text"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </div>

          

          <div>
            <input
              className="h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]"
              placeholder="Enter Your Password"
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
            popupProp={setOpenPopup}
          />
        </div>
        <div>{openPopup && <Popup popupProp={setOpenPopup} />}</div>
      </div>

      <div className=" basis-1/2 w-1/2 h-screen bg-[#172445]"></div>
    </div>
  );
}
