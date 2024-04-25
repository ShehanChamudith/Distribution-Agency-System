import React from 'react';
import { LineGraph } from '../components/LineGraph';

export const Admin = () => {
  return (
    <div>
      <div className='text-3xl font-PoppinsB h-[100px] flex items-center p-5 shadow-md'>
        Admin Dashboard
      </div>

      <div className='flex justify-center w-full '>
        <div className=' w-[50rem] flex justify-start'> 
          
            <LineGraph />
          
        </div>
      </div>
    </div>
  );
};

export default Admin;
