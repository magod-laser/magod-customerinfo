import React, { useState, useContext } from "react";

const QuotationContext = React.createContext();

export function useQuotationContext() {
    return useContext(QuotationContext);
}

export function QuotationProvider({children}) {
    const [quotation, setQuotation] = useState();

    function setQuotationState(quotation) {
        setQuotation(quotation);
    }
    return (
        <QuotationContext.Provider value={{quotation, setQuotationState}}>
            {children}
        </QuotationContext.Provider>
    );
}