import React from 'react';

function Popup({ popupProp }) {

   

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg backdrop-blur-sm'>
        <div className='w-[400px] h-[400px] bg-white rounded-[20px] flex flex-col transition-all duration-5000 ease-in transform'>
        <button className='w-[30px] h-[30px] bg-red-500 hover:bg-red-700 rounded-[8px] mt-4 place-self-end mr-4'
        onClick={() => {
            popupProp(false)
        }}
        >X</button>
        
            <div className=''>
                <h1 className='text-center font-PoppinsB text-[20px]'>Forgot Password?</h1>
            </div>
        </div>
    </div>
  )
}

export default Popup