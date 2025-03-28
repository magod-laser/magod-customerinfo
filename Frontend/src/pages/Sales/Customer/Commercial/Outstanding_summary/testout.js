import CustomerInfoTable from "./Components/CustomerInfoTable";
import CustomerInvoicesTable from "./Components/CustomerInvoicesTable";
import "../../Css/Commerical.css";
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
import moment from "moment";
// import CmpLogo from "../../../images/ML-LOGO.png";
import AlertModal from "../../../../../pages/components/alert";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function Commercial() {
  let navigate = useNavigate();
  let [alertModal, setAlertModal] = useState(false);
  let [firstbuttontext, setFirstbuttontext] = useState("");
  let [secondbuttontext, setSecondbuttontext] = useState("");

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
        console.log(resp);
        console.log("Individual Customer outstanding : " + resp[0]["Inv_Date"]);
        if (resp.length > 0) {
          setCrDays(resp[0]["credittime"]);
          setOutstandingInvDetsdata(resp);
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
      }
    );
  };

  let rendertable = (outstanding, id) => {
    return (
      <tr
        className="custtr"
        style={{
          // backgroundColor: selectedCustomerId === id ? "#5d88fc" : "#f7b983",
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
            textAlign: "right",
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
            textAlign: "right",
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
            textAlign: "right",
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
            textAlign: "right",
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
            textAlign: "right",
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
            textAlign: "right",
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
            textAlign: "right",
            backgroundColor: selectedCustomerId === id ? "#98A8F8" : "Red",
            color: "white",
          }}
        >
          {outstanding["DueAmtAbv365"]}
        </td>
      </tr>
    );
  };

  let rendertblosinv = (outstandinginv) => {
    console.log(outstandinginv["DueDays"]);
    if (outstandinginv["DueDays"] <= 30) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "Green",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    } else if (
      outstandinginv["DueDays"] > 30 &&
      outstandinginv["DueDays"] <= 60
    ) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "YellowGreen",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    } else if (
      outstandinginv["DueDays"] > 60 &&
      outstandinginv["DueDays"] <= 90
    ) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "LightGreen",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    } else if (
      outstandinginv["DueDays"] > 90 &&
      outstandinginv["DueDays"] <= 180
    ) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "Orange",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    } else if (
      outstandinginv["DueDays"] > 180 &&
      outstandinginv["DueDays"] <= 360
    ) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "OrangeRed",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    } else if (outstandinginv["DueDays"] > 365) {
      return (
        <tr
          className="custtr"
          style={{
            backgroundColor: "Red",
            color: "black",
            borderColor: "black",
            border: "1px",
            borderStyle: "solid",
          }}
        >
          <td
            className="custtd"
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
              textAlign: "right",
            }}
          >
            {moment(outstandinginv["Inv_Date"]).format("DD/MM/YYYY")}
          </td>
          <td
            className="custtd"
            style={{
              fontFamily: "Roboto",
              fontSize: "12px",
              border: "1px",
              borderStyle: "solid",
              textAlign: "right",
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
              textAlign: "right",
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
              textAlign: "right",
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
    }
  };

  let printreport = () => {
    // console.log("...", document.getElementById("outstandinginvreport"));
    let printarea = document.getElementById("outstandinginvreport").innerHTML;
    let w = window.open();
    w.document.write(printarea);
    let wtable = w.document.getElementsByClassName("custtable")[0];
    let wtablebody = w.document.getElementById("custtablebody");
    wtable.style.width = "100%";
    wtablebody.style.width = "100%";
    w.print();
    // w.close();
  };
  return (
    <div className="commercial-container">
      <div className="outstanding-sum-container mb-3">
        <h4 className="title">Outstanding Summary</h4>
        <div className="secondary-container">
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title ">30 Days</span>
                <span className="outstanding-sum-value day30">{days30}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">60 Days</span>
                <span className="outstanding-sum-value day60">{days60}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">3 Months</span>
                <span className="outstanding-sum-value day90">{month3}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">6 Months</span>
                <span className="outstanding-sum-value day120">{month6}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title">1 Year</span>
                <span className="outstanding-sum-value day365">{year1}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="box-container d-md-flex justify-content-md-end">
                <span className="outstanding-sum-title"> &gt;1 Year</span>
                <span className="outstanding-sum-value years">
                  {greater1year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <>
        {/* <CustomerInfoTable /> */}
        <div style={{ height: "280px", overflowY: "scroll" }}>
          <Table striped className="table-data border ">
            <thead className="tableHeaderBGColor">
              <tr style={{ textAlign: "center" }}>
                {[
                  "Customer",
                  "Total Dues",
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
                })}
              </tr>
            </thead>
            <tbody>
              {outstandingdata != null
                ? outstandingdata.map((outstanding, id) =>
                  rendertable(outstanding, id)
                )
                : ""}
            </tbody>
          </Table>
        </div>

        {/* <CustomerInvoicesTable /> */}
        <div className="mt-4">
          <div className="outstanding-sum-container">
            <h4 className="title">Outstanding Invoices</h4>
            <div style={{ paddingLeft: "720px" }}>
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
            <div className=" d-sm-flex flex-sm-column align-items-sm-center d-md-flex flex-md-row  align-items-md-start info ">
              <img
                className="m-logo"
                style={{
                  width: "50px",
                  height: "55px",
                  marginTop: "10px",
                  paddingLeft: "15px",
                }}
                src={require("../../../../../../src/ML-LOGO.png")}
              />
              <div className="address mt-2 p-0-md">
                <h5>Magod Laser Machining Pvt. Ltd.</h5>
                <div className="address-sub">
                  <div className="row">
                    <div className="col-sm-12">
                      <p>
                        {" "}
                        72. KIADB Industrial Area, Phase II Jigani, Anekal
                        Taluk, Bangalore -560106 <br />
                        Outstanding Invoices Report for ANDRITZ HYDRO PRIVATE
                        LIMITED
                      </p>
                    </div>
                  </div>
                </div>
                <>
                  <h6>
                    Outstanding Invoices Report for{" "}
                    {selectedCustomer["Cust_Name"]}
                  </h6>
                </>
              </div>
            </div>

            <Table responsive striped bordered>
              <thead>
                <tr>
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
                        className="custth "
                        style={{
                          //   fontFamily: "Roboto",
                          //   fontSize: "12px",
                          border: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="tbody">
                {outstandinginvdetsdata != null
                  ? outstandinginvdetsdata.map((outstandinginv) =>
                    rendertblosinv(outstandinginv)
                  )
                  : ""}
                {selectedCustomer == "" ? (
                  <tr
                    className="custtr"
                    style={{ borderWidth: "1px", borderColor: "black" }}
                  >
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
            </Table>
          </div>
        </div>
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
      </>
    </div>
  );
}

export default Commercial;
