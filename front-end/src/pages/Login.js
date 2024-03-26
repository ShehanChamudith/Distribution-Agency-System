import React from 'react'
import BasicButton from '../components/BasicButton';
import {useState} from 'react'

export default function Login() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleButtonClick = (e) => {
        e.preventDefault();
        setIsPopupOpen(true);
      };
      
  
    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };
    

    return (
        
        <div class="flex flex-row">
            <div class="basis-1/2" className='w-1/2 h-screen bg-white'>
                <h1 className=' text-[#172445] text-2xl font-PoppinsB ml-[100px] pt-[100px]'>Maleesha Agency</h1>
                <h1 className=' text-[#172445] text-5xl font-PoppinsB ml-[100px] pt-[100px]'>Login to your account!</h1>

                

                <form className=' mt-[50px]'>
                    <div>
                    <h1 className='text-gray-500 font-PoppinsR ml-[100px]'>Username:</h1>
                    </div>
                        
                    <div>
                        <input className='h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]' 
                            placeholder='Enter Your Username' 
                            required 
                            type='text'
                        />
                    </div>
                    

                    <div className=' mt-[30px]'>
                    <h1 className='text-gray-500 font-PoppinsR ml-[100px]'>Password:</h1>
                    </div>
                        
                    <div>
                        <input className='h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]' 
                            placeholder='Enter Your Password' 
                            required 
                            type='password'
                        />
                    </div>
                    <div className='ml-[385px] mt-[15px]'>
                        <a href='' onClick={handleButtonClick}>
                            <h4 className=' font-PoppinsR text-[13px] text-[#172445]'>Forgot Password?</h4>
                        </a>
                        
                    </div>
                    
                </form>

                <div className=' ml-[100px] mt-[50px]'>
                    <BasicButton buttonName="Login" sName="/bill" ButtonWidth="w-[400px]"/> 
                </div>

                <div>
                        {isPopupOpen && (
                            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                            <div className="p-8 transition-all duration-300 transform bg-white rounded-lg">
                                <h2>Popup Content</h2>
                                <button onClick={handleClosePopup}>Close Popup</button>
                            </div>
                            </div>
                        )}
                </div>
            </div>


            <div class="basis-1/2" className='w-1/2 h-screen bg-[#172445]'>

            </div>
        </div>

        
        
    )

    
}




// className='bg-[#172445] h-screen w-screen'