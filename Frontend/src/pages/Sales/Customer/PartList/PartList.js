import React, { useState, useEffect, useRef } from "react";
import { Table, Row, Form, Tabs, Tab, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

// import BreadcrumbsComponent from "../../components/BreadCumbsComponent";

//getCustomers, bompartsCustomer, assyPartCustomer, assyInsertPartCustomer,
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function PartList() {
  const typeaheadRef = useRef(null);
  // const typeaheadProcRef = useRef(null);
  // const typeaheadMatRef = useRef(null);

  let navigate = useNavigate();
  //const [formData, setFormData] = useState({ partid: '', qty: '' });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // const isFirstClickRef = useRef(true);
  const [custarray, setCustArray] = useState([]);
  const [selectedCust, setSelectedCust] = useState({});
  const [custcode, setCustCode] = useState("");
  //  const [custName, setCustName] = useState("");
  const [custbomparts, setCustBomParts] = useState([]);

  const [custassydetails, setCustAssyDetails] = useState([]);

  const [selectedCustAssy, setSelectedCustAssy] = useState({});

  const [custpartdetails, setCustPartDetails] = useState([]);
  let [selectedAssyCustId, setSelectedAssyCustId] = useState("");

  let [selectedPart1, setSelectedPart1] = useState([]);

  let [formpartid, setFormPartId] = useState("");
  let [formpartdesc, setFormPartDesc] = useState("");
  let [formcustpartid, setFormCustPartId] = useState("");
  let [formMagodid, setFormMagodID] = useState("");

  let [assmpartid, setAssmPartId] = useState("");
  let [assmid, setAssmId] = useState("");
  let [selectedPartId, setSelectedPartId] = useState([]);
  // let [btnaddnew, setBtnAddNew] = useState(false);
  // let [btnupdate, setBtnUpdate] = useState(true);
  //let [btnasmprtnew, setBtnAsmPrtNew] = useState(false);
  //let [btnasmprtdel, setBtnAsmPrtDel] = useState(true);

  // let [formdescription,setFormDescription] = useState("");
  // let [formmtrlcost, setFormMtrlCost] = useState("");
  // let [formjwcost, setFormJwCost] = useState("");
  // let [status, setStatus] = useState("");
  let [qty, setQty] = useState("");
  let [mtrlcost, setMtrlcost] = useState("");
  let [lbrcost, setLbrcost] = useState("");
  let [Statusss, setStatusss] = useState("Create");
  let [selectedbompart, setSelectedbompart] = useState([]);
  // let [selectedbomassyid, setSelectedbomassyid] = useState("");
  // setFormMtrlCost("");
  // setStatus("** Select ***");
  let [partDetailspartid, setpartDetailsPartId] = useState("");

  let [opearion, setOpearion] = useState("");
  let [material, setMaterial] = useState("");
  const [procdata, setProcdata] = useState([]);
  const [mtrldata, setMtrldata] = useState([]);
  let [strmtrlcode, setStrMtrlCode] = useState("");
  let [strprocessdescription, setStrProcessDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItms, setSelectedItms] = useState([]);

  useEffect(() => {
    //  setBtnAddNew(false);
    //  setBtnUpdate(true);
    // setBtnAsmPrtNew(true);
    // setBtnAsmPrtDel(true);
    async function getCustomersData() {
      postRequest(endpoints.getCustomers, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        setCustArray(data);
      });
    }
    getCustomersData();
    postRequest(endpoints.getProcessLists, {}, (pdata) => {
      let arr = [];
      for (let i = 0; i < pdata.length; i++) {
        pdata[i].label = pdata[i].Operation; //     pdata[i].ProcessDescription;
        arr.push(pdata[i]);
      }

      setProcdata(arr);

      // //console.log("pdata", pdata);
    });
    getRequest(endpoints.getMaterials, (mtrldata) => {
      //////console.log(mtrldata);
      let arr = [];
      for (let i = 0; i < mtrldata.length; i++) {
        mtrldata[i].label = mtrldata[i].Mtrl_Code;
        arr.push(mtrldata[i]);
      }

      setMtrldata(arr);
    });
  }, []);

  // const handleCustChange = async (e) => {
  //     const cust = custarray.find((cust) => cust["Cust_Code"] === e.target.value);
  //     console.log(cust);
  //     setSelectedCust(cust);
  //     postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
  //         // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
  //         if (data.length > 0) {
  //             setCustAssyDetails(data);
  //         } else {
  //             setCustAssyDetails([]);
  //         }
  //     });
  // };

  let handleCustChange = async (evt) => {
    // let custdet = evt.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    // let cdet = custdet.substring(0, 4)
    // console.log(cdet);
    // setCustCode(custdet.substring(0, 4));
    // console.log("cust data = ", evt);
    // console.log("cust code = ", evt[0].Cust_Code);
    // console.log("table customer = ", custarray);
    const cust = custarray.find(
      (cust) => cust["Cust_Code"] === evt[0].Cust_Code
    ); // custdet.substring(0, 4));
    console.log(cust);
    setSelectedCust(cust);
    setCustCode(cust["Cust_Code"]);

    clearAssydata();
    clearcustBOM();

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: evt[0].Cust_Code },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    postRequest(
      endpoints.assyPartCustomer,
      { custcode: evt[0].Cust_Code },
      (data) => {
        // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {

        if (data.length > 0) {
          setCustAssyDetails(data);
        } else {
          setCustAssyDetails([]);
        }
      }
    );
    // postRequest(endpoints.custbomAssemblyParts, { custcode: evt.target.value }, (data) => {
    //     bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         console.log(data)
    //         setCustPartDetails(data);
    //     } else {
    //         setCustPartDetails([]);
    //     }
    // });

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: cust["Cust_Code"] },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    // postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
    //     // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         setCustAssyDetails(data);
    //     } else {
    //         setCustAssyDetails([]);
    //     }
    // });
    postRequest(
      endpoints.custbomAssemblyParts,
      { custcode: cust["Cust_Code"] },
      (data) => {
        // bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
        if (data.length > 0) {
          console.log(data);
          setCustPartDetails(data);
        } else {
          setCustPartDetails([]);
        }
      }
    );
  };

  const addBOMPart = async (e) => {
    e.preventDefault();
    let partid = e.target.elements.formpartid.value;
    let partdesc = e.target.elements.formpartdesc.value;
    if (!partid || !partdesc) {
      toast.error("Please enter part id and description");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    postRequest(
      endpoints.saveCustBOMParts,
      {
        partid: partid,
        partdescription: partdesc,
        custcode: selectedCust["Cust_Code"],
      },
      (response) => {
        if (response.status === "Success") {
          setCustBomParts((olddata) => [
            ...olddata,
            {
              partid: partid,
              partdesc: partdesc,
              magodpartid: response["MagodPartId"],
            },
          ]);
          toast.success("Added PartId Successfully..");

          // if (isFirstClickRef.current) {
          //   isFirstClickRef.current = false;
          // }

          clearcustBOM();
          postRequest(
            endpoints.getCustBOMParts,
            { custcode: selectedCust["Cust_Code"] },
            (partsdata) => {
              console.log(partsdata);
              if (partsdata.length > 0) {
                setCustBomParts(partsdata);
              } else {
                setCustBomParts([]);
              }
              clearcustBOM();
            }
          );
        } else {
          toast.error("Duplicate Part Id for this Customer..");

          return;
        }
        clearcustBOM();
      }
    );
    clearcustBOM();
    console.log(custbomparts);
  };

  function clearAssydata() {
    document.getElementById("formmagodid").value = "";
    document.getElementById("formassyid").value = "";
    document.getElementById("formdescription").value = "";
    document.getElementById("formstatus").value = "";
    document.getElementById("formmtrlcost").value = "";
    document.getElementById("formjwcost").value = "";
    document.getElementById("formstatus").value = "Create";
  }

  const addAssemblyDetails = async (e) => {
    e.preventDefault();
    console.log(e.target.elements.formstatus.value);
    let assyid = e.target.elements.formassyid.value;
    let formdescription = e.target.elements.formdescription.value;
    let assmstatus = e.target.elements.formstatus.value;
    let formmtrlcost = e.target.elements.formmtrlcost.value;
    let formjwcost = e.target.elements.formjwcost.value;
    let oprtion = strprocessdescription; // e.target.elements.formoperation.value;
    let mtrl = strmtrlcode;

    console.log(e.target.elements.formassyid.value);
    setFormMagodID(e.target.elements.formassyid.value);
    // setCustAssyDetails((custassydetails => [custassydetails,{"MagodCode": resp["magodassmid"], "AssyCust_PartId": assyid, "AssyDescription": formdescription, "MtrlCost": formmtrlcost, "JobWorkCost": formjwcost, assystatus: assmstatus}]));
    // setBtnAsmPrtNew(false);
    // setBtnAsmPrtDel(true);

    clearcustAssydata(e);
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    console.log("mtrl cost : ", formmtrlcost);
    console.log("jwcost :", formjwcost);
    postRequest(
      endpoints.chkAssyDupl,
      { custcode: selectedCust["Cust_Code"], partid: assyid },
      (data) => {
        if (data.status == "Duplicate") {
          // toast.error("PartId Already Exists for selected Customer");
          return;
        } else {
          postRequest(
            endpoints.assyInsertPartCustomer,
            {
              custcode: selectedCust["Cust_Code"],
              partid: assyid,
              partdescription: formdescription,
              mtrlcost: e.target.elements.formmtrlcost.value, //formmtrlcost,
              jwcost: e.target.elements.formjwcost.value, // formjwcost,
              Operation: oprtion,
              Material: mtrl,
              assystatus: "Edit",
            },
            (resp) => {
              console.log(resp);
              setCustAssyDetails((olddata) => [
                ...olddata,
                {
                  MagodCode: resp["magodassmid"],
                  AssyCust_PartId: assyid,
                  AssyDescription: formdescription,
                  MtrlCost: formmtrlcost,
                  JobWorkCost: formjwcost,
                  assystatus: assmstatus,
                  Operation: oprtion,
                  Material: mtrl,
                },
              ]);
            }
          );
          clearcustAssydata(e);

          setConfirmModalOpen(true);
          // toast.success("Assembly added successfully");
        }
      }
    );
  };

  const clearcustAssydata = (e) => {
    // setBtnAddNew(false);
    // setBtnUpdate(true);
    console.log("Clearing Assy Data ");
    e.target.elements.formassyid.value = "";
    e.target.elements.formdescription.value = "";
    e.target.elements.formstatus.value = "Create";
    e.target.elements.formmtrlcost.value = "";
    e.target.elements.formjwcost.value = "";
    // e.target.elements.formoperation.value = "";
    //   setStrProcessDescription(" ");
    //  setStrMtrlCode(" ");
  };

  function clearcustBOM() {
    console.log("clear Cust BOM");
    formpartid = "";
    setFormPartId("");
    setFormPartDesc("");
    setQty(0);
    // setBtnAsmPrtNew(false);
    // setBtnAsmPrtDel(false);
  }

  //   const addCustPart = async (e) => {
  //     e.preventDefault();
  //     console.log("Add Cust Part: ", partDetailspartid); //document.getElementById("formpartid").value);
  //     //setBtnAsmPrtDel(true);
  //     //setBtnAsmPrtNew(false);
  //     if (!selectedCustAssy["AssyCust_PartId"]) {
  //       toast.error("Please select an assembly");
  //       return;
  //     }
  //     let selcustassy = selectedCustAssy["AssyCust_PartId"];

  //     let partid = partDetailspartid; // formcustpartid;
  //     let qty = e.target.elements.formqty.value;
  //     if (!partid || !qty) {
  //       toast.error("Please enter part id and qty");
  //       return;
  //     }
  //     if (!selectedCust["Cust_name"]) {
  //       toast.error("Please select a customer");
  //       return;
  //     }
  //     console.log("custbomparts: ", custbomparts);
  //     let partdesc = custbomparts.find((part) => part["PartId"] === partid)["PartDescription"];

  //     console.log("custbomparts : ", custbomparts)
  //     // toCheck BOM parts

  //     for (let i = 0; i < custpartdetails.length; i++) {
  //       if (custpartdetails[i].partid === partid) {
  //         toast.error("Duplicate Part Id.. Please check..");

  //         return;
  //       }
  //     }

  //     toast.success("Part added successfully");
  //     console.log("line - 447 - part ID : ",partid)
  //  //   if (partid !== null && partid !== "") {
  //   if (partid && partid.trim() !== "" && selcustassy && partdesc && qty) {
  //       //setCustPartDetails((olddata => [...olddata, { assyPartId: selectedCustAssy["AssyCust_PartId"], partid: partid, partdesc: partdesc, qty: qty }]));
  //       setCustPartDetails((olddata) => [
  //         ...olddata,
  //         {
  //           assyPartId: selcustassy,
  //           partid: partid,
  //           partdesc: partdesc,
  //           qty: qty,
  //         },
  //       ]);

  //       typeaheadRef.current.clear();

  //     }
  //     console.log("cust part details from  - add cust part :",custpartdetails);

  //     clearcustBOM();
  //     e.target.elements.formqty.value = 0;
  //   };

  // const addCustPart = async (e) => {
  //   e.preventDefault();

  //   console.log("Add Cust Part: ", partDetailspartid);

  //   if (!selectedCustAssy["AssyCust_PartId"]) {
  //     toast.error("Please select an assembly");
  //     return;
  //   }

  //   let selcustassy = selectedCustAssy["AssyCust_PartId"];
  //   let partid = partDetailspartid;
  //   let qty = e.target.elements.formqty.value;

  //   if (!partid || !qty) {
  //     toast.error("Please enter Part ID and Quantity");
  //     return;
  //   }

  //   if (!selectedCust["Cust_name"]) {
  //     toast.error("Please select a customer");
  //     return;
  //   }

  //   let partdesc = custbomparts.find((part) => part["PartId"] === partid)?.["PartDescription"];
  //   if (!partdesc) {
  //     toast.error("Part description not found, invalid part ID");
  //     return;
  //   }

  //   for (let i = 0; i < custpartdetails.length; i++) {
  //     if (custpartdetails[i].partid === partid) {
  //       toast.error("Duplicate Part ID detected");
  //       return;
  //     }
  //   }

  //   console.log("Valid Data - Adding Part:", { partid, partdesc, qty, selcustassy });

  //   if (partid && partid.trim() !== "" && selcustassy && partdesc && qty) {
  //     setCustPartDetails((olddata) => {
  //       const newData = [
  //         ...olddata,
  //         {
  //           assyPartId: selcustassy,
  //           partid: partid,
  //           partdesc: partdesc,
  //           qty: qty,
  //         },
  //       ];
  //       console.log("Updated CustPartDetails: ", newData);
  //       return newData;
  //     });

  //     typeaheadRef.current.clear();
  //     toast.success("Part added successfully");
  //     clearcustBOM();
  //     e.target.elements.formqty.value = 0;
  //   } else {
  //     console.error("Invalid data, skipping update.");
  //   }
  // };

  const addCustPart = async (e) => {
    e.preventDefault();

    console.log("Add Cust Part: ", partDetailspartid);
    let selcustassy = selectedCustAssy["AssyCust_PartId"];
    let partid = partDetailspartid;
    let qty = e.target.elements.formqty.value;

    console.log(
      "Debugging Variables - partid:",
      partid,
      ", selcustassy:",
      selcustassy,
      ", qty:",
      qty
    );

    if (!partid || partid.trim() === "") {
      toast.error("Invalid Part ID, skipping.");
      return;
    }
    if (!qty || isNaN(qty)) {
      toast.error("Invalid Quantity, skipping.");
      return;
    }

    let partdesc = custbomparts.find((part) => part["PartId"] === partid)?.[
      "PartDescription"
    ];
    if (!partdesc) {
      toast.error("Invalid Part ID, no description found.");
      return;
    }

    // Duplicate check
    if (custpartdetails.some((item) => item.partid === partid)) {
      toast.error("Duplicate Part ID detected.");
      return;
    }

    setCustPartDetails((olddata) => {
      const newData = [
        ...olddata.filter((item) => item.partid && item.partid.trim() !== ""), // Filter blanks
        {
          assyPartId: selcustassy,
          partid: partid,
          partdesc: partdesc,
          qty: qty,
        },
      ];
      // console.log("Updated CustPartDetails: ", newData);
      alert("Please Save the data before closing");
      return newData;
    });

    typeaheadRef.current.clear();
    e.target.elements.formqty.value = 0;
    toast.success("Part added successfully");
  };

  //Sorting BOM Item List
  const [sortConfigbomitemlist, setsortConfigbomitemlist] = useState({
    key: null,
    direction: null,
  });

  // sorting function for table headings of the table
  const requestSortBomItemList = (key) => {
    let direction = "asc";
    if (
      sortConfigbomitemlist.key === key &&
      sortConfigbomitemlist.direction === "asc"
    ) {
      direction = "desc";
    }
    setsortConfigbomitemlist({ key, direction });
  };

  const sortedDatabomItemList = () => {
    console.log("custbomparts: ", custbomparts);
    const dataCopybomItemList = [...custbomparts];

    if (sortConfigbomitemlist.key) {
      dataCopybomItemList.sort((a, b) => {
        let valueA = a[sortConfigbomitemlist.key];
        let valueB = b[sortConfigbomitemlist.key];

        // Convert only for the "integer" columns
        // if (
        //   sortConfigbomitemlist.key === "QtyToNest" ||
        //   sortConfigtaskprtDets.key === "QtyNested" ||
        //   sortConfigtaskprtDets.key === "QtyProduced" ||
        //   sortConfigtaskprtDets.key === "QtyCleared"
        // ) {
        //   valueA = parseFloat(valueA);
        //   valueB = parseFloat(valueB);
        // }

        if (valueA < valueB) {
          return sortConfigbomitemlist.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigbomitemlist.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopybomItemList;
  };

  let renderBomItemList = (part) => {
    return (
      <tr className="">
        <td>{part["MagodPartId"]}</td>
        <td>{part["PartId"]}</td>
        <td>{part["PartDescription"]}</td>
      </tr>
    );
  };

  // Sorting Assembly List
  const [sortConfigAssypart, setsortConfigAssmpart] = useState({
    key: null,
    direction: null,
  });

  // sorting function for table headings of the table
  const requestSortAssypart = (key) => {
    let direction = "asc";
    if (
      sortConfigAssypart.key === key &&
      sortConfigAssypart.direction === "asc"
    ) {
      direction = "desc";
    }
    setsortConfigAssmpart({ key, direction });
  };

  const sortedDataAssyPart = () => {
    const dataCopyAssypart = [...custassydetails];

    if (sortConfigAssypart.key) {
      dataCopyAssypart.sort((a, b) => {
        let valueA = a[sortConfigAssypart.key];
        let valueB = b[sortConfigAssypart.key];

        // Convert only for the "integer" columns
        if (
          sortConfigAssypart.key === "MtrlCost" ||
          sortConfigAssypart.key === "JobWorkCost"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigAssypart.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigAssypart.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyAssypart;
  };

  let renderassemblydetails = (assmpart, id) => {
    return (
      <tr
        className=""
        style={{
          backgroundColor: selectedAssyCustId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => selectAssemblyPart(assmpart, id)}
      >
        <td>{assmpart["MagodCode"]}</td>
        <td>{assmpart["AssyCust_PartId"]}</td>
        <td>{assmpart["AssyDescription"]}</td>
        <td>{assmpart["MtrlCost"]}</td>
        <td>{assmpart["JobWorkCost"]}</td>
        {/* <td>{assmpart["Operation"]}</td>
        <td>{assmpart["Material"]}</td> */}
        <td hidden>{assmpart["Status"]}</td>
      </tr>
    );
  };

  // Sorting Assembly List
  const [sortConfigCustpart, setsortConfigCustpart] = useState({
    key: null,
    direction: null,
  });

  // sorting function for table headings of the table
  const requestSortCustpart = (key) => {
    let direction = "asc";
    if (
      sortConfigCustpart.key === key &&
      sortConfigCustpart.direction === "asc"
    ) {
      direction = "desc";
    }
    setsortConfigCustpart({ key, direction });
  };

  const sortedDataCustPart = () => {
    const dataCopyCustpart = [...custpartdetails];

    if (sortConfigCustpart.key) {
      dataCopyCustpart.sort((a, b) => {
        let valueA = a[sortConfigCustpart.key];
        let valueB = b[sortConfigCustpart.key];

        // Convert only for the "integer" columns
        if (sortConfigCustpart.key === "qty") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigCustpart.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigCustpart.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyCustpart;
  };

  // RENDER BOM TABLEDATA
  let rendercustpartdetail = (custpart, id) => {
    let custpartid = custpart["partid"];

    // write if condetion to remove the default assypartidissue
    if (custpartid === null) {
    } else {
      console.log(
        "Id:" +
          id +
          " Cust:" +
          custcode +
          " custpartid: " +
          custpartid +
          " assyPartId: " +
          custpart.assyPartId
      );

      // btnasmprtdel
      // setBtnAsmPrtDel(true);
      return (
        <tr
          className=""
          style={{
            backgroundColor: selectedPartId === id ? "#98A8F8" : "",
            overflowY: "scroll",
            cursor: "pointer",
          }}
          id={id}
          onClick={() => selectItem(custpart, id)}
        >
          <td>{custpart["assyPartId"]}</td>
          <td>{custpart["partid"]}</td>
          <td>{custpart["partdesc"]}</td>
          <td>{custpart["qty"]}</td>
        </tr>
      );
    }
  };

  let selectedPart = (e) => {
    setFormCustPartId(e.target.value);
  };

  let selectAssemblyPart = (part, id) => {
    console.log("entering into onclick assy");
    //  setBtnAddNew(true);
    //  setBtnUpdate(false);
    // setBtnAsmPrtDel(true);
    // setBtnAsmPrtNew(false);
    setSelectedAssyCustId(id);
    document.getElementById("formmagodid").value = part["MagodCode"];
    document.getElementById("formassyid").value = part["AssyCust_PartId"];
    document.getElementById("formdescription").value = part["AssyDescription"];
    document.getElementById("formmtrlcost").value = parseFloat(
      part["MtrlCost"]
    ).toFixed(2);
    document.getElementById("formjwcost").value = parseFloat(
      part["JobWorkCost"]
    ).toFixed(2);
    // document.getElementById("formoperation").value = part["Operation"];
    document.getElementById("formstatus").value = "Edit";
    console.log("id: ", id);
    // document.getElementById("formmtrl").value = part["Material"];
    // new code
    const materialOption = { Mtrl_Code: part["Material"] }; // Assuming material uses Mtrl_Code
    setSelectedItems([materialOption]); // Update typeahead selection with the material
    setStrMtrlCode(part["Material"]); // Set material code in the state

    // document.getElementById("formstatus").value = "Create"; // part["Status"];

    const processOption = { ProcessDescription: part["Operation"] };
    setSelectedItms([processOption]);
    // setStrProcessDescription(part["ProcessDescription"]);
    setStrProcessDescription(part["Operation"]);

    // console.log(part["Status"]);
    //setStatusss(part["Status"]);
    setStatusss("Edit");
    console.log(part);
    setSelectedCustAssy(part);
    console.log(part["AssyCust_PartId"]);
    console.log(part["MtrlCost"]);
    console.log(part["JobWorkCost"]);
    let cstasmid = part["AssyCust_PartId"];
    postRequest(
      endpoints.custbomAssemblyParts,
      {
        custcode: selectedCust["Cust_Code"],
        custassyid: cstasmid, // part["AssyCust_PartId"],
      },
      (resp) => {
        setCustPartDetails(resp);
      }
    );
  };

  // console.log("Statusss", Statusss);

  const updateAssembly = () => {
    console.log("entering into updateassy");
    //  setBtnAddNew(false);
    //setBtnUpdate(false);
    let mmagodid = document.getElementById("formmagodid").value;
    let massyid = document.getElementById("formassyid").value;
    let assmstatus = document.getElementById("formstatus").value;
    let assmdesc = document.getElementById("formdescription").value;
    let mtrlcost = document.getElementById("formmtrlcost").value;
    let jobworkcost = document.getElementById("formjwcost").value;
    let Operation = strprocessdescription; // document.getElementById("formoperation").value;
    let mtrl = strmtrlcode;
    // let mtrl = material;

    console.log("jobworkcost: ", jobworkcost);
    console.log("mtrlcost: ", mtrlcost);
    postRequest(
      endpoints.UpdateBOMAssembly,
      {
        mmagodid,
        massyid,
        assmstatus,
        assmdesc,
        mtrlcost,
        jobworkcost,
        Operation,
        mtrl,
      },
      (resp) => {
        console.log(resp);
        if (resp.status === "success") {
          // if (isFirstClickRef.current) {
          toast.success("Updated Assembly Details Successfully");
          //   isFirstClickRef.current = false;
          // }
          setCustAssyDetails(resp.data);
        }
      }
    );
  };

  let saveBomAssemblyParts = async () => {
    console.log("Saving BOM Assembly Parts", custpartdetails);
    //   setBtnAddNew(false);
    //  setBtnUpdate(true);

    //setCustPartDetails

    //  console.log("saveBomAssemblyParts");
    // console.log(custpartdetails);

    let mmagodid = document.getElementById("formmagodid").value;
    let massyid = document.getElementById("formassyid").value;
    let assmstatus = document.getElementById("formstatus").value;
    let assmdesc = document.getElementById("formdescription").value;
    let mtrlcost = document.getElementById("formmtrlcost").value;
    let jobworkcost = document.getElementById("formjwcost").value;
    let Operation = strprocessdescription; // document.getElementById("formoperation").value;
    //  let mtrl = strmtrlcode;
    let mtrl = material;

    console.log("jobworkcost: ", jobworkcost);
    console.log("mtrlcost: ", mtrlcost);
    postRequest(
      endpoints.UpdateBOMAssembly,
      {
        mmagodid,
        massyid,
        assmstatus,
        assmdesc,
        mtrlcost,
        jobworkcost,
        Operation,
        mtrl,
      },
      (resp) => {
        console.log(resp);
        if (resp.status === "success") {
          // if (isFirstClickRef.current) {
          //   toast.success("Updated Assembly Details Successfully");
          //   isFirstClickRef.current = false;
          // }
          setCustAssyDetails(resp.data);
        }
      }
    );

    postRequest(
      endpoints.bomAssemblyParts,
      { custcode: selectedCust["Cust_Code"], dataarray: custpartdetails },
      (resp) => {
        if (resp.status === "success") {
          //          typeaheadProcRef.current.clear();
          //        typeaheadMatRef.current.clear();

          setConfirmModalOpen(true);
        }
      }
    );
  };

  let selectItem = (item, id) => {
    console.log("item: ", item);
    console.log("id: " + id);
    setSelectedbompart(item);
    // console.log(item);
    // setBtnAsmPrtDel(false);
    // setBtnAsmPrtNew(true);
    setSelectedPartId(id);
    setAssmPartId(item.partid);
    setAssmId(item.assyPartId);
    // setStatus();
  };

  // let deleteassmparts = async () => {
  //   console.log("deleteassmparts");
  //   setBtnAsmPrtDel(true);
  //   setBtnAsmPrtNew(false);
  //   if (isFirstClickRef.current) {
  //     toast.success("Deleted successfully");
  //     isFirstClickRef.current = false;

  //     console.log("custpartsdetails", custpartdetails);
  //     let olddata = custpartdetails;
  //     let newdata = olddata.filter(
  //       (data) => data.assyid !== assmid && data.partid != assmpartid
  //     );
  //     setCustPartDetails(newdata);
  //     postRequest(
  //       endpoints.DeleteBOMAssemblyPart,
  //       { assmid, assmpartid },
  //       (deldata) => {
  //         if (deldata.status == "success") {
  //           console.log("Delete Success");
  //         }
  //       }
  //     );
  //   }
  // };

  // new solution to partid delete issue
  let deleteassmparts = async (custpart) => {
    console.log("custpartid", custpart.partid);
    console.log("custassyid", custpart.assyPartId);

    // debugger;
    // setBtnAsmPrtDel(true);
    // setBtnAsmPrtNew(false);
    console.log(custpartdetails);
    let olddata = custpartdetails;
    let newdata = olddata.filter(
      (data) => data.assyid !== assmid && data.partid != assmpartid
    );
    // console.log(olddata);
    console.log(newdata);
    setCustPartDetails(newdata);
    postRequest(
      endpoints.DeleteBOMAssemblyPart,
      { selectedbompart, custcode },
      //  { olddata, newdata },
      (deldata) => {
        if (deldata.status == "success") {
          toast.success("Part Deleted Successfully");
          console.log("Delete Success");
        }
      }
    );
  };

  // let handleChangeQtyNumeric = (evt) => {
  //   //  console.log("evt.target.value", evt.target.value);
  //   const mvalue = evt.target.value.replace(/[^0-9]/gi, "");
  //   //console.log("mvalve", mvalue);
  //   setQty(mvalue);
  // };

  // let handleChangeQtyNumeric = (evt) => {
  //   if (/^[1-9]\d*$/.test(originalValue)) {
  //     setQty(originalValue);
  //   } else {
  //     setQty("");
  //     // alert('Please enter a valid positive integer.');
  //   }

  //   // const originalValue = evt.target.value;
  //   // if (originalValue === '') {
  //   //    setQty('');
  //   //    return;
  //   // }

  //   // if (originalValue.length > 1) {
  //   // // Remove any non-digit characters
  //   // const numericValue = originalValue.replace(/^0+/, '');
  //   // }

  //   // if (/^\d+$/.test(originalValue)) {
  //   //   setQty(originalValue);
  //   // }

  //   // // Ensure the value is a positive whole number
  //   // // if (numericValue && parseInt(numericValue) > 0) {
  //   // //   setQty(numericValue);
  //   // // }
  //   //  else {
  //   //   setQty("");
  //   //   alert("Please enter a value greater than 0.");
  //   // }

  //   const originalValue = evt.target.value;

  //   // Allow clearing the input
  //   if (originalValue === "") {
  //     setQty("");
  //     return;
  //   }

  //   // Validate input to only allow positive integers
  //   if (originalValue.replace(/(\d{3})\d+/, "$1")) {
  //     setQty(originalValue);
  //   } else {
  //     setQty("");
  //     alert("Please enter a valid integer.");
  //   }
  // };

  const handleChangeQtyNumeric = (evt) => {
    const originalValue = evt.target.value;

    // Allow clearing the input
    if (originalValue === "") {
      setQty("");
      return;
    }

    // Only allow positive integers (no zero)
    if (/^[1-9]\d*$/.test(originalValue)) {
      setQty(originalValue);
    } else {
      alert("Please enter a value greater than 0.");
      return;
    }
  };

  const blockInvalidQtyChar = (e) => {
    const invalidChars = ["e", "E", "+", "-", "."];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  // const blockInvalidQtyChar = (e) =>
  //   ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

  const handleChangeMtrlCost = (e) => {
    //  const mvalue = e.target.value.replace(/[^0-9]/gi, "");
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      // Only allow numeric values setValue(value); }
      setMtrlcost(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  // let handleChangeLbrCost = (e) => {
  //   const Inputvalue = e.target.value.replace(/[^0-9]/gi, "");
  //   // if (/^\d*\.?\d{0,2}$/.test(Inputvalue)){
  //   //   setLbrcost(Inputvalue);
  //   //   }
  //    console.log("mvalve", Inputvalue);
  //    setLbrcost(Inputvalue);
  // };

  let handleChangeLbrCost = (e) => {
    // Use a regular expression to allow only numbers with up to two decimal places
    const inputValue = e.target.value;

    // Validate the input value using regex
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      setLbrcost(inputValue); // Update the state only if the value is valid
    } else {
      console.log("Invalid input:", inputValue); // Log invalid input for debugging
    }

    console.log("Validated value:", inputValue);
  };

  let handleChangeOpearion = (evt) => {
    const mvalue = evt.target.value;
    console.log("mvalve", mvalue);
    setOpearion(mvalue);
  };
  let handleChangeMaterial = (evt) => {
    const mvalue = evt.target.value;
    console.log("mvalve", mvalue);
    setMaterial(mvalue);
  };
  const handleMtrlCodeTypeaheadChangeeee = (selectedOptions) => {
    console.log("selectedOptions....", selectedOptions);
    setSelectedItems(selectedOptions);
    // if (selectedOptions.length > 0) {
    //   setLastSlctedRow(selectedOptions[0]);
    // }
    setMaterial(selectedOptions[0]?.Mtrl_Code);

    console.log("selectedOptions[0]?.Mtrl_Code", selectedOptions[0]?.Mtrl_Code);
    const selectedValue =
      selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
    console.log("selectedValue", selectedValue);
    setStrMtrlCode(selectedValue);
  };

  const handleProcessTypeaheadChangeeee = (selectedItms) => {
    console.log("selectedOptions....", selectedItms);
    setSelectedItms(selectedItms);

    //  console.log("selectedOptions[0]?.ProcessDescription", selectedItms[0]?.ProcessDescription);

    // const selectedValue = selectedItms.length > 0 ? selectedItms[0]?.ProcessDescription : " ";
    const selectedValue =
      selectedItms.length > 0 ? selectedItms[0]?.Operation : " ";
    console.log("selectedValue", selectedValue);
    setStrProcessDescription(selectedValue);
  };

  const handlePartIdTypeaheadChange = (selectedOptions) => {
    //   const handlePartIdTypeaheadChange = (selectedOptions) => {
    console.log("Typehaed: ", selectedOptions[0]);
    console.log("Typehaed: ", selectedOptions[0]?.PartId);
    console.log("Main Magod Code: ", selectedCustAssy["MagodCode"]);

    if (
      selectedCustAssy["MagodCode"] === "" ||
      selectedCustAssy["MagodCode"] === undefined
    ) {
      toast.warning(
        "Please select Assembly details before selecting Part Details"
      );
      return;
    }

    setSelectedPart1(selectedOptions); // Update the state
    setpartDetailsPartId(selectedOptions[0]?.PartId);
    setFormCustPartId(selectedOptions[0]?.PartId);
  };

  let handleKeyDown = (evt) => {
    // Prevent entering the letter "e" (101 or 69 in key codes)
    if (evt.key === "e" || evt.keyCode === 101 || evt.keyCode === 69) {
      evt.preventDefault();
    }
    // Allow decimals for two digits only
    const value = evt.target.value;
    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length >= 2) {
      evt.preventDefault();
    }
  };

  const yesClicked = () => {
    //  handleClose(true);
    toast.success("Assy Info Saved");
    // typeaheadProcRef.current.clear();
    // typeaheadMatRef.current.clear();
    closeModal();

    return;
  };

  const closeModal = () => {
    // typeaheadProcRef.current.clear();
    // typeaheadMatRef.current.clear();
    setConfirmModalOpen(false);
  };

  return (
    // <Container>
    //     <div className="addquotecard">
    //         {/* <Row className="justify-content-md-center"> */}
    //         <h4 className="addquotecard-header">Customer BOM</h4>
    <div>
      {/* <BreadcrumbsComponent /> */}
      <h4 className="title">Customer BOM</h4>

      <div className="form-style"></div>
      <div className="row">
        <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
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

          <Typeahead
            className="ip-select mt-1"
            // id="formCustName"
            id="formCustName"
            // onChange={selectCust}
            options={custarray}
            placeholder="Select Customer"
            onChange={(label) => handleCustChange(label)}
          />
        </div>
        <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
          <label className="form-label mt-1">Code </label>
          <input
            className="in-field mt-1"
            id="formCustCode"
            disabled
            value={custcode}
          />
        </div>
        <div className="col-md-3">
          <div>
            <button
              className="button-style"
              id="btnclose"
              type="submit"
              onClick={() => navigate("/customer")}
            >
              Close{" "}
            </button>
          </div>
        </div>
      </div>
      <Row>
        <Tabs defaultActiveKey="bomitemslist" className="mb-1  tab_font">
          <Tab eventKey="bomitemslist" title="Customer BOM Items List">
            <div className="row">
              <div
                className="col-md-8"
                style={{ overflowY: "scroll", height: "200px" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortBomItemList("MagodPartId")}>
                        Magod Part ID
                      </th>
                      <th onClick={() => requestSortBomItemList("PartId")}>
                        Part ID
                      </th>
                      <th
                        onClick={() =>
                          requestSortBomItemList("PartDescription")
                        }
                      >
                        Part Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custbomparts != null
                      ? custbomparts.map((part) => renderBomItemList(part))
                      : null} */}
                    {sortedDatabomItemList().map((part) =>
                      renderBomItemList(part)
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addBOMPart} autoComplete="off">
                  <h6 className="mb-3" style={{ textAlign: "center" }}>
                    <u>Part as identified in Customer Drawing</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "60px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part ID
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
                      id="formpartid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Part ID"
                      required
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part Description
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
                      id="formpartdesc"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Part Description"
                      required
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <button
                      variant="primary"
                      type="submit"
                      className="button-style justify-content-center"
                    >
                      Add Part
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </Tab>

          <Tab eventKey="custpartassmlist" title="Customer Assembly List">
            <div className="row">
              <div
                className="col-md-8"
                style={{ maxHeight: "275px", overflowY: "scroll" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortAssypart("MagodCode")}>
                        Magod Code
                      </th>
                      <th
                        onClick={() => requestSortAssypart("AssyCust_PartId")}
                      >
                        Assm Cust PartID
                      </th>
                      <th
                        onClick={() => requestSortAssypart("AssyDescription")}
                      >
                        Assm Description
                      </th>
                      <th onClick={() => requestSortAssypart("MtrlCost")}>
                        Mtrl Cost
                      </th>
                      <th onClick={() => requestSortAssypart("JobWorkCost")}>
                        JW Cost
                      </th>
                      {/* <th onClick={() => requestSortAssypart("Operation")}>Operation</th>
                      <th onClick={() => requestSortAssypart("Mtrl_Code")}>Material</th> */}
                      {/* {[
                        "Magod Code",
                        "Assm Cust PartID",
                        "Assm Description",
                        "Mtrl Cost",
                        "JW Cost",
                      ].map((item) => {
                        return <th>{item}</th>;
                      })} */}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custassydetails != null
                      ? custassydetails.map((part, id) =>
                        renderassemblydetails(part, id)
                      )
                      : null} */}
                    {sortedDataAssyPart().map((part, id) =>
                      renderassemblydetails(part, id)
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addAssemblyDetails} autoComplete="off">
                  <h6 className="" style={{ textAlign: "center" }}>
                    <u>Part / Assembly Details</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "30px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Magod ID
                    </label>
                    <input
                      id="formmagodid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Magod ID"
                      disabled
                      style={{ marginTop: "-5px" }}
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap", marginTop: "-5px" }}
                    >
                      Assembly ID
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
                      id="formassyid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Assembly ID"
                      required
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "15px" }}>
                    <label className="form-label" style={{ marginTop: "-5px" }}>
                      Description
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
                      id="formdescription"
                      className="in-fields"
                      as="textarea"
                      type="text"
                      placeholder="Enter Description"
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "50px" }}>
                    <label className="form-label" style={{ marginTop: "-5px" }}>
                      Status
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

                    <select
                      className="ip-select dropdown-field"
                      id="formstatus"
                      aria-label="Select Status"
                      // value={Statusss}
                      defaultValue={Statusss}
                      style={{ marginTop: "-1px" }}
                    >
                      <option value="Create" selected>
                        Create
                      </option>
                      <option value="Edit">Edit</option>
                      <option value="Locked">Locked</option>
                      <option value="Closed">Closed</option>

                      {/* {["Create", "Edit", "Locked", "Closed"].map((st) => {
                        return <option value={st}>{st}</option>;
                      })} */}
                    </select>
                  </div>

                  <div className="d-flex" style={{ gap: "35px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Mtrl Cost
                    </label>
                    <input
                      id="formmtrlcost"
                      className="in-fields"
                      type="text"
                      onKeyPress={handleKeyPress}
                      onChange={handleChangeMtrlCost}
                      // value={mtrlcost}
                      defaultValue={parseFloat(mtrlcost)}
                      placeholder="Enter Mtrl Cost"
                    />
                  </div>
                  <div className="d-flex" style={{ gap: "40px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      JW Cost
                    </label>
                    <input
                      id="formjwcost"
                      className="in-fields"
                      type="text"
                      onKeyPress={handleKeyPress}
                      // min="0"
                      onChange={handleChangeLbrCost}
                      defaultValue={parseFloat(lbrcost)}
                      //  value={lbrcost}
                      placeholder="Enter Labour Cost"
                    />
                  </div>

                  {/* <div
                    className="d-flex"
                    style={{ gap: "29px"}}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}>
                      Operation
                    </label>
                    {procdata.length > 0 || procdata != null ? (
                      <Typeahead
                        className="ip-select dropdown-field"
                        id="formoperation"
                        labelKey={(option1) =>
                          option1.Operation || "Unknown Operation"
                        }
                        // labelKey={"ProcessDescription"}
                        name="newSrlProcess"
                        ref={typeaheadProcRef}
                        onChange={handleProcessTypeaheadChangeeee}
                        selected={selectedItms} // Pass selected items from state
                        options={procdata}
                        placeholder="Choose a Process..."
                      ></Typeahead>
                    ) : (
                      ""
                    )}

                  </div>
                  <div
                    className="d-flex"
                    style={{ gap: "39px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}>
                      Material
                    </label>
                   
                    {mtrldata.length > 0 || mtrldata != null ? (
                      <Typeahead
                        className="ip-select dropdown-field"
                        id="formmtrl"
                        labelKey={(option) =>
                          option.Mtrl_Code || "Unknown Material"
                        }
                        name="newSrlMaterial"
                        ref={typeaheadMatRef}
                        onChange={handleMtrlCodeTypeaheadChangeeee}
                        // onInputChange={handleInputChange}
                        // onChange={handleChange}
                        // selected={Material}
                        selected={selectedItems} // Pass selected items from state
                        options={mtrldata}
                        placeholder="Choose a Material..."
                        required></Typeahead>
                    ) : (
                      ""
                    )}
                  </div> */}

                  <div>
                    <div className="mb-1" style={{ marginLeft: "25px" }}>
                      <div className="" style={{ textAlign: "center" }}>
                        <button
                          className="button-style"
                          variant="primary"
                          //  disabled={btnaddnew}
                          type="submit"
                        >
                          Add New
                        </button>
                        {/* <button
                          className="button-style"
                          variant="primary"
                          disabled={btnupdate}
                          onClick={() => updateAssembly()}
                        >
                          Update
                        </button> */}
                        <button
                          className="button-style mb-2"
                          variant="primary"
                          onClick={() => {
                            saveBomAssemblyParts();
                          }}
                        >
                          Save{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <label className="Out-standing-inv ms-2 mb-1">
                Bill of Materials (BOM)
              </label>
            </div>
            <div className="row">
              <div
                className="col-md-8"
                style={{ maxHeight: "230px", overflowY: "scroll" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortCustpart("assyPartId")}>
                        Assm PartId
                      </th>
                      <th onClick={() => requestSortCustpart("partid")}>
                        Part ID
                      </th>
                      <th onClick={() => requestSortCustpart("partdesc")}>
                        Description
                      </th>
                      <th onClick={() => requestSortCustpart("qty")}>Qty</th>
                      {/* {["Assm PartId", "Part ID", "Description", "Qty"].map(
                        (item) => {
                          return <th>{item}</th>;
                        }
                      )} */}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custpartdetails != null
                      ? custpartdetails.map((part, id) =>
                        rendercustpartdetail(part, id)
                      )
                      : null} */}
                    {sortedDataCustPart().map((part, id) =>
                      rendercustpartdetail(part, id)
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addCustPart} autoComplete="off">
                  <h6 className="" style={{ textAlign: "center" }}>
                    <u>Part Details</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "35px" }}>
                    <label
                      className="form-label mt-2"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part ID{" "}
                    </label>

                    {/* <select
                      className="ip-select dropdown-field"
                      id="formcustpartid"
                      aria-label="Select Customer Part ID"
                      onChange={selectedPart}
                      style={{ marginTop: "-3px" }}
                    >
                      <option selected disabled>
                        Select Customer Part ID
                      </option>
                      {custbomparts.length > 0
                        ? custbomparts.map((part1) => {
                          return (
                            <option value={part1.PartId}>
                              {part1.PartId} - {part1.PartDescription}
                            </option>
                          );
                          
                        })
                        : null}
                    </select> */}

                    {custbomparts.length > 0 ? (
                      <Typeahead
                        className="ip-select dropdown-field"
                        name="formcustpartid"
                        id="formcustpartid"
                        ref={typeaheadRef}
                        labelKey={(option1) =>
                          option1.PartId || "Choose a Part"
                        }
                        //  labelKey={(option1) => `${option1.PartId} || "C|| "Unknown Process""`}
                        onChange={handlePartIdTypeaheadChange}
                        //  selected={selectedPart} // Reflect the updated state
                        options={custbomparts}
                        placeholder="Choose a Part..."
                      />
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="d-flex" style={{ gap: "24px" }}>
                    <label className="form-label">Quantity</label>
                    <input
                      className="in-fields"
                      id="formqty"
                      type="number"
                      onKeyDown={blockInvalidQtyChar}
                      onChange={handleChangeQtyNumeric}
                      // value={qty}
                      placeholder="Enter Quantity"
                      // min="0"
                    />
                  </div>

                  <div className="row mt-3 mb-3 justify-content-center">
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="button-style"
                        variant="primary"
                        type="submit"
                        //   disabled={btnasmprtnew}
                        //onClick={() => {
                        // saveBomAssemblyParts();
                        // addCustPart()
                        // }}
                      >
                        Add Assm Parts
                      </button>
                      {/* <button
                        className="button-style"
                        variant="primary"
                     //   disabled={btnasmprtdel}
                        onClick={deleteassmparts}
                      >
                        Delete Assm Parts
                      </button> */}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            {/* </Container> */}
          </Tab>
        </Tabs>
      </Row>
      <div className="row mt-3 mt-3" style={{ maxHeight: "600px" }}>
        <Modal
          show={confirmModalOpen}
          onHide={closeModal}
          style={{ background: "#4d4d4d57" }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "14px" }}>
              Confirmation Message
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: "12px" }}>
              Do you wish to add parts ?{" "}
            </span>
          </Modal.Body>
          <Modal.Footer className="d-flex flex-row justify-content-end">
            <button className="button-style m-0 me-3" onClick={yesClicked}>
              Yes
            </button>
            <button className="button-style m-0" onClick={closeModal}>
              No
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* // Customer BOM Items List */}
      {/* <div className="row mt-3 mt-3" style={{ maxHeight: "600px" }}>
        <Modal show={confirmModalOpen} onHide={closeModal} style={{ background: "#4d4d4d57" }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "14px" }}>Confirmation Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: "12px" }}>Do you wish to add part ? </span>
          </Modal.Body>
          <Modal.Footer className="d-flex flex-row justify-content-end">
            <button className="button-style m-0 me-3" onClick={BPyesClicked}>
              Yes
            </button>
            <button className="button-style m-0" onClick={BPcloseModal}>
              No
            </button>
          </Modal.Footer>
        </Modal>
      </div> */}
    </div>

    // </Container>
  );
}

export default PartList;
