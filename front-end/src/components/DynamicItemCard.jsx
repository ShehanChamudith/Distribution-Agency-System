import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import myImg from "../assets/images/img.jpg";
import axios from "axios";

function ItemCard({ item }) {
  return (
    <Card
      sx={{
        width: 200,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={item.name}
        image={myImg}
        sx={{ height: 150 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {item.product_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {item.stock_total} kg
        </Typography>
      </CardContent>
      <CardActions className="flex justify-between">
        <Button size="small" variant="outlined">
          <DeleteIcon />
        </Button>
        <Button size="small" variant="outlined">
          <EditIcon />{" "}
        </Button>
      </CardActions>
    </Card>
  );
}

export default function DynamicItemCard({ category, searchQuery }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch data from the API endpoint
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        let filteredData = response.data;

        // Filter items based on category
        if (category && category !== "All") {
          filteredData = filteredData.filter(
            (item) => item.category === category
          );
        }

        // Filter items based on search query
        if (searchQuery) {
          filteredData = filteredData.filter((item) =>
            item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setData(filteredData); // Set the filtered data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [category, searchQuery]);

  return (
    <div className="flex flex-wrap gap-4 justify-arround">
      {data.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
