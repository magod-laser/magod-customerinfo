import React, { useState, useEffect, useRef } from "react";
import { Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import AlertModal from "../../../../pages/components/alert";
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function CreateCustomer() {
  let modcust = {};
  const isFirstClickRef = useRef(true);
  let [alertModal, setAlertModal] = useState(false);
  let [saved, setSaved] = useState(false);
  let [custdetdata, setCustDetdata] = useState([]);
  let [custdetdatafiltered, setCustDetdatafiltered] = useState([]);
  let [loaded, setLoaded] = useState(false);

  // Form data
  let [selectedCustomerId, setSelectedCustomerId] = useState("");
  let [newCustName, setNewCustName] = useState("");
  let [branchName, setBranchName] = useState("");
  let [custcode, setCustCode] = useState("");
  let [respo, setRespo] = useState("");
  // let [modcustname, setModcustname] = useState("");
  const [modcustname, setModCustName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [respo, setRespo] = useState(false);
  //const [fstbtnc, setFstbtnc] = useState(false); 
  //const [secbtnc, setSecbtnc] = useState(false);

  useEffect(() => {
    async function getCustomersdata() {
      postRequest(endpoints.getCustomers, {}, (custdetdata) => {
        setCustDetdata(custdetdata);
        setCustDetdatafiltered(custdetdata);
        setLoaded(true);
      });
    }
    getCustomersdata();
  }, []);

  let rendertable = (cust, id) => {
    // console.log(cust);
    return (
      <tr
        className="custtr"
        style={{
          backgroundColor: selectedCustomerId === id ? "#98A8F8" : "",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          custselector(cust, id);
        }}
      >
        <td className="custtd">{cust["Cust_Code"]}</td>
        <td className="custtd">{cust["Cust_name"]}</td>
        <td className="custtd">{cust["Branch"]}</td>
      </tr>
    );
  };

  // Suresh Code 12112024
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {
    console.log("entering into the request sort");
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...custdetdatafiltered]; // [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Cust_Code" ||
          sortConfig.key === "Cust_name" ||
          sortConfig.key === "branch"
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



  async function valCustName(e) {
    let cname = e.target.value.replace("^[A-Za-Z0-9 ");
    setNewCustName(cname);
  }

  let custselector = (cust, id) => {
    console.log(cust);
    setSelectedCustomerId(id);
    setNewCustName(cust["Cust_name"]);
    setBranchName(cust["Branch"]);
    setCustCode(cust["Cust_Code"]);
    localStorage.setItem("LazerCustExist", JSON.stringify(cust));
  };

  let csavedata = async () => {
    let custsavedata = {
      customerName: newCustName,
      branchName: branchName,
      custCode: custcode,
    };
    localStorage.setItem("LazerCustomer", JSON.stringify(custsavedata));
  };

  async function searchCustomer(e) {

   // const spformat = /^[A-Za-z0-9\-\_\.\,\+\@#\$\&\*\| \{\}\(\)]+$/;
   // const spformat = /^[A-Za-z0-9\-\_\.\,\+\@#\$\&\*\| \{\}\(\)\\\/ \[\] ]+$/;
   const spformat = /^[A-Za-z0-9\-\_\.\,\@#\$\&\*\ ]+$/;
    const trimmedName = e.target.value; // Trim whitespace from the input
    if (!trimmedName || !trimmedName.match(spformat)) {
      toast.error("Customer Name cannot have invalid characters");
      setAlertModal(false);
      return;
    }

    let sarray = [];

    // {custdetdata
    //     .filter(name => name.match(new RegExp(e.target.value.toLowerCase(), "i")))
    //     .map(name => {
    //         sarray.push(element);
    //     //  return <li key={Cust_name}>{Cust_name} </li>
    //     })}

    custdetdata.forEach((element) => {
      let sstring = element["Cust_name"].toLowerCase();
      if (sstring.startsWith(e.target.value.toLowerCase())) {
        // .includes(e.target.value.toLowerCase())) {
        sarray.push(element);
      }
    });
    console.log(sarray);
    if (sarray.length > 0) {
      setCustDetdatafiltered(sarray);
    }
    setNewCustName(e.target.value);
  }

  async function checkBranch(e) {
    e.preventDefault();
    let branName = e.target.value.replace(/[^A-Za-z0-9. -]/g, "");
    //   let branName = e.target.elements.branchName.value.replace(/[^A-Za-z0-9. -]/g, "");
    // if ((branchName === null) || (branchName === "") || (branchName.replaceAll(" ", "") === "")){
    //     alert('Branch Name cannot be blank');
    //     return;
    // }
    //   const brhname = e.target.elements.value.replace(/[^A-Za-z0-9. -]/g, "")
    setBranchName(branName);
  }

  let secbtnc = () => {
    setAlertModal(false);
  };

  let fstbtnc = () => {
    saveCustomerData();
    setAlertModal(false);

    //  toast.success(modcust["customerName"] + " added to Cutomer List with Code No : " + modcust["custcode"]);

  };

  async function submitSave(e) {
    // e.preventDefault();
    // let newCustName = e.target.elements.newCustName.value.trimEnd();
    // let branchName = e.target.elements.branchName.value.trimEnd();

    // const spformat = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    // const trimmedName = newCustName;
    // if (!trimmedName || trimmedName.match(spformat)) {
    //   toast.error("Customer Name cannot be blank or have special characters");
    //   setAlertModal(false);
    //   return;
    // }

    e.preventDefault();
    let newCustName = e.target.elements.newCustName.value.trimEnd();
    let branchName = e.target.elements.branchName.value.trimEnd();

    // const spformat = /^[A-Za-z0-9\-\_\.\,\+\@#\$\&\*\/\\\|]+$/;
    const spformat = /^[A-Za-z0-9\-\_\.\,\@#\$\&\*\ ]+$/;

    const trimmedName = newCustName.trim(); // Trim whitespace from the input 
    
     if (!trimmedName || !trimmedName.match(spformat)) {
    // if (!trimmedName || !spformat.test(trimmedName)) {
      toast.error("Customer Name cannot be blank or contain semicolons"); 
      setAlertModal(false); 
      return;
    }
    const customerExists = custdetdatafiltered.some((cust) => cust.Cust_name === newCustName);
    if (customerExists) {
      toast.error("Customer Already Existed");
      setAlertModal(false);
      return;
    }
    setModCustName(newCustName);
    setAlertModal(true);

  }

  const saveCustomerData = async () => {
    await csavedata();

    postRequest(
      endpoints.createCustomer,
      { customerName: newCustName, branchName: branchName },
      (resp) => {
        console.log(resp);
        setRespo(resp);
        const modcust = JSON.parse(localStorage.getItem("LazerCustomer")) || {};
        modcust.customerName = newCustName;
        modcust.branchName = branchName;
        modcust.custcode = resp.custcode;
        localStorage.setItem("LazerCustomer", JSON.stringify(modcust));
        localStorage.removeItem("LazerCustExist");

        alert(newCustName + " added to Customer List with Code No : " + resp.custcode);
        setAlertModal(false);
        window.location.href = "/Customer/Customers/CustomerInfo";
        // setModCustName(newCustName);
        // setAlertModal(true);

      });
  };


  // setAlertModal(true);

  // {
  //   modcust.customerName == newCustName
  //     ? setAlertModal(true)
  //     : toast.error("Customer Alrady Existed");
  // }

  // {
  //   modcust.customerName != newCustName
  //     ? toast.error("Customer Alrady Existed")
  //     : setAlertModal(true);
  // }
  //  alert.success(modcust["customerName"]+" added to Cutomer List with Code No : "+modcust["custcode"]);
  // setAlertModal(true);
  // alert(
  //   modcust["customerName"] +
  //     " added to Cutomer List with Code No : " +
  //     resp.custcode
  // ); //modcust["custcode"]);
  // window.location.href = "/Customer/CustomerInfo";
  //  }
  //  );
  // setModCustName(e.target.elements.newCustName.value);
  // setAlertModal(true);
  // }
  // console.log(modcustname);

  const handleKeyDown = (event) => {
    if (event.key === " " && event.target.selectionStart === 0) {
      event.preventDefault(); // Prevent adding space at the beginning
    }
  };


  return (
    <div>
      <h4 className="title">Customer Creator Form</h4>
      <div className="form-style">
        <Form onSubmit={submitSave} autoComplete="off">
          <div className="row">
            <div className="col-md-4 d-flex" style={{ gap: '10px' }}>
              <label className="form-label">Name </label>
              <input
                className="in-field"
                id="newCustName"
                type="text"
                placeholder="Enter Customer Name"
                maxLength={150}
                value={newCustName}
                onKeyDown={handleKeyDown}
                onChange={(e) => searchCustomer(e)}
              />
            </div>
            <div className="col-md-4 d-flex" style={{ gap: '10px' }}>
              <label className="form-label">Branch </label>
              <input
                className="in-field"
                id="branchName"
                type="text"
                placeholder="Enter Branch Name"
                onChange={checkBranch}
                onKeyDown={handleKeyDown}
                value={branchName}
              />
            </div>
            <div className="col-md-4">
              <button id="btnnewcustomer" className="button-style">
                Create Customer
              </button>
            </div>
          </div>

          <div className="mt-1">
            <div
              style={{
                height: "465px",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              <Table
                striped
                className="table-data border"
                style={{ border: "1px" }}
              >
                <thead className="tableHeaderBGColor tablebody">
                  <tr>
                    <th onClick={() => requestSort("Cust_Code")}>Customer Code</th>
                    <th onClick={() => requestSort("Cust_name")}>Customer Name</th>
                    <th onClick={() => requestSort("Branch")}>Branch</th>
                    {/* {["Customer Code", "Customer Name", "Branch"].map((h) => {
                      return <th>{h}</th>;
                    })} */}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {
                    // custdetdatafiltered != null
                    //   ?  custdetdatafiltered.map((cust, id) =>
                    //     rendertable(cust, id)

                    sortedData()?.map((cust, id) =>
                      rendertable(cust, id)
                    )}
                  {/* : ""} */}
                </tbody>
              </Table>
            </div>
          </div>
        </Form>
        {/* <AlertModal
          modcustname={modcustname}
          respo={respo}
          show={alertModal}
          onHide={(e) => setAlertModal(e)}
          firstbutton={fstbtnc}
          secondbutton={secbtnc}
          title="New Customer to the List"
          message={"Create New Customer :"+ modcustname }
          firstbuttontext="Yes"
          secondbuttontext="No"
        /> */}

        <AlertModal
          modcustname={modcustname}
          respo={respo}
          show={alertModal}
          onHide={(e) => setAlertModal(e)}
          firstbutton={fstbtnc}
          secondbutton={secbtnc}
          title="New Customer to the List"
          message={"Create New Customer: " + modcustname}
          firstbuttontext="Yes"
          secondbuttontext="No"
        />
      </div>
    </div>
  );
}
export default CreateCustomer;
