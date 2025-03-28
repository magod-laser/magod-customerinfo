import React, { useState, useEffect, useRef } from "react";
import { Form, Table, Col, FormLabel, Tabs, Tab } from "react-bootstrap";
import moment from "moment";
import CmpLogo from "../../../../../images/MagodLogo.png";
import * as XLSX from 'xlsx';
//import CmpLogo from "../../../../../images/MagodLogo.png";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../../../../pages/components/alert";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import ModalPrintDueReport from "../Invoices_and_payments/Printing/PrintDues";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");



function Custinvandpayments() {
 
  let navigate = useNavigate();
  const isFirstClickRef = useRef(true);
  let [alertModal, setAlertModal] = useState(false);
 
  let [custdata, setCustdata] = useState("");
  let [custcode, setCustCode] = useState("");
  let [custname, setCustName] = useState("");
  let [dueAmount, setDueAmount] = useState(0);
  let [overDue, setOverDue] = useState(0);
  let [unitdata, setUnitdata] = useState([]);
 
  let [dlinvformdata, setDLInvFormdata] = useState([]);
  let [duelistdata, setDueListdata] = useState([]);
  let [overduelistdata, setOverDueListdata] = useState([]);
  let [pprduelistdata, setPPRDueListdata] = useState([]);
  let [dlinvformtaxdetsdata, setDLInvFormTaxDetsdata] = useState([]);
  let [dueAgeingdata, setDueAgeingdata] = useState([]);
  let [receiptsdata, setReceiptsdata] = useState([]);
  let [receiptdetsdata, setReceiptDetsdata] = useState([]);
  let [selectedInvoiceId, setSelectedInvoiceId] = useState(false);
  let [selectedInvoice, setSelectedInvoice] = useState(null);
  let [selectedReceiptId, setSelectedReceiptId] = useState(false);
  let [selectedReceipt, setSelectedReceipt] = useState(null);
  let [paymentandReceipts, setPaymentandReceipts] = useState(true);
  let [showInvoiceState, setShowInvoice] = useState(false);
  let [showDueReportState, setShowDueReport] = useState(false);
  let [selectedCustomer, setSelectedCustomer] = useState("");
  let [duereportdata, setDueReportData] = useState([]);
  let [duesamount, setDuesAmount] = useState("");
  let [openDueReportPrintModal, setDueReportPrintModal] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Invoice details
  let [invtype, setInvType] = useState("");
  let [dcinvno, setDCInvNo] = useState("");
  let [invdate, setInvDate] = useState("");
  let [pnno, setPNNO] = useState("");
  let [recpvid, setRecdPVID] = useState("");
  let [crdays, setCrDays] = useState(0);
  let [selectedODInvoiceId, setSelectedODInvoiceId] = useState(0);
  let [selectedODInvoice, setSelectedODInvoice] = useState(null);

  useEffect(() => {
    async function fetchCustData() {
      postRequest(endpoints.getCustomers, {}, (data) => {
        //COMMENTED BCZ NEW DROPDOWN HAVE RETAINE ISSUE

        // for (let i = 0; i < data.length; i++) {
        //   data[i].label = data[i].Cust_name;
        // }
        setCustdata(data);
      });

      postRequest(endpoints.getUnits, {}, (unitdata) => {
        console.log(unitdata);
        setUnitdata(unitdata);
      });

      // postRequest( endpoints.getPaymentTerms, {crterms: custdata.CreditTerms}, (crdaysdata) => {
      //   setCrDays(crdaysdata.CreditDays);
      // })
    }
    fetchCustData();
  }, []);


  let selectCust = async (selected) => {
    console.log("Customer Selected : ",selected[0].CreditTerms);
    if (selected.length === 0 || selected[0].cust_name === '') { 
      setIsButtonEnabled(false); 
      setOverDue(0);
      setDueAmount(0);
      setDuesAmount(0);
      setDueListdata([]);
      setDueReportData([]);
      setOverDueListdata([]);
      setPPRDueListdata([]);
      setDueAgeingdata([]);
      setReceiptsdata([]);
      return; 
    } else { 
      setIsButtonEnabled(true); 
    }

    setCustName(selected[0].Cust_name);
    if (selected.length > 0) {
      const cust = custdata.find(
        (custItem) => custItem.Cust_Code === selected[0].Cust_Code
      );
let creditdys =0;
      if (cust) {
        setCustName(cust.Cust_name);
        setCustCode(cust.Cust_Code);
        setCrDays(cust.CreditDays);
creditdys = cust.CreditDays;
  //     console.log("credit says : ",cust); //.CreditDays);

      //   await postRequest( endpoints.getPaymentTerms, {crterms: cust.CreditTerms}, (crdaysdata) => {
      //     console.log("Credit Days : ", crdaysdata.CreditDays);
      //     setCrDays(crdaysdata.CreditDays);
      //   })
   
        // API calls
        await postRequest(
          endpoints.getCustDues,
          { custcode: cust.Cust_Code, crdays: creditdys },
          (duedata) => {
            console.log("DueData: ",duedata)
            console.log("Due Amounnt: ",duedata[0].dueAmount)
            setDueAmount(duedata[0].dueamount);
            setDuesAmount(duedata[0].dueAmount);
          }
        );

        await postRequest(
          endpoints.getCustOverdues,
          { custcode: cust.Cust_Code, crdays: creditdys },
          (oddata) => {
            console.log("Over Due Data: ",oddata)
            console.log("Over Due Amounnt: ",oddata[0].OverDue)
            setOverDue(oddata[0].OverDue);
            //setDueAmount(oddata[0]["dueAmount"]);
            setDuesAmount(oddata[0]["dueAmount"]);
          }       );

        await postRequest(
          endpoints.dueListCustomer,
          { custcode: cust.Cust_Code, crdays: creditdys}, //CreditTime },
          (data) => {
            setDueListdata(data);
            setDueReportData(data);
          }
        );

        await postRequest(
          endpoints.overdueListCustomer,
          { custcode: cust.Cust_Code, crdays: creditdys}, // crdays: cust.CreditTime },
          (data) => {
            console.log("over due list data: ",data);
            setOverDueListdata(data);
          }
        );

        await postRequest(
          endpoints.pprDueListCustomer,
          { custcode: cust.Cust_Code },
          (pprdata) => {
            console.log("ppr Data:",pprdata);
            setPPRDueListdata(pprdata);
          }
        );

        await postRequest(
          endpoints.dueSummaryCustomer,
          { custcode: cust.Cust_Code },
          (data) => {
            setDueAgeingdata(data);
          }
        );

        await postRequest(
          endpoints.receiptsinfoCustomer,
          { custcode: cust.Cust_Code },
          (data) => {
            setReceiptsdata(data);
          }
        );
      }
    }
  };

  let closeShowInvoice = (e) => {
    e.preventDefault();
    setShowInvoice(false);
    showPaymentandReceipts(true);
  }

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

  let invselector = (id, duelist) => {

    console.log("duelist Data id : ",id);
    
    console.log("duelist Data: ",duelist);

    setSelectedInvoiceId(id);
    setSelectedInvoice(duelist);
    setDCInvNo(duelist["DC_Inv_No"]);
    postRequest(
      endpoints.dLInvFormCustomer,
      { dcinvno: duelist["DC_Inv_No"] },
      (data) => {
        console.log(data);
        setDLInvFormdata(data);
      }
    );
    postRequest(
      endpoints.dLInvFormTaxDetsCustomer,
      { dcinvno: duelist["DC_Inv_No"] },
      (data) => {
        console.log(data);
        setDLInvFormTaxDetsdata(data);
      }
    );
  };

  let invodselector = (id, odduelist) => {
    setSelectedODInvoiceId(id);
    setSelectedODInvoice(odduelist);
    setDCInvNo(odduelist["DC_Inv_No"]);
    postRequest(
      endpoints.dLInvFormCustomer,
      { dcinvno: odduelist["DC_Inv_No"] },
      (data) => {
        console.log(data);
        setDLInvFormdata(data);
      }
    );
    postRequest(
      endpoints.dLInvFormTaxDetsCustomer,
      { dcinvno: odduelist["DC_Inv_No"] },
      (data) => {
        console.log(data);
        setDLInvFormTaxDetsdata(data);
      }
    );
  };

  async function printDueReport() {
    // let printContents = document.getElementById("showduereport").innerHTML;
    // let newWindow = window.open(
    //   "",
    //   "Due List",
    //   "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=700"
    // );
    // newWindow.document.body.innerHTML = printContents;
    // window.print();

    if (duereportdata.length > 0) {
      setDueReportPrintModal(true);
    };

  }

  async function printXLDueReport() {
      if (duereportdata.length > 0) {
      const columns =['DC_InvType','DC_No','Inv_No','DespatchDate','PO_NO','GrandTotal','PymtAmtRecd','Balance','PaymentDate','DueDays'];
      let filName = "DueReport_" + duereportdata[0].Cust_Code + "_" + moment(new Date()).format("DDMMYYYY");
     exportToExcel(duereportdata, columns, filName);
    };
  }

  const exportToExcel= (data, columns, filName) => {
    const processedData = preprocessedData(data);
    const filtereddata = processedData.map(row => {
      const filteredRow = {};
      columns.forEach(column => {
        if(row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
        }
      });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filtereddata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filName}.xlsx`);
  };

  const preprocessedData = (data) => {
    return data.map(row => ({
      ...row,
      Balance: (row["GrandTotal"] - row["PymtAmtRecd"]).toFixed(2),
      PaymentDate: moment(row["DespatchDate"]).add(crdays,"days").format("DD/MM/YYYY"),
      DueDays:row["DueDays"]
    }));
  };

  async function showDueReport() {
    printDueReport();
    //  setShowDueReport(true);
    setPaymentandReceipts(false);
  }
  async function close() {
    
      navigate("/customer");
     
    
  }


  async function closeDueReport() {
    setShowInvoice(false);
    setShowDueReport(false);
    setPaymentandReceipts(true);
    if (custname === '') { 
      setIsButtonEnabled(false); 
      setAlertModal(false);
      // navigate("/customer");
      return; 
    } else { 
      setIsButtonEnabled(true); 
      setAlertModal(true);
    }
    
  }

  let secbtnc = () => {
    setAlertModal(false);
    // navigate("/customer");
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

    console.log(" Due : " + dueAmount);
    console.log(" Over Due : " + overDue);

    let newDate = moment(new Date()).format("DD MMM YY");
    let msubjct = Buffer.from(
      `Magod Laser List of Invoices Due for Payment as on ${newDate}`
    ).toString("base64");
    let mbody = Buffer.from(
      `Dear Sir,\n

        The details of outstanding invoice that are overdue for payment as of date is attached. Total out standing amount as per our records is Rs/- ${dueAmount} and total amount over due for payment is Rs/- ${overDue}.\n
        We request you to release the payment that is due at the earliest. \n
        
        Looking forward to receiving payment at the earliest. We assure you best of service in quality and timely delivery\n
        
        With warm regards\n
        
        Yours Sincerely\n
        
        Magod Laser Machining Pvt Ltd :\n
        Unit: Jigani`
    ).toString("base64");
    console.log(mbody);
    // Content Changing option
    window.open(`/mailer?mlbody=${mbody}&mlsubjct=${msubjct}`, "_blank");
    setAlertModal(false);
  };

  let recselector = (id, receiptdets) => {
    setSelectedReceiptId(id);
    setSelectedReceipt(receiptdets);
    setRecdPVID(receiptdets["RecdPVID"]);
    postRequest(
      endpoints.receiptDetsCustomer,
      { recdpvid: receiptdets["RecdPVID"] },
      (data) => {
        console.log(data);
        setReceiptDetsdata(data);
      }
    );
    // receiptDetsCustomer({
    //     recdpvid: receiptdets["RecdPVID"],
    // }, async (resp) => {
    //     console.log(resp)
    //     setReceiptDetsdata(resp)
    // })
  };

  let rendertable = (duelist, id, grdtype) => {

    const bgcolor = selectedInvoiceId === id ? "#98A8F8" :
      duelist["DueDays"] <= 30 ? "Green" : (duelist["DueDays"] > 30 && duelist["DueDays"] <= 60) ? "YellowGreen" :
        (duelist["DueDays"] > 60 && duelist["DueDays"] <= 90) ? "LightGreen" :
          (duelist["DueDays"] > 90 && duelist["DueDays"] <= 180) ? "OrangeRed" : "Red";
        //  let crdays = 60;
        console.log("moment(duelist[Inv_Date]).format(DD/MM/YYYY)",duelist["Inv_Date"])
    return (
      <tr
        // className="custtr"
        style={{
          backgroundColor: bgcolor, color: "white"
        }}
        id={id}
        onClick={() => {
          invselector(id, duelist);
        }}
      >
        <td className="">{duelist.DC_InvType}</td>
        <td className="">{duelist["DC_No"]}</td>
        <td className="">{duelist["Inv_No"]}</td>
        {/* <td className="">{moment(duelist["Inv_Date"]).format("DD/MM/YYYY")}</td> */}
        <td className="">{duelist["Inv_Date"]}</td>
        <td className="">{duelist["PO_No"]}</td>
        <td style={{textAlign:"right"}}>{duelist["GrandTotal"]}</td>
        <td style={{textAlign:"right"}}>{duelist["PymtAmtRecd"]}</td>
        <td style={{textAlign:"right"}}>{(duelist["GrandTotal"] - duelist["PymtAmtRecd"]).toFixed(2)}</td>
        {/* <td className="" style={{textAlign:"right"}}>{moment(duelist["DespatchDate"]).add(crdays, "days").format("DD/MM/YYYY")}</td> */}
        <td className="" style={{textAlign:"right"}}>{duelist["PaymentDate"]}</td>
        {grdtype === "DUE" ? (
          <td className="" >{duelist["DueDays"]}</td>
        ) : (
          ""
        )}
      </tr>
    );
  };

  

  const [sortConfigOD, setSortConfigOD] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortOD = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDataOD = () => {
    const dataCopy = [...overduelistdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "integer" columns
        if (
          sortConfig.key === "DC_NO" ||
          sortConfig.key === "GrandTotal" ||
          sortConfig.key === "PymtAmtRecd" ||
          sortConfig.key === "DueDays"

        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };


  // Suresh Code 12112024
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...duelistdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "integer" columns
        if (
          sortConfig.key === "DC_NO" ||
          sortConfig.key === "GrandTotal" ||
          sortConfig.key === "PymtAmtRecd" ||
          sortConfig.key === "DueDays"

        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };
  // Suresh Code 12112024
  // Suresh Code 131124 for Rect Info tab 

  const [sortConfigR, setSortConfigR] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortRect = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigR.key === key && sortConfigR.direction === "asc") {
      direction = "desc";
    }
    setSortConfigR({ key, direction });
  };

  const sortedDataRect = () => {
    const dataCopyRect = [...receiptsdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfigR.key) {
      dataCopyRect.sort((a, b) => {
        let valueA = a[sortConfigR.key];
        let valueB = b[sortConfigR.key];

        // Convert only for the "integer" columns
        if (
          sortConfigR.key === "Recd_PVNo" ||
          sortConfigR.key === "Recd_PV_Date" ||
          sortConfigR.key === "Amount" ||
          sortConfigR.key === "On_account"

        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigR.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigR.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyRect;
  };

  // Suresh Code 131124 for Rect Info tab

  // Suresh Code 131124 for Rect Info Details Table

  const [sortConfigRD, setSortConfigRD] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortRectDet = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigRD.key === key && sortConfigRD.direction === "asc") {
      direction = "desc";
    }
    setSortConfigRD({ key, direction });
  };

  const sortedDataRectDet = () => {
    const dataCopyRectDet = [...receiptdetsdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfigRD.key) {
      dataCopyRectDet.sort((a, b) => {
        let valueA = a[sortConfigRD.key];
        let valueB = b[sortConfigRD.key];

        // Convert only for the "integer" columns
        if (
          sortConfigRD.key === "Inv_No" ||
          sortConfigRD.key === "Inv_date" ||
          sortConfigRD.key === "Inv_Amount" ||
          sortConfigRD.key === "Amt_received" ||
          sortConfigRD.key === "Receive_Now"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigRD.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigRD.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyRectDet;
  };

  // Suresh Code 131124 for Rect Info Details Table

  let rendertableod = (oduelist, id, grdtype) => {
    return (
      <tr
        // className="custtr"
        style={{
          backgroundColor: selectedODInvoiceId === id ? "#98A8F8" : "",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          invodselector(id, oduelist);
        }}
      >
        <td>{oduelist["DC_InvType"]}</td>
        <td>{oduelist["DC_No"]}</td>
        <td>{oduelist["Inv_No"]}</td>
        <td>{oduelist["Inv_Date"]}</td>
        <td>{oduelist["PO_No"]}</td>
        <td style={{textAlign:"right"}}>{oduelist["GrandTotal"]}</td>
        <td style={{textAlign:"right"}}>{oduelist["PymtAmtRecd"]}</td>
        <td style={{textAlign:"right"}}>{(oduelist["GrandTotal"] - oduelist["PymtAmtRecd"]).toFixed(2)}</td>
        <td style={{textAlign:"right"}}>
          {oduelist["PaymentDate"]}
        </td>
      </tr>
    );
  };

  let rendertblduerep = (duerepinv, id) => {
    return (
      <tr
      // className="custtr"
      // style={{ borderColor: "black", borderWidth: "1px", border: "1px" }}
      >
        <td className="" style={{ borderLeft: "1px" }}>
          {id + 1}
        </td>
        <td className="" style={{ borderLeft: "1px" }}>
          {duerepinv["Inv_No"]}
        </td>
        <td
          className=""
          style={{ borderLeft: "1px", fontFamily: "Roboto", fontSize: "12px" }}
        >
          {moment(duerepinv["DespatchDate"]).format("DD/MM/YYYY")}
        </td>
        <td
          className=""
          style={{ borderLeft: "1px", fontFamily: "Roboto", fontSize: "12px" }}
        >
          <b>{duerepinv["PO_No"]}</b>
        </td>
        <td
          className=""
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {duerepinv["GrandTotal"]}
        </td>
        <td
          className=""
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {duerepinv["PymtAmtRecd"]}
        </td>
        <td
          className=""
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {(duerepinv["GrandTotal"] - duerepinv["PymtAmtRecd"]).toFixed(2)}
        </td>
        <td className="" style={{ fontFamily: "Roboto", fontSize: "12px" }}>
          {moment(duerepinv["DespatchDate"])
            .add(crdays, "days")
            .format("DD/MM/YYYY")}
        </td>
        <td
          className=""
          style={{
            fontFamily: "Roboto",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {duerepinv["DueDays"]}
        </td>
      </tr>
    );
  };

  let rendertableppr = (pprduelist, id) => {
    console.log("pprduelistdata : ",pprduelist)
    return (
      <tr
        // className="custtr"
        style={{
          // backgroundColor: selectedInvoiceId === id ? "#5d88fc" : "",
          backgroundColor: selectedInvoiceId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          invselector(id, pprduelist);
        }}
      >
        <td className="">{pprduelist["DC_InvType"]}</td>
        <td className="">{pprduelist["DC_No"]}</td>
        <td className="">{pprduelist["Inv_No"]}</td>
        <td className="">
          {moment(pprduelist["DespatchDate"]).format("DD/MM/YYYY")}
        </td>
        <td className="">{pprduelist["PO_No"]}</td>
        <td className="" style={{textAlign:"right"}}>{pprduelist["GrandTotal"]}</td>
        <td  style={{textAlign:"right"}}>{pprduelist["PymtAmtRecd"]}</td>
        <td  style={{textAlign:"right"}}>
          {parseFloat(pprduelist["GrandTotal"] - pprduelist["PymtAmtRecd"]).toFixed(2)}
        </td>
        <td style={{textAlign:"right"}}>
          {moment(pprduelist["DespatchDate"])
            .add(crdays, "days")
            .format("DD/MM/YYYY")}
        </td>
      </tr>
    );
  };

 
  const [sortConfigPayRec, setSortConfigPayRec] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortPayRec = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigPayRec.key === key && sortConfigPayRec.direction === "asc") {
      direction = "desc";
    }
    setSortConfigPayRec({ key, direction });
  };

  const sortedDataPayRec = () => {
    const dataCopyPayRec = [...dlinvformdata]; 

    if (sortConfigPayRec.key) {
      dataCopyPayRec.sort((a, b) => {
        let valueA = a[sortConfigPayRec.key];
        let valueB = b[sortConfigPayRec.key];

        // Convert only for the "integer" columns
        if (
          sortConfigPayRec.key === "Qty" ||
          sortConfigPayRec.key === "Mtrl_rate" ||
          sortConfigPayRec.key === "JW_Rate" ||
          sortConfigPayRec.key === "DC_Srl_Amt" 
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigPayRec.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigPayRec.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyPayRec;
  };

  let rendertbldwg = (dldwgrec) => {
    return (
      <tr className="">
        <td>{dldwgrec["Dwg_No"]}</td>
        <td>{dldwgrec["Material"]}</td>
        <td>{dldwgrec["Qty"]}</td>
        <td>{dldwgrec["Mtrl_rate"]}</td>
        <td>{dldwgrec["JW_Rate"]}</td>
        <td>{dldwgrec["DC_Srl_Amt"]}</td>
      </tr>
    );
  };

  const [sortConfigTaxRec, setSortConfigTaxRec] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortTaxRec = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigTaxRec.key === key && sortConfigTaxRec.direction === "asc") {
      direction = "desc";
    }
    setSortConfigTaxRec({ key, direction });
  };

  const sortedDataTaxRec = () => {
    const dataCopyTaxRec = [...dlinvformtaxdetsdata]; 

    if (sortConfigTaxRec.key) {
      dataCopyTaxRec.sort((a, b) => {
        let valueA = a[sortConfigTaxRec.key];
        let valueB = b[sortConfigTaxRec.key];

        // Convert only for the "integer" columns
        if (
          sortConfigTaxRec.key === "TaxableAmount" ||
          sortConfigTaxRec.key === "TaxPercent" ||
          sortConfigTaxRec.key === "TaxAmt"  
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigTaxRec.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigTaxRec.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyTaxRec;
  };

  let rendertbltax = (dlinvtaxrec) => {
    return (
      <tr
        // className="custtr"
        style={{
          fontFamily: "Roboto",
          // borderWidth: "1px",
          // borderColor: "black",

          fontSize: "12px",
        }}
      >
        <td>{dlinvtaxrec["Tax_Name"]}</td>
        <td>{dlinvtaxrec["TaxableAmount"]}</td>
        <td>{dlinvtaxrec["TaxPercent"]}</td>
        <td>{dlinvtaxrec["TaxAmt"]}</td>
      </tr>
    );
  };

  let renderduessummtable = (dueAgeing) => {
    return (
      <tr
      // className="custtr"
      // style={{ borderWidth: "1px", borderColor: "black" }}
      >
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmt30"]}
        </td>
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmt60"]}
        </td>
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmt90"]}
        </td>
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmt180"]}
        </td>
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmt365"]}
        </td>
        <td
          className=""
        // style={{ fontFamily: "Roboto", fontSize: "12px", textAlign: "right" }}
        >
          {dueAgeing["DueAmtAbv365"]}
        </td>
      </tr>
    );
  };

  let rendertblrcpts = (receipts, id) => {
    return (
      <tr
        // className="custtr"
        style={{
          backgroundColor: selectedReceiptId === id ? "#98A8F8" : "",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          recselector(id, receipts);
        }}
      >
        <td className="">{receipts["Recd_PVNo"]}</td>
        <td className="">{moment(receipts["Recd_PV_Date"]).format("DD/MM/YYYY")}</td>
        <td>{receipts["TxnType"]}</td>
        <td className="" style={{textAlign:"right"}}>{receipts["Amount"]}</td>
        <td className="" style={{textAlign:"right"}}>{receipts["On_account"]}</td>
        <td className="">{receipts["Description"]}</td>
      </tr>
    );
  };
  let rendertblrcptdets = (receiptdets) => {
    return (
      <tr>
        <td>{receiptdets["Inv_No"]}</td>
        <td>{moment(receiptdets["Inv_date"]).format("DD/MM/YYYY")}</td>
        <td>{receiptdets["Inv_Type"]}</td>
        <td style={{textAlign:"right"}}>{receiptdets["Inv_Amount"]}</td>
        <td style={{textAlign:"right"}}>{receiptdets["Amt_received"]}</td>
        <td style={{textAlign:"right"}}>{receiptdets["Receive_Now"]}</td>
      </tr>
    );
  };

  async function showPaymentandReceipts(id) {

    setShowInvoice(false);
    setShowDueReport(false);
    setPaymentandReceipts(true);
  }

  async function showInvoice(id) {
    if (selectedInvoiceId == false && selectedInvoiceId != 0) {
      if (isFirstClickRef.current) {
        toast.error("Please Select an Invoice from Due List..");
        isFirstClickRef.current = false;
      }

      return;
    } else {
      setShowInvoice(true);
      setPaymentandReceipts(false);

    }
    // setSelectedReceiptId(id);
    // let invoicedets = await receiptDetsCustomer(id);
    // setReceiptDets(invoicedets);
  }

  return (
    <div>
      <h4 className="title">Customer Payment Receipt Info</h4>

      <div>
        {/* {paymentandReceipts ? ( */}
        <div style={{ display: paymentandReceipts ? "block" : 'none' }}>
          <div className="addquotecard" id="PaymentandReceipts">
            <div className="row">
              <div className="col-md-4 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">
                  Name
                  <span
                    style={{
                      color: "#f20707",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    *
                  </span>{" "}
                </label>

                {custdata.length > 0 ? (
                  <Typeahead
                    className="ip-select"
                    id="custname"
                    labelKey="Cust_name"
                    //  selected={customerNames}
                    value={custname}
                    onChange={selectCust}
                    options={custdata}
                    placeholder="Choose a Customer..."
                  ></Typeahead>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-2" style={{ marginRight: "2rem" }}>
                <div className="d-flex" style={{ gap: "20px" }}>
                  <label className="form-label mt-1">Code</label>
                  <span
                    className="outstanding-sum-value"
                    style={{
                      backgroundColor: "lightgray",
                      color: "black",
                    }}
                  >
                    {custcode}
                  </span>
                </div>
              </div>
              <div className=" col-md-2" style={{ marginRight: "2rem" }}>
                <div className="d-flex" style={{ gap: "10px" }}>
                  <label className="form-label mt-1">Due</label>
                  <input
                    className="outstanding-sum-value"
                    id="dueAmount"
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      textAlign: "center",
                    }}
                    value={parseFloat(dueAmount + overDue).toFixed(2)}
                  />
                  {/* <span
                      className="outstanding-sum-value"
                      style={{ backgroundColor: "orange", color: "white" }}
                    >
                      {parseFloat(dueAmount + overDue).toFixed(2)}
                    </span> */}
                </div>
              </div>
              <div className="col-md-2">
                <div className="d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label mt-1"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Over Due
                  </label>
                  <input
                    className="outstanding-sum-value"
                    id="overDueAmt"
                    style={{
                      backgroundColor: "Red",
                      color: "white",
                      textAlign: "center",
                    }}
                    value={overDue}
                  />
                  {/* <span
                      className="outstanding-sum-value"
                      style={{ backgroundColor: "Red", color: "white" }}
                    >
                      {overDue}
                    </span> */}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <button
                  id="btnshowInvoice"
                  className="button-style"
                  disabled={!isButtonEnabled}
                  onClick={() => showInvoice(0)}
                >
                  Show Invoice{" "}
                </button>
                <button
                  id="btndueReport"
                  className="button-style"
                  disabled={!isButtonEnabled}
                  onClick={() => printDueReport()} // showDueReport()}
                >
                  Due Report{" "}
                </button>

                <button
                  id="btndueReport"
                  className="button-style"
                  disabled={!isButtonEnabled}
                  onClick={() => printXLDueReport()} // showDueReport()}
                >
                  To Excel{" "}
                </button>

                <button
                  id="btncustdwgclose"
                  className="button-style"

                  onClick={() => closeDueReport()} //navigate("/customer")}
                >
                  {/* Close{" "} */}
                  Send DueReport E-Mail
                </button>
                <button
                  id="btncustdwgclose"
                  className="button-style"

                  onClick={() => close()} //navigate("/customer")}
                >
                  Close{" "}
                  {/* Send DueReport E-Mail */}
                </button>
              </div>
            </div>

            <div>
              <Tabs
                defaultActiveKey="duedets"
                id="custinvdetails"
                className="mb-1  tab_font mt-1"
              >
                <Tab eventKey="duedets" title="Due List">
                  <div style={{ height: "460px", width: "100%", overflowY: "scroll" }}>
                    <table striped className="table-data border " style={{ width: "100%" }}>
                      <thead className="tableHeaderBGColor tablebody">
                        <tr >
                          <th onClick={() => requestSort("DC_InvType")} style={{width:'100px'}}>Inv Type</th>
                          <th onClick={() => requestSort("DC_No")} style={{width:'60px'}}>PN No</th>
                          <th onClick={() => requestSort("Inv_No")}style={{width:'60px'}}>Inv No</th>
                          <th onClick={() => requestSort("DespatchDate")} style={{width:'70px'}}>Date</th>
                          <th onClick={() => requestSort("PO_No")} style={{width:'150px', whiteSpace: "nowrap"}}>PO No</th>
                          <th onClick={() => requestSort("GrandTotal")} style={{width:'70px', textAlign:"right"}}>Inv Value</th>
                          <th onClick={() => requestSort("PymtAmtRecd")} style={{width:'70px', textAlign:"right"}}>Payment Recd</th>
                          <th style={{width:'70px', textAlign:'right'}}>Balance</th>
                          <th onClick={() => requestSort("PaymentDate")} style={{width:'70px',textAlign:"right"}}>Payment Date</th>
                          <th onClick={() => requestSort("DueDays")} style={{width:'60px'}}>Due Days</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {/* {duelistdata != null
                            ? duelistdata.map((duelist, id) =>
                              rendertable(duelist, id, "DUE")
                            )
                            : ""} */}

                        {sortedData()?.map((duelist, id) =>
                          rendertable(duelist, id, "DUE")
                        )
                        }
                      </tbody>
                    </table>
                  </div>
                </Tab>
                <Tab eventKey="overduedets" title="Over Due">
                  <div classnName=" row mt-2">
                    <div style={{ overflowY: "scroll", height: "460px", width: "100%", }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            <th onClick={() => requestSort("DC_InvType")}>Inv Type</th>
                            <th onClick={() => requestSort("DC_No")}>PN No</th>
                            <th onClick={() => requestSort("Inv_No")}>Inv No</th>
                            <th onClick={() => requestSort("DespatchDate")}>Date</th>
                            <th onClick={() => requestSort("PO_No")}>PO No</th>
                            <th onClick={() => requestSort("GrandTotal")} style={{textAlign:"right"}}>Inv Value</th>
                            <th onClick={() => requestSort("PymtAmtRecd")} style={{textAlign:"right"}}>Payment Recd</th>
                            <th style={{textAlign:"right"}}>Balance</th>
                            <th onClick={() => requestSort("PaymentDate")} style={{textAlign:"right"}}>Payment Date</th>
                          </tr>

                          {/* {[
                                "Inv Type",
                                "PN No",
                                "Inv No",
                                "Date",
                                "PO No",
                                "Inv Value",
                                "Payment Recd",
                                "Balance",
                                "Payment Date",
                              ].map((h) => {
                                return <th>{h}</th>;
                              })}
                            </tr> */}
                        </thead>
                        <tbody className="tablebody">
                          {/* {overduelistdata != null
                              ? overduelistdata.map((oduelist, id) =>
                                rendertableod(oduelist, id, "OD")
                              )
                              : ""} */}
                          {sortedDataOD()?.map((oduelist, id) =>
                            rendertableod(oduelist, id, "OD")
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="partpayrecd" title="Part Payment Received">
                  <div classnName=" row mt-2">
                    <div style={{  height: "460px", width: "100%", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            <th onClick={() => requestSort("DC_InvType")}>Inv Type</th>
                            <th onClick={() => requestSort("DC_No")}>PN No</th>
                            <th onClick={() => requestSort("Inv_No")}>Inv No</th>
                            <th onClick={() => requestSort("DespatchDate")}>Date</th>
                            <th onClick={() => requestSort("PO_No")}>PO No</th>
                            <th onClick={() => requestSort("GrandTotal")} style={{textAlign:"right"}}>Inv Value</th>
                            <th onClick={() => requestSort("PymtAmtRecd")} style={{textAlign:"right"}}>Payment Recd</th>
                            <th style={{textAlign:"right"}}>Balance</th>
                            <th onClick={() => requestSort("PaymentDate")} style={{textAlign:"right"}}>Payment Date</th>
                          </tr>

                          {/* {[
                                "Inv Type",
                                "PN No",
                                "Inv No",
                                "Date",
                                "PO No",
                                "Inv Value",
                                "Payment Recd",
                                "Balance",
                                "Payment Date",
                              ].map((h) => {
                                return <th>{h}</th>;
                              })}
                            </tr> */}
                        </thead>
                        <tbody className="tablebody">
                        {pprduelistdata != null
                              ? pprduelistdata.map((pprduelist, id) =>
                                rendertableppr(pprduelist, id)
                              )
                              : ""} 
                             {/*    {sortedData()?.map((pprduelistdata, id) =>
                            rendertableppr(pprduelistdata, id)
                          )}*/}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="duesSummary" title="Dues Summary">
                  <div classnName=" row mt-2">
                    <div style={{  height: "460px", width: "100%", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            {[
                              "30 days",
                              "60 days",
                              "3 Months",
                              "6 Months",
                              "1 Year",
                              "> 1 Year",
                            ].map((h) => {
                              return <th>{h}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {dueAgeingdata != null
                            ? dueAgeingdata.map((dueAge) =>
                              renderduessummtable(dueAge)
                            )
                            : ""}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="receiptsinfo" title="Receipts Info">
                  <div className="row">
                    <div
                      className="col-md-7"
                      style={{  height: "460px", width:"65%", overflowY: "scroll" }}
                    >
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            <th onClick={() => requestSortRect("Recd_PVNo")} style={{whiteSpace:"nowrap",width:"90px"}}>Receipt No</th>
                            <th onClick={() => requestSortRect("Recd_PV_Date")}>Date</th>
                            <th onClick={() => requestSortRect("TxnType")}>Type</th>
                            <th onClick={() => requestSortRect("Amount")} style={{textAlign:"right"}}>Amount</th>
                            <th onClick={() => requestSortRect("On_account")} style={{textAlign:"right"}}>On Account</th>
                            <th onClick={() => requestSortRect("Description")}>Description</th>
                          </tr>

                          {/* <tr>
                              {[
                                "Receipt No",
                                "Date",
                                "Type",
                                "Amount",
                                "On Account",
                                "Description",
                              ].map((h) => {
                                return <th>{h}</th>;
                              })}
                            </tr> */}
                        </thead>
                        <tbody className="tablebody">
                          {/* {receiptsdata != null
                              ? receiptsdata.map((receipts, id) =>
                                rendertblrcpts(receipts, id)
                              )
                              : ""} */}
                          {sortedDataRect()?.map((receipts, id) =>
                            rendertblrcpts(receipts, id)
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div
                      className="col-md-5"
                      style={{
                         height: "460px", width: "35%",
                        overflowY: "scroll",
                      }}
                    >
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor">
                          <tr>
                            <th onClick={() => requestSortRectDet("Inv_No")}>Inv No</th>
                            <th onClick={() => requestSortRectDet("Inv_date")}>Inv Date</th>
                            <th onClick={() => requestSortRectDet("Inv_Type")}>Type</th>
                            <th onClick={() => requestSortRectDet("Inv_Amount")} style={{textAlign:"right"}}>Inv Amount</th>
                            <th onClick={() => requestSortRectDet("Amt_received")} style={{textAlign:"right"}}>Received</th>
                            <th onClick={() => requestSortRectDet("Receive_Now")} style={{textAlign:"right"}}>Received Now</th>
                          </tr>

                          {/* <tr>
                              {[
                                "Inv. No",
                                "Inv Date",
                                "Type",
                                "Inv Amount",
                                "Received",
                                "Received Now",
                              ].map((h) => {
                                return <th>{h}</th>;
                              })}
                            </tr> */}
                        </thead>
                        <tbody>
                          {/* {receiptdetsdata != null
                              ? receiptdetsdata.map((receiptdets) =>
                                rendertblrcptdets(receiptdets)
                              )
                              : ""} */}
                          {sortedDataRectDet()?.map((receiptdets) =>
                            rendertblrcptdets(receiptdets)
                          )}
                        </tbody>
                      </Table>
                      {/* </Col>
                                        </Row> */}
                      {/* </Container> */}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        {/* ) : null} */}
        {selectedInvoice ? (
          <div id="ShowInvoice" style={{ display: showInvoiceState ? 'block' : 'none' }}>
            <label className="Out-standing-inv ms-2">Consignee Address</label>
            <Form>
              <div className="row mt-2">
                <div className="col-md-3 d-flex" style={{ gap: "22px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Inv Type
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="invtype"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["DC_InvType"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Invoice No
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="dcinvno"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["Inv_No"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "62px" }}>
                  <label className="form-label">Date</label>
                  <input
                    className="in-field"
                    type="text"
                    id="invdate"
                    disabled
                    value={
                      selectedInvoice["Inv_Date"] == null
                        ? ""
                        : selectedInvoice["Inv_Date"]
                        //selectedInvoice["Dc_inv_Date"]  
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "35px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    PN No
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="pnno"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["DC_No"]
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
                  <label className="form-label">Consignee</label>
                  <input
                    className="in-field"
                    type="text"
                    id="consignee"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Cust_Name"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "51px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    PO No
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="pono"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["PO_No"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "45px" }}>
                  <label className="form-label">Date</label>
                  <input
                    className="in-field"
                    type="text"
                    id="pndate"
                    value={
                      selectedInvoice == null ? "" :  selectedInvoice["DC_Date"]
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 d-flex" style={{ gap: "45px" }}>
                  <label className="form-label">City</label>
                  <input
                    className="in-field"
                    type="text"
                    id="custcity"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Cust_Place"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "23px" }}>
                  <label className="form-label">Pincode</label>

                  <input
                    className="in-field"
                    type="text"
                    id="pincode"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["PIN_Code"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "5px" }}>
                  <div className="col-md-7 d-flex" style={{ gap: "8px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Dispatch Date
                    </label>
                    <input
                      className="in-field"
                      type="text"
                      id="dispatchdate"
                      value={
                        selectedInvoice == null
                          ? ""
                          : 
                          moment(selectedInvoice["DespatchDate"]).format('DD/MM/YYYY')
                         // moment(selectedInvoice["Dc_inv_Date"]).format('DD/MM/YYYY')
                      }

                      
                    />
                  </div>
                  <div className="col-md-5 d-flex" style={{ gap: "8px" }}>
                    <label className="form-label"> Mode</label>
                    <input
                      className="in-field"
                      type="text"
                      id="dispatchmode"
                      value={
                        selectedInvoice == null
                          ? ""
                          : selectedInvoice["TptMode"]
                      }
                    />
                  </div>
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Vehicle No
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="dispatchdate"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["VehNo"]
                    }
                  />
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-md-3 d-flex" style={{ gap: "38px" }}>
                  <label className="form-label">State</label>

                  <input
                    className="in-field"
                    type="text"
                    id="cstate"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Cust_State"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "22px" }}>
                  <label className="form-label">Address</label>
                  <textarea
                    className="in-field"
                    type="textarea"
                    id="address"
                    rows={3}
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Cust_Address"]
                    }
                    style={{
                      width: "290px",
                      height: "55px",
                      padding: "6px",
                    }}
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "40px" }}>
                  <label className="form-label">Delivery</label>
                  <textarea
                    className="in-field"
                    type="textarea"
                    id="address"
                    rows={3}
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Del_Address"]
                    }
                    style={{
                      width: "290px",
                      height: "55px",
                      padding: "6px",
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    style={{ float: "right" }}
                    className="button-style"
                    onClick={(e) => closeShowInvoice(e)}
                  >
                    Close
                  </button>
                </div>
              </div>

              <label className="Out-standing-inv ms-2">Commercial Info</label>

              <div className="row mt-1">
                <div className="col-md-3 d-flex" style={{ gap: "52px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Net Value
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="dispatchdate"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Net_Total"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Delivery Charges
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="delchg"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["Del_Chg"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "33px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Grand Total
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="dispatchmode"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["GrandTotal"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Payment Terms
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="paymentterms"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["PaymentTerms"]
                    }
                  />
                </div>


              </div>
              <div className="row">
                <div className="col-md-3 d-flex" style={{ gap: "43px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Mtrl Value
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="mtrlchg"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["MtrlChg"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "38px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Total Taxes
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="delchg"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["TaxAmount"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "41px" }}>
                  <label className="form-label">Received</label>
                  <input
                    className="in-field"
                    type="text"
                    id="received"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["0.00"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Payment Date
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="paymentdate"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["PaymentDate"]
                    }
                  />
                </div>

              </div>
              <div className="row">

                <div className="col-md-3 d-flex" style={{ gap: "56px" }}>
                  <label className="form-label">Discount</label>
                  <input
                    className="in-field"
                    type="text"
                    id="discount"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["Discount"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "33px" }}>
                  {" "}
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Invoice Total
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="invtotal"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["InvTotal"]
                    }
                  />
                </div>



                <div className="col-md-3 d-flex" style={{ gap: "54px" }}>
                  <label className="form-label">Balance</label>
                  <input
                    className="in-field"
                    type="text"
                    id="grandtotal"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["GrandTotal"]
                    }
                  />
                </div>

                <div className="col-md-3 d-flex" style={{ gap: "50px" }}>
                  <label className="form-label">Remarks</label>
                  <input
                    className="in-field"
                    type="textarea"
                    id="remarks"
                    rows={3}
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["Remarks"]
                    }
                  />
                </div>

              </div>
              <div className="row">

                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Assessible Value
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="assesiblevalue"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["AssessableValue"]
                    }
                  />
                </div>
                <div className="col-md-3 d-flex" style={{ gap: "37px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Round Off
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="roundoff"
                    value={
                      selectedInvoice == null
                        ? ""
                        : selectedInvoice["Round_Off"]
                    }
                  />
                </div>



                <div className="col-md-3 d-flex" style={{ gap: "37px" }}>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Due Days
                  </label>
                  <input
                    className="in-field"
                    type="text"
                    id="duedays"
                    value={
                      selectedInvoice == null ? "" : selectedInvoice["DueDays"]
                    }
                  />
                </div>


              </div>

              <div className="mt-1">
                <div className="row">
                  <div className="col-md-7">
                    <div style={{ height: "150px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            <th onClick={() => requestSortPayRec("Dwg_No")}>Dwg No / Part No</th>
                            <th onClick={() => requestSortPayRec("Material")}>Material</th>
                            <th onClick={() => requestSortPayRec("Qty")}>Qty</th>
                            <th onClick={() => requestSortPayRec("Mtrl_Rate")}>Mtrl Rate</th>
                            <th onClick={() => requestSortPayRec("JW_Rate")} >JW Rate</th>
                            <th onClick={() => requestSortPayRec("Total")}>Total</th>
                            {/* {[
                              "Dwg No / Part No",
                              "Material",
                              "Qty",
                              "Mtrl Rate",
                              "JW Rate",
                              "Total",
                            ].map((h) => {
                              return <th>{h}</th>;
                            })} */}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {/* {dlinvformdata != null
                            ? dlinvformdata.map((dldwgrec) =>
                              rendertbldwg(dldwgrec)
                            )
                            : ""} */}
                            {sortedDataPayRec()?.map((dldwgrec) =>
                              rendertbldwg(dldwgrec)
                            )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="col-md-5">
                    {" "}
                    <div style={{ height: "150px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr>
                            <th onClick={() => requestSortTaxRec("TaxName")}>Tax Name</th>
                            <th onClick={() => requestSortTaxRec("TaxableAmount")}>Taxable Amount</th>
                            <th onClick={() => requestSortTaxRec("TaxPercent")}>Tax Percent</th>
                            <th onClick={() => requestSortTaxRec("TaxAmt")}>Tax Amount</th>

                            {/* {[
                              "Tax Name",
                              "Taxable Amount",
                              "Tax Percent",
                              "Tax Amount",
                            ].map((h) => {
                              return <th>{h}</th>;
                            })} */}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {/* {dlinvformtaxdetsdata != null
                            ? dlinvformtaxdetsdata.map((dlinvtaxrec) =>
                              rendertbltax(dlinvtaxrec)
                            )
                            : ""} */}
                            {sortedDataTaxRec()?.map((dlinvtaxrec) =>
                              rendertbltax(dlinvtaxrec)
                            )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        ) : (
          ""
        )}
        {unitdata[0] ? (
          <div id="ShowDueReport" style={{ display: showDueReportState ? 'block' : 'none' }}>
            <label className="Out-standing-inv" >
              List of Invoices Due for Payment
            </label>
            <div className="row mb-1">
              <div className="col-md-12">
                <button
                  style={{ float: "right" }}
                  className="button-style"
                  onClick={() => printDueReport()}
                >
                  Print
                </button>
                <button
                  style={{ float: "right" }}
                  className="button-style"
                  onClick={() => closeDueReport()}
                >
                  Close
                </button>
              </div>
            </div>

            <Col
              className="vscroll"
              style={{ width: "100%", maxHeight: "500px" }}
            >
              <div id="showduereport">
                <Table responsive striped bordered style={{ width: "100%" }}>
                  <thead>
                    <tr>
                   
                      <td rowspan="2" style={{ width: "50%", marginLeft: "20%", marginBottom: "2%" }}>
                        <img className="logo"  src={CmpLogo} />
                      </td>
                      <td colSpan="8" style={{textAlign:"center"}}>
                        <h5> {unitdata[0].RegisteredName}</h5>
                      </td>
                      {/* <b>Magod Laser Machining Pvt. Ltd.</b> */}

                    </tr>
                    <tr>
                      <td colSpan="8" style={{textAlign: "center"}}>{unitdata[0].Unit_Address}
                        {/* 72, KIADB Industrial Area, Phase II Jigani, Anekal
                        Taluk, Bangalore -560106 */}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan="8" style={{ textAlign: "center",  fontWeight: "bold" }}>
                        <h6>
                          List of Invoices Due for Payment as on{" "}
                          {moment(new Date()).format("DD/MM/YYYY")}
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="8">
                        <b>Customer Name : {custname}</b>
                      </td>
                      <td colSpan="2">
                        <b>Due Amount : {overDue}</b>
                      </td>
                    </tr>

                    <tr
                      style={{ textAlign: "center" }}
                      className="tableHeaderBGColor tablebody"
                    >
                      {[
                        "Srl",
                        "Inv No",
                        "Inv Date",
                        "PO No",
                        "Amount",
                        "Received",
                        "Balance",
                        "Due Date",
                        "Over Due Days",
                      ].map((h) => {
                        return <th>{h}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {duereportdata != null
                      ? duereportdata.map((duerepinv, id) =>
                        rendertblduerep(duerepinv, id)
                      )
                      : ""}
                    {custname == "" ? (
                      <tr>
                        <td colSpan={8}>No Customer Selected</td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {custname != "" && duereportdata.length == 0 ? (
                      <tr style={{ textAlign: "center" }}>
                        <td style={{ textAlign: "center" }} colSpan={8}>
                          No Data Found for {custname}{" "}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                </Table>
              </div>
              {/* </Col>
                        </Row>
                    </Container> */}
            </Col>
          </div>
        ) : (
          ""
        )}
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
      </div>
      <div>
        <ModalPrintDueReport openDueReportPrintModal={openDueReportPrintModal} DueReportData={duelistdata} UnitData={unitdata} handleClose={setDueReportPrintModal} />
      </div>
    </div>
  );
}


export default Custinvandpayments;
