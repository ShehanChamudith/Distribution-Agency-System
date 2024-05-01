import React, { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const deleteRow = (productId) => {
  axios
    .delete(`http://localhost:3001/inventory/${productId}`)
    .then((response) => {
      console.log("Row deleted successfully");
      // Optionally, you can perform additional actions after deletion
    })
    .catch((error) => {
      console.error("Error deleting row:", error);
    });
};


const popup = (productId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteRow(productId); // Call the callback function after confirmation
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
};




function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch data from the API endpoint
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        setData(response.data); // Set the retrieved data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);



  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Product Name
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Stock Quantity
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Category
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Wholesale Price
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Selling Price
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Date Added
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Batch Number
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {data.map((item) => (
            <tr key={item.productID} className="hover:bg-gray-50">
              <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                {item.product_name}
              </th>
              <td className="px-6 py-4">{item.stock_quantity}kg</td>
              <td className="px-6 py-4">{item.category}</td>
              <td className="px-6 py-4">Rs.{item.wholesale_price}</td>
              <td className="px-6 py-4">Rs.{item.selling_price}</td>
              <td className="px-6 py-4">{item.date_added.split("T")[0]}</td>
              <td className="px-6 py-4">{item.batch_no}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-4">
                  <button onClick={() => popup(item.productID)}>
                    <DeleteIcon sx={{ fontSize: 32, color: "blue" }} />
                  </button>

                  <button onClick={popup}>
                    <EditIcon sx={{ fontSize: 32, color: "blue" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
