import React, { useState, useContext } from "react";

const OrderContext = React.createContext();

export function useOrderContext() {
    return useContext(OrderContext);
}

export function OrderProvider({children}) {
    const [order, setOrder] = useState();

    function setOrderState(order) {
        setOrder(order);
    }
    return (
        <OrderContext.Provider value={{order, setOrderState}}>
            {children}
        </OrderContext.Provider>
    );
}