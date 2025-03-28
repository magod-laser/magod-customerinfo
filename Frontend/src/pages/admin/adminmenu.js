import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { TreeView, TreeItem } from "@mui/lab";

import UserRolesModules from './userrolesmodules';
import UserMenus from './menus';
import CreateUsers from './createusers';
import MenuRoleMapping from './menurolemapping';
import MainMenu from '../mainMenu';
import { Settings, SupervisedUserCircle } from "@mui/icons-material";
import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";

function AdminMenu() {
    let navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    return (
        <div className="main-container" style={{display:"flex",flexDirection:'row'}}>
            {/* <Row>
                <Col  style={{ backgroundColor: '#999797', color: '#ffffff', height: '100%', paddingTop: '10px' }}> */}
            <div className={`${isSidebarOpen ? "sidebar sidebar_open" : "sidebar"}`}> 
                {/* logo */}
                <div className="top_section">
                    {isSidebarOpen && (
                        // <img className="logo" src={require("../ML-LOGO.png")} />
                        <h5 className="title_name" style={{color:'#c3ddeb'}}>Admin</h5>
                    )}
                  
                    <div className="toggle-icon">
                        {isSidebarOpen ? (
                            <FaAngleLeft onClick={toggleSidebar} />
                        ) : (
                            <FaAngleRight onClick={toggleSidebar} />
                        )}
                    </div>
                </div>
                <TreeView // className={`${isSidebarOpen ? "sidebar sidebar_open" : "sidebar"}`}
                    aria-label="file system navigator"
                    defaultCollapseIcon={<SupervisedUserCircle />}
                    defaultExpandIcon={<Settings />}
                    sx={{ height: '90vh' }} //, maxWidth: '200px' }}
                    style={{ fontFamily: 'Roboto', fontSize: '12px',color:'#c3ddeb' }}
                    >

                    <TreeItem nodeId="1" label="Users">
                        <TreeItem nodeId="2" label="Roles" onClick={() => window.location.href = '/admin/userrolesmodules'} />
                        <TreeItem nodeId="5" label="Users" onClick={() => window.location.href = '/admin/createusers'} />
                    </TreeItem>
                    <TreeItem nodeId="6" label="Access">
                        <TreeItem nodeId="7" label="Menu Role Mapping" onClick={() => window.location.href = '/admin/menurolemapping'} />
                    </TreeItem>

                    <TreeItem nodeId="40" label="Previous Menu" onClick={() => navigate('../home')} />
                </TreeView>
            </div>



            {/* </Col > */}
            <div>
                <div style={{ maxHeight: '90vh' }}>

                    <Routes>
                        <Route exact path="/userrolesmodules" element={<UserRolesModules />} />
                        <Route exact path="/menus" element={<UserMenus />} />
                        <Route exact path="/createusers" element={<CreateUsers />} />
                        <Route exact path="/menurolemapping" element={<MenuRoleMapping />} />
                        <Route exact path="/home" element={<MainMenu />} />

                        {/* <Route exact path="./addcustomerdetails" element={<AddCustomerDetails />} />
                                <Route exact path="./addcustomerpartlist" element={<CustPartListPage />} /> */}
                    </Routes>

                </div>
            </div>

        </div>
        // </div >

    )
}

export default AdminMenu;