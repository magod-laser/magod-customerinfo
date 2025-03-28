import React, { useEffect, useState } from "react";
import { Container, Col, Row, Table, Form, Button, Card } from "react-bootstrap";
//import { useAlert } from "react-alert";

const { getRequest, postRequest } = require("../../api/apiinstance");
const { endpoints } = require("../../api/constants");

function UserMenus() {
    // const alert = useAlert();
    let [selectedusermenus, setSelectedUserMenus] = useState([]);
    let [moduledata, setModuleData] = useState([]);
    let [selectedusrmenudata, setSelectedUsrMenuData] = useState([]);
    let [selectedMenuId, setSelectedMenuId] = useState("");
    let [menuname, setMenuName] = useState("");
    let [menuurl, setMenuUrl] = useState("");

    useEffect(() => {
        async function getUsrMenus() {
            postRequest(endpoints.getUserMenus, {}, (data) => {
                setSelectedUsrMenuData(data);
            });
            // postRequest(endpoints.getUserModules, {}, (mdldata) => {
            //     setModuleData(mdldata);
            // });
        }
        getUsrMenus();
    }, []);

    let menuselector = (id, selusrmenus) => {
        console.log(selusrmenus)
        setSelectedMenuId(id);
        setMenuName(selusrmenus["MenuName"]);
        setMenuUrl(selusrmenus["MenuUrl"]);
        console.log(selusrmenus["MenuName"] + " " + selusrmenus["MenuUrl"])
        setSelectedUserMenus(selusrmenus);
    }

    let renderusrmenus = (selusrmenus, id) => {
        return (
            <tr className="custtr" style={{ backgroundColor: (selectedMenuId === id ? '#5d88fc' : ''), fontFamily: 'Roboto', fontSize: '12px', cursor: 'pointer' }} id={id} onClick={() => { menuselector(id, selusrmenus) }} >
                <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px' }}>{selusrmenus["MenuName"]}</td>
                <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px' }}>{selusrmenus["MenuUrl"]}</td>
                {/* <td className="custtd" style={{ fontFamily: 'Roboto', fontSize: '12px' }}>{selusrmenus["ModuleName"]}</td> */}
            </tr>
        )
    }

    async function submitmenu(e) {
        e.preventDefault();
        console.log("submiting menu");
        if (e.target.elements.menuname.value == "" || e.target.elements.menuurl.value == "") {
            alert("Please enter all the fields");
            return;
        }
        let menu = {
            MenuName: e.target.elements.menuname.value,
            MenuUrl: e.target.elements.menuurl.value,
        }

        postRequest(endpoints.addUserMenus, { menu }, (data) => {
            //     console.log("Post Data")
            console.log("added ")
            console.log(data);
            //setSelectedUsrMenuData(data);
            if (data.status === "success") {
                alert("Menu Added Successfully");
            }
            else if (data.status === "Updated") {
                alert("Menu Already Exists");
            }
            postRequest(endpoints.getUserMenus, {}, (data) => {
                setSelectedUsrMenuData(data);
            });
            setMenuName("");
            setMenuUrl("");
        });
    }

    async function delmenu(e) {
        e.preventDefault();
        postRequest(endpoints.delUserMenus, { mname: menuname }, async (data) => {
            if (data.status === "Deleted") {
                alert('Deleted Menu Successfully');
            }
        });
        setMenuName("");
        setMenuUrl("");
        postRequest(endpoints.getUserMenus, {}, (data) => {
            setSelectedUsrMenuData(data);
        });
    }

    const handleChange = (e) => {
        const menuvalue = e.target.value.replace(/[^A-Za-z ]/gi, "");
        setMenuName(menuvalue);
    };

    const handleChangeUrl = (e) => {
        //((^\/[a-z]{1,})*\/[a-z]*)

        const value = e.target.value.replace(/[^A-Z/a-z]/gi, "");
        if (value.substr(0, 1) != '/') {
            alert('Please provide proper path with /');
            setMenuUrl("");
            return;
        } else {
            if (value.includes("//")) {
                alert('Please enter valid URL Path');
                return;
            }
            setMenuUrl(value);
        }
    };

    return (
        // <Card className="mt-3">
        //     <Card.Body style={{ borderRadius: '10px 10px 0px 0px', backgroundColor:'#fffcfc' }}>
        <div>
        <h4 className="form-title mt-2">Create Menus</h4>
        <hr className="horizontal-line" />

        <div className="form-style">
          
                <Form onSubmit={submitmenu} autoComplete="off">
                    <Row className="mb-1 mt-3" >
                        <Col xs={5}>
                            <Form.Group controlId="menuname" style={{ display: 'flex', marginRight: '10px' }}>
                                <Form.Label style={{ width: '25%', fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }}>Menu Name </Form.Label>
                                <Form.Control type="text" style={{ width: "100%", fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }} placeholder="Enter Menu Name" maxLength={25} required onChange={(handleChange)} value={menuname} />
                            </Form.Group>
                        </Col>
                        <Col xs={5}>
                            <Form.Group controlId="menuurl" style={{ display: 'flex', marginRight: '10px' }}>
                                <Form.Label style={{ width: '10%', fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }}>URL </Form.Label>
                                <Form.Control type="text" style={{ width: "100%", fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }} placeholder="Enter URL" maxLength={50} required onChange={(handleChangeUrl)} value={menuurl} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Form.Group controlId="submit" style={{ display: 'flex', marginLeft: '200px', marginRight: '10px' }}>
                                <Button variant="primary" type="submit" style={{ width: '100px', marginLeft: '30px', marginRight: '250px', fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }}> Save </Button>
                                <Button style={{ backgroundColor: '#f5070f', width: '100px', marginleft: '30px', fontFamily: 'Roboto', fontSize: '12px', fontWeight: 'bold' }} onClick={delmenu}> Delete </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-1 mt-3" style={{ display: 'flex' }}>
                        <div style={{ padding: '0px 40px 0px 150px', maxHeight: '380px', overflowY: 'scroll' }}>
                            <Table style={{ width: '60%', fontFamily: 'Roboto', fontSize: '12px' }} className="custtable" >
                                <tr className="custtr" style={{ fontFamily: 'Roboto', fontSize: '12px' }}>
                                    {
                                        ["Menu Name", "Url"].map(h => {
                                            return <th className="custth" style={{ fontFamily: 'Roboto', fontSize: '12px' }}>{h}</th>
                                        })

                                    }
                                </tr>
                                {selectedusrmenudata.length > 0 ? selectedusrmenudata.map((selusrmenus, id) => renderusrmenus(selusrmenus, id)) : ""}
                            </Table>
                        </div>
                    </Row>
                </Form>
            </div>
          
        </div>
        //      </Card.Body>
        // </Card> 
    )
}

export default UserMenus;