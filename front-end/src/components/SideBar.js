import React from 'react'
import {Link} from "react-router-dom";

export const SideBar = () => {
  return (
    <div>
        <Link className='text-2xl text-white ' to="/">Login </Link>
        <Link className='text-2xl text-white ' to="/bill">Bill</Link>
    </div>
  )
}
