import React from 'react'
import {useNavigate} from "react-router-dom";

export default function BasicButton(props) {
  let navigate = useNavigate();

  return (
    <div className=' w-fit h-fit'>
        
        <button 
          className='bg-sky-500 hover:bg-sky-700 rounded-xl w-auto h-[50px] px-4 font-PoppinsM text-white' 
          onClick={() => {
            navigate(props.sName)
          }}
        >
          {props.buttonName}</button>

    </div>
  )
}

// Call the button like below
// <BasicButton buttonName="Test Button Click me !!"/>