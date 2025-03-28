import React, { useEffect, useState } from "react";
import { Form,  Table } from "react-bootstrap";
import { toast } from "react-toastify";

const { postRequest } = require("../api/apiinstance");
const { endpoints } = require("../api/constants");

function Menurolemapping() {
  let [rolesdata, setRolesData] = useState([]);
  let [menusdata, setMenusData] = useState([]);
  let [rolemenudata, setRoleMenuData] = useState([]);
 // let [newselectedmenudata, setNewSelectedMenuData] = useState([]);
  let [counter, setCounter] = useState(1);

  let [role, setRole] = useState("");

  useEffect(() => {
    async function getMenuRolesData() {
      postRequest(endpoints.getUserRoles, {}, (data) => {
        console.log(data);
        setRolesData(data);
      });
      postRequest(endpoints.getUserMenus, {}, (mdldata) => {
        setMenusData(mdldata);
      });
    }
    getMenuRolesData();
  }, []);

  let selectRole = (e) => {
    //  console.log(e.target.value);
    let selrole = e.target.value;
    setRole(selrole);
    postRequest(endpoints.getRoleMenus, { Role: selrole }, (rmdata) => {
      //console.log(rmdata)
      setRoleMenuData(rmdata);
    });
  };

  let markchecked = (e, menuname) => {
    console.log("Mark Checked");
    let oldselected = rolemenudata;
    if (!e.target.checked) {
      for (let i = 0; i < oldselected.length; i++) {
        if (oldselected[i]["MenuName"] === menuname) {
          oldselected.splice(i, 1);
          break;
        }
      }
    } else {
      // let selectedmenudata = {
      //     "role": role,
      //     "MenuName": menuname,
      // }
      // oldselected.push(selectedmenudata);

      setRoleMenuData([...rolemenudata, { role: role, MenuName: menuname }]);

      // setRoleMenuData(oldselected);
      console.log("if Checked");
      console.log(rolemenudata);
    }

    setCounter(counter + 1);
  };

  let checkselected = (menuname) => {
    for (let j = 0; j < rolemenudata.length; j++) {
      if (rolemenudata[j]["MenuName"] === menuname) {
        return true;
      }
    }
    return false;
  };

//  let rendermenus = (selmenus, id) => {};

  let savemenuroles = (e) => {
    e.preventDefault();
    console.log("while saving");
    if (rolemenudata.length > 0) {
      postRequest(
        endpoints.saveMenuRoleMapping,
        { newselectedmenu: rolemenudata },
        async (data) => {
          console.log("After sending to api");
          console.log(data);
          if (data.status === "updated") {
            toast.success("Updated Successfully");
          }
          if (data.status === "") {
            toast.success("Menus Mapped Successfully");
          }
          if (data.status === "No Menu Selected") {
            toast.error("Please Select Menus for Role Access");
          }
        }
      );
    } else {
      toast.error("Please Select Menus for Role Access");
      return;
    }
    setRole("");
    // postRequest(endpoints.getUserMenus, {}, (mdldata) => {
    //     setMenusData(mdldata);
    // });
  };
  return (
    <div>
      {" "}
      <div>
        <h4 className="title ">Menu Role Mapping</h4>

        <div className="form-style">
          <Form onSubmit={savemenuroles} autoComplete="off">
            <div className="row">
              <div className="col-md-4 d-flex" style={{ gap: "10px" }}>
                <label className="form-label">Role</label>
                {rolesdata.length > 0 ? (
                  <select
                    className="ip-select"
                    id="role"
                    onChange={selectRole}
                    required
                  >
                    <option value="" disabled selected>
                      {" "}
                      Select Role{" "}
                    </option>
                    {rolesdata.map((rles) => {
                      return (
                        <option
                          style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          value={rles["Role"]}
                        >
                          {rles["Role"]}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-4 mb-1">
                <Form.Group className="" style={{ display: "flex" }}>
                  <button className="button-style" type="submit">
                    Save
                  </button>
                </Form.Group>
              </div>
            </div>

            <div style={{ overflowY: "scroll", maxHeight: "350px" }}>
              <Table striped className="table-data border">
                <thead className="tableHeaderBGColor tablebody">
                  <tr>
                    {["Select", "MenuName", "Details"].map((h) => {
                      return <th>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {menusdata &&
                    !!counter &&
                    menusdata.map((selmenus, id) => {
                      return (
                        <tr
                          style={{
                            cursor: "pointer",
                          }}
                          id={id}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={checkselected(selmenus["MenuName"])}
                              onChange={(e) =>
                                markchecked(e, selmenus["MenuName"])
                              }
                            />
                          </td>
                          <td>{selmenus["MenuName"]}</td>
                          <td>{selmenus["MenuUrl"]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Menurolemapping;
