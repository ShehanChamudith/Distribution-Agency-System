import React from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoadIcon from "@mui/icons-material/Publish";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import BallotIcon from "@mui/icons-material/Ballot";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const SideBarData = [
 
  //  User Roles
  //  1 = admin
  //  2 = office
  //  3 = salesRep
  //  4 = warehouse
  //  5 = supplier
  //  6 = customer

  {
    title: "Inventory",
    icon: <InventoryIcon />,
    link: "/inventory",
    roles: [1,2,3,4,5],
  },

  {
    title: "Loading",
    icon: <LoadIcon />,
    link: "/loading",
    roles: [1,2,3,4],
  },

  {
    title: "Bill",
    icon: <ShoppingCartIcon />,
    link: "/bill",
    roles: [1,3,4],
  },

  {
    title: "Pre Orders",
    icon: <RotateRightIcon />,
    link: "/pre-orders",
    roles: [1,2,3,4,6],
  },

  {
    title: "Reports",
    icon: <AssessmentIcon />,
    link: "/reports",
    roles: [1,2,3,4,5,6],
  },

  {
    title: "Product Catalog",
    icon: <BallotIcon />,
    link: "/product-catalog",
    roles: [1,2,3,4,5,6],
  },

  {
    title: "My Dashboard",
    icon: <DashboardIcon />,
    link: "/admin-dashboard",
    roles: [1,2,3,4,5,6],
  },
];
