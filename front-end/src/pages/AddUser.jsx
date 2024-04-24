import React from 'react';

function AddUser() {
    return (
        <div className='w-full h-full'>

                <div className='h-[100px] flex items-center pl-5'>
                    <div className="">
                        <h1 className='font-PoppinsB text-[#172445] text-[30px]'>Add User</h1>
                        <h1 className='font-PoppinsR text-[#172445] text-[15px]'>Fill the form to add a user to the system</h1>
                    </div>
                </div>

                <div className='p-8'>
                        <div className='justify-center w-full p-5 h-fit rounded-3xl bg-[#c0d2e4]'>

                        <div className='flex'>
                            <div className="flex flex-col mb-4 w-[300px] mr-10">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name*
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
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                                    />
                            </div>
                        </div>

                    <div>
                        <div className="flex flex-col mb-4 w-[642px]">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email*
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                                />
                        </div>
                        <div className="flex flex-col mb-4 w-[642px]">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username*
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                            />
                        </div>
                    </div>

                    <div className='flex'>
                        <div className="flex flex-col mb-4 w-[300px] mr-10">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password*
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                                />
                        </div>
                        <div className="flex flex-col mb-4 w-[300px] ">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password*
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md h-[36px]"
                                />
                        </div>    
                    </div>

                    <div className='flex'>
                        <div className="flex flex-col mb-4 w-[300px] mr-10">
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
                                defaultValue=""
                            >
                                <option disabled value="">Select User Type</option>
                                <option>Office</option>
                                <option>Warehouse</option>
                                <option>Sales Rep</option>
                            </select>
                        </div>
                    </div>

                        <div>
                            <div className="flex flex-col mb-4 w-[642px]">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address*
                                    </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Remove the fixed height and add resize-none to prevent resizing
                                    rows={4} // Set the initial number of rows displayed
                                >
                                </textarea>
                            </div>
                        </div>            
                    </div> 
                </div>       
        </div>
    );
}

export default AddUser;


