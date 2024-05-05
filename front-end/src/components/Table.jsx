import React, { useState, useEffect } from "react";
import axios from "axios";
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
      .get("http://localhost:3001/inventory")
      .then((response) => {
        setData(response.data); // Set the retrieved data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="w-[80vw] max-w-[100vw] overflow-y-hidden rounded-lg border border-gray-200 shadow-md m-5">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50 ">
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
            <tr key={item.productID} className="hover:bg-gray-100">
              <td className="px-6 py-4">{item.product_name}</td>
              <td className="px-6 py-4">{item.stock_total}kg</td>
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

// const editPopup = async () => {
//   // Make an HTTP request to your backend API to fetch the data
//   try {
//     const response = await axios.get('http://localhost:3001/inventory');
//     const dataFromDatabase = response.data;

//     const { value: formValues } = await Swal.fire({
//       title: "Edit Inventory Data",
//       html: `
//         <div style="display: flex; flex-direction: column;">
//           <div style="margin-bottom: 10px;">
//             <label for="swal-input1" style="margin-right: 10px;">Field 1:</label>
//             <input id="swal-input1" class="swal2-input" value="${dataFromDatabase.field1}">
//           </div>

//           <div style="margin-bottom: 10px;">
//             <label for="swal-input2" style="margin-right: 10px;">Field 2:</label>
//             <input id="swal-input2" class="swal2-input" value="${dataFromDatabase.field2}">
//           </div>

//           <div style="margin-bottom: 10px;">
//             <label for="swal-input3" style="margin-right: 10px;">Field 3:</label>
//             <input id="swal-input3" class="swal2-input" value="${dataFromDatabase.field3}">
//           </div>

//           <div style="margin-bottom: 10px;">
//             <label for="swal-input4" style="margin-right: 10px;">Field 4:</label>
//             <input id="swal-input4" class="swal2-input" value="${dataFromDatabase.field4}">
//           </div>

//           <div>
//             <label for="swal-input5" style="margin-right: 10px;">Field 5:</label>
//             <input id="swal-input5" class="swal2-input" value="${dataFromDatabase.field5}">
//           </div>
//         </div>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return [
//           document.getElementById("swal-input1").value,
//           document.getElementById("swal-input2").value,
//           document.getElementById("swal-input3").value,
//           document.getElementById("swal-input4").value,
//           document.getElementById("swal-input5").value,
//         ];
//       }
//     });

//     if (formValues) {
//       Swal.fire(JSON.stringify(formValues));
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     // Handle error (e.g., show error message)
//     Swal.fire('Error', 'Failed to fetch data from the server', 'error');
//   }
// }
