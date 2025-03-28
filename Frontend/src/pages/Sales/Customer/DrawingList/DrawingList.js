import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Table,
  Row,
  Col,
  FormLabel,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Tables from "../../../../components/Tables.js";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
//import { getCustomers, drawingsCustomer } from '../../../api/apiconn';
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function DrawingList() {
  // for accessing object keys
  let navigate = useNavigate();
  let [CustName, setCustName] = useState([]);
  let [custdata, setCustdata] = useState([]);
  let [custcode, setCustCode] = useState("");
  let [custdwgdata, setCustDwgdata] = useState([]);
  // let [custdetdatafiltered, setCustDetdatafiltered] = useState([]);

  // let customerMenu = () => {
  //   window.location.href = "/customer";
  // };

  useEffect(() => {
    async function getCustomersdata() {
      postRequest(endpoints.getCustCodeName, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        setCustdata(data);
      });
    }
    getCustomersdata();
    // getCustomers(data => {
    //     setCustdata(data);
    // });
  }, []);

  let selectCust = async (evt) => {
    //    e.preventDefault();

    // let custdet = evt.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }
    // //    e.preventDefault();
    // let cdet = custdet.substring(0, 4)
    // console.log(cdet);
    // setCustCode(custdet.substring(0, 4));
    // custcode = custdet.substring(0, 4);
    // //     console.log("cust code : "+custcode);
    // postRequest(endpoints.drawingsCustomer, {
    //     custcode: custdet.substring(0, 4),
    // }, (data) => {
    //     setCustDwgdata(data);
    // });

    // console.log("cust data = ", evt);
    // console.log("cust code = ", evt[0].Cust_Code);
    // console.log("table customer = ", custdata);
    let cust;
    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i]["Cust_Code"] === evt[0].Cust_Code) {
        cust = custdata[i];
        break;
      }
    }
    // console.log(cust.Cust_Code);
    setCustCode(cust.Cust_Code);
    postRequest(
      endpoints.drawingsCustomer,
      { custcode: cust.Cust_Code },
      (data) => {
        setCustDwgdata(data);
      }
    );
    // drawingsCustomer({
    //     custcode: cust.Cust_Code,
    // }, async (resp) => {
    //     console.log(resp)
    //     setCustDwgdata(resp)
    // })
  };

// Sorting the Drawing List
const [sortConfigDwgList, setsortConfigDwgList] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortDwgList = (key) => {
    let direction = "asc";
    if (sortConfigDwgList.key === key && sortConfigDwgList.direction === "asc") {
      direction = "desc";
    }
    setsortConfigDwgList({ key, direction });
  };

  const sortedDataDwgList = () => {
    const dataCopyDwgList = [...custdwgdata];

    if (sortConfigDwgList.key) {
      dataCopyDwgList.sort((a, b) => {
        let valueA = a[sortConfigDwgList.key];
        let valueB = b[sortConfigDwgList.key];

        // Convert only for the "integer" columns
        if (
          sortConfigDwgList.key === "MtrlCost" ||
          sortConfigDwgList.key === "JobWorkCost" ||
          sortConfigDwgList.key === "LOC" ||
          sortConfigDwgList.key === "Holes" ||
          sortConfigDwgList.key === "Weight" 
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigDwgList.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigDwgList.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyDwgList;
  };


  let rendertable = (custdwg) => {
    return (
      <tr className="">
        <td>{custdwg["Dwg_Code"]}</td>
        <td hidden>{custdwg["Cust_Code"]}</td>
        <td>{custdwg["DwgName"]}</td>
        <td>{custdwg["Mtrl_Code"]}</td>
        <td>{custdwg["DxfLoc"]}</td>
        <td>{custdwg["Operation"]}</td>
        <td>{custdwg["MtrlCost"]}</td>
        <td>{custdwg["JobWorkCost"]}</td>
        <td>{custdwg["LOC"]}</td>
        <td>{custdwg["Holes"]}</td>
        <td>{custdwg["Weight"]}</td>
      </tr>
    );
  };

  return (
    <div>
      <h4 className="title">Profile Drawing List</h4>
      {/* <hr className="horizontal-line" /> */}

      <div className="form-style table_top_style">
        <form>
          <div className="row mt-3">
            <div className="col-md-4 d-flex" style={{ gap: "10px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Name
                <span
                  style={{
                    color: "#f20707",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  *
                </span>
              </label>

              {custdata.length > 0 ? (
                // <Form.Select
                //   className="ip-select mt-1 "
                //   controlId="CustName"
                //   onChange={selectCust}
                // >
                //   <option value="" disabled selected>
                //     {" "}
                //     Select Customer{" "}
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
                ""
              )}
            </div>
            <div className="col-md-4 d-flex" style={{ gap: "10px" }}>
              {/* <label className="">Branch</label> */}
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Cust Code
              </label>
              <input
                className="in-field"
                id="custcode"
                type="text"
                value={custcode}
              />
            </div>
            <div className="col-md-4" style={{ marginTop: "-10px" }}>
              <button
                className="button-style"
                type="submit"
                onClick={() => navigate("/customer")}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* for table */}
      <div>
        {/* <Tables theadData={getHeadings()} tbodyData={data} /> */}

        <div style={{ height: "460px", overflowY: "scroll" }}>
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor tablebody">
              <tr
                className=""
                // style={{ fontFamily: "Roboto", fontSize: "12px" }}
              >
                <th onClick={() => requestSortDwgList("Dwg_Code")}>Dwg Code</th>
                <th onClick={() => requestSortDwgList("DwgName")}>Dwg Name</th>
                <th onClick={() => requestSortDwgList("Mtrl_Code")}>Mtrl Code</th>
                <th onClick={() => requestSortDwgList("DxfLoc")}>Dxf Location</th>
                <th onClick={() => requestSortDwgList("Operation")}>Operation</th>
                <th onClick={() => requestSortDwgList("MtrlCost")}>Material Cost</th>
                <th onClick={() => requestSortDwgList("JobWorkCost")}>Jobwork Cost</th>
                <th onClick={() => requestSortDwgList("LOC")}>LOC</th>
                <th onClick={() => requestSortDwgList("Holes")}>Holes</th>
                <th onClick={() => requestSortDwgList("Weight")}>Weight</th>
                {/* {[
                  "Dwg Code",
                  "Dwg Name",
                  "Mtrl Code",
                  "Dxf Location",
                  "Operation",
                  "Material Cost",
                  "Jobwork Cost",
                  "LOC",
                  "Holes",
                  "Weight",
                ].map((h) => {
                  return (
                    <th
                      className=""
                      //   style={{ fontFamily: "Roboto", fontSize: "12px" }}
                    >
                      {h}
                    </th>
                  );
                })} */}
              </tr>
            </thead>
            <tbody className="tablebody ">
              {/* {custdwgdata != null
                ? custdwgdata.map((custdwg) => rendertable(custdwg))
                : ""} */}
              {sortedDataDwgList().map((custdwg) => rendertable(custdwg))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DrawingList;
