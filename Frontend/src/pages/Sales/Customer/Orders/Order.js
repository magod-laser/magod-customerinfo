import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Row,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

const { postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function Order(props) {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const isFirstClickRef = useRef(true);
  let [custdata, setCustdata] = useState([]);
  let [ordstatdata, setOrdStatdata] = useState([]);
  let [orderdata, setOrderdata] = useState([]);
  let [orderscheduledata, setOrderScheduledata] = useState([]);
  let [invoicelistdata, setInvoiceListdata] = useState([]);
  const [isStatusEnabled, setIsStatusEnabled] = useState(false);

  let [orderno, setOrderNo] = useState("");
  let [custcode, setCustCode] = useState("");
  let [ordstatus, setOrdStatus] = useState("");
  let [ordschid, setOrdSchId] = useState("");

  let [selectedOrderId, setSelectedOrderId] = useState(false);
  let [selectedOrder, setSelectedOrder] = useState(null);
  let [selectedOrdSchId, setSelectedOrdSchId] = useState(false);
  //  let [selectedOrdSchTaskId, setSelectedOrdSchTaskId] = useState(false);
  let [selectedOrdSch, setSelectedOrdSch] = useState(null);
  let [selectedSchTaskId, setSelectedSchTaskId] = useState(false);
  let [selectedSchTask, setSelectedSchTask] = useState(null);
  let [ordschtaskdata, setOrdSchTaskdata] = useState([]);
  //  let [selectedOrdSchtask, setSelectedOrdSchTask] = useState(null);
  let [orddetailsdata, setOrdDetailsdata] = useState([]);
  let [invdwgdata, setInvDwgdata] = useState([]);
  let [selectedInvListId, setSelectedInvListId] = useState(false);
  let [selectedinvlist, setSelectedInvList] = useState(null);
  let [dcinvno, setDCINVNo] = useState("");
  let [schdetsdata, setSchDetsdata] = useState([]);
  let [taskpartdetsdata, setTaskPartDetsdata] = useState([]);
  let [nctaskid, setNcTaskID] = useState([]);

  useEffect(() => {
    async function fetchdata() {
      postRequest(endpoints.getCustCodeName, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        setCustdata(data);

      });

      postRequest(endpoints.ordStatusCustomer, {}, (osdata) => {
        console.log("osdata", osdata);
        setOrdStatdata(osdata);
      });

      if (custcode !== "" && searchParams.get("ordstat") !== null) {
        postRequest(
          endpoints.ordersCustomer,
          { custcode: custcode, orderstatus: searchParams.get("ordstat") },
          (odata) => {
            //console.log("Orders Customer" + JSON.stringify(odata));
            setOrderdata(odata);
            setOrdStatus(searchParams.get("ordstat"));
            if (odata.length === 0) {
              setOrderScheduledata([]);
              setInvoiceListdata([]);
              setOrdDetailsdata([]);
              setOrdSchTaskdata([]);
              setSchDetsdata([]);
              setInvDwgdata([]);
              setTaskPartDetsdata([]);
            }
          }
        );
      }
    }
    fetchdata();
  }, [orderdata, custcode]);   //[searchParams.get("ordstat"), custcode]);

  useEffect(() => {
    if (custcode) {
      setIsStatusEnabled(true);
    }
    else {
      setIsStatusEnabled(false);
    }
  }, [custcode])

  const handleCustChange = (selected) => {
    if (selected.length > 0) {
      const selectedCust = selected[0];
      setCustCode(selectedCust.Cust_Code);
      selectCust(selectedCust); // If selectCust needs to be called with the whole object 
    } else {
      setCustCode('');
    }
  };


  const selectCust = (selectedCust) => {
    let cust;
    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i]["Cust_Code"] === selectedCust.Cust_Code) {
        cust = custdata[i];
        break;
      }
    }

    let ostat = searchParams.get("ordstat");
    setOrdStatus(searchParams.get("ordstat"));
    // console.log(ostat);

    // if (selectedCust.Cust_Code !== "" && searchParams.get("ordstat") !== null) {
    //   postRequest(
    //     endpoints.ordersCustomer,
    //     { custcode: selectedCust.Cust_Code, orderstatus: searchParams.get("ordstat") },
    //     (odata) => {
    //       console.log("Orders Customer" + JSON.stringify(odata));
    //       setOrderdata(odata);
    //     }
    //   );
    // } else {
    //   if (isFirstClickRef.current) {
    //     toast.error("Please select a customer");
    //     isFirstClickRef.current = false;
    //   }

    //  return;
    //}
  };

  let selectOStatus = async (e) => {
    // Log the event object to see its properties 
    console.log(e);
    console.log(e.target); // Check if e.target is defined before accessing its value 
    if (e.target) {
      const selectedStatus = e.target.value;
      setOrdStatus(selectedStatus);
      await postRequest(
        endpoints.ordersCustomer,
        {
          custcode: custcode,
          orderstatus: selectedStatus,
        },
        async (resp) => {
          console.log(resp);
          setOrderdata([]);
          setOrderScheduledata([]);
          setInvoiceListdata([]);
          setOrdDetailsdata([]);
          setOrdSchTaskdata([]);
          setSchDetsdata([]);
          setInvDwgdata([]);
          setTaskPartDetsdata([]);
          setOrderdata(resp);
        }
      );
    } else {
      console.warn('e.target or e.target.value is undefined');
    }
  };

  let dateconv = (da) => {
    let cdate = new Date(da);
    console.log(cdate);
    return (
      cdate.getDay().toString().padStart(2, "0") +
      "/" +
      cdate.getMonth().toString().padStart(2, "0") +
      "/" +
      cdate.getFullYear()
    );
  };

  let ordselector = (id, orders) => {
    setSelectedOrderId(id);
    setSelectedOrder(orders);
    setOrderNo(orders["Order_No"]);

    setOrderScheduledata([]);
    setInvoiceListdata([]);
    setOrdDetailsdata([]);
    setOrdSchTaskdata([]);
    setSchDetsdata([]);
    setInvDwgdata([]);
    setTaskPartDetsdata([]);

    postRequest(
      endpoints.orderScheduleCustomer,
      { orderno: orders["Order_No"] },
      (osdata) => {
        setOrderScheduledata(osdata);
      }
    );
    postRequest(
      endpoints.orderInvoicesCustomer,
      { orderno: orders["Order_No"] },
      (invdata) => {
        setInvoiceListdata(invdata);
      }
    );
    postRequest(
      endpoints.orderDetailsCustomer,
      { orderno: orders["Order_No"] },
      (orddata) => {

        setOrdDetailsdata(orddata);
      }
    );

  };
  console.log("orddetailsdata : - 222 -", orddetailsdata)

  let ordschselector = (id, ordschedules) => {
    setSelectedOrdSchId(id);
    setSelectedOrdSch(ordschedules);
    setOrderNo(ordschedules["Order_No"]);
    setOrdSchId(ordschedules["ScheduleId"]);
    postRequest(
      endpoints.ordSchTasksCustomer,
      {
        orderno: ordschedules["Order_No"],
        ordschid: ordschedules["ScheduleId"],
      },
      (ostdata) => {
        setOrdSchTaskdata(ostdata);
      }
    );
    postRequest(
      endpoints.schDetsCustomer,
      { ordschid: ordschedules["ScheduleId"] },
      (osddata) => {
        setSchDetsdata(osddata);
      }
    );

    // ordSchTasksCustomer({
    //     orderno: ordschedules["Order_No"],
    //     ordschid: ordschedules["ScheduleId"],
    // }, async (resp) => {
    //     //console.log(resp)
    //     setOrdSchTaskdata(resp)
    // })
    // schDetsCustomer({
    //     ordschid: ordschedules["ScheduleId"],
    // }, async (resp) => {
    //     //console.log(resp)
    //     setSchDetsdata(resp)
    // })
  };

  let invselector = (id, invlist) => {
    setSelectedInvListId(id);
    setSelectedInvList(invlist);
    setDCINVNo(invlist["DC_Inv_No"]);
    postRequest(
      endpoints.invDwgCustomer,
      { dcinvno: invlist["DC_Inv_No"] },
      (iddata) => {
        setInvDwgdata(iddata);
      }
    );
    // invDwgCustomer({
    //     dcinvno: invlist["DC_Inv_No"],
    // }, async (resp) => {
    //     //console.log(resp)
    //     setInvDwgdata(resp)
    // })
  };

  let schtasksselector = (id, schtasks) => {
    setSelectedSchTaskId(id);
    setSelectedSchTask(schtasks);
    setNcTaskID(schtasks["NcTaskId"]);

    postRequest(
      endpoints.scheduleTasksCustomer,
      { nctaskid: schtasks["NcTaskId"] },
      (stddata) => {
        setTaskPartDetsdata(stddata);
      }
    );
    // scheduleTasksCustomer({
    //     nctaskid: schtasks["NcTaskId"],
    // }, async (resp) => {
    //     //console.log(resp)
    //     setTaskPartDetsdata(resp)
    // })
  };

  let rendertable = (orders, id) => {
    return (
      <tr
        className=""
        style={{
          // backgroundColor: selectedOrderId === id ? "#5d88fc" : "",
          backgroundColor: selectedOrderId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "14px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          ordselector(id, orders);
        }}
      >
        <td>{orders["Order_No"]}</td>
        <td>{orders["Type"]}</td>
        <td>{moment(orders["Order_Date"]).format("DD/MM/YYYY")}</td>
        <td>{orders["Purchase_Order"]}</td>
        <td>{orders["OrderValue"]}</td>
        <td>{orders["MaterialValue"]}</td>
      </tr>
    );
  };


  // Suresh Code 12112024
  const [sortConfigOrd, setSortConfigOrd] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortOrd = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigOrd.key === key && sortConfigOrd.direction === "asc") {
      direction = "desc";
    }
    setSortConfigOrd({ key, direction });
  };

  const sortedDataOrd = () => {
    const dataCopyOrd = [...orderdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfigOrd.key) {
      dataCopyOrd.sort((a, b) => {
        let valueA = a[sortConfigOrd.key];
        let valueB = b[sortConfigOrd.key];

        // Convert only for the "integer" columns
        if (
          sortConfigOrd.key === "Order_No" ||
          sortConfigOrd.key === "Order_Date" ||
          sortConfigOrd.key === "OrderValue" ||
          sortConfigOrd.key === "MaterialValue"

        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigOrd.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigOrd.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyOrd;
  };
  // Suresh Code 12112024
  const [sortConfigOrdSch, setSortConfigOrdSch] = useState({ key: null, direction: null });

  const requestSortOrdSch = (key) => {
    let direction = 'asc';
    if (sortConfigOrdSch.key === key && sortConfigOrdSch.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigOrdSch({ key, direction });
  };

  const sortedDataSch = () => {
    const dataCopyOrdSch = [...orderscheduledata]; //...custdetdatafiltered]; // [...filteredData];
    if (sortConfigOrdSch.key) {
      dataCopyOrdSch.sort((a, b) => {
        let valueA = a[sortConfigOrdSch.key];
        let valueB = b[sortConfigOrdSch.key];

        // Convert only for the "integer" columns
        // if (
        // sortConfigOrdSch.key === "OrdSchNo" //||
        // sortConfigDwg.key === "QtyScheduled" ||
        // sortConfigDwg.key === "QtyProduced" ||
        // sortConfigDwg.key === "QtyPacked" ||
        // sortConfigDwg.key === "QtyDelivered" ||
        // sortConfigDwg.key === "JWCost" ||
        // sortConfigDwg.key === "MtrlCost"
        // ) 
        {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigOrdSch.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigOrdSch.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyOrdSch;
  };


  // Suresh Code 12112024
  const [sortConfigDwg, setSortConfigDwg] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortDwg = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigDwg.key === key && sortConfigDwg.direction === "asc") {
      direction = "desc";
    }
    setSortConfigDwg({ key, direction });
  };

  const sortedDataDwg = () => {

    const dataCopyDwg = [...orddetailsdata];

    if (sortConfigDwg.key) {
      dataCopyDwg.sort((a, b) => {
        let valueA = a[sortConfigDwg.key];
        let valueB = b[sortConfigDwg.key];

        // Convert only for the "integer" columns
        if (
          sortConfigDwg.key === "Qty_Ordered" ||
          sortConfigDwg.key === "QtyScheduled" ||
          sortConfigDwg.key === "QtyProduced" ||
          sortConfigDwg.key === "QtyPacked" ||
          sortConfigDwg.key === "QtyDelivered" ||
          sortConfigDwg.key === "JWCost" ||
          sortConfigDwg.key === "MtrlCost"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigDwg.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigDwg.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyDwg;
  };
  // Suresh Code 12112024

  let rendertblschs = (ordschedules, id) => {
    return (
      <tr
        className=""
        style={{
          backgroundColor: selectedOrdSchId === id ? "#98A8F8" : "",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          ordschselector(id, ordschedules);
        }}
      >
        <td>{ordschedules["OrdSchNo"]}</td>
        <td hidden>{ordschedules["ScheduleId"]}</td>
        <td>{ordschedules["Schedule_Status"]}</td>
      </tr>
    );
  };

  let rendertbltasks = (ordschtasks, id) => {
    return (
      <tr
        className=""
        style={{
          // backgroundColor: selectedSchTaskId === id ? "#5d88fc" : "",
          backgroundColor: selectedSchTaskId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "14px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          schtasksselector(id, ordschtasks);
        }}
      >
        <td>{ordschtasks["TaskNo"]}</td>
        <td>{ordschtasks["Mtrl_Code"]}</td>
        <td>{ordschtasks["CustMtrl"]}</td>
        <td>{ordschtasks["Operation"]}</td>
        <td>{ordschtasks["TStatus"]}</td>
      </tr>
    );
  };
  let rendertblOrdDets = (orddetails) => {
    console.log("rendertblOrdDets - orddetails : - 2 -", orddetails)
    console.log("Drawing Name : - ", orddetails.DwgName);

    let bgcolor = "";
    bgcolor = orddetails.Qty_Ordered === 0 ? "Lavender" :
      orddetails.QtyDelivered >= orddetails.Qty_Ordered ? "LightGreen" :
        orddetails.QtyDelivered > 0 ? "Orange" :
          orddetails.QtyPacked >= orddetails.Qty_Ordered ? "Green" :
            orddetails.QtyPacked > 0 ? "GreenYellow" :
              orddetails.QtyProduced >= orddetails.Qty_Ordered ? "Yellow" :
                orddetails.QtyProduced > 0 ? "LightGreen" :
                  orddetails.QtyScheduled >= orddetails.Qty_Ordered ? "LightYellow" :
                    orddetails.QtyScheduled > 0 ? "LightCoral" :
                      "Lavender";
    return (
      <tr className="" style={{ backgroundColor: bgcolor }}>
        <td>{orddetails.DwgName}</td>
        <td>{orddetails["Operation"]}</td>
        <td>{orddetails["Mtrl_Code"]}</td>
        <td>{orddetails["Mtrl_Source"]}</td>
        <td>{orddetails["Qty_Ordered"]}</td>
        <td>{orddetails["QtyScheduled"]}</td>
        <td>{orddetails["QtyProduced"]}</td>
        <td>{orddetails["QtyPacked"]}</td>
        <td>{orddetails["QtyDelivered"]}</td>
        <td>{orddetails["JWCost"]}</td>
        <td>{orddetails["MtrlCost"]}</td>
        <td>{orddetails["SrlStatus"]}</td>
      </tr>
    );
  };

  const [sortConfigInvlist, setSortConfigInvlist] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortInvlist = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigInvlist.key === key && sortConfigInvlist.direction === "asc") {
      direction = "desc";
    }
    setSortConfigInvlist({ key, direction });
  };

  const sortedDataInvlist = () => {
    const dataCopyInvlist = [...invoicelistdata];

    if (sortConfigInvlist.key) {
      dataCopyInvlist.sort((a, b) => {
        let valueA = a[sortConfigInvlist.key];
        let valueB = b[sortConfigInvlist.key];

        // Convert only for the "integer" columns
        if (
          sortConfigInvlist.key === "GrandTotal" ||
          sortConfigInvlist.key === "PymtAmtRecd"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigInvlist.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigInvlist.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyInvlist;
  };

  let rendertblInvList = (invlist, id) => {
    return (
      <tr
        className=""
        style={{
          // backgroundColor: selectedInvListId === id ? "#5d88fc" : "",
          backgroundColor: selectedInvListId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "14px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          invselector(id, invlist);
        }}
      >
        <td>{invlist["DC_InvType"]}</td>
        <td>{invlist["Inv_No"]}</td>
        <td>{moment(invlist["Inv_Date"]).format("DD/MM/YYYY")}</td>
        <td>{moment(invlist["PaymentDate"]).format("DD/MM/YYYY")}</td>
        <td>{invlist["GrandTotal"]}</td>
        <td>{invlist["PymtAmtRecd"]}</td>
        <td hidden>{invlist["DC_Inv_No"]}</td>
      </tr>
    );
  };

  const [sortConfigInvDwg, setSortConfigInvDwg] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortInvDwg = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigInvDwg.key === key && sortConfigInvDwg.direction === "asc") {
      direction = "desc";
    }
    setSortConfigInvDwg({ key, direction });
  };

  const sortedDataInvDwg = () => {
    const dataCopyInvDwg = [...invdwgdata];

    if (sortConfigInvDwg.key) {
      dataCopyInvDwg.sort((a, b) => {
        let valueA = a[sortConfigInvDwg.key];
        let valueB = b[sortConfigInvDwg.key];

        // Convert only for the "integer" columns
        if (
          sortConfigInvDwg.key === "Qty" ||
          sortConfigInvDwg.key === "JW_Rate" ||
          sortConfigInvDwg.key === "Mtrl_rate"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigInvDwg.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigInvDwg.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyInvDwg;
  };

  let rendertblInvDwg = (invdwg) => {
    return (
      <tr className="">
        <td>{invdwg["Dwg_No"]}</td>
        <td>{invdwg["Mtrl"]}</td>
        <td>{invdwg["Qty"]}</td>
        <td>{invdwg["JW_Rate"]}</td>
        <td>{invdwg["Mtrl_rate"]}</td>
      </tr>
    );
  };

  // Schedule Details
  const [sortConfigschDets, setsortConfigschDets] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortschDets = (key) => {
    let direction = "asc";
    if (sortConfigschDets.key === key && sortConfigschDets.direction === "asc") {
      direction = "desc";
    }
    setsortConfigschDets({ key, direction });
  };

  const sortedDataschDets = () => {
    const dataCopyschDets = [...schdetsdata];

    if (sortConfigschDets.key) {
      dataCopyschDets.sort((a, b) => {
        let valueA = a[sortConfigschDets.key];
        let valueB = b[sortConfigschDets.key];

        // Convert only for the "integer" columns
        if (
          sortConfigschDets.key === "QtyScheduled" ||
          sortConfigschDets.key === "QtyProgrammed" ||
          sortConfigschDets.key === "QtyProduced" ||
          sortConfigschDets.key === "QtyInspected" ||
          sortConfigschDets.key === "QtyCleared" ||
          sortConfigschDets.key === "QtyPacked" ||
          sortConfigschDets.key === "QtyDelivered" ||
          sortConfigschDets.key === "QtyRejected" ||
          sortConfigschDets.key === "JWCost" ||
          sortConfigschDets.key === "MtrlCost"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigschDets.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigschDets.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyschDets;
  };

  let rendertblschDets = (schdetails) => {

    return (
      <tr className="" style={{ width: "100%", whitespace:'nowrap' }}>
        <td>
          {schdetails["DwgName"]}
        </td>
        <td>
          {schdetails["Mtrl_Code"]}
        </td>
        <td>
          {schdetails["Operation"]}
        </td>
        <td>{schdetails["Mtrl_Source"]}</td>
        <td>{schdetails["QtyScheduled"]}</td>
        <td>{schdetails["QtyProgrammed"]}</td>
        <td>{schdetails["QtyProduced"]}</td>
        <td>{schdetails["QtyInspected"]}</td>
        <td>{schdetails["QtyCleared"]}</td>
        <td>{schdetails["QtyPacked"]}</td>
        <td>{schdetails["QtyDelivered"]}</td>
        <td>{schdetails["QtyRejected"]}</td>
        <td>{schdetails["JWCost"]}</td>
        <td>{schdetails["MtrlCost"]}</td>
        <td hidden>{schdetails["SrlStatus"]}</td>
      </tr>
    );
  };


  // Task Part Details
  const [sortConfigtaskprtDets, setsortConfigtaskprtDets] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSorttaskprtDets = (key) => {
    let direction = "asc";
    if (sortConfigtaskprtDets.key === key && sortConfigtaskprtDets.direction === "asc") {
      direction = "desc";
    }
    setsortConfigtaskprtDets({ key, direction });
  };

  const sortedDatataskprtDets = () => {
    const dataCopytaskprtDets = [...taskpartdetsdata];

    if (sortConfigtaskprtDets.key) {
      dataCopytaskprtDets.sort((a, b) => {
        let valueA = a[sortConfigtaskprtDets.key];
        let valueB = b[sortConfigtaskprtDets.key];

        // Convert only for the "integer" columns
        if (
          sortConfigtaskprtDets.key === "QtyToNest" ||
          sortConfigtaskprtDets.key === "QtyNested" ||
          sortConfigtaskprtDets.key === "QtyProduced" ||
          sortConfigtaskprtDets.key === "QtyCleared"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigtaskprtDets.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigtaskprtDets.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopytaskprtDets;
  };

  let rendertbltaskprtDets = (taskprtdets) => {
    return (
      <tr className="">
        <td>{taskprtdets["DwgName"]}</td>
        <td>{taskprtdets["QtyToNest"]}</td>
        <td>{taskprtdets["QtyNested"]}</td>
        <td>{taskprtdets["QtyProduced"]}</td>
        <td>{taskprtdets["QtyCleared"]}</td>
        <td>{taskprtdets["Remarks"]}</td>
      </tr>
    );
  };

  return (
    <div>
      {/* <BreadcrumbsComponent /> */}
      <h4 className="title ">Customer Order Information</h4>
      {/* <hr className="horizontal-line" /> */}
      <div>
        <div className="row">
          <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
            {/* <Form.Group controlId="CustName"> */}
            <label className="form-label">
              Customer
              <span
                style={{
                  color: "#f20707",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                *
              </span>
            </label>

            {custdata.length > 0 ? (
              // <Form.Select
              //   className="ip-select "
              //   controlId="CustName"
              //   onChange={selectCust}
              // >
              //   <option value="" disabled selected>
              //     {" "}
              //     Select Customer
              //   </option>
              //   {custdata.map((cust) => {
              //     return (
              //       <option value={cust["Cust_Code"]}>
              //         {cust["Cust_name"]}
              //       </option>
              //     );
              //   })}
              // </Form.Select>
              <Typeahead
                className="ip-select"
                // id="basic-example"
                id="CustName"
                style={{ marginTop: "3px" }}
                // onChange={selectCust}
                options={custdata}
                placeholder="Select Customer"
                // selected={selected}
                /*onInputChange={(label) => {
                  console.log("input change :", label);
                }}
                onChange={(label) => {
                  console.log("onchange :", label);
                }}*/
                //  onChange={(label) => selectCust(label)}
                onChange={handleCustChange}
              />
            ) : (
              ""
            )}
            {/* </Form.Group> */}
          </div>{" "}
          <div className="col-md-2 d-flex mt-1" style={{ gap: "10px" }}>
            {" "}
            <label className="form-label">Code </label>
            <input
              className="in-field"
              id="custcode"
              type="text"
              disabled
              value={custcode}
            />
          </div>
          <div className="col-md-2 d-flex mt-1" style={{ gap: "10px" }}>
            {" "}
            <label className="form-label">Status </label>
            {/* <input id="custcode" type="text" disabled value={""} /> */}
            {searchParams.get("ordstat") == "All" ? (
              ordstatdata.length > 0 ? (
                <select className="ip-select mt-1"
                  id="ordstatus"
                  onChange={selectOStatus}
                  disabled={!isStatusEnabled} >
                  <option value="" disabled selected>
                    ** Select **
                  </option>
                  {ordstatdata.map((ordstat) => (
                    <option key={ordstat["Status"]}
                      value={ordstat["Status"]}>
                      {ordstat["Status"]}
                    </option>
                  ))}
                </select>
              ) : (
                ""
              )
            ) : (
              // <input id="ordstatus" type="text" disabled value={ordstatus} />
              <input
                className="in-field"
                id="custcode"
                type="text"
                disabled
                value={ordstatus}
              />
            )}
          </div>
          <div className="col-md-2">
            {" "}
            <button
              id="btnclose"
              type="submit"
              className="button-style"
              onClick={() => navigate("/customer")}
            >
              Close{" "}
            </button>
          </div>
        </div>
        <div className="row" style={{ paddingRight: "0px" }}>
          <div className="col-md-4 mt-2">
            <div
              style={{
                height: "200px",
                overflowY: "scroll",
              }}
            >
              <Table striped className="table-data border ">
                <thead className="tableHeaderBGColor  tablebody">

                  <tr style={{ whiteSpace: "nowrap" }}>
                    <th onClick={() => requestSortOrd("Order_No")}>Order No</th>
                    <th onClick={() => requestSortOrd("Type")}>Type</th>
                    <th onClick={() => requestSortOrd("Order_Date")}>Order Date</th>
                    <th onClick={() => requestSortOrd("Purchase_Order")}>Purchase Order</th>
                    <th onClick={() => requestSortOrd("OrderValue")}>Order Value</th>
                    <th onClick={() => requestSortOrd("MaterialValue")}>Mtrl Value</th>
                  </tr>
                  {/* {[
                      "Order No",
                      "Type",
                      "Order Date",
                      "Purchase Order",
                      "Order Value",
                      "Mtrl Value",
                    ].map((h) => {
                      return <th>{h}</th>;
                    })}
                  </tr> */}
                </thead>
                <tbody className="tablebody" style={{ whiteSpace: "nowrap" }}>
                  {/* {orderdata != null
                    ? orderdata.map((orders, id) => rendertable(orders, id))
                    : ""} */}
                  {sortedDataOrd()?.map((orders, id) => rendertable(orders, id))
                  }
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-md-3 mt-2">
            <div
              style={{
                height: "200px",
                overflowY: "scroll",
              }}
            >
              <Table striped className="table-data border ">
                <thead className="tableHeaderBGColor  tablebody">
                  <tr>
                    <th>Ord. Schedule No</th>
                    <th>Sch. Status</th>
                    {/* <th  onClick={() => requestSortOrdSch("OrdSchNo")}>Ord. Schedule No</th>
                    <th  onClick={() => requestSortOrdSch("Schedule_Status")}>Sch. Status</th> */}
                    {/* {["Ord. Schedule No", "Sch. Status"].map((h) => {
                      return (
                        <th
                          className="custth"
                          //   style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        >
                          {h}
                        </th>
                      );
                    })} */}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {orderscheduledata != null
                    ? orderscheduledata.map((ordschedules, id) =>
                      rendertblschs(ordschedules, id)
                    )
                    : ""}
                  {/* {sortedDataSch()?.map((ordschedules, id) => {
                    rendertblschs(ordschedules, id)
                  })}  */}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-md-5 mt-2">
            {" "}
            <div
              style={{
                height: "200px",
                overflowY: "scroll",
              }}
            >
              <Table striped className="table-data border ">
                <thead className="tableHeaderBGColor  tablebody">
                  <tr>
                    {[
                      "Task No",
                      "Mtrl Code",
                      "Cust Mtrl",
                      "Operation",
                      "Status",
                    ].map((h) => {
                      return (
                        <th
                          className=""
                        // style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        >
                          {h}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {ordschtaskdata != null
                    ? ordschtaskdata.map((ordschtasks, id) =>
                      rendertbltasks(ordschtasks, id)
                    )
                    : ""}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div xs={12}>
            <Tabs
              defaultActiveKey="orddets"
              id="orderdetails"
              className="mb-1 mt-1 tab_font"
            >
              <Tab eventKey="orddets" title="Order Details Status">
                <div style={{ height: "320px", overflowY: "scroll" }}>
                  <table striped className="table-data border ">
                    <thead className="tableHeaderBGColor  tablebody">
                      <tr>
                        <th onClick={() => requestSortDwg("DwgName")} style={{width:'250px'}}>Dwg Name</th>
                        <th onClick={() => requestSortDwg("Operation")} style={{width:'150px'}}>Operation</th>
                        <th onClick={() => requestSortDwg("Mtrl_Code")}  style={{width:'150px'}}>Mtrl Code</th>
                        <th onClick={() => requestSortDwg("Mtrl_Source")} style={{width:'80px'}}>Source</th>
                        <th onClick={() => requestSortDwg("Qty_Ordered")} style={{width:'90px'}}>Qty</th>
                        <th onClick={() => requestSortDwg("QtyScheduled")} style={{width:'90px'}}>Scheduled</th>
                        <th onClick={() => requestSortDwg("QtyProduced")} style={{width:'90px'}}>Produced</th>
                        <th onClick={() => requestSortDwg("QtyPacked")} style={{width:'90px'}}>Packed</th>
                        <th onClick={() => requestSortDwg("QtyDelivered")} style={{width:'90px'}}>Delivered</th>
                        <th onClick={() => requestSortDwg("JWCost")} style={{width:'90px'}}>JWCost</th>
                        <th onClick={() => requestSortDwg("MtrlCost")} style={{width:'90px'}}>MtrlCost</th>
                        <th onClick={() => requestSortDwg("SrlStatus")} style={{width:'90px'}}>SrlStatus</th>
                      </tr>
                      {/* {[
                          "Dwg Name",
                          "Operation",
                          "Mtrl Code",
                          "Source",
                          "Qty",
                          "Scheduled",
                          "Produced",
                          "Packed",
                          "Delivered",
                          "JWCost",
                          "MtrlCost",
                          "SrlStatus",
                        ].map((h) => {
                          return <th>{h}</th>;
                        })}
                      </tr> */}
                    </thead>
                    <tbody className="tablebody">
                      {/* {orddetailsdata != null
                        ? orddetailsdata.map((orddetails) =>
                          rendertblOrdDets(orddetails)
                        )
                        : ""} */}
                      {sortedDataDwg().map((orddetails) => (
                        rendertblOrdDets(orddetails)
                      ))}


                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab
                eventKey="invlist"
                title="Invoice List"
              // style={{ fontFamily: "Roboto", fontSize: "12px" }}
              >
                <div className="d-flex">
                  <div
                    className="col-md-6"
                    style={{ height: "300px", overflowY: "scroll" }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor  tablebody">
                        <tr>
                          {/* {[
                            "Inv Type",
                            "Inv No",
                            "Mtrl Inv Date",
                            "Due Date",
                            "Grand Total",
                            "Amt. Received",
                          ].map((h) => {
                            return <th>{h}</th>;
                          })} */}

                          <th onClick={() => requestSortInvlist("DC_InvType")}>Inv Type</th>
                          <th onClick={() => requestSortInvlist("Inv_No")}>Inv No</th>
                          <th onClick={() => requestSortInvlist("Inv_Date")}>Mtrl Inv Date</th>
                          <th onClick={() => requestSortInvlist("PaymentDate")}>Due Date</th>
                          <th onClick={() => requestSortInvlist("GrandTotal")}>Grand Total</th>
                          <th onClick={() => requestSortInvlist("PymtAmtRecd")}>Amt. Received</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {/* {invoicelistdata != null
                          ? invoicelistdata.map((invlist, id) =>
                            rendertblInvList(invlist, id)
                          )
                          : ""} */}
                        {sortedDataInvlist().map((invlist, id) => (
                          rendertblInvList(invlist, id)
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div
                    className="col-md-6"
                    style={{
                      height: "300px",
                      overflowY: "scroll",
                    }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor  tablebody">
                        <tr>
                          <th onClick={() => requestSortInvDwg("Dwg_No")}>Dwg No</th>
                          <th onClick={() => requestSortInvDwg("Mtrl")}>Mtrl</th>
                          <th onClick={() => requestSortInvDwg("Qty")}>Qty</th>
                          <th onClick={() => requestSortInvDwg("JW_Rate")}>JW Rate</th>
                          <th onClick={() => requestSortInvDwg("Mtrl_Rate")}>Mtrl Rate</th>

                          {/* {[
                            "Dwg No",
                            "Mtrl",
                            "Qty",
                            "JW Rate",
                            "Mtrl Rate",
                          ].map((h) => {
                            return <th>{h}</th>;
                          })} */}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {/* {invdwgdata != null
                          ? invdwgdata.map((invdwg) => rendertblInvDwg(invdwg))
                          : ""} */}
                        {sortedDataInvDwg().map((invdwg) => (
                          rendertblInvDwg(invdwg)
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="schdets" title="Schedule Details">
                <div
                  style={{
                    height: "300px",
                    overflowY: "scroll",
                    overflowX: "scroll",
                  }}
                >
                  <Table striped className="table-data border ">
                    <thead className="tableHeaderBGColor  tablebody">
                      <tr style={{whitespace:'nowrap'}}>
                        <th onClick={() => requestSortschDets("DwgName")}>Dwg Name</th>
                        <th onClick={() => requestSortschDets("Mtrl_Code")}>Mtrl Code</th>
                        <th onClick={() => requestSortschDets("Operation")}>Operation</th>
                        <th onClick={() => requestSortschDets("Mtrl_Source")}>Source</th>
                        <th onClick={() => requestSortschDets("QtyScheduled")}>Scheduled</th>
                        <th onClick={() => requestSortschDets("QtyProgrammed")}>Programmed</th>
                        <th onClick={() => requestSortschDets("QtyProduced")}>Produced</th>
                        <th onClick={() => requestSortschDets("QtyInspected")}>Inspected</th>
                        <th onClick={() => requestSortschDets("QtyCleared")}>Cleared</th>
                        <th onClick={() => requestSortschDets("QtyPacked")}>Packed</th>
                        <th onClick={() => requestSortschDets("QtyDelivered")}>Delivered</th>
                        <th onClick={() => requestSortschDets("QtyRejected")}>Rejected</th>
                        <th onClick={() => requestSortschDets("JWCost")}>JWCost</th>
                        <th onClick={() => requestSortschDets("MtrlCost")}>MtrlCost</th>
                      </tr>
                      {/* {[
                          "Dwg Name ",
                          "Mtrl Code",
                          "Operation",
                          "Source",
                          "Scheduled",
                          "Programmed",
                          "Produced",
                          "Inspected",
                          "Cleared",
                          "Packed",
                          "Delivered",
                          "Rejected",
                          "JWCost",
                          "MtrlCost",
                        ].map((h) => {
                          return <th>{h}</th>;
                        })}
                      </tr> */}
                    </thead>
                    <tbody className="tablebody">
                      {/* {schdetsdata != null
                        ? schdetsdata.map((schdetails) =>
                          rendertblschDets(schdetails)
                        )
                        : ""} */}
                      {sortedDataschDets().map((schdetails) => (
                        rendertblschDets(schdetails)
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              <Tab eventKey="taskpartdets" title="Task Part Details">
                <div
                  style={{
                    height: "300px",
                    overflowY: "scroll",
                  }}
                >
                  <Table striped className="table-data border ">
                    <thead className="tableHeaderBGColor  tablebody">
                      <tr>
                        <th onClick={() => requestSorttaskprtDets("DwgName")}>Dwg Name</th>
                        <th onClick={() => requestSorttaskprtDets("QtyToNest")}>Drawing</th>
                        <th onClick={() => requestSorttaskprtDets("QtyNested")}>To Nest</th>
                        <th onClick={() => requestSorttaskprtDets("QtyProduced")}>Nested</th>
                        <th onClick={() => requestSorttaskprtDets("QtyCleared")}>Produced</th>
                        <th onClick={() => requestSorttaskprtDets("Remarks")}>Cleared</th>
                      </tr>
                      {/* {[
                          "Drawing",
                          "To Nest",
                          "Nested",
                          "Produced",
                          "Cleared",
                          "Remarks",
                        ].map((h) => {
                          return <th>{h}</th>;
                        })}
                      </tr> */}
                    </thead>
                    <tbody className="tablebody">
                      {/* {taskpartdetsdata != null
                        ? taskpartdetsdata.map((taskprtdets) =>
                          rendertbltaskprtDets(taskprtdets)
                        )
                        : ""} */}
                      {sortedDatataskprtDets().map((taskprtdets) => (
                        rendertbltaskprtDets(taskprtdets)
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      {/* --------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="form-style">
        {/* // <Container>
        //     <div className="addquotecard">
                 <h4 className="addquotecard-header">Customer Order Information</h4> */}
        <Form>
          {/* <Row className="mb-1">
            <Form.Label
              style={{ width: "90px", fontFamily: "Roboto", fontSize: "12px" }}
            >
              Customer
            </Form.Label>
            {custdata.length > 0 ? (
              <select
                className="ip-select col-md-6"
                controlId="CustName"
                style={{
                  width: "350px",
                  height: "30px",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                onChange={selectCust}
              >
                <option value="" disabled selected>
                  {" "}
                  Select Customer
                </option>
                {custdata.map((cust) => {
                  return (
                    <option
                      style={{ fontFamily: "Roboto", fontSize: "12px" }}
                      value={cust["Cust_Code"]}
                    >
                      {cust["Cust_name"]}
                    </option>
                  );
                })}
              </select>
            ) : (
              ""
            )} */}

          {/* <input type="text" list="custdata" id='CustName' style={{ width: '400px', height: '30px', fontFamily: 'Roboto', fontSize: '12px', marginLeft: '5px', marginRight: '20px' }} placeholder="Select Customer" onChange={selectCust} />
                        {custdata.length > 0 ?
                            <datalist id="custdata" onChange={selectCust} required>
                                {custdata.map((cust) =>
                                    <option key={cust.Cust_Code} value={cust.Cust_Code + ' - ' + cust.Cust_name} />

                                )}
                            </datalist> : ""} */}
          {/* <Form.Label
              style={{
                width: "90px",
                fontFamily: "Roboto",
                fontSize: "14px",
                padding: "1px 1px 1px 50px",
              }}
            > */}
          {/* Code{" "}
            </Form.Label> */}
          {/* <Form.Control
              id="custcode"
              type="text"
              disabled
              style={{
                width: "90px",
                height: "30px",
                fontFamily: "Roboto",
                fontSize: "14px",
              }}
              value={custcode}
            /> */}
          {/* <Form.Label
              style={{
                width: "100px",
                fontFamily: "Roboto",
                fontSize: "12px",
                padding: "1px 1px 1px 50px",
              }}
            >
              Status{" "}
            </Form.Label> */}

          {/* {searchParams.get("ordstat") == "All" ? (
              ordstatdata.length > 0 ? (
                <select
                  className="ip-select col-md-6"
                  controlId="ordstatus"
                  style={{
                    width: "130px",
                    height: "30px",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                  }}
                  onChange={selectOStatus}
                >
                  <option value="" disabled selected>
                    ** Select **
                  </option>
                  {ordstatdata.map((ordstat) => {
                    return (
                      <option
                        style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        value={ordstat["Status"]}
                      >
                        {ordstat["Status"]}
                      </option>
                    );
                  })}
                </select>
              ) : (
                ""
              )
            ) : (
              <Form.Control
                id="ordstatus"
                type="text"
                disabled
                style={{
                  width: "130px",
                  height: "30px",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                value={ordstatus}
              />
            )} */}
          {/* <Col style={{ width: "200px", padding: "0px 0px 0px 50px" }}>
              <Button
                id="btnclose"
                type="submit"
                style={{
                  backgroundColor: "#283E81",
                  align: "float-right",
                  width: "100px",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                onClick={() => navigate("/customer")}
              >
                Close{" "}
              </Button>
            </Col> */}
          {/* </Row> */}
          <Row>
            {/* <Col
              xs={5}
              className="vscroll"
              style={{
                fontFamily: "Roboto",
                fontSize: "12px",
                maxHeight: "310px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                className="custtable"
              >
                <tr
                  className="custtr"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  {[
                    "Order No",
                    "Type",
                    "Order Date",
                    "Purchase Order",
                    "Order Value",
                    "Mtrl Value",
                  ].map((h) => {
                    return (
                      <th
                        className="custth"
                        style={{ fontFamily: "Roboto", fontSize: "12px" }}
                      >
                        {h}
                      </th>
                    );
                  })}
                </tr>
                {orderdata != null
                  ? orderdata.map((orders, id) => rendertable(orders, id))
                  : ""}
              </table>
            </Col> */}
            {/* <Col
              xs={3}
              className="vscroll"
              style={{
                fontFamily: "Roboto",
                fontSize: "12px",
                height: "310px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                className="custtable"
              >
                <tr
                  className="custtr"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  {
                    // ["Ord. Schedule No", "Scheduled", "Sch. Status"].map(h => {
                    ["Ord. Schedule No", "Sch. Status"].map((h) => {
                      return (
                        <th
                          className="custth"
                          style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        >
                          {h}
                        </th>
                      );
                    })
                  }
                </tr>
                {orderscheduledata != null
                  ? orderscheduledata.map((ordschedules, id) =>
                      rendertblschs(ordschedules, id)
                    )
                  : ""}
              </table>
            </Col> */}
            {/* <Col xs={4} className="vscroll" style={{ maxHeight: "310px" }}>
              <table
                style={{
                  width: "100%",
                  fontFamily: "Roboto",
                  fontSize: "12px",
                }}
                className="custtable"
              >
                <tr
                  className="custtr"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  {[
                    "Task No",
                    "Mtrl Code",
                    "Cust Mtrl",
                    "Operation",
                    "Status",
                  ].map((h) => {
                    return (
                      <th
                        className="custth"
                        style={{ fontFamily: "Roboto", fontSize: "12px" }}
                      >
                        {h}
                      </th>
                    );
                  })}
                </tr>
                {ordschtaskdata != null
                  ? ordschtaskdata.map((ordschtasks, id) =>
                      rendertbltasks(ordschtasks, id)
                    )
                  : ""}
              </table>
            </Col> */}
          </Row>
          <Row className="mt-2 mb-3">
            {/* <Col xs={12}>
              <Tabs
                defaultActiveKey="orddets"
                id="orderdetails"
                className="mb-3"
                style={{
                  fontFamily: "Roboto",
                  fontSize: "12px",
                  padding: "1px 1px 1px 5px",
                }}
              >
                <Tab
                  eventKey="orddets"
                  title="Order Details Status"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  <Container>
                    <Row>
                      <Col
                        xs={12}
                        className="vscroll"
                        style={{ maxHeight: "320px" }}
                      >
                        <table
                          style={{
                            width: "100%",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                          }}
                          className="custtable"
                        >
                          <tr
                            className="custtr"
                            style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            {[
                              "Dwg Name",
                              "Operation",
                              "Mtrl Code",
                              "Source",
                              "Qty",
                              "Scheduled",
                              "Produced",
                              "Packed",
                              "Delivered",
                              "JWCost",
                              "MtrlCost",
                              "SrlStatus",
                            ].map((h) => {
                              return (
                                <th
                                  className="custth"
                                  style={{
                                    fontFamily: "Roboto",
                                    fontSize: "12px",
                                  }}
                                >
                                  {h}
                                </th>
                              );
                            })}
                          </tr>
                          {orddetailsdata != null
                            ? orddetailsdata.map((orddetails) =>
                                rendertblOrdDets(orddetails)
                              )
                            : ""}
                        </table>
                      </Col>
                    </Row>
                  </Container>
                </Tab>
                <Tab
                  eventKey="invlist"
                  title="Invoice List"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  <Container>
                    <Row classnName="mt-2">
                      <Col
                        xs={8}
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          height: "300px",
                        }}
                        className="vscroll"
                      >
                        <table
                          style={{
                            width: "100%",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                          }}
                          className="custtable"
                        >
                          <tr
                            className="custtr"
                            style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            {
                              //  ["Inv Type", "Inv No", "Mtrl Inv Date", "Due Date", "Grand Total", "Amt. Received", "DC Inv No"].map(h => {
                              [
                                "Inv Type",
                                "Inv No",
                                "Mtrl Inv Date",
                                "Due Date",
                                "Grand Total",
                                "Amt. Received",
                              ].map((h) => {
                                return (
                                  <th
                                    className="custth"
                                    style={{
                                      fontFamily: "Roboto",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {h}
                                  </th>
                                );
                              })
                            }
                          </tr>
                          {invoicelistdata != null
                            ? invoicelistdata.map((invlist, id) =>
                                rendertblInvList(invlist, id)
                              )
                            : ""}
                        </table>
                      </Col>
                      <Col
                        xs={4}
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          height: "300px",
                        }}
                        className="vscroll"
                      >
                        <table
                          style={{
                            width: "100%",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                          }}
                          className="custtable"
                        >
                          <tr
                            className="custtr"
                            style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            {[
                              "Dwg No",
                              "Mtrl",
                              "Qty",
                              "JW Rate",
                              "Mtrl Rate",
                            ].map((h) => {
                              return (
                                <th
                                  className="custth"
                                  style={{
                                    fontFamily: "Roboto",
                                    fontSize: "12px",
                                  }}
                                >
                                  {h}
                                </th>
                              );
                            })}
                          </tr>
                          {invdwgdata != null
                            ? invdwgdata.map((invdwg) =>
                                rendertblInvDwg(invdwg)
                              )
                            : ""}
                        </table>
                      </Col>
                    </Row>
                  </Container>
                </Tab>
                <Tab
                  eventKey="schdets"
                  title="Schedule Details"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  <Container>
                    <Row classnName="mt-2">
                      <Col
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          height: "300px",
                          overflowX: "scroll",
                          overflowY: "scroll",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                          }}
                          className="custtable"
                        >
                          <tr
                            className="custtr"
                            style={{
                              width: "100%",
                              fontFamily: "Roboto",
                              fontSize: "12px",
                            }}
                          >
                            {[
                              "       Dwg Name         ",
                              "Mtrl Code",
                              "Operation",
                              "Source",
                              "Scheduled",
                              "Programmed",
                              "Produced",
                              "Inspected",
                              "Cleared",
                              "Packed",
                              "Delivered",
                              "Rejected",
                              "JWCost",
                              "MtrlCost",
                            ].map((h) => {
                              return (
                                <th
                                  className="custth"
                                  style={{
                                    fontFamily: "Roboto",
                                    fontSize: "12px",
                                  }}
                                >
                                  {h}
                                </th>
                              );
                            })}
                          </tr>
                          {schdetsdata != null
                            ? schdetsdata.map((schdetails) =>
                                rendertblschDets(schdetails)
                              )
                            : ""}
                        </table>
                      </Col>
                    </Row>
                  </Container>
                </Tab>
                <Tab
                  eventKey="taskpartdets"
                  title="Task Part Details"
                  style={{ fontFamily: "Roboto", fontSize: "12px" }}
                >
                  <Container>
                    <Row classnName="mt-2">
                      <Col
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          height: "300px",
                        }}
                        className="vscroll"
                      >
                        <table
                          style={{
                            width: "100%",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                          }}
                          className="custtable"
                        >
                          <tr
                            className="custtr"
                            style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            {[
                              "Drawing",
                              "To Nest",
                              "Nested",
                              "Produced",
                              "Cleared",
                              "Remarks",
                            ].map((h) => {
                              return (
                                <th
                                  className="custth"
                                  style={{
                                    fontFamily: "Roboto",
                                    fontSize: "12px",
                                  }}
                                >
                                  {h}
                                </th>
                              );
                            })}
                          </tr>
                          {taskpartdetsdata != null
                            ? taskpartdetsdata.map((taskprtdets) =>
                                rendertbltaskprtDets(taskprtdets)
                              )
                            : ""}
                        </table>
                      </Col>
                    </Row>
                  </Container>
                </Tab>
              </Tabs>
            </Col> */}
          </Row>
        </Form>
      </div>
      {/* ----------------------------------------------------------------------------------------------------------------- */}
    </div>
  );
}

export default Order;
