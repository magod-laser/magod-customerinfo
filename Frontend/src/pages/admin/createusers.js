import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
// import BreadcrumbsComponent from "../components/BreadCumbsComponent";
//import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
//import { useAlert } from "react-alert";
import { toast } from "react-toastify";

const { postRequest } = require("../api/apiinstance");
const { endpoints } = require("../api/constants");

function CreateUsers() {
  // const alert = useAlert();
  let [selecteduserrowdata, setSelectedUserRowData] = useState([]);
  let [userrolesdata, setUserRolesData] = useState([]);
  let [unitsdata, setUnitsData] = useState([]);
  let [selectedUserId, setSelectedUserId] = useState("");
  let [selectedusermenudata, setSelectedUserMenuData] = useState([]);

  let [uname, setUname] = useState("");
  let [username, setUsername] = useState("");
  let [urole, setUrole] = useState("");
  let [password, setPassword] = useState("");
  let [passreset, setPassReset] = useState(false);
  let [unit, setUnit] = useState("");
  let [btnsave, setBtnSave] = useState(false);
  let [btndelete, setBtnDelete] = useState(true);
  let [tablusername, settablusername] = useState();

  useEffect(() => {
    setBtnSave(false);
    async function getUsersdata() {
      postRequest(endpoints.getUsers, {}, (data) => {
        setSelectedUserRowData(data);
      });
      postRequest(endpoints.getUserRoles, {}, (data) => {
        setUserRolesData(data);
      });
      postRequest(endpoints.getUnits, {}, (untdata) => {
        setUnitsData(untdata);
        console.log(untdata);
      });
    }
    getUsersdata();
  }, []);

  let selecteduserdata = (id, selusrs) => {
    setBtnSave(true);
    setBtnDelete(false);
    console.log("Selected User Data", selusrs);
    setUname(selusrs["Name"]);
    setUsername(selusrs["UserName"]);
    setPassReset(selusrs["PassReset"] === true ? true : false);
    setUrole(selusrs["Role"]);
    setUnit(selusrs["Unit"]);
    setSelectedUserId(id);

    postRequest(endpoints.getRoleMenus, { Role: selusrs["Role"] }, (data) => {
      setSelectedUserMenuData(data);
    });
  };
  let renderusers = (selusrs, id) => {
    console.log(selectedUserId);
    console.log(selusrs.UserName);
    // settablusername(selusrs.UserName);
    // console.log(id);
    return (
      <tr
        style={{
          backgroundColor: selectedUserId === id ? "#98A8F8" : "",
          // backgroundColor: "#98A8F8",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          selecteduserdata(id, selusrs);
        }}
      >
        <td>{selusrs["Name"]}</td>
        <td>{selusrs["UserName"]}</td>
        <td>{selusrs["Role"]}</td>
        <td>{selusrs["UnitName"]}</td>
      </tr>
    );
  };

  let renderusermenu = (selusrmnus) => {
    return (
      <tr
        style={{
          backgroundColor: "#98A8F8",

          cursor: "pointer",
        }}
      >
        <td>{selusrmnus["MenuName"]}</td>
      </tr>
    );
  };

  let saveusers = (e) => {
    e.preventDefault();
    setBtnSave(false);
    setBtnDelete(true);
    if (
      e.target.elements.uname.value === "" ||
      e.target.elements.username.value === "" ||
      e.target.elements.password.value === "" ||
      e.target.elements.unit.value === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    // if (e.target.elements.uname.value == setUname) {
    //   toast.error("Duplicate username please check");
    // }
    if (
      e.target.elements.urole.value === "" ||
      e.target.elements.urole.value === "Select Role"
    ) {
      toast.error("Please select a role");
      return;
    }
    let usrname = e.target.elements.uname.value;
    let usrusername = e.target.elements.username.value;
    let usrpassword = e.target.elements.password.value;
    let usrrole = e.target.elements.urole.value;
    //  let usrresetpassword = (e.target.elements.passreset.checked == true) ? 1 : 0;
    let usrunit = e.target.elements.unit.value;
    let usrdata = {
      Name: usrname,
      UserName: usrusername,
      Password: usrpassword,
      Role: usrrole,
      //"ResetPassword": usrresetpassword,
      Unit: usrunit,
    };
    console.log(usrdata);
    console.log(usrdata.UserName);
    console.log(tablusername);

    if (e.target.elements.uname.value !== tablusername) {
      // toast.error("Duplicate username please check");
    } else {
    }

    postRequest(endpoints.saveUsers, { usrdata }, (data) => {
      console.log(data.d);
      setSelectedUserRowData(data.d);
      if (data.status === "success") {
        toast.success("User Created successfully..");
      } else {
        // toast.error("User Already Exists..");
        // toast.success("User Created successfully..");
      }
      // if (usrdata.UserName === ) {

      // } else {

      // }

      postRequest(endpoints.getUsers, {}, (data) => {
        console.log(data);
        setSelectedUserRowData(data);
      });
    });
    // alert.success("User created successfully");
    cleardata();
  };

  let cleardata = () => {
    setUname("");
    setUsername("");
    setPassword("");
    setPassReset(false);
    setUrole("");
    setUnit("");
  };

  const handleChangeAlphaNumeric = (e) => {
    const mvalue = e.target.value.replace(/[^A-Za-z0-9 ]/gi, "");
    if (mvalue.includes(" ")) {
      toast.error("Cannot enter spaces for User Name");
      return;
    }
    //   let unm = mvalue.replace(/^\s+|\s+$/gm,'')
    setUname(mvalue);
  };

  const passchk = (e) => {
    const passvalue = e.target.value;
    if (passvalue.includes(" ")) {
      toast.error("Cannot given only spaces for Password");
      return;
    }
    setPassword(passvalue);
  };
  // const handleChangeAlpha = (e) => {
  //     const avalue = e.target.value.replace(/[^A-Za-z ]/gi, "");
  //     if((avalue == '') || (avalue == null)){
  //         alert('User Name cannot be blank..');
  //         return;
  //     }
  //     setUsername(avalue);
  // };

  async function deactiveuser(e) {
    e.preventDefault();
    setBtnSave(false);
    setBtnDelete(true);
    toast.success("Deleted User Successfully");

    postRequest(endpoints.delUsers, { uname: username }, async (data) => {
      if (data.status === "Deleted") {
        toast.success("Deleted User Successfully");
      }
    });
    cleardata();
    //  setSelectedUserMenuData([]);
    postRequest(endpoints.getUsers, {}, (data) => {
      setSelectedUserRowData(data);
    });
  }

  return (
    <div>
      <div>
        <h4 className="title">Create Users</h4>
        <div className="form-style">
          <Form onSubmit={saveusers} autoComplete="off">
            <div className="row">
              <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Name</label>
                <input
                  className="in-field"
                  id="uname"
                  placeholder="Enter Name"
                  onChange={handleChangeAlphaNumeric}
                  value={uname}
                  required
                />
              </div>
              <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  User Name
                </label>
                <input
                  className="in-field"
                  id="username"
                  type="text"
                  placeholder="Enter User Name"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </div>
              <div className="col-md-2 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Password</label>
                <input
                  className="in-field"
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  onChange={passchk}
                  value={password}
                  required
                />
              </div>
              <div className="col-md-2 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Role</label>
                {userrolesdata.length > 0 ? (
                  <select
                    className="ip-select"
                    id="urole"
                    onChange={(e) => setUrole(e.target.value)}
                    value={urole}
                    required
                  >
                    <option value="" disabled selected>
                      {" "}
                      Select Role{" "}
                    </option>
                    {userrolesdata.map((usrrole) => {
                      return (
                        <option value={usrrole["Role"]}>
                          {usrrole["Role"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-2 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Unit</label>
                {unitsdata.length > 0 ? (
                  <select
                    className="ip-select"
                    id="unit"
                    onChange={(e) => setUnit(e.target.value)}
                    value={unit}
                    required
                  >
                    {" "}
                    <option value="" disabled selected>
                      {" "}
                      Select Unit{" "}
                    </option>
                    {unitsdata.map((unit, id) => {
                      return (
                        <option key={id} value={unit["UnitID"]}>
                          {unit["UnitName"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row ">
              <div className="col-md-12">
                <button
                  className="button-style"
                  disabled={btnsave}
                  type="submit"
                  style={{ float: "right" }}
                >
                  Save
                </button>
                <button
                  className="button-style"
                  disabled={btndelete}
                  onClick={deactiveuser}
                  style={{ float: "right" }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8 mt-2">
                <div style={{ maxHeight: "280px", overflowY: "scroll" }}>
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor tablebody">
                      <tr>
                        {["Name", "UserName", "Role", "Unit"].map((h) => {
                          return <th>{h}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {selecteduserrowdata != null
                        ? selecteduserrowdata.map((selusrs, id) =>
                            renderusers(selusrs, id)
                          )
                        : ""}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        {["Menu Permissions"].map((h) => {
                          return <th className="custth ">{h}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {selectedusermenudata != null
                        ? selectedusermenudata.map((selusrmnus) =>
                            renderusermenu(selusrmnus)
                          )
                        : ""}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateUsers;
