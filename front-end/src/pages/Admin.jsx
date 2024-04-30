import React from "react";
import { LineGraph } from "../components/LineGraph";
import DoughnutGraph from "../components/DoughnutGraph";

export const Admin = () => {
  return (
    <div className="flex  w-lvw">
      <div className="flex w-full ">
        <div className="flex w-full -300 gap-4">
          <div className="flex flex-col w-4/6 p-2 border rounded-xl ml-6 mt-5">
            <p className=" font-PoppinsM text-xl pl-2"> Sales </p>
            <div>
              <LineGraph />
            </div>
          </div>

          <div className="flex flex-col w-2/6 p-2 border rounded-xl mr-6 mt-5">
            <p className=" font-PoppinsM text-xl pl-2" > Inventory </p>
            <div>
              <DoughnutGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
