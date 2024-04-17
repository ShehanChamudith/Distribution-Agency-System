import {React, useState, useEffect} from 'react';
import BasicButton from '../components/BasicButton';
import Popup from '../components/Popup';
import axios from 'axios';



export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [openPopup, setOpenPopup]= useState(false);

    const login = () => {
        const data = {username: username, password: password};
        axios.post("http://localhost:3001/login", data).then((response) => {
            console.log(response.data);
        })
    };
    

    // useEffect(() => {
    //     axios.get('http://localhost:3001/data').then((response) => {
    //         console.log(response.data);
    //     });
    // }, []);

    return (
        
        <div className="flex flex-row">
            <div className='w-1/2 h-screen bg-white basis-1/2'>
                <h1 className=' text-[#172445] text-2xl font-PoppinsB ml-[100px] pt-[100px]'>Maleesha Agency</h1>
                <h1 className=' text-[#172445] text-5xl font-PoppinsB ml-[100px] pt-[100px]'>Login to your account!</h1>

                

                <form className=' mt-[50px]'>
                    <div>
                    <h1 className='text-gray-500 font-PoppinsR ml-[100px]'>Username:</h1>
                    </div>
                        
                    <div>
                        <input 
                            className='h-15 w-[400px] py-2 border-gray-300 border-b-[1px] font-PoppinsL focus:outline-none mt-1 ml-[100px] text-[14px]' 
                            placeholder='Enter Your Username' 
                            required 
                            type='text'
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }} 
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
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </div>   
                </form>

                <div className='ml-[385px] mt-[15px]'>
                        <button className='border-0  font-PoppinsR text-[13px] text-[#172445]' 
                        
                        onClick={() => {
                            setOpenPopup(true);
                        }}
                        >
                        Forgot Password?</button>
                </div>

                <div className=' ml-[100px] mt-[50px]'>
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

                <div>
                    {openPopup && <Popup popupProp={setOpenPopup}/>}
                </div>
            </div>
            
            <div className=' basis-1/2 w-1/2 h-screen bg-[#172445]'>

            </div>
        </div>

        
        
    )

    
}

