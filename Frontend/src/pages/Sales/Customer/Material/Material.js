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
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function Material() {
  let navigate = useNavigate();
  //let [CustName, setCustName] = useState("");
  let [custdata, setCustdata] = useState("");
  let [custcode, setCustCode] = useState("");
  let [mtrlstkposition, setMtrlStkPositiondata] = useState([]);
  let [custmtrlrectdata, setCustMtrlRectdata] = useState([]);
  let [custmtrlrecdetsdata, setCustMtrlRecDetsdata] = useState([]);
  let [selectedMatRectId, setSelectedMatRectId] = useState("");
  let [selectedMatRect, setSelectedMatRec] = useState(null);
  let [mtrlretpartsdata, setMtrlRetPartsdata] = useState([]);
  let [mtrlretscrapunuseddetsdata, setMtrlRetScrapUnusedDetsdata] = useState(
    []
  );

  useEffect(() => {
    async function fetchCustData() {
      postRequest(endpoints.getCustCodeName, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        console.log(data);
        setCustdata(data);
      });
    }
    fetchCustData();
  }, []);

  let selectCust = async (e) => {
    //  console.log(e.target.value);
    // let custdet = e.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    //  let ccode = custdet.substring(0, 4);
    //  console.log(custdet.substring(0, 4));
    //  setCustCode(custdet.substring(0, 4));
    // setCustCode(ccode);
    // selectedMatRectId("");
    //   console.log(evt.target.value);
    console.log("cust data = ", e);
    console.log("cust code = ", e[0].Cust_Code);
    console.log("table customer = ", custdata);
    let cust;
    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i]["Cust_Code"] === e[0].Cust_Code) {
        cust = custdata[i];
        break;
      }
    }
    //  console.log(cust.Cust_Code);
    setCustCode(cust.Cust_Code);

    postRequest(
      endpoints.mtrlStockCustomer,
      { custcode: cust.Cust_Code },
      (mtrlstkdata) => {
        setMtrlStkPositiondata(mtrlstkdata);
      }
    );

    postRequest(
      endpoints.mtrlReceiptsCustomer,
      { custcode: cust.Cust_Code },
      (mtrlrectsdata) => {
        console.log(mtrlrectsdata);
        setCustMtrlRectdata(mtrlrectsdata);
      }
    );

    postRequest(
      endpoints.mtrlPartsReturnedCustomer,
      { custcode: cust.Cust_Code },
      (mtrlpartsdata) => {
        setMtrlRetPartsdata(mtrlpartsdata);
      }
    );

    postRequest(
      endpoints.mtrlScrapUnusedReturnedCustomer,
      { custcode: cust.Cust_Code },
      (mtrlscrpdata) => {
        setMtrlRetScrapUnusedDetsdata(mtrlscrpdata);
      }
    );
  };

  // let dateconv = (da) => {
  //     let cdate = new Date(da);
  //     return cdate.getDay().toString().padStart(2, "0") + "/" + cdate.getMonth().toString().padStart(2, "0") + "/" + cdate.getFullYear();
  // }

  let matrecselector = async (id, mtrlrects) => {
    setSelectedMatRectId(id);

    postRequest(
      endpoints.mtrlReceiptDetailsCustomer,
      { rvid: mtrlrects["RVID"] },
      (mtrlrectdetsdata) => {
        setCustMtrlRecDetsdata(mtrlrectdetsdata);
      }
    );
  };

  // Mtrl Stock Position Sorting
  const [sortConfigStkposn, setsortConfigStkposn] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortStkposn = (key) => {
    let direction = "asc";
    if (sortConfigStkposn.key === key && sortConfigStkposn.direction === "asc") {
      direction = "desc";
    }
    setsortConfigStkposn({ key, direction });
  };
 
  const sortedDataStkPosn = () => {
    const dataCopyStkPosn = [...mtrlstkposition];
 
    if (sortConfigStkposn.key) {
      dataCopyStkPosn.sort((a, b) => {
        let valueA = a[sortConfigStkposn.key];
        let valueB = b[sortConfigStkposn.key];
 
        // Convert only for the "integer" columns
        if (
          sortConfigStkposn.key === "DynamicPara1" ||
          sortConfigStkposn.key === "DynamicPara2" ||
          sortConfigStkposn.key === "inStock"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }
 
        if (valueA < valueB) {
          return sortConfigStkposn.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigStkposn.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyStkPosn;
  };

  let rendertable = (mtrlstkposn) => {
    return (
      <tr className="custtr">
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["Mtrl_Code"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["DynamicPara1"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["DynamicPara2"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["inStock"]}
        </td>
        <td>
          <input style={{width:'45px'}} type="checkbox" checked={mtrlstkposn["Locked"] != 0}  />
        </td>
        <td >
          <input                 
         type="checkbox" style={{width:'43px'}} checked={mtrlstkposn["Scrap"] != 0} />
        </td>
      </tr>
    );
  };
  

  let rendertabmatrec = (mtrlrects, id) => {
    return (
      <tr
        className="custtr"
        style={{
          backgroundColor: selectedMatRectId === id ? "#98A8F8" : "",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          matrecselector(id, mtrlrects);
        }}
      >
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrects["CustDocuNo"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrects["RV_No"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {moment(mtrlrects["RV_Date"]).format("DD/MM/YYYY")}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          <input type="checkbox" checked={mtrlrects["updated"] == 1} />
        </td>
      </tr>
    );
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
    const dataCopy = [...custmtrlrectdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "integer" columns
        if (
          // sortConfig.key === "CustDocuNo" ||
          sortConfig.key === "RV_No" ||
          sortConfig.key === "RV_Date"
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

  let rendertabmatrecdets = (mtrlrecdets) => {
    return (
      <tr className="custtr" style={{ fontFamily: "Roboto", fontSize: "12px" }}>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrecdets["Mtrl_Code"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["DynamicPara1"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["DynamicPara2"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["Qty"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          <input type="checkbox" checked={mtrlrecdets["updated"] == 1} />
        </td>
      </tr>
    );
  };


  // Suresh Code 12112024
  const [sortConfigMat, setSortConfigMat] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortMat = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigMat.key === key && sortConfigMat.direction === "asc") {
      direction = "desc";
    }
    setSortConfigMat({ key, direction });
  };

  const sortedDataMat = () => {
    const dataCopyMat = [...custmtrlrecdetsdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfigMat.key) {
      dataCopyMat.sort((a, b) => {
        let valueA = a[sortConfigMat.key];
        let valueB = b[sortConfigMat.key];

        // Convert only for the "integer" columns
        if (
          sortConfigMat.key === "DynamicPara1" ||
          sortConfigMat.key === "DynamicPara2" ||
          sortConfigMat.key === "Qty"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigMat.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigMat.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyMat;
  };
  // Suresh Code 12112024



  let rendertabmatretparts = (mtrlretparts) => {
    return (
      <tr className="">
        <td>{mtrlretparts.Inv_No}</td>
        <td>{moment(mtrlretparts.Inv_Date).format("DD/MM/YYYY")}</td>
        <td>{mtrlretparts.Material}</td>
        <td style={{textAlign:'right'}}>{mtrlretparts.SrlWt}</td>
      </tr>
    );
  };

  // Sorting for Material Parts Returned
  const [sortConfigMatRet, setSortConfigMatRet] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortMatRet = (key) => {

    //   console.log("entering into the request sort:  ", key);
    let direction = "asc";
    if (sortConfigMatRet.key === key && sortConfigMatRet.direction === "asc") {
      direction = "desc";
    }
    setSortConfigMatRet({ key, direction });
  };

  const sortedDataMatRet = () => {
    const dataCopyMatRet = [...mtrlretpartsdata]; //...custdetdatafiltered]; // [...filteredData];

    if (sortConfigMatRet.key) {
      dataCopyMatRet.sort((a, b) => {
        let valueA = a[sortConfigMatRet.key];
        let valueB = b[sortConfigMatRet.key];

        // Convert only for the "integer" columns
        if (
         // sortConfigMatRet.key === "Inv_No" ||
          //sortConfigMatRet.key === "Inv_Date" ||
          sortConfigMatRet.key === "SrlWt"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigMatRet.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigMatRet.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyMatRet;
  };


  let rendertblmatscrpunusedets = (mtrlscrunusedets) => {
    return (
      <tr className="">
        <td>{mtrlscrunusedets.DC_No}</td>
        <td>{moment(mtrlscrunusedets.DC_Date).format("DD/MM/YYYY")}</td>
        <td>{mtrlscrunusedets.Material}</td>
        <td>{parseFloat(mtrlscrunusedets.Total_Wt).toFixed(2)}</td>
      </tr>
    );
  };

 // Suresh Code 12112024
 const [sortConfigScrp, setSortConfigScrp] = useState({ key: null, direction: null });

 // sorting function for table headings of the table
 const requestSortScrp = (key) => {

   //   console.log("entering into the request sort:  ", key);
   let direction = "asc";
   if (sortConfigScrp.key === key && sortConfigScrp.direction === "asc") {
     direction = "desc";
   }
   setSortConfigScrp({ key, direction });
 };

 const sortedDataScrp = () => {
   const dataCopyScrp = [...mtrlretscrapunuseddetsdata]; //...custdetdatafiltered]; // [...filteredData];

   if (sortConfigScrp.key) {
     dataCopyScrp.sort((a, b) => {
       let valueA = a[sortConfigScrp.key];
       let valueB = b[sortConfigScrp.key];

       // Convert only for the "integer" columns
       if (
         sortConfigScrp.key === "CustDocuNo" ||
         sortConfigScrp.key === "RV_No" ||
         sortConfigScrp.key === "RV_Date"
       ) {
         valueA = parseFloat(valueA);
         valueB = parseFloat(valueB);
       }

       if (valueA < valueB) {
         return sortConfigScrp.direction === "asc" ? -1 : 1;
       }
       if (valueA > valueB) {
         return sortConfigScrp.direction === "asc" ? 1 : -1;
       }
       return 0;
     });
   }
   return dataCopyScrp;
 };
 // Suresh Code 12112024


  return (
    <div>
      <h4 className="title">Customer Material Information</h4>

      <div className="row">
        <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Customer
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
            //   className="ip-select"
            //   controlId="CustName"
            //   style={{}}
            //   onChange={selectCust}
            // >
            //   <option value="" disabled selected>
            //     {" "}
            //     Select Customer
            //   </option>
            //   {custdata.map((cust) => {
            //     return (
            //       <option value={cust["Cust_Code"]}>{cust["Cust_name"]}</option>
            //     );
            //   })}
            // </Form.Select>
            <Typeahead
              className="ip-select"
              id="basic-example"
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
              onChange={(label) => selectCust(label)}
            />
          ) : (
            // <Typeahead
            //   id="basic-example"
            //   className="ip-select"
            //   onChange={setCustdata}
            //   options={custdata}
            //   placeholder="Select Customer"
            //   custdata={custdata}
            // />
            ""
          )}
        </div>

        <div className="col-md-3 d-flex mt-1" style={{ gap: "10px" }}>
          <label className="form-label">Code</label>
          <input className="in-field" disabled type="text" value={custcode} />
        </div>
        <div className="col-md-2">
          <button
            id="btncustmtrlclose"
            type="submit"
            className="button-style"
            onClick={() => navigate("/customer")}
            style={{ float: "right" }}
          >
            Close{" "}
          </button>
        </div>
      </div>
      <div>
        {/* <MainTable /> */}
        <div className="row mt-1">
          <Tabs
            defaultActiveKey="mtrlrecpts"
            id="materialdetails"
            className="mb-1 tab_font"
          >
            <Tab eventKey="mtrlrecpts" title="Material Receipts">
              <div>
                <div className="row">
                  <div
                    className="col-md-6"
                    style={{
                      height: "450px",
                      overflowY: "scroll",
                    }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor tablebody">
                        <tr>
                          <th onClick={() => requestSort("CustDocuNo")}>Cust Doc. No</th>
                          <th onClick={() => requestSort("RV_No")}>RV No</th>
                          <th onClick={() => requestSort("RV_Date")}>Date</th>
                          <th>Updated</th>
                          {/* {["Cust Doc. No", "RV No", "Date", "Updated"].map(
                            (h) => {
                              return <th>{h}</th>;
                            }
                          )} */}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {/* {custmtrlrectdata != null
                          ? custmtrlrectdata.map((mtrlrects, id) =>
                              rendertabmatrec(mtrlrects, id)
                            )
                          : ""} */}
                        {sortedData()?.map((mtrlrects, id) =>
                          rendertabmatrec(mtrlrects, id)
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <div
                    className="col-md-6"
                    xs={6}
                    style={{ height: "450px", overflowY: "scroll" }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor tablebody">
                        <tr
                          className="custtr "
                          // style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        >
                          <th onClick={() => requestSortMat("Mtrl_Code")}>Mtrl Code</th>
                          <th onClick={() => requestSortMat("DynamicPara1")}>Length</th>
                          <th onClick={() => requestSortMat("DynamicPara2")}>Width</th>
                          <th onClick={() => requestSortMat("Qty")}>Quantity</th>
                          <th onClick={() => requestSortMat("updated")}>Updated</th>
                          {/* {[
                            "Mtrl Code",
                            "Length",
                            "Width",
                            "Quantity",
                            "Updated",
                          ].map((h) => {
                            return (
                              <th
                                className="custth "
                                // style={{
                                //   fontFamily: "Roboto",
                                //   fontSize: "12px",
                                // }}
                              >
                                {h}
                              </th>
                            );
                          })} */}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {/* {custmtrlrecdetsdata != null
                          ? custmtrlrecdetsdata.map((mtrlrecdets) =>
                              rendertabmatrecdets(mtrlrecdets)
                            )
                          : ""} */}
                          {sortedDataMat()?.map((mtrlrecdets) =>
                          rendertabmatrecdets(mtrlrecdets)
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="mtrlrets" title="Material Return">
              <div>
                <div className="row">
                  <div
                    className="col-md-6"
                    xs={6}
                    style={{ maxHeight: "320px" }}
                  >
                    <FormLabel>Returned as Parts</FormLabel>
                    <div style={{ height: "440px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr
                            className=" "
                            //   style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            <th onClick={() => requestSortMatRet("Inv_No")}>Inv No</th>
                            <th onClick={() => requestSortMatRet("Inv_Date")}>Inv Date</th>
                            <th onClick={() => requestSortMatRet("Material")}>Material</th>
                            <th onClick={() => requestSortMatRet("SrlWt")}>Weight</th>

                            {/* {["Inv No", "Inv Date", "Material", "Weight"].map(
                              (h) => {
                                return (
                                  <th
                                    className=" "
                                    //   style={{
                                    //     fontFamily: "Roboto",
                                    //     fontSize: "12px",
                                    //   }}
                                  >
                                    {h}
                                  </th>
                                );
                              }
                            )} */}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {/* {mtrlretpartsdata != null
                            ? mtrlretpartsdata.map((mtrlretparts) =>
                                rendertabmatretparts(mtrlretparts)
                              )
                            : ""} */}
                            {sortedDataMatRet().map((mtrlretparts) =>
                            rendertabmatretparts(mtrlretparts)
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div
                    className="col-md-6"
                    xs={6}
                    style={{ maxHeight: "320px" }}
                  >
                    <FormLabel>Returned as Scrap & Unused</FormLabel>
                    <div style={{ height: "440px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr className="custtr ">
                            <th onClick={() => requestSortScrp("DC_No")}>DC No</th>
                            <th onClick={() => requestSortScrp("DC_Date")}>DC Date</th>
                            <th onClick={() => requestSortScrp("Material")}>Material</th>
                            <th onClick={() => requestSortScrp("Total_Wt")}>Total Wt.</th>
 
                             {/* {["DC No", "DC Date", "Material", "Total Wt."].map(
                              (h) => {
                                return <th className="custth ">{h}</th>;
                              }
                            )} */}
                            
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {/* {mtrlretscrapunuseddetsdata != null
                            ? mtrlretscrapunuseddetsdata.map(
                                (mtrlscrunusedets) =>
                                  rendertblmatscrpunusedets(mtrlscrunusedets)
                              )
                            : ""} */}
                            {sortedDataScrp()?.map((mtrlscrunusedets) =>
                            rendertblmatscrpunusedets(mtrlscrunusedets)
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="mtrldets" title="Material Stock Position">
              <div style={{ height: "450px", overflowY: "scroll" }}>
                <Table striped className="table-data border ">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr className=" ">
                      <th onClick={() => requestSortStkposn("Mtrl_Code")}>Material</th>
                      <th onClick={() => requestSortStkposn("DynamicPara1")}>Width</th>
                      <th onClick={() => requestSortStkposn("DynamicPara2")}>Length</th>
                      <th onClick={() => requestSortStkposn("inStock")}>InStock</th>
                      <th onClick={() => requestSortStkposn("Locked")}>Locked</th>
                      <th onClick={() => requestSortStkposn("Scrap")}>Scrap</th>
                      {/* {[
                        "Material",
                        "Width",
                        "Length",
                        "InStock",
                        "Locked",
                        "Scrap",
                      ].map((h) => {
                        return <th className="custth ">{h}</th>;
                      })} */}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {mtrlstkposition != null
                      ? mtrlstkposition.map((mtrlstkposn) =>
                          rendertable(mtrlstkposn)
                        )
                      : ""} */}
                      {sortedDataStkPosn()?.map((mtrlstkposn) =>
                      rendertable(mtrlstkposn)
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Material;
