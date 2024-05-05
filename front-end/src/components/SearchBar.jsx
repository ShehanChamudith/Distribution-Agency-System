import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";

export default function SearchBar() {

  const [data, setData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch data from the API endpoint
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        // Filter out duplicate product titles
        const uniqueProducts = response.data.reduce((acc, current) => {
          if (!acc.some(item => item.product_name === current.product_name)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setData(uniqueProducts); // Set the filtered data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={data.map((item) => item.product_name)}
        // onChange={(event, value) => handleTitleSelect(value)} // Execute function on select
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Items"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              sx: { height: 48 },
              
            }}
          />
        )}
      />
    </Stack>
  );
}
