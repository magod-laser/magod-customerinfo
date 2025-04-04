import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Table,
  Row,
  Col,
  FormLabel,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import "../../Css/Commerical.css";
import moment from "moment";
import * as XLSX from 'xlsx';
// import CmpLogo from "../../../images/ML-LOGO.png";
import CmpLogo from "../../../../../images/ML-LOGO.png";
// import CmpLogo from "../../../../../Magod-Laser-Logo - White.png";

import AlertModal from "../../../../../pages/components/alert";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import ModalPrintOSReport from "../Outstanding_summary/Printing/PrintOS";


const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function Commercial() {
  let navigate = useNavigate();
  let [alertModal, setAlertModal] = useState(false);
  let [firstbuttontext, setFirstbuttontext] = useState("");
  let [secondbuttontext, setSecondbuttontext] = useState("");
  let [openOSPrintModal, setOSPrintModal] = useState(false);

  let [days30, setdays30] = useState(0);
  let [days60, setdays60] = useState(0);
  let [month3, setmonth3] = useState(0);
  let [month6, setmonth6] = useState(0);
  let [year1, setyear1] = useState(0);
  let [greater1year, setGreater1Year] = useState(0);
  let [selectedCustomerId, setSelectedCustomerId] = useState("");
  let [selectedCustomer, setSelectedCustomer] = useState("");

  let [custcode, setCustCode] = useState("");

  let [outstandingdata, setOutStandingdata] = useState([]);
  let [outstandinginvdetsdata, setOutstandingInvDetsdata] = useState([]);
  let [unitdata, setUnitdata] = useState([]);
  let [OSData, setOSData] = useState([]);

  let [outstandings, setOutstandings] = useState(true);
  // let [showInvoiceState, setShowInvoice] = useState(false);
  let [showOutStandReportState, setShowOutStandReport] = useState(true);
  let [indtotaldues, setIndTotalDues] = useState(0);
  let [indtotaloverdues, setIndTotalOverDues] = useState(0);
  let [crdays, setCrDays] = useState(0);

  useEffect(() => {
    postRequest(endpoints.outStandingCustomers, {}, async (data) => {
      //   console.log("Customer Outstanding : " + data[0]["CreditTime"])
      setOutStandingdata(data);
      let due30 = 0;
      let due60 = 0;
      let due90 = 0;
      let due180 = 0;
      let due365 = 0;
      let due365plus = 0;

      for (let i = 0; i < data.length; i++) {
        due30 += parseFloat(data[i]["DueAmt30"]);
        due60 += parseFloat(data[i]["DueAmt60"]);
        due90 += parseFloat(data[i]["DueAmt90"]);
        due180 += parseFloat(data[i]["DueAmt180"]);
        due365 += parseFloat(data[i]["DueAmt365"]);
        due365plus += parseFloat(data[i]["DueAmtAbv365"]);
      }
      setdays30(due30);
      setdays60(due60);
      setmonth3(due90);
      setmonth6(due180);
      setyear1(due365);
      setGreater1Year(due365plus);
    });

    postRequest(endpoints.getUnits, {}, (unitdata) => {
      console.log(unitdata);
      setUnitdata(unitdata);
    });
  }, []);

  // let dateconv = (da) => {
  //     let cdate = new Date(da);
  //     return cdate.getDay().toString().padStart(2, "0") + "/" + cdate.getMonth().toString().padStart(2, "0") + "/" + cdate.getFullYear();
  // }

  let secbtnc = () => {
    setAlertModal(false);
  };

  let fstbtnc = () => {
    // postRequest(endpoints.printDueReport, { custcode: custcode }).then((data) => {
    //     console.log(data);
    //     if (data.status === 200) {
    //         window.open(data.data);
    //     }
    // });
    // let [dueAmount, setDueAmount] = useState(0);
    // let [overDue, setOverDue] = useState(0);

    // console.log(" Due : " + dueAmount);

    // if(outstandingdata["CreditTime"] < diff)
    //  let dueAmount = parseFloat(days30) + parseFloat(days60) + parseFloat(month3) + parseFloat(month6) + parseFloat(year1) + parseFloat(greater1year)
    // let overDue = parseFloat(days60) + parseFloat(month3) + parseFloat(month6) + parseFloat(year1) + parseFloat(greater1year);
    // console.log(" Over Due : " + overDue);

    let newDate = moment(new Date()).format("DD MMM YY");
    let msubjct = Buffer.from(
      `Magod Laser Payment Balance Statement ${newDate}`
    ).toString("base64");
    let mbody = Buffer.from(
      `Dear Sir,\n

        The details of outstanding invoice that are overdue for payment as of date is attached. Total out standing amount as per our records is Rs. ${indtotaldues} /- and total amount over due for payment is Rs. ${indtotaloverdues} /-. We request you to release the payment that is due at the earliest. 

        Looking forward to receiving payment at the earliest. We assure you best of service in quality and timely delivery
        
        
        With warm regards\n
        
        Yours Sincerely\n
        
        Magod Laser Machining Pvt Ltd :\n
        Unit: Jigani`
    ).toString("base64");
    console.log(mbody);
    // Content Changing option
    window.open(`/mailer?mlbody=${mbody}&mlsubjct=${msubjct}`, "_blank");
    // navigate(`/mailer?mlbody=${mbody}&mlsubjct=${msubjct}`);
    setAlertModal(false);
  };

  async function createmail() {
    setShowOutStandReport(true);
    //    setPaymentandReceipts(false);

    setAlertModal(true);
  }

  let custselector = (id, outstanding) => {

    setSelectedCustomerId(id);
    setSelectedCustomer(outstanding);
    setCustCode(outstanding["Cust_Code"]);
    // setIndTotalDues(outstanding["TotalDues"]);
    postRequest(
      endpoints.individualCustomer,
      {
        custcode: outstanding["Cust_Code"],
      },
      async (resp) => {
        //console.log(resp);
        //  console.log("Individual Customer outstanding : " + resp[0]["Inv_Date"]);
        if ((resp.length === 0)) { //} && (resp[0]["Inv_Date"] === null)) {
          //  alert("No Data Found");
          setOutstandings(false);
          setOutstandingInvDetsdata([]);
          return;
        }
        setCrDays(resp[0]["credittime"]);
        setOutstandingInvDetsdata(resp);
        setOSData(resp);
        let indTotalOD = 0;
        let indTotalPend = 0;
        for (let i = 0; i < resp.length; i++) {
          if (resp[0]["credittime"] < resp[i]["DueDays"]) {
            indTotalOD += parseFloat(resp[i]["Due"]);
            indTotalPend += parseFloat(resp[i]["Due"]);
          } else {
            indTotalPend += parseFloat(resp[i]["Due"]);
          }
        }
        setIndTotalOverDues(indTotalOD);
        setIndTotalDues(indTotalPend);
      }
    );
  };


  const [sortConfigOsInvDets, setsortConfigOsInvDets] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortOsInvDets = (key) => {
    let direction = "asc";
    if (sortConfigOsInvDets.key === key && sortConfigOsInvDets.direction === "asc") {
      direction = "desc";
    }
    setsortConfigOsInvDets({ key, direction });
  };

  const sortedDataOsInvDets = () => {
    const dataCopyOsInvDets = [...outstandinginvdetsdata];

    if (sortConfigOsInvDets.key) {
      dataCopyOsInvDets.sort((a, b) => {
        let valueA = a[sortConfigOsInvDets.key];
        let valueB = b[sortConfigOsInvDets.key];

        // Convert only for the "integer" columns
        if (
          // sortConfigOsInvDets.key === "Inv_No" ||
          sortConfigOsInvDets.key === "Inv_Date" ||
          sortConfigOsInvDets.key === "GrandTotal" ||
          sortConfigOsInvDets.key === "PymtAmtRecd" ||
          sortConfigOsInvDets.key === "Due" ||
          sortConfigOsInvDets.key === "DueDays" 
        //  sortConfigOsInvDets.key === "DueAmtAbv365"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigOsInvDets.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigOsInvDets.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyOsInvDets;
  };

  let rendertable = (outstanding, id) => {
    return (
      <tr
        // className="custtr"
        style={{
          backgroundColor: selectedCustomerId === id ? "#5d88fc" : "#f7b983",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          custselector(id, outstanding);
        }}
      >
        {/* <td className="custtd">{outstanding["Cust_Code"]}</td> */}
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "blue",
            color: "white",
          }}
        >
          {outstanding["Cust_Name"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "white",
            color: selectedCustomerId === id ? "white" : "black",
          }}
        >
          {outstanding["TotalDues"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "Green",
            color: "white",
          }}
        >
          {outstanding["DueAmt30"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor:
              selectedCustomerId === id ? "#98A8F8" : "YellowGreen",
            color: "white",
          }}
        >
          {outstanding["DueAmt60"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor:
              selectedCustomerId === id ? "#98A8F8" : "LightGreen",
            color: "white",
          }}
        >
          {outstanding["DueAmt90"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "Orange",
            color: selectedCustomerId === id ? "white" : "black",
          }}
        >
          {outstanding["DueAmt180"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor:
              selectedCustomerId === id ? "#98A8F8" : "OrangeRed",
            color: "white",
          }}
        >
          {outstanding["DueAmt365"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "Red",
            color: "white",
          }}
        >
          {outstanding["DueAmtAbv365"]}
        </td>
      </tr>
    );
  };

  let dateconv = (da) => {
    let cdate = new Date(da);
    return (
      cdate.getDay().toString().padStart(2, "0") +
      "/" +
      (cdate.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      cdate.getFullYear()
    );
  };

  let rendertblosinv = (outstandinginv) => {
    let bgcolor = "";
    outstandinginv["DueDays"] <= 30 ? (bgcolor = "Green") :
      (outstandinginv["DueDays"] > 30 && outstandinginv["DueDays"] <= 60) ? (bgcolor = "YellowGreen") :
        (outstandinginv["DueDays"] > 60 && outstandinginv["DueDays"] <= 90) ? (bgcolor = "LightGreen") :
          (outstandinginv["DueDays"] > 90 && outstandinginv["DueDays"] <= 180) ? (bgcolor = "Orange") :
            (outstandinginv["DueDays"] > 180 && outstandinginv["DueDays"] <= 360) ? (bgcolor = "OrangeRed") : (bgcolor = "Red");


    //if (outstandinginv["DueDays"] <= 30) {
    return (
      <tr
        style={{
          backgroundColor: bgcolor,
          color: "white",
          borderColor: "black",
          border: "1px",
          borderStyle: "solid",
        }}
      >
        <td

          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          {outstandinginv["Inv_No"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
            textAlign: "center",
          }}
        >
          {(outstandinginv["Inv_Date"])}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
            textAlign: "center",
          }}
        >
          {outstandinginv["GrandTotal"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
            textAlign: "center",
          }}
        >
          {outstandinginv["PymtAmtRecd"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
            textAlign: "center",
          }}
        >
          {outstandinginv["Due"]}
        </td>
        {/* <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px', border: '1px', borderStyle: 'solid' }}>{outstandinginv["GRNNo"]}</td> */}
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          {outstandinginv["DueDays"]}
        </td>
        <td
          className="custtd"
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          {outstandinginv["PO_No"]}
        </td>
      </tr>
    );
  };

  let printreport = () => {

    // let printarea = document.getElementById("outstandinginvreport").innerHTML;
    // let w = window.open();
    // w.document.write(printarea);
    // let wtable = w.document.getElementsByClassName("custtable")[0];
    // let wtablebody = w.document.getElementById("custtablebody");
    // wtable.style.width = "100%";
    // wtablebody.style.width = "100%";
    // w.print();

    console.log("OS Data : " + OSData.length);
    if (OSData.length > 0) {
      setOSPrintModal(true);
    };

  };

  let printXLreport = () => {

    console.log("OS Data : " , JSON.stringify(OSData));
    if (OSData.length > 0) {
      const columns = ['Inv_No', 'Inv_Date', 'GrandTotal', 'PymtAmtRecd', 'Due', 'DueDays', 'PO_No'];
      let filName = "OutStandingReport_" + selectedCustomer["Cust_Name"] + "_" + moment(new Date()).format("DDMMYYYY");
      exportToExcel(OSData, columns, filName);
    };
  };

  const exportToExcel = (data, columns, filName) => {
    const filteredData = data.map(row => {
      const filteredRow = {};
      columns.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
        }
      });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filName}.xlsx`);
  };


  // Outstanding Invoices
  const [sortConfigOstDets, setsortConfigOstDets] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortOstDets = (key) => {
    let direction = "asc";
    if (sortConfigOstDets.key === key && sortConfigOstDets.direction === "asc") {
      direction = "desc";
    }
    setsortConfigOstDets({ key, direction });
  };

  const sortedDataOstDets = () => {
    const dataCopyOstDets = [...outstandingdata];

    if (sortConfigOstDets.key) {
      dataCopyOstDets.sort((a, b) => {
        let valueA = a[sortConfigOstDets.key];
        let valueB = b[sortConfigOstDets.key];

        // Convert only for the "integer" columns
        if (
          sortConfigOstDets.key === "TotalDues" ||
          sortConfigOstDets.key === "DueAmt30" ||
          sortConfigOstDets.key === "DueAmt60" ||
          sortConfigOstDets.key === "DueAmt90" ||
          sortConfigOstDets.key === "DueAmt180" ||
          sortConfigOstDets.key === "DueAmt365" ||
          sortConfigOstDets.key === "DueAmtAbv365"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigOstDets.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigOstDets.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyOstDets;
  };


  return (
    <div>
      {/* <BreadcrumbsComponent /> */}
      <h4 className="title ">Outstanding Summary</h4>

      <div className="form-style">
        <div className="secondary-container mb-1">
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">30 Days</span>
                <span className="outstanding-sum-value day30">{days30.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">60 Days</span>
                <span className="outstanding-sum-value day60">{days60.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">3 Months</span>
                <span className="outstanding-sum-value day90">{month3.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">6 Months</span>
                <span className="outstanding-sum-value day120">{month6.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">1 Year</span>
                <span className="outstanding-sum-value day365">{year1.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title"> &gt;1 Year</span>
                <span className="outstanding-sum-value years">
                  {greater1year.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <CustomerInfoTable /> */}
        <div style={{ height: "280px", overflowY: "scroll" }}>
          <Table striped className="table-data border ">
            <thead className="tableHeaderBGColor">
              <tr style={{ textAlign: "center" }}>
                <th onClick={() => { requestSortOstDets("Cust_Name") }}>Customer</th>
                <th onClick={() => { requestSortOstDets("TotalDues") }}>Total Dues</th>
                <th onClick={() => { requestSortOstDets("DueAmt30") }}>30 Days</th>
                <th onClick={() => { requestSortOstDets("DueAmt60") }}>60 Days</th>
                <th onClick={() => { requestSortOstDets("DueAmt90") }}>3 Months</th>
                <th onClick={() => { requestSortOstDets("DueAmt180") }}>6 Months</th>
                <th onClick={() => { requestSortOstDets("DueAmt365") }}>1 Year</th>
                <th onClick={() => { requestSortOstDets("DueAmtAbv365") }}>&gt;1 Year</th>
                {/* "Total Dues",
                    "30 Days",
                    "60 Days",
                    "3 Months",
                    "6 Months",
                    "1 Year",
                    ">1 Year",
                  ].map((h) => {
                    return (
                      <th
                        className="custth "
                      //   style={{ fontFamily: "Roboto", fontSize: "12px" }}
                      >
                        {h}
                      </th>
                    );
                  })} */}
              </tr>
            </thead>
            <tbody>
              {/* {outstandingdata != null
                ? outstandingdata.map((outstanding, id) =>
                  rendertable(outstanding, id)
                )
                : ""} */}
              {sortedDataOstDets().map((outstanding, id) =>
                rendertable(outstanding, id)
              )}
            </tbody>
          </Table>
        </div>
        {/* <Row className='mt-2 mb-3' id="outstandinginvreport"> */}
        <div className="mt-2" style={{ textAlign: "center" }}>
          <labele className="Out-standing-inv">Oustanding Invoices</labele>
        </div>

        <div className="row mb-2 justify-content-end">
          <div className="col-md-9"></div>
          <div className="col-md-3">
            <button
              className="button-style"
              onClick={() => {
                printreport();
              }}
            >
              Print Report
            </button>

            <button
              className="button-style"
              onClick={() => {
                printXLreport();
              }}
            >
              To Excel
            </button>

            <button
              className="button-style"
              onClick={() => {
                createmail();
              }}
            >
              Create Mail
            </button>
            <button
              className="button-style"
              onClick={() => {
                navigate("/customer");
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div style={{ height: '400px', overflowY: "scroll" }}>
          {" "}
          {showOutStandReportState ? (
            <div id="outstandinginvreport">
              <table responsive striped bordered style={{ width: "100%" }}>
                <thead className="tablebody">
                  <tr className=" mt-1">
                    <td rowspan="2" style={{ width: "44px" }}>
                      <img
                        style={{
                          width: "36px",
                          height: "54px",
                          // marginLeft: "35px",
                        }}
                        className="logo"
                        src={CmpLogo}
                      />
                    </td>
                    <td colSpan="8">
                      <h6>
                        <b>{unitdata[0]?.RegisteredName}</b>
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="8">
                      {unitdata[0]?.Unit_Address}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td colSpan="8">
                      <h6>
                        Outstanding Invoices Report for{" "}
                        {selectedCustomer["Cust_Name"]}
                      </h6>
                    </td>
                  </tr>

                  <tr className="tableHeaderBGColor" style={{ textAlign: "center" }}>
                  
                    <th onClick={() => { requestSortOsInvDets("Inv_No") }}>Inv No</th>
                    <th onClick={() => { requestSortOsInvDets("Inv_Date") }}>Inv Date</th>
                    <th onClick={() => { requestSortOsInvDets("GrandTotal") }}>Amount</th>
                    <th onClick={() => { requestSortOsInvDets("PymtAmtRecd") }}>Received</th>
                    <th onClick={() => { requestSortOsInvDets("Due") }}>Balance</th>
                    <th onClick={() => { requestSortOsInvDets("DueDays") }}>DueDays</th>
                    <th onClick={() => { requestSortOsInvDets("PO_No") }}>PO No</th>
                  </tr>


                  {/* <tr
                    style={{
                      border: "1px",
                      borderStyle: "solid",
                    }}
                  >
                    {[
                      "Inv No",
                      "Inv Date",
                      "Amount",
                      "Received",
                      "Balance",
                      "DueDays",
                      "PO No",
                    ].map((h) => {
                      return (
                        <th
                          style={{
                            border: "1px",
                            borderStyle: "solid",
                          }}
                        >
                          {h}
                        </th>
                      );
                    })}
                  </tr> */}
                </thead>
                <tbody id="custtablebody" className="tablebody">
                  {/* {outstandinginvdetsdata != null
                    ? outstandinginvdetsdata.map((outstandinginv) =>
                      rendertblosinv(outstandinginv)
                    )
                    : ""} */}

                  {sortedDataOsInvDets().map((outstandinginv, id) =>
                    rendertblosinv(outstandinginv, id)
                  )}
                  {selectedCustomer == "" ? (
                    <tr style={{ borderWidth: "1px", borderColor: "black" }}>
                      <td
                        style={{
                          textAlign: "center",
                          fontSize: "16px",
                          fontWeight: "800",
                          border: "1px",
                          borderStyle: "solid",
                        }}
                        colSpan={8}
                      >
                        No Customer Selected
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {selectedCustomer != "" &&
                    outstandinginvdetsdata.length == 0 ? (
                    <tr borderWidth="1px" borderColor="black">
                      <td
                        className="custtd"
                        style={{
                          textAlign: "center",
                          fontSize: "16px",
                          fontWeight: "800",
                          border: "1px",
                          borderStyle: "solid",
                        }}
                        colSpan={8}
                      >
                        No Data Found for {selectedCustomer["Cust_Name"]}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>

        {/*</Container > */}

        <AlertModal
          show={alertModal}
          onHide={(e) => setAlertModal(e)}
          firstbutton={fstbtnc}
          secondbutton={secbtnc}
          title="Alert !"
          message="Do you wish to Send a Copy through E-Mail ?"
          firstbuttontext="Yes"
          secondbuttontext="No"
        />
        <div>
          <div>
            <ModalPrintOSReport openOSPrintModal={openOSPrintModal} OSData={OSData} UnitData={unitdata} CName={selectedCustomer["Cust_Name"]} handleClose={setOSPrintModal} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Commercial;
