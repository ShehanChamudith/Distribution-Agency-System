import React from "react";
import { useNavigate } from "react-router-dom";

export default function BasicButton(props) {
  let navigate = useNavigate();

  const handleButtonClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      navigate(props.sName);
    }
  };

  return (
    <div className=" w-fit h-fit">
      <button
        className={`${props.ButtonColor} ${props.ButtonHover} rounded-xl ${props.ButtonWidth} ${props.ButtonHeight} px-4 font-PoppinsM text-white`}
        onClick={handleButtonClick}
      >
        {props.buttonName}
      </button>
    </div>
  );
}

// Call the button like below
// <BasicButton buttonName="Test Button Click me !!"/>
