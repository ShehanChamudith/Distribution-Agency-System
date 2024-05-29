import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoadIcon from "@mui/icons-material/Publish";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import BallotIcon from "@mui/icons-material/Ballot";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const SideBarData = [
  // {
  //   title: "Home",
  //   icon: <HomeIcon />,
  //   link: "/home",
  // },

  // 1 = admin

  {
    title: "Inventory",
    icon: <InventoryIcon />,
    link: "/inventory",
    roles: [1],
  },

  {
    title: "Loading",
    icon: <LoadIcon />,
    link: "/loading",
    roles: [1],
  },

  {
    title: "Bill",
    icon: <ShoppingCartIcon />,
    link: "/bill",
    roles: [1],
  },

  {
    title: "Pre Orders",
    icon: <RotateRightIcon />,
    link: "/pre-orders",
    roles: [1],
  },

  {
    title: "Reports",
    icon: <AssessmentIcon />,
    link: "/reports",
    roles: [1],
  },

  {
    title: "Product Catalog",
    icon: <BallotIcon />,
    link: "/product-catalog",
    roles: [1],
  },

  {
    title: "My Dashboard",
    icon: <DashboardIcon />,
    link: "/admin-dashboard",
    roles: [1],
  },
];
