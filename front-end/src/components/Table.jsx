import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const deleteRow = (inventoryID) => {
  axios
    .delete(`http://localhost:3001/deletestock/${inventoryID}`)
    .then((response) => {

      console.log(inventoryID,"Row deleted successfully");
      // Optionally, you can perform additional actions after deletion
    })
    .catch((error) => {
      console.error("Error deleting row:", error);
    });
};

const popup = (inventoryID) => {
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
      deleteRow(inventoryID); // Call the callback function after confirmation
      Swal.fire({
        title: "Deleted!",
        text: "Row has been deleted.",
        icon: "success",
      }).then(() => {
        window.location.reload(); // Reload the page after successful deletion
      });
    }
  });
};

function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch data from the API endpoint
    axios
      .get("http://localhost:3001/getstock")
      .then((response) => {
        setData(response.data); // Set the retrieved data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="w-[60vw] max-w-[100vw] overflow-y-hidden rounded-lg border border-gray-200 shadow-md ">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50 ">
          <tr>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Product Name
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Stock Arrival
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Supplier
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Received Date
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Expire Date
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900">
              Batch Number
            </th>
            <th scope="col" class="px-6 py-4 font-medium text-gray-900"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {data.map((item) => (
            <tr key={item.inventoryID} className="hover:bg-gray-100">
              <td className="px-6 py-4">{item.product_name}</td>
              <td className="px-6 py-4">{item.stock_arrival}kg</td>
              <td className="px-6 py-4">{item.supplier_company}</td>
              <td className="px-6 py-4">{item.purchase_date.split("T")[0]}</td>
              <td className="px-6 py-4">{item.expire_date.split("T")[0]}</td>
              <td className="px-6 py-4">{item.batch_no}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-4">
                  <button onClick={() => popup(item.inventoryID)}>
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
