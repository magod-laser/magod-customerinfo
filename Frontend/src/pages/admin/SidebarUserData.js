import React from "react";
import { FaLock, FaUserAlt, FaUserCheck } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";

const SidebarUserData = [
  {
    id: 1,
    path: "/users",
    name: "Users",
    icon: <FaUserAlt />,
    subRoutes: [
      {
        name: "Roles",
        path: "/admin/userrolesmodules",
        icon: <FaUserCheck />,
      },
      // {
      //   name: "Menus",
      //   path: "/admin/menus",
      //   icon: <MdMenuOpen />,
      // },
      {
        name: "Users",
        path: "/admin/createusers",
        icon: <FaUserAlt />,
      },
    ],
  },
  {
    id: 2,
    path: "/admin",
    name: "menurolemapping",
    icon: <FaLock />,
  },
];
export default SidebarUserData;
