import React from "react";
import SearchBar from "../components/SearchBar";
import Button from '@mui/material/Button';

function ProductCatalog() {
  return(
    <div className="flex items-center w-screen border border-red-600 h-fit">

      <div className=" w-1/2 boder pl-10">
        <Button variant="contained">Select Category</Button>
      </div>

      <div className="flex justify-end w-1/2 border p-5">
        <SearchBar/>
      </div>
      
      
    </div>
  ) 
  
}

export default ProductCatalog;
