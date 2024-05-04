import React from "react";
import SearchBar from "../components/SearchBar";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function ProductCatalog() {
  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="flex items-center w-screen h-fit ">
      <div className="flex w-1/2  pl-10 gap-10">
        <div>
        <Button variant="contained" className="h-12" disabled style={{ pointerEvents: 'none', backgroundColor: '#1976d2', color: 'white' }}>
  Select Category
</Button>

        </div>

        <div>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="Chicken">Chicken</ToggleButton>
            <ToggleButton value="Chicken-Parts">Chicken Parts</ToggleButton>
            <ToggleButton value="Pork">Pork</ToggleButton>
            <ToggleButton value="Sausages">Sausages</ToggleButton>
          </ToggleButtonGroup>
          
        </div>
      </div>

      <div className="flex w-1/2 pr-10 py-5  justify-between pl-64">
        
        <div className="flex justify-end "> 
          <SearchBar />
        </div>

        <div className="">
        <Button variant="contained" className=" h-12 gap-2">
            Add Item <AddCircleOutlineIcon/>
          </Button>
        </div>
        
      </div>
    </div>
  );
}

export default ProductCatalog;
