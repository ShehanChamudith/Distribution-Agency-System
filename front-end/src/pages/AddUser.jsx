import React from 'react'

function AddUser() {
    return (
      <div className='w-full h-full'>
        <div className='font-PoppinsB text-[#172445] text-[30px] pl-[140px] h-[100px] flex items-center '>
            <div>
                Add User
            </div>
        </div>  

        <div className=' h[500px] w-full justify-center items-center flex '>


        <div className='px-28 py-20 bg-[#DEE1EB] w-[1000px] rounded-[20px]'>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col w-[300px] mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                        Telephone
                    </label>
                    <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                    />
                </div>
                <div className="flex flex-col mb-4 w-[300px]">
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                        User Type
                    </label>
                    <select
                        id="userType"
                        name="userType"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-[36px]"
                    >
                        <option>Office</option>
                        <option>Warehouse</option>
                        <option>Sales Rep</option>
                    </select>
                </div>
            </form>
            <button
                type="submit"
                className="px-2 py-2 text-white bg-indigo-600 rounded-md mpx-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-[px]"
            >
                Add User
            </button>
        </div> 

        
            
    </div>

    <div className=' h-[1000px]'>
            
            </div>
  
        
    </div>
    );
  }
  
  export default AddUser;
  