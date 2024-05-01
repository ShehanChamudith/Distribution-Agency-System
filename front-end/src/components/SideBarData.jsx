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
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/home",
  },

  {
    title: "Inventory",
    icon: <InventoryIcon />,
    link: "/inventory",
  },

  {
    title: "Loading",
    icon: <LoadIcon />,
    link: "/loading",
  },

  {
    title: "Bill",
    icon: <ShoppingCartIcon />,
    link: "/bill",
  },

  {
    title: "Pre Orders",
    icon: <RotateRightIcon />,
    link: "/pre-orders",
  },

  {
    title: "Reports",
    icon: <AssessmentIcon />,
    link: "/reports",
  },

  {
    title: "Product Catalog",
    icon: <BallotIcon />,
    link: "/product-catalog",
  },

  {
    title: "My Dashboard",
    icon: <DashboardIcon />,
    link: "/my-dashboard",
  },
];
