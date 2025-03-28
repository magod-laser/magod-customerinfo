import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
//import { useSearchParams } from "react-router-dom";
//import validator from "validator";
// import Breadcrumbscomponent from "../components/BreadCumbsComponent";
import { toast } from "react-toastify";

const { postRequest } = require("../api/apiinstance");
const { endpoints } = require("../api/constants");

function UserRolesModules() {
  //  const alert = useAlert();
 // let [searchParams] = useSearchParams();
  let [selectedusrroledata, setSelectedUsrRoleData] = useState([]);
 // let [usertype, setUserType] = useState("");
  let [rolename, setRoleName] = useState("");
  let [selrolename, setSelRoleName] = useState("");
  let [selectedRoleId, setSelectedRoleId] = useState("");
  let [btntext, setBtnText] = useState("");
 // const [value, setValue] = useState("");

  useEffect(() => {
    async function getUsrRoledata() {
      postRequest(endpoints.getUserRoles, {}, (data) => {
        console.log(data);
        setSelectedUsrRoleData(data);
      });
    }
    getUsrRoledata();
    setBtnText("Save");
  }, []);

  let selroles = (id, selusrroles) => {
    console.log(selusrroles["Role"]);
    setSelectedRoleId(id);
    setRoleName(selusrroles["Role"]);
    setSelRoleName(selusrroles["Role"]);
    //    setBtnText("Update");
  };

  let renderusrroles = (selusrroles, id) => {
    return (
      <tr
        className="custtr"
        style={{
          backgroundColor: selectedRoleId === id ? "#98A8F8" : "",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
          height: "25px",
        }}
        id={id}
        onClick={() => selroles(id, selusrroles)}
      >
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {selusrroles["Role"]}
        </td>
        {/* <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px',width:'90px' }}><Button id="btnedit" style={{backgroundColor:'#283E81',fontFamily: 'Roboto', fontSize: '12px',width:'70px',height:'30px'}} >Edit</Button></td>
                <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px',width:'90px' }}><Button id="btndelete" style={{backgroundColor:'#f5070f',fontFamily: 'Roboto', fontSize: '12px',width:'70px',height:'30px'}} >Delete</Button></td> */}
      </tr>
    );
  };

  // let clearData = () => {
  //   setRoleName("");
  // };

  async function delUserRole(e) {
    e.preventDefault();
    console.log("Deleting");
    console.log(rolename);
    if (rolename == "") {
      toast.error("Please select a Role to Delete ");
      return;
    }
    postRequest(endpoints.delUserRoles, { rolenm: rolename }, async (data) => {
      if (data.status === "RoleMenu") {
        toast.success("Menu is Mapped for the Role");
      } else if (data.status === "Deleted") {
        toast.success("Role Deleted Successfully");
      }
      postRequest(endpoints.getUserRoles, {}, (roldata) => {
        console.log(roldata);
        setSelectedUsrRoleData(roldata);
      });
    });
    setRoleName("");
  }

  async function submitusrroles(e) {
    e.preventDefault();
    console.log("submitusrroles");
    // console.log(searchParams.get("usrtype"))

    if (e.target.elements.rolename.value === " ") {
      toast.error("Please enter Role Name");
      return;
    }
    let usrrole = e.target.elements.rolename.value;
    let usrroledata = {
      Role: usrrole,
    };

    console.log("Adding Role");
    postRequest(endpoints.addUserRoles, { usrroledata }, (data) => {
      console.log(data);
      //   if (data.length > 0) {
      //  setSelectedUsrRoleData(data);
      if (data.status === "success") {
        e.target.elements.rolename.value = "";
        setRoleName(e.target.elements.rolename.value);
        toast.success("Role Added successfully");
      } else {
        e.target.elements.rolename.value = "";
        setRoleName(e.target.elements.rolename.value);
        toast.error("Role Already exists");
      }

      // Refresh table
      setRoleName("");
      postRequest(endpoints.getUserRoles, {}, (data) => {
        console.log(data);
        setSelectedUsrRoleData(data);
      });
    });
  }

  // const validate = (inputText) => {
  //     setValue("#"+validator.trim(inputText)+"#")
  // }

  // const handleChange = (e) => {
  //     const rvalue = e.target.value; //.replace(/[^A-Za-z ]/gi, "");
  //     if((rvalue.trim() == '') || (rvalue.trim() == null)){
  //         alert('Role Name cannot be Blank');
  //         return;
  //     }

  //     console.log(rvalue)
  //     setRoleName(rvalue);
  // };

  return (
    <div>
      <h4 className="title">Create Roles</h4>

      <div className="form-style">
        {/* className="boxcontainer"> */}
        <Form onSubmit={submitusrroles} autoComplete="off">
          <div className="row">
            <div className="col-md-5">
              <div className="d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Role Name
                </label>
                <input
                  className="in-field"
                  type="text"
                  id="rolename"
                  placeholder="Enter Role Name"
                  maxLength={30}
                  onChange={(e) => setRoleName(e.target.value)}
                  value={rolename}
                  required
                />
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: "-5px" }}>
              <Form.Group className="">
                <button className="button-style" type="submit" id="btnsave">
                  {" "}
                  {btntext}
                </button>
                <button className="button-style" onClick={delUserRole}>
                  Delete
                </button>
              </Form.Group>
            </div>
          </div>
          <div className="">
            <div
              className="col-md-6 mt-1"
              style={{ height: "400px", overflow: "auto" }}
            >
              <Table striped className="table-data border">
                <thead className="tableHeaderBGColor tablebody">
                  <tr>
                    {["Role"].map((h) => {
                      return <th>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {selectedusrroledata != null
                    ? selectedusrroledata.map((selusrroles, id) =>
                        renderusrroles(selusrroles, id)
                      )
                    : ""}
                </tbody>
              </Table>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default UserRolesModules;
