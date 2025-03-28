/** @format */

import React, { createContext, useState } from "react";

// Create a context
const MenusContext = createContext();

// Create a provider component
const MenuProvider = ({ children }) => {
	const [menusData, setMenusData] = useState(null);
	console.log("memusData", menusData);

	return (
		<MenusContext.Provider value={{ menusData, setMenusData }}>
			{children}
		</MenusContext.Provider>
	);
};

export { MenusContext, MenuProvider };
