import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { BsGraphUp } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdOutlineRequestQuote } from "react-icons/md";
import { AiTwotoneContainer } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Home() {
  // let navigate = useNavigate();

  // let [lazerUser, setLazerUser] = useState(
  //   JSON.parse(localStorage.getItem("LazerUser"))
  // );

  let navigate = useNavigate();
  let [lazerUser, setLazerUser] = useState(
    JSON.parse(localStorage.getItem("LazerUser"))
  );

  let customerMenu = () => {
    if (lazerUser.data.access.includes("/customer"))
      window.location.href = "/customer";
    // else throwError(() => error);
  };

  let quotationMenu = () => {
    if (lazerUser.data.access.includes("/Quotation"))
      window.location.href = "/Quotation";
    // else throwError(() => error);
  };
  return (
    <>
      <Header user={false} />
      <button
        className="button-style "
        style={{
          backgroundColor: "#283E81",
          borderRadius: "10px",
          marginLeft: "42px",
        }}
        //navigate("../home")}
        onClick={() => {window.location.href = "http://www.magodlaser:3000/Home"}}
      >
        Previous Menu
      </button>
      <div className="card-container">
        {lazerUser.data.access.includes("/customer") ? (
          <Link
            to="/customer"
            // onClick={customerMenu}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="dashboard-card">
              <div className="card-item">
                <BsGraphUp size={60} color="#283E81" />
                <span className="dashboard-link"> Customer Info</span>
              </div>
            </div>
          </Link>
        ) : null}
        {lazerUser.data.access.includes("/quotation") ? (
          <Link
            to="/quotation"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="dashboard-card">
              <div className="card-item">
                <MdOutlineRequestQuote size={60} color="#283E81" />
                <span className="dashboard-link"> Quotation</span>
              </div>
            </div>
          </Link>
        ) : null}

        {/* {lazerUser.data.access.includes("/customer") ? (
          <>
            {" "}
            <Link
              to="/customer"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="dashboard-card">
                <div className="card-item">
                  <BsGraphUp size={60} color="#283E81" />
                  <span className="dashboard-link"> Customer Info</span>
                </div>
              </div>
            </Link>
            <Link
              to="/quotation"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="dashboard-card">
                <div className="card-item">
                  <MdOutlineRequestQuote size={60} color="#283E81" />
                  <span className="dashboard-link"> Quotation</span>
                </div>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/packingandinvoices"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="dashboard-card">
                <div className="card-item">
                  <BsGraphUp size={60} color="#283E81" />
                  <span className="dashboard-link"> Packing Invoice</span>
                </div>
              </div>
            </Link>

            <Link
              to="/materialsetup"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="dashboard-card">
                <div className="card-item">
                  <BsGraphUp size={60} color="#283E81" />
                  <span className="dashboard-link">MaterialSetUp</span>
                </div>
              </div>
            </Link>
          </>
        )} */}
      </div>
    </>
  );
}

export default Home;
