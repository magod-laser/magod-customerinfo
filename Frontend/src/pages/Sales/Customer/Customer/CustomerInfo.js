import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Row,
  Col,
  Container,
  Form,
  FormLabel,
  FormCheck,
  Button,
} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import moment from "moment";
import { toast } from "react-toastify";

//import { getStates, getCreditTerms, getMtrlSources, updateCustomer, getCustomerdets } from "../../../api/apiconn";
//import { useAlert } from 'react-alert'
import { useNavigate } from "react-router-dom";
// import { TryRounded } from "@mui/icons-material";
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function CustomerInfo() {
  let navigate = useNavigate();
  const isFirstClickRef = useRef(true);
  //   const alert = use toast.error();
  let [statedata, setStatedata] = useState([]);
  let [crtermsdata, setCrTermsdata] = useState([]);
  let [mtrlsourcedata, setMtrlSourcedata] = useState([]);
  let [custContactData, setCustContactData] = useState([]);
  //let [custContTeleData, setCustContTeleData] = useState([]);
  let [customerdata, setCustomerdata] = useState([]);
  let [gstdisabled, setGSTDisabled] = useState(true);
  let [pandisabled, setPANDisabled] = useState(true);

  // Form data
  let [newCustName, setNewCustName] = useState("");
  let [branchName, setBranchName] = useState("");
  let [custcode, setCustCode] = useState("");
  let [pincode, setPinCode] = useState("");
  let [country, setCountry] = useState("India");
  let [custcity, setCustCity] = useState("");
  let [custstate, setCustState] = useState("");
  let [custstateid, setCustStateId] = useState(0);
  let [custAddress, setCustAddress] = useState("");
  let [compemail, setCompEmail] = useState("");
  let [crterms, setCrTerms] = useState("");
  let [maxcredit, setMaxCredit] = useState("");
  let [creditdays, setCreditDays] = useState("");
  let [avepaydays, setAvePayDays] = useState("");
  let [firstbillingdt, setFirstBillingDt] = useState("");
  let [lastbillingdt, setLastBillingDt] = useState("");
  let [gstno, setGSTNO] = useState("");
  let [panno, setPANNO] = useState("");
  let [statecd, setStateCd] = useState("");
  let [custfoldername, setCustFolderName] = useState("");
  let [delivery, setDelivery] = useState("");
  let [govtorg, setGovtOrg] = useState(false);
  let [isexport, setIsExport] = useState(false);
  let [custcurrent, setCustCurrent] = useState(false);
  let [gststate, setGSTState] = useState("");
  // Contact Details
  let [conName, setContactName] = useState("");
  let [conDept, setDept] = useState("");
  let [conDesignation, setDesignation] = useState("");
  let [conE_mail, setCEmail] = useState("");
  let [conTele_Office, setTele_Office] = useState(0);
  let [conTele_Mobile, setTele_Mobile] = useState(0);

  let [btnnew, setBtnNew] = useState(false);
  let [btnupd, setBtnUpd] = useState(true);
  let [btndel, setBtnDel] = useState(true);
  let [rawCustState, setRawCustState] = useState({});

  let customerMenu = () => {
    window.location.href = "/customer";
  };

  useEffect(() => {
    setBtnNew(false);
    if (localStorage.getItem("LazerCustExist")) {
      console.log("Existing Customer");
      let existingccode = localStorage.getItem("LazerCustExist");
      setCustCode(existingccode);
      console.log(existingccode);
    //  setCustCode(existingccode);
      postRequest(
        endpoints.getCustomerDets,
        { custcode: existingccode },
        async (resp) => {
          let excustdata = resp[0];
          console.log(excustdata);
          //  setCustCode(excustdata.Cust_code);
          setNewCustName(excustdata.Cust_name);
          setBranchName(excustdata.Branch);
          setAvePayDays(excustdata.AveragePymtPeriod);
          setCompEmail(excustdata.EMail);
          setCountry(excustdata.Country);
          setCrTerms(excustdata.CreditTerms);
          setCreditDays(excustdata.CreditTime);
          setCustAddress(excustdata.Address);
          setCustCity(excustdata.City);
          setCustCurrent(excustdata.CURRENT);
          setCustFolderName(
            excustdata.DWG != null ? excustdata.DwgLoc : excustdata.Cust_code
          );

          if (excustdata.StateId != null && excustdata.State == "undefined") {
            postRequest(
              endpoints.getStateName,
              { statecd: excustdata.StateId },
              (stnmdata) => {
                setCustState(stnmdata[0]["State"]);
                setCustStateId(excustdata.StateId);
              }
            );
          } else if (
            excustdata.StateId == null &&
            (excustdata.State != null || excustdata.State != "undefined")
          ) {
            postRequest(
              endpoints.getStateCode,
              { statenm: excustdata.State },
              (stdata) => {
                setCustState(excustdata.State);
                setCustStateId(stdata[0]["StateCode"]);
              }
            );
          } else {
            setCustStateId(excustdata.StateId);
            setCustState(excustdata.State);
          }

          setDelivery(excustdata.Delivery);
          setFirstBillingDt(
            excustdata.FirstBilling != null
              ? moment(excustdata.FirstBilling).format("DD/MM/YYYY")
              : ""
          );
          setLastBillingDt(
            excustdata.LastBilling != null
              ? moment(excustdata.LastBilling).format("DD/MM/YYYY")
              : ""
          );
          setMaxCredit(excustdata.CreditLimit);
          setGSTNO(excustdata.GSTNo);
          setGovtOrg(excustdata.IsGovtOrg);
          setIsExport(excustdata.IsForiegn);
          setPANNO(excustdata.PAN_No);
          setPinCode(excustdata.Pin_Code);
          setCustCurrent(excustdata.CURRENT);
          setCustomerdata(resp);
        }
      );
      postRequest(
        endpoints.getCustomerContactDets,
        { custcode: existingccode },
        async (contdets) => {
          console.log("Contact Details");
          console.log(contdets);
          setCustContactData(contdets);
        }
      );
      // postRequest(endpoints.getCustomerContactTeleDets, { custcode: existingccode },
      //     async (contteldets) => {
      //         console.log("Contact Tele Details");
      //         console.log(contteldets);
      //         setCustContTeleData(contteldets);
      //     })
    } else {
      // Accessing CustCode
      // if(branchName == "" || branchName == null){
      //      toast.error("Please enter Branch Name for New Customer");
      //     return;
      // }
      console.log("New Customer");
      let custdet = JSON.parse(localStorage.getItem("LazerCustomer"));
      console.log(custdet);

      setCustCode(custdet.custcode);
      setNewCustName(custdet.customerName);
      setBranchName(custdet.branchName);
      setCustFolderName(custdet.custcode);
      setCustStateId("");
      setCustStateId("");
      setCrTerms("");
    }

    postRequest(endpoints.getStates, {}, (data) => {
      // getStates(data => {
      setStatedata(data);
    });
    postRequest(endpoints.getCreditTerms, {}, (crdata) => {
      // getCreditTerms(crdata => {
      setCrTermsdata(crdata);
    });
    postRequest(endpoints.getMtrlSources, {}, (mtlsrcdata) => {
      //getMtrlSources(mtlsrcdata => {
      setMtrlSourcedata(mtlsrcdata);
    });
  }, []);

  let selectState = async (e) => {
    setCustStateId(e.target.value);
    setGSTState(e.target.value);
    setGSTNO(e.target.value);

    for (let i = 0; i < statedata.length; i++) {
      //   setCustState("");
      if (statedata[i]["StateCode"] == e.target.value) {
        setCustState(statedata[i]["State"]);
        setCustStateId(statedata[i]["StateCode"]);
        break;
      }
    }
  };

  let selectCrTerms = async (e) => {
    console.log(e.target.value);
    for (let i = 0; i < crtermsdata.length; i++) {
      if (crtermsdata[i]["PaymentTerm"] === e.target.value) {
        setCrTerms(crtermsdata[i]["PaymentTerm"]);
        setCreditDays(crtermsdata[i]["CreditDays"]);
        break;
      }
    }
  };

  let selectMtrlSource = async (e) => {
    console.log(e.target.value);
    // let mtlsrc;
    // for (let i = 0; i < mtrlsourcedata.length; i++) {
    //     if (mtrlsourcedata[i]["MtrlSource"] === e.target.value) {
    //         mtlsrc = mtrlsourcedata[i];
    //         break;
    //     }
    // }
    // setDelivery(mtlsrc["MtrlSource"]);
    setDelivery(e.target.value);
  };

  function Cleardata() {
    setNewCustName("");
    setCustCode("");
    setCustAddress("");
    setCustCity("");
    setCompEmail("");
    setBranchName("");
    setCountry("");
    setCrTerms("");
    setCreditDays("");
    setAvePayDays(0);
    setContactName("");
    //    setCustContTeleData([]);
    setCustContactData([]);
    setCustCurrent(false);
    setCustFolderName("");
    setCustState("");
    setCustStateId("");
    setDelivery("");
    setCompEmail("");
    setFirstBillingDt("");
    setGSTNO("");
    setGovtOrg(false);
    setIsExport(false);
    setLastBillingDt("");
    setMaxCredit(0);
    setMtrlSourcedata("");
    setPANNO("");
    setPinCode("");
    // setTeleNo(0);
    // setTeleType("");
  }

  // THIS FUNCTION HAS AN ISSUE WITH GST NO INPUT
  // async function updateCustomerData(e) {

  //   e.preventDefault();

  //   if (custContactData.length <= 0) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Contact Details are required");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   }

  //   console.log("Update Customer Data");
  //   // let brname = "";
  //   //  brname = e.target.elements.branchName.value;
  //   // let branchName = e.target.elements.branchName.value;
  //   let custAddress = "";
  //   if (
  //     e.target.elements.custAddress.value == "" ||
  //     e.target.elements.custAddress.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter Customer Address");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     custAddress = e.target.elements.custAddress.value;
  //   }
  //   let city = "";
  //   if (
  //     e.target.elements.city.value == "" ||
  //     e.target.elements.city.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter City");
  //       isFirstClickRef.current = false;
  //     }
  //     return;
  //   } else {
  //     city = e.target.elements.city.value;
  //   }
  //   let pincode = "";
  //   if (
  //     e.target.elements.pincode.value == "" ||
  //     e.target.elements.pincode.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter Pincode");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     if (e.target.elements.pincode.value.length != 6) {
  //       if (isFirstClickRef.current) {
  //         toast.error("Please enter valid Pincode");
  //         isFirstClickRef.current = false;
  //       }

  //       return;
  //     } else pincode = e.target.elements.pincode.value;
  //   }
  //   custstate = custstate;
  //   custstateid = custstateid;

  //   if (
  //     e.target.elements.country.value == "" ||
  //     e.target.elements.country.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter Country");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     country = e.target.elements.country.value;
  //   }
  //   let compemail = e.target.elements.compemail.value;
  //   console.log(compemail);

  //   if (
  //     e.target.elements.crterms.value == "" ||
  //     e.target.elements.crterms.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please select Credit Terms");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     crterms = e.target.elements.crterms.value;
  //   }
  //   //let maxcredit = "";
  //   if (
  //     e.target.elements.maxcredit.value == "" ||
  //     e.target.elements.maxcredit.value == null ||
  //     e.target.elements.maxcredit.value < 0
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter Positive Max Credit");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     maxcredit = e.target.elements.maxcredit.value;
  //   }
  //   creditdays = e.target.elements.creditdays.value;
  //   avepaydays =
  //     e.target.elements.avepaydays.value == 0
  //       ? 0
  //       : e.target.elements.avepaydays.value;
  //   // let firstbillingdt = e.target.elements.firstbillingdt.value;
  //   // let lastbillingdt = e.target.elements.lastbillingdt.value;
  //   //   gstno = custstateid + e.target.elements.gstno.value.substr(2, 16);
  //   //   let gstno = "";
  //   let gstno = e.target.elements.gstno.value;
  //   console.log(gstno);
  //   if (gstno.includes("~!@#$%^&*().,`[]{}|?><")) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Special Characters are not allowed..");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   }
  //   if (
  //     e.target.elements.gstno.value.length < 3 ||
  //     (e.target.elements.gstno.value = "")
  //   ) {
  //     gstno = "UnRegistered";
  //   } else {
  //     //  gstno = custstateid + e.target.elements.gstno.value.substr(2, 15);
  //     //gstno = e.target.elements.gstno.value;
  //     setGSTNO(gstno);
  //   }
  //   panno = e.target.elements.panno.value;

  //   // console.log("gst no lEN : " + gstno.length)
  //   // console.log("pan no : " + panno.length)
  //   // if ((gstno.length < 15) || (panno.length < 10)) {
  //   //      toast.error('Enter correct GST or PAN number');
  //   //     //     return;
  //   // }
  //   // console.log("gst no pan : " + gstno.substring(2, 12))
  //   // console.log("pan no : " + panno);
  //   // if (gstno.substring(2, 12) != panno) {
  //   //      toast.error('Either GST or PAN is not correct');
  //   //     setGSTNO(custstateid);
  //   //     return;
  //   // }
  //   setGSTNO(custstateid);
  //   govtorg = e.target.elements.govtorg.checked ? 1 : 0;
  //   isexport = e.target.elements.isexport.checked ? 1 : 0;
  //   if (
  //     e.target.elements.custfoldername.value == "" ||
  //     e.target.elements.custfoldername.value == null
  //   ) {
  //     if (isFirstClickRef.current) {
  //       toast.error("Please enter Customer Folder Name");
  //       isFirstClickRef.current = false;
  //     }

  //     return;
  //   } else {
  //     custfoldername = e.target.elements.custfoldername.value;
  //   }
  //   let current = "1";
  //   // if (e.target.elements.delivery.value == "" || e.target.elements.delivery.value == null) {
  //   //      toast.error("Please select Material Source");
  //   //     return;
  //   // } else {
  //   delivery = e.target.elements.delivery.value;
  //   //}

  //   //  custContactData
  //   //  custContTeleData
  //   // await csavedata()
  //   postRequest(
  //     endpoints.updateCustomer,
  //     {
  //       //updateCustomer({
  //       custcode: custcode,
  //       customerName: newCustName,
  //       branchName: branchName,
  //       custAddress: custAddress,
  //       city: city,
  //       pincode: pincode,
  //       state: custstate,
  //       stateid: custstateid,
  //       country: country,
  //       compemail: compemail,
  //       maxcredit: maxcredit,
  //       crterms: crterms,
  //       creditdays: creditdays,
  //       avepaydays: avepaydays,
  //       // firstbillingdt: firstbillingdt,
  //       // lastbillingdt: lastbillingdt,
  //       gstno: gstno,
  //       panno: panno,
  //       govtorg: govtorg,
  //       isexport: isexport,
  //       custfoldername: custfoldername,
  //       custcurent: custcurrent,
  //       delivery: delivery,
  //       custContactData: custContactData,
  //       //    custContTeleData: custContTeleData
  //     },
  //     (resp) => {
  //       //            console.log(resp)
  //     }
  //   );

  //   if (isFirstClickRef.current) {
  //     toast.success("Customer Added sucessfully");
  //     isFirstClickRef.current = false;
  //   }

  //   //   Cleardata();
  //   //  clearDataCustomer();
  //   //     window.location.href = "/customer/createcustomer";
  // }

  //WORKING NEWLY ADDED FUNCTION

  // NEWLY ADDED FUNCTION
  let updateCustomerData = (e) => {
    e.preventDefault();

    if (e.target.elements.newCustName.value == "") {
      toast.error("Customer Name is required");
      return;
    }
    if (custContactData.length <= 0) {
      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
      toast.error("Contact Details are required");

      return;
    }

    if (gststate != custstateid) {
      toast.error("GST No should start with State Code " + custstateid);
      return;
    }

    // console.log("updateCustomerData" + custaddress);
    // let custAddress = custaddress;
    let city = custcity; //e.target.elements.city.value;
    let pincode = 0;
    if (e.target.elements.pincode.value > 0)
      pincode = e.target.elements.pincode.value;
    //  if (isFirstClickRef.current) {
    //   isFirstClickRef.current = false;
    // }
    else toast.error("Pincode should be numeric");

    let cstate = custstate;
    //        console.log("stateCD  ", statecd.length);
    let stateid = custstateid; //.substring(0, 2); // custstateid;
    //   let statecd = statecd;
    let country = e.target.elements.country.value;

    let compemail = e.target.elements.compemail.value;
    // let crterms = crterms; //e.target.elements.crterms.value;
    let maxcredit = e.target.elements.maxcredit.value;
    let creditdays = e.target.elements.creditdays.value;
    let avepaydays = e.target.elements.avepaydays.value;
    let firstbillingdt = e.target.elements.firstbillingdt.value
      ? e.target.elements.firstbillingdt.value
      : "";
    let lastbillingdt = e.target.elements.lastbillingdt.value
      ? e.target.elements.lastbillingdt.value
      : "";

    let gstno = e.target.elements.gstno.value;

    if (gstno.includes("~!@#$%^&*().,`[]{}|?><")) {
      toast.error("Special Characters are not allowed..");

      return;
    }
    
    // if (
    //   e.target.elements.gstno.value.length < 3 ||
    //   e.target.elements.gstno.value == ""
    // ) {
    //   gstno = "UnRegistered";
    // } else {
    //   //  gstno = custstateid + e.target.elements.gstno.value.substr(2, 15);
    //   // gstno = e.target.elements.gstno.value;
    if (gstno.substring(0, 2) != custstateid) {
      toast.error("GST No should start with State Code " + custstateid);
      return;
    }
    else {
      if (gstno.length < 15) {
        toast.error("GST Number should be 15 Characters");
        return;
      }
      setGSTNO(gstno);
    }

   // let panno = e.target.elements.panno.value;

    setPANNO(e.target.elements.panno.value);

    //let govtorg = govtorg;
    //let isexport = isexport;
    let custfoldername = e.target.elements.custfoldername.value;
    let ccurent = custcurrent.checked ? 1 : 0;


    postRequest(
      endpoints.updateCustomer,
      {
        custcode: custcode,
        customerName: newCustName,
        branchName: branchName,
        custAddress: custAddress,
        city: city,
        pincode: pincode,
        state: custstate,
        stateid: custstateid,
        country: country,
        compemail: compemail,
        crterms: crterms,
        maxcredit: maxcredit,
        creditdays: creditdays,
        avepaydays: avepaydays,
        gstno: gstno,
        panno: panno,
        govtorg: govtorg,
        isexport: isexport,
        custfoldername: custfoldername,
        custcurent: custcurrent,
        delivery: delivery,
        custContactData: custContactData,
        firstbillingdt: moment(firstbillingdt).format("DD/MM/YYYY"),
        lastbillingdt: moment(lastbillingdt).format("DD/MM/YYYY"),
      },
      (resp) => {
        console.log(resp);
        console.log(custContactData);

        toast.success("Customer data Updated Successfully");
      }
    );

  };

  let clearDataCustomer = () => {
    setCustCode("");
    setNewCustName("");
    setBranchName("");
    setCustAddress("");
    setCustCity("");
    setPinCode("");
    setCustStateId("");
    setStateCd("");
    setCustState("");
    setCountry("");
    setCompEmail("");
    setCrTerms("");
    setMaxCredit("");
    setCreditDays("");
    setAvePayDays("");
    setFirstBillingDt("");
    setLastBillingDt("");
    //   setGSTNO("");
    setPANNO("");
    setGovtOrg("");
    setIsExport("");
    setCustFolderName("");
    setCustCurrent("");
    setDelivery("");
  };

  let addContactData = async () => {
    console.log("Add Contact Data");
    console.log(custContactData.length);
    if (conName == "" || conName == null) {
      toast.error("Name cannot be blank..");

      return;
    }

    if (conName != null || conName != "") {
      setCustContactData([
        ...custContactData,
        {
          id: custContactData.length + 1,
          conName,
          conDesignation,
          conDept,
          conE_mail,
          conTele_Mobile,
          conTele_Office,
        },
      ]);
      console.log(custContactData);
    }
    clearData();
    // setSaveBtn(true);
    // setDeleteBtn(false);
  };

  let updContactData = async () => {
    console.log("Update Contact Data ");
    console.log(custContactData.length);
    for (let i = 0; i < custContactData.length; i++) {
      if (
        conName == custContactData[i]["conName"] &&
        (custContactData[i]["conName"] != null ||
          custContactData[i]["conName"] != "")
      ) {
        custContactData[i]["conDesignation"] = conDesignation;
        custContactData[i]["conDept"] = conDept;
        custContactData[i]["conE_mail"] = conE_mail;
        custContactData[i]["conTele_Office"] = conTele_Office;
        custContactData[i]["conTele_Mobile"] = conTele_Mobile;
      }
    }
    console.log(custContactData);
    clearData();
  };

  let clearData = () => {
    setBtnDel(true);
    setBtnUpd(true);
    setBtnNew(false);
    setContactName("");
    setDept("");
    setDesignation("");
    setCEmail("");
    setTele_Office(0);
    setTele_Mobile(0);
  };

  let selectItem = (item) => {
    setBtnDel(false);
    setBtnUpd(false);
    setBtnNew(true);
    setContactName(item.conName ? item.conName : ".");
    setDept(item.conDept);
    setDesignation(item.conDesignation);
    setCEmail(item.conE_mail);
    setTele_Office(item.conTele_Office);
    setTele_Mobile(item.conTele_Mobile);
  };

  let removeContactData = async () => {
    let olddata = custContactData;
    let newdata = olddata.filter(
      (data) => data.conName !== conName && data.conE_mail != conE_mail
    );
    setCustContactData(newdata);
    clearData();
  };


  const handleChangeAlpha = (e) => {
    const mvalue = e.target.value.replace(/[^A-Za-z ]/gi, "");
    if (mvalue.length < 0) {
      toast.error("Please enter valid name");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    } else {
      setContactName(mvalue);
    }
  };

  const handleChangeNumeric = (e) => {
    const mvalue = e.target.value.replace(/[^0-9]/gi, "");
    if (e.target.value.length > 6) {
      toast.error("Pin Code only 6 digits are allowed..");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    setPinCode(mvalue);
  };

  const handleChangePhNo = (e) => {
    const mvalue = e.target.value.replace(/[^0-9 ]/gi, "");
    // mvalue = e.target.value.length > 15 ? e.target.value.substring(0, 15) : e.target.value;
    if (mvalue < 0) {
      toast.error("Contact No1 cannot be blank..");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    }
    setTele_Office(mvalue);
  };

  const chkgstpan = (e) => {
    console.log(e.target.value);

    if (e.target.value == "GST") {
      setGSTDisabled(false);
      setPANDisabled(true);
    } else if (e.target.value == "PAN") {
      console.log("PAN ");
      setGSTDisabled(true);
      setPANDisabled(false);
      console.log(gstdisabled);
      console.log(pandisabled);
    }
  };

  const HandleGSTNo = (e) => {
    const avalue = e.target.value.replace(/[^A-Za-z0-9]/gi, "");
    if (avalue.length > 15) {
      toast.error("Please enter valid GST No");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    } else {
      setGSTNO(avalue);
      setPANNO(avalue.substr(2, 10));
      // setPANDisabled = true;
    }
  };

  const valPanNo = (e) => {
    //  const mpanno = e.target.value;
    const mpanno = e.target.value.replace(/[^A-Za-z0-9]/gi, "");
    //  console.log(mpanno);
    //  console.log(gstno);
    // if ((mpanno.length > 10)) {
    //      toast.error('Please check GST No / PAN No');
    //     return;

    // }

    setPANNO(mpanno);
    //  setGSTDisabled(true);
  };

  const handleChangePhNo1 = (e) => {
    const mvalue = e.target.value.replace(/[^0-9 ]/gi, "");
    // mvalue = e.target.value.length > 15 ? e.target.value.substring(0, 15) : e.target.value;
    setTele_Mobile(mvalue);
  };

  const funcmaxCredit = (e) => {
    // const crval = e.target.value.replace(/[^0-9.]/gi, "");
    // if (crval < 0) {
    //   toast.error("Please enter a positive value");

    //   // if (isFirstClickRef.current) {
    //   //   isFirstClickRef.current = false;
    //   // }

    //   return;
    // } else {
      setMaxCredit(e.target.value);
     // setMaxCredit(crval);
 //   }
  };

  const funcCrdays = (e) => {
    const crdys = e.target.value.replace(/[^0-9]/gi, "");
    if (crdys < 0) {
      toast.error("Please enter positive value or zero");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    } else {
      setCreditDays(crdys);
    }
  };

  const valemail = (e) => {
    const vcemail = e.target.value.replace(/[^A-Za-z0-9.@]/gi, "");
    setCompEmail(vcemail);
  };

  // const valconemail = (e) => {
  //     const vconemail = e.target.value.replace(/[^A-Za-z0-9.@]/gi, "")
  //     setCEmail(vconemail);
  // }

  const valconemail = (e) => {
    const vcnemail = e.target.value.replace(/[^A-Za-z0-9.@]/gi, "");
    if (vcnemail.includes("@@") || vcnemail.includes("..")) {
      toast.error("Invalid Email Address...");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    setCEmail(vcnemail);
  };

  async function checkBranch(e) {
    const brhnm = e.target.value; //.replace(/[^A-Za-z0-9. -]/gi, "")
    setBranchName(brhnm);
  }

  const handlegovtorg = (e) => {
    setGovtOrg(e.target.checked);
  }

  const handleexport = (e) => {
    setIsExport(e.target.checked);
  }

  return (
    <div>
      <h4 className="title ">Customer Details</h4>

      <div>
        <Form onSubmit={updateCustomerData} autoComplete="off">
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex" style={{ gap: "23px" }}>
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
                  </span>
                </label>

                <input
                  className="in-field"
                  id="newCustName"
                  disabled
                  value={newCustName}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="d-flex" style={{ gap: "40px" }}>
                <label className="form-label">Code</label>
                <input
                  className="in-field"
                  id="custcode"
                  type="text"
                  disabled
                  value={custcode}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Branch </label>
                <input
                  className="in-field"
                  type="text"
                  id="branchName"
                  onChange={(e) => setBranchName(e.target.value)}
                  value={branchName}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex" style={{ gap: "35px" }}>
                <label className="form-label">
                  City
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
                <input
                  className="in-field"
                  id="custcity"
                  type="text"
                  onChange={(e) => setCustCity(e.target.value)}
                  value={custcity}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label">
                  Address
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
                <input
                  className="in-field"
                  type="text"
                  id="custAddress"
                  rows={2}
                  onChange={(e) => setCustAddress(e.target.value)}
                  value={custAddress}
                  required
                />
              </div>
            </div>
            <div className="col-md-2" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Pin Code
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

                <input
                  className="in-field"
                  type="text"
                  id="pincode"
                  maxLength={6}
                  onChange={handleChangeNumeric}
                  value={pincode}
                  required
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "12px" }}>
                <label className="form-label">
                  State
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

                {statedata.length > 0 ? (
                  <select
                    className="ip-select"
                    onChange={selectState}
                    value={custstateid}
                    required
                  >
                    {/* {rawCustState.stateid != undefined ?
                                                    <option value={rawCustState.stateid} selected>{rawCustState.state}</option>
                                                    :
                                                    <option value={custstate} disabled selected>{custstate}</option>
                                                } */}
                    <option value="" disabled selected>
                      {" "}
                      Select State
                    </option>
                    {statedata.map((stat) => {
                      return (
                        <option
                          style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          value={stat["StateCode"]}
                        >
                          {stat["State"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label">
                  Country
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

                <input
                  className="in-field"
                  type="text"
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "28px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  E mail
                </label>
                <input
                  className="in-field"
                  type="email"
                  id="compemail"
                  onChange={valemail}
                  value={compemail}
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "18px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Cr Terms
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

                {crtermsdata.length > 0 ? (
                  <select
                    className="ip-select"
                    id="crterms"
                    onChange={selectCrTerms}
                    value={crterms}
                    required
                  >
                    <option value="" disabled selected>
                      ** Select Cr Terms **
                    </option>
                    {crtermsdata.map((crterm) => {
                      return (
                        <option value={crterm["PaymentTerm"]}>
                          {crterm["PaymentTerm"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Max. Credit
                  {/* <span
                    style={{
                      color: "#f20707",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    *
                  </span> */}
                </label>

                <input
                  className="in-field"
                  id="maxcredit"
                  type="text"
                  onChange={funcmaxCredit}
                  value={maxcredit}
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-8px" }}>
              <div className="d-flex" style={{ gap: "20px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Cr Days
                </label>
                <input
                  className="in-field"
                  type="text"
                  id="creditdays"
                  onChange={funcCrdays}
                  value={creditdays}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3" style={{ marginTop: "-7px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Ave. Payment Days
                </label>
                <input
                  className="in-field"
                  type="text"
                  id="avepaydays"
                  disabled
                  onChange={(e) => setAvePayDays(e.target.value)}
                  value={avepaydays}
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-7px" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  First Billing
                </label>
                <input
                  className="in-field"
                  id="firstbillingdt"
                  type="text"
                  disabled
                  value={firstbillingdt}
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-7px" }}>
              <div className="d-flex" style={{ gap: "20px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Last Billing
                </label>
                <input
                  className="in-field"
                  id="lastbillingdt"
                  type="text"
                  disabled
                  value={lastbillingdt}
                />
              </div>
            </div>
            <div className="col-md-3" style={{ marginTop: "-7px" }}>
              <button
                className="button-style"
                id="btnSaveAllDetails"
                type="submit"
              >
                Save Customer Details
              </button>
              <button
                className="button-style"
                id="btncustupdateclose"
                onClick={() => navigate("/customer")}
              >
                Close{" "}
              </button>
            </div>
          </div>

          <label className="Out-standing-inv ms-2">Commercial Info</label>

          <div className="row mt-2">
            <div className="col-md-2">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Select</label>
                <select className="ip-select" id="gstpan" onChange={chkgstpan}>
                  <option value="">Select</option>
                  <option value="GST">GST</option>
                  <option value="PAN">PAN</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  GST No
                </label>
                {/* <InputMask mask="00-aaaaaaaaaa-a-a-a" maskChar=" " style={{ flex: '0.7', height: '30px', fontFamily: 'Roboto', fontSize: '12px' }} onChange={(e) => setGSTNO(e.target.value)} value={gstno} /> */}

                <input
                  className="in-field"
                  type="text"
                  id="gstno"
                  disabled={gstdisabled}
                  maxLength={15}
                  onChange={HandleGSTNo}
                  value={gstno}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  PAN No
                </label>
                <input
                  className="in-field"
                  type="text"
                  id="panno"
                  disabled={pandisabled}
                  maxLength={10}
                  onChange={valPanNo}
                  value={panno}
                />
              </div>
            </div>
            {/* <div className="col-md-3">
              <div className="row">
                <input
                  type="checkbox"
                  style={{
                    flex: "0.06",
                  }}
                  onChange={handlegovtorg}
                  checked={govtorg}
                />
                <label
                  className="form-label mt-2"
                  style={{
                    // flex: "0.",
                  }}
                >
                  {" "}
                  Is Govt Organization{" "}
                </label>
              </div>
            </div> */}
            <div className="col-md-2">
              <div className="row">
                <input
                  type="checkbox"
                  style={{
                    flex: "0.06",
                  }}
                  onChange={handlegovtorg}
                  checked={govtorg}
                />
                <label
                  className="form-label mt-2"
                  style={{
                    flex: "0.7",
                  }}
                >
                   Is Govt Organization{" "}
                </label>
              </div>
            </div>


            <div className="col-md-2">
              <div className="row">
                <input
                  type="checkbox"
                  style={{
                    flex: "0.06",
                  }}
                  onChange={handleexport}
                  checked={isexport}
                />
                <label
                  className="form-label mt-2"
                  style={{
                    flex: "0.7",
                  }}
                >
                  Is Export{" "}
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Folder Name
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

                <input
                  className="in-field"
                  type="text"
                  id="custfoldername"
                  onChange={(e) => setCustFolderName(e.target.value)}
                  value={custfoldername}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Delivery </label>
                {mtrlsourcedata.length > 0 ? (
                  <select
                    className="ip-select"
                    id="delivery"
                    onChange={selectMtrlSource}
                    value={delivery}
                  >
                    <option value="" disabled selected>
                      ** Select Delivery **
                    </option>
                    {mtrlsourcedata.map((mtlsrc) => {
                      return (
                        <option
                          style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          value={mtlsrc["MtrlSource"]}
                        >
                          {mtlsrc["MtrlSource"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="row">
                <input
                  type="checkbox"
                  style={{
                    flex: "0.1",
                  }}
                  onChange={(e) => setCustCurrent(!custcurrent)}
                  checked={custcurrent}
                />
                <label
                  className="form-label mt-2"
                  style={{
                    flex: "0.06",
                  }}
                >
                  Current{" "}
                </label>
              </div>
            </div>
          </div>

          <label className="Out-standing-inv ms-2">Contact Details</label>
          <div className="d-flex" style={{gap:'20px'}}>
            <div className="col-md-7 mt-1">
              <div
                style={{
                  height: "210px",
                  overflowY: "scroll",
                  border: "solid #c0c4c2 1px",
                }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr className="custtr">
                      <th className="custtd">Name</th>
                      <th className="custtd">Designation</th>
                      <th className="custtd">Dept</th>
                      <th className="custtd">E Mail</th>
                      <th className="custtd">Contact No1</th>
                      <th className="custtd">Contact No2</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {custContactData.map((ccont) => {
                      return (
                        <tr
                          className=""
                          key={ccont.id}
                          onClick={() => selectItem(ccont)}
                        >
                          <td className="">{ccont.conName}</td>
                          <td className="">{ccont.conDesignation}</td>
                          <td className="">{ccont.conDept}</td>
                          <td className="">{ccont.conE_mail}</td>
                          <td className="">{ccont.conTele_Office}</td>
                          <td className="">{ccont.conTele_Mobile}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-4 mt-1">
              <div className="form-bg">
                <div className="row">
                  <div className="col-md-12 d-flex" style={{ gap: "45px" }}>
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
                      </span>
                    </label>

                    <input
                      className="in-fields"
                      controlId="conName"
                      maxLength={30}
                      onChange={(e) => handleChangeAlpha(e)}
                      value={conName}
                    />
                  </div>

                  <div className="col-md-12 d-flex" style={{ gap: "18px" }}>
                    <label className="form-label">Designation</label>
                    <input
                      className="in-fields"
                      controlId="conDesignation"
                      onChange={(e) => setDesignation(e.target.value)}
                      value={conDesignation}
                    />
                  </div>

                  <div className="col-md-12 d-flex" style={{ gap: "57px" }}>
                    <label className="form-label">Dept</label>
                    <input
                      className="in-fields"
                      type="text"
                      controlId="conDept"
                      onChange={(e) => setDept(e.target.value)}
                      value={conDept}
                    />
                  </div>

                  <div className="col-md-12 d-flex" style={{ gap: "53px" }}>
                    <label className="form-label">Email</label>
                    <input
                      className="in-fields"
                      controlId="conE_mail"
                      onChange={valconemail}
                      value={conE_mail}
                    />
                  </div>

                  <div className="col-md-12 d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Contact No 1
                    </label>
                    <input
                      className="in-fields"
                      type="text"
                      controlId="conTele_Office"
                      maxLength={15}
                      onChange={handleChangePhNo}
                      value={conTele_Office}
                    />
                  </div>

                  <div className="col-md-12 d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Contact No 2
                    </label>
                    <input
                      className="in-fields"
                      type="text"
                      controlId="conTele_Mobile"
                      maxLength={15}
                      onChange={handleChangePhNo1}
                      value={conTele_Mobile}
                    />
                  </div>
                </div>
                <div className="row mb-1">
                  <div className="col-md-12 ms-5">
                    <button
                      className="button-style ms-5"
                      disabled={btnnew}
                      onClick={() => addContactData()}
                    >
                      New
                    </button>
                    <button
                      className="button-style"
                      disabled={btnupd}
                      onClick={() => updContactData()}
                    >
                      Update
                    </button>
                    <button
                      className="button-style"
                      disabled={btndel}
                      onClick={() => removeContactData()}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CustomerInfo;
