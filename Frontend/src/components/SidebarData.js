/** @format */

import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as FaIcon from "react-icons/fa";
import * as GrIcon from "react-icons/gr";
import * as BsIcon from "react-icons/bs";
import * as MdIcon from "react-icons/md";
import * as SiIcon from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { BiFoodMenu } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";


const priousurl = process.env.REACT_APP_PRIVIOUSURL;

export const customerSidebar = [
  {
    title: "Orders",
    // path: "/customer/orders",
    icon: <BsIcon.BsListTask />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Created",
        // path: "/customer/orders?ordstat=Created",
        path: "/Customer/Orders/OrdersCreated?ordstat=Created",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Recorded",
        path: "/Customer/Orders/OrdersRecorded?ordstat=Recorded",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Processing",
        path: "/Customer/Orders/OrdersProcessing?ordstat=Processing",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Produced",
        path: "/Customer/Orders/OrdersProduced?ordstat=Produced",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Ready",
        path: "/Customer/Orders/OrdersReady?ordstat=Ready",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Dispatched",
        path: "/Customer/Orders/OrdersDispatched?ordstat=Dispatched",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "All",
        path: "/Customer/Orders/OrdersAll?ordstat=All",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
    ],
  },

  {
    title: "Commercial",
    // path: "/customer/outstandings",
    icon: <MdIcon.MdOutlineSummarize />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Inv. & Payments",
        path: "/Customer/Commercial/CustomerInvoiceAndPayments",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "O/S Summary",
        path: "/Customer/Commercial/Outstandings",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Material",
    path: "Customer/Material",
    icon: <SiIcon.SiMaterialdesignicons />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },

  {
    title: "Customers",
    // path: "/customer",
    icon: <BsIcon.BsFillPeopleFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Customer Info",
        path: "/Customer/Customers/ExistingCustomerInfo",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
      {
        title: "Customer New",
        path: "/Customer/Customers/CustomerNew",
        icon: <AiIcons.AiOutlineArrowRight />,
      },
    ],
  },
  {
    title: "Part List",
    path: "/Customer/PartList",
    icon: <AiIcons.AiOutlinePartition />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Drawing List",
    path: "/Customer/DrawingList",
    icon: <MdIcon.MdDraw />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },

  // {
  //   title: "Packing Invoice",
  //   // path: "/customer",
  //   icon: <MdIcon.MdOutlineSummarize />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: "Inspection",
  //       // path: "/materialmanagement/receipt/customerjobwork",
  //       icon: <AiIcons.AiFillCustomerService />,
  //       subNav: [
  //         {
  //           title: "Profile",
  //           icon: <AiIcons.AiOutlinePartition />,
  //           subNav: [
  //             {
  //               title: "ScheduleList",
  //               path: "/PackingAndInvoices/Profile/ScheduleList",
  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //             {
  //               title: "FindSchedule",
  //               path: "/PackingAndInvoices/Profile/FindSchedule",
  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //           ],
  //         },
  //         {
  //           title: "Fabrication",
  //           icon: <AiIcons.AiOutlineDeploymentUnit />,
  //           subNav: [
  //             {
  //               title: "ScheduleList",
  //               path: "/PackingAndInvoices/fabrication/ScheduleList",

  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //             {
  //               title: "FindSchedule",
  //               path: "/PackingAndInvoices/fabrication/FindSchedule",

  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //           ],
  //         },
  //         {
  //           title: "Services",
  //           icon: <MdIcon.MdOutlineOtherHouses />,

  //           subNav: [
  //             {
  //               title: "ScheduleList",
  //               path: "/PackingAndInvoices/service/ScheduleList",

  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //             {
  //               title: "FindSchedule",
  //               path: "/PackingAndInvoices/service/FindSchedule",

  //               icon: <AiIcons.AiOutlineArrowRight />,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: "Packing Note",
  //       icon: <AiIcons.AiOutlineInfoCircle />,
  //       // icon: <BiIcons.BiPurchaseTag />,
  //     },
  //     {
  //       title: "Invoice",
  //       // path: "/materialmanagement/receipt/branchtransfer",
  //       icon: <AiIcons.AiOutlineBranches />,
  //     },
  //     {
  //       title: "SetUp",
  //       // path: "/materialmanagement/receipt/branchtransfer",
  //       icon: <AiIcons.AiOutlineBranches />,
  //     },
  //     {
  //       title: "ReturnableDC",
  //       // path: "/materialmanagement/receipt/branchtransfer",
  //       icon: <AiIcons.AiOutlineBranches />,
  //     },
  //   ],
  // },
  // {
  // 	title: "Previous Menu",
  // 	path: "/salesHome",
  // 	// path: "/http://localhost:3000/salesHome",
  // 	// onClick: () => {
  // 	// 	// window.location.href = "http://localhost:3000/salesHome";
  // 	// 	window.location.replace("http://172.16.20.61:3000/salesHome/");
  // 	// },
  // 	icon: <MdIcon.MdPreview />,
  // 	iconClosed: <RiIcons.RiArrowDownSFill />,
  // 	iconOpened: <RiIcons.RiArrowUpSFill />,
  // },
  {
    title: "Previous Menu",
    //path: "#", // Set path to '#' or simply omit it
    onClick: () => {
      // console.log("Navigating to port 3000/salesHome");
        window.location.href = priousurl;
      // window.location.href = "http://172.16.20.61:3000/salesHome";
      // window.location.href = "http://192.168.1.25:9000/salesHome";
    },
    icon: <MdIcon.MdPreview />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  // {
  // 	title: "Previous Menu",
  // 	path: "http://172.16.20.61:3000/salesHome",
  // 	icon: <MdIcon.MdPreview />,
  // 	iconClosed: <RiIcons.RiArrowDownSFill />,
  // 	iconOpened: <RiIcons.RiArrowUpSFill />,
  // },
];

export const adminSidebar = [
  {
    title: "Users",
    // path: "/customer",
    icon: <FaIcon.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Roles",
        path: "/admin/Roles",
        icon: <VscTypeHierarchySub />,
      },
      {
        title: "Users",
        path: "/admin/Users",
        icon: <HiUsers />,
      },
    ],
  },
  {
    title: "Access",
    // path: "/customer",
    icon: <FaIcon.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Role Mapping",
        path: "/admin/Mapping",
        icon: <VscTypeHierarchySub />,
      },
    ],
  },
  {
    title: "Previous Menu",
    path: "/home",
    icon: <MdIcon.MdPreview />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
];
