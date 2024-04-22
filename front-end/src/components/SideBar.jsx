import React from 'react';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import Time from './Time';

export const SideBar = () => {
  return (
    <div className='w-[20%] h-full bg-[#172445] flex flex-col'>

      <div className='w-full bg-[#0e172d] h-[100px] text-white  flex items-center justify-center '>
        <div>
          <h2 className='font-PoppinsR text-[13px]'>Good Morning!</h2>
          <h1 className='font-PoppinsB text-[23px]'>Maleesha Agency</h1>
        </div>
      </div>
      
      <div>
        <ul className='w-full h-full p-0'>
          {SideBarData.map((val, key) => (
            <li key={key} className=''>
            <Link to={val.link} className="flex items-center h-12 space-x-2 bg-[#172445] hover:bg-[#293350] font-PoppinsM text-white justify-center">
              <div className=' flex-[30%] grid justify-center'>{val.icon}</div>
              <div className=' flex-[70%] '>{val.title}</div>
            </Link>
          </li>
          ))}
        </ul>
      </div>

      <div className='flex justify-center w-full mt-auto h-fit'>
          <Time/>
      </div>
      
      
    </div>
  );
};
