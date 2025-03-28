/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { BsGraphUp } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdOutlineRequestQuote } from "react-icons/md";
import { AiTwotoneContainer } from "react-icons/ai";

function Home() {
	let [lazerUser, setLazerUser] = useState(
		JSON.parse(localStorage.getItem("LazerUser"))
	);
	return (
		<>
			<Header user={false} />
			{/* <div className="card-container">
        <Link
          to="/salesHome"
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="dashboard-card">
            <div className="card-item">
              <RiUserSettingsFill size={60} color="#283E81" />
              <span className="dashboard-link"> Sales</span>
            </div>
          </div>
        </Link>
        <Link to="/admin" style={{ textDecoration: "none", color: "black" }}>
          <div className="dashboard-card">
            <div className="card-item">
              <RiUserSettingsFill size={60} color="#283E81" />
              <span className="dashboard-link"> Admin</span>
            </div>
          </div>
        </Link>
      </div> */}

			<div className="card-container">
				{/* {lazerUser.data.access.includes("/customer/custorders") ? ( */}
				{lazerUser?.data?.access.includes("/sales") ? (
					<Link
						to="/salesHome"
						style={{ textDecoration: "none", color: "black" }}>
						<div className="dashboard-card">
							<div className="card-item">
								<RiUserSettingsFill
									size={60}
									color="#283E81"
								/>
								<span className="dashboard-link"> Sales</span>
							</div>
						</div>
					</Link>
				) : null}

				{lazerUser?.data?.access.includes("/admin") ? (
					<Link
						to="/admin"
						style={{ textDecoration: "none", color: "black" }}>
						<div className="dashboard-card">
							<div className="card-item">
								<RiUserSettingsFill
									size={60}
									color="#283E81"
								/>
								<span className="dashboard-link"> Admin</span>
							</div>
						</div>
					</Link>
				) : null}
			</div>
		</>
	);
}

export default Home;
