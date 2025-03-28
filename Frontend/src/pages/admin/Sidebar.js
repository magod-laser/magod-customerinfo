import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SidebarUserData from "../admin/SidebarUserData";
import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setSubMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openSubMenu = () => setSubMenuOpen(!isSubmenuOpen);

  return (
    <div className="main-container" style={{ marginRight: "0px" }}>
      <div className={`${isSidebarOpen ? "sidebar sidebar_open" : "sidebar"}`}>
        {/* logo */}
        <div className="top_section">
          {isSidebarOpen && (
            // <img className="logo" src={require("../ML-LOGO.png")} />
            <h5 className="title_name">M A G O D</h5>
          )}

          <div className="toggle-icon">
            {isSidebarOpen ? (
              <FaAngleLeft onClick={toggleSidebar} />
            ) : (
              <FaAngleRight onClick={toggleSidebar} />
            )}
          </div>
        </div>

        {/* paths */}

        <div>
          <div className="routes">
            <div>
              {SidebarUserData.map((path, index) => (
                <React.Fragment key={path.id}>
                  <div className="link">
                    <div>
                      <NavLink to={path.path} className="menu_items">
                        <div
                          className={`${isSidebarOpen ? "icon" : "small-icon"}`}
                        >
                          {path.icon}
                        </div>
                        <div className="link_text">{path.name}</div>
                      </NavLink>
                    </div>
                    <div>
                      <FaAngleDown
                        className="dropdown-icon"
                        onClick={() => setSubMenuOpen(!isSubmenuOpen)}
                      />
                    </div>
                  </div>
                  <div
                    className={`${isSubmenuOpen ? "submenu" : "close-submenu"}`}
                  >
                    <div>
                      <ul className="submenu_ul">
                        {isSidebarOpen && (
                          <>
                            {path?.subRoutes?.map((linkval, index) => {
                              return (
                                <li key={index} className="submenu_link">
                                  <div className="submenu_links">
                                    <div className="icon">{linkval.icon}</div>
                                    <div className="link_text">
                                      {linkval.name}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
