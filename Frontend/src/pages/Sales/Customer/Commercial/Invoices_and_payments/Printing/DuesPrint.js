import React, { useRef, Fragment, useEffect, useState } from "react";
// import MLLogo from "../../../../../ML-LOGO.png";

import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';  // Add PropTypes for validation
import moment from 'moment';
import magodlogo from "../../../../../../images/ML-LOGO.png"
import { Button } from 'react-bootstrap';
//import blobStream from 'blob-stream';
import { postRequest } from '../../../../../api/apiinstance';
// import DuesTable from "./DuesTable";
// import { postRequest } from "../../../../../api/apiinstance";
import { endpoints } from "../../../../../api/constants";
import { ToastContainer, toast } from "react-toastify";

// Define styles with fixed column widths and wrapping 
let headerFontSize = "13px";
let subheaderFontsize = "11px";
let fontSize = "9px";

const style = {
    pageStyling: {
        padding: "2%",
        // paddingTop: "3%",
        fontSize: fontSize,
        fontFamily: "Helvetica",
    },
    globalPadding: { padding: "0.6%" },
    footerRowPadding: { padding: "3px" },
    rowPadding: { padding: "0.6%" },
    fontBold: {
        //   fontWeight: "bold",
        fontSize: fontSize,
        fontFamily: "Helvetica-Bold",
    },
};


// Define styles with fixed column widths and wrapping 
const styles = StyleSheet.create(
    {
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: 20,
        },
        table: {
            display: 'table',
            width: 'auto',
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableColHeader: {
            //  border: '1px solid #000',
            //  backgroundColor: '#E4E4E4',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for header columns 
        },
        tableCol: {
            //  border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for data columns 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        logo: {
            width: 30,
            height: 40,
        },
        companyDetails: {
            fontSize: 10, // Reduced font size 
            textAlign: 'right',
        },
        title: {
            fontSize: 12, // Reduced font size 
            marginBottom: 10,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        text: {
            fontSize: 10, // Reduced font size 
        },
        tableColRight: {
            //   border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size width: '20%', // Fixed width for data columns 
            textAlign: 'right', // Align text to the right 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        tableColLeft: {
            //   border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for data columns 
            textAlign: 'left', // Align text to the left 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        colBold: {
            fontWeight: 'bold',
        },
        tableColHeaderMerge: {
            border: '1px solid #000',
            //  backgroundColor: '#E4E4E4',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '50%', // Merged column width for header 
            textAlign: 'left', // Centered text for merged column 
        },
        line: {
            height: 1,
            backgroundColor: '#000',
            marginVertical: 3,
        },

        table1: {
            display: 'table',
            borderWidth: '0.5',
            width: 'auto',
        },
        tableRow1: {
            flexDirection: 'row',
        },
        tableColHeader1: {
            //  border: '1px solid #000',
            //  backgroundColor: '#E4E4E4',
            borderWidth: 0.5,
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for header columns 
        },
        tableCol1: {
            //  border: '1px solid #000',
            borderWidth: 0.5,
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for data columns 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        tableColRight1: {
            //   border: '1px solid #000',
            borderWidth:0.5,
            padding: 5,
            fontSize: 10, // Reduced font size width: '20%', // Fixed width for data columns 
            textAlign: 'right', // Align text to the right 
            flexWrap: 'wrap', // Enable text wrapping 
        },
    });


// Function to get today's date in DD/MM/YYYY format 
const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0! 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};




export default function DuesPrint({ DueReportData, UnitData, ODAmt }) {

    const [newData, setNewData] = useState([]);
    const [unitData, setUnitData] = useState([]);

    useEffect(() => {
        if (Array.isArray(DueReportData)) {  // Ensure it is an array
            setNewData(DueReportData);
        } else {
            console.error("DueReportData should be an array");
        }
        if (Array.isArray(UnitData)) {  // Ensure it is an array
            setUnitData(UnitData);
        } else {
            console.error("DueReportData should be an array");
        }

    }, [DueReportData, UnitData]);

    console.log('newData:', newData);
    console.log('unitData:', unitData);
    console.log('ODAmt:', ODAmt);
    console.log('DueReportData:', DueReportData);
    //useEffect(() => { pdf(<MyDocument />).toBlob().then(blob => { // Use the blob to count pages or download the PDF }); }, []);

    const DownloadPDF = async()=>{
        toast.success("Downloaded Successfully")
    }
    const handleDueGeneratePDF = async () => {
        // alert("Saved successfully")
        toast.success("Saved successfully")
        try {
            // const response = await axios.post('/generate-pdf', { newData, unitData, CName });

            await postRequest(endpoints.getGenerateDuePdf, { ccode: newData[0].Cust_Code }, (response) => {
                console.log('Response:', response);
                //   setFilePath(response.filePath);
                alert("sucesssss")
                // alert(response.data.message);
                // toast.success("Saved successfully")
            });
            // setFilePath(response.data.filePath);
            // alert(response.data.message);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const fileName = `Duelist_${getCurrentDate()}.pdf`;


    return (
        <>

            <Fragment>
                {newData.length > 0 && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
                                <button className="button-style" onClick={handleDueGeneratePDF} style={{ fontSize: '10px' }}>Save to Server</button>
                                <PDFDownloadLink
                                    document={<MyDocument newData={newData} unitData={unitData} ODAmt={ODAmt} />}
                                    fileName={fileName} >
                                    {({ loading }) => loading ? 'Loading document...' : (
                                        <button className="button-style" onClick={DownloadPDF} style={{ fontSize: '10px' }}>Download PDF</button>)}
                                </PDFDownloadLink>
                            </div>
                            <PDFViewer width="1200" height="600">
                                <MyDocument newData={newData} unitData={unitData} ODAmt={ODAmt} />
                            </PDFViewer>
                        </div>
                    </>
                )}
            </Fragment>



        </>
    );


}


const MyDocument = ({ newData, unitData, ODAmt }) => (

    <Document>
        <Page size="A4" orientation='landscape' style={styles.page} >
            {/* <Header unitData={unitData} /> */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol, width: '10%' }}>
                        <Image style={styles.logo} src={magodlogo} /> {/* Update with your logo path */}
                    </View>
                    <View style={{ ...styles.tableCol, width: '100%' }}>
                        {/* <Text style={styles.companyDetails}> */}
                        <Text style={{ ...styles.companyDetails, textAlign: 'center' }}>
                            {/* <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign:'center', borderBottom:'1'}}>List of Invoices Due For Payment as on {getCurrentDate()}</Text> */}
                            {/* <Text style={{ fontSize: 13, fontWeight: 'bold',fontFamily: "Helvetica-Bold",borderBottom:"1px" }}>List of Invoices Due For Payment as on {getCurrentDate()}{'\n'}</Text> */}
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 2 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', fontFamily: "Helvetica-Bold" }}>
                                    List of Invoices Due For Payment as on {getCurrentDate()}{'\n'}
                                </Text>
                            </View>


                            <Text style={{ fontSize: 13, fontWeight: 'bold', fontFamily: "Helvetica-Bold" }}>{unitData[0].RegisteredName}{'\n'}</Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' }}> GST: {unitData[0].GST_No} CIN: {unitData[0].CIN_No}{'\n'}</Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', fontweight: 'bold' }}>{unitData[0].Unit_Address}{'\n'}</Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', fontweight: 'bold' }}>{unitData[0].PhonePrimary},{" "}
                                {unitData[0].PhoneSecondary}, {unitData[0].Email},{" "} {unitData[0].URL}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                {/* <Text style={styles.title}>List of Invoices Due For Payment as on {getCurrentDate()}</Text> */}
                {/* <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign:'center'}}>List of Invoices Due For Payment as on {getCurrentDate()}</Text> */}

                {newData.length > 0 ? (
                    <View style={styles.table}>
                        {/* <View style={styles.tableRow} >
                            <Text style={{ fontSize: 13, fontWeight: 'bold',fontFamily: "Helvetica-Bold"}}>Customer Name: </Text>
                            {/* style={styles.tableColLeft} */}
                        {/* <Text style={{ width: '30%', paddingTop:'20px', textAlign:"left", fontSize:"10"}}>Customer Name: </Text> */}
                        {/* <Text style={styles.tableColHeaderMerge}>{newData[0].Cust_Name}</Text> */}
                        {/* // width: '60%', textAlign:"left",paddingTop:'20px', fontSize:"10", fontWeight: 'bold' */}
                        {/* <Text style={{ fontSize: 13, fontWeight: 'bold',fontFamily: "Helvetica-Bold"}}>{newData[0].Cust_Name}</Text> */}
                        {/* style={{...styles.tableColHeaderMerge, fontWeight:'bold'}} */}

                        {/* <Text style={styles.tableColRight}>        Due Amount : {parseFloat(ODAmt).toFixed(2)}</Text> */}
                        {/* style={{ ...styles.tableColRight, width: '15%', textAlign:"right", fontSize:"10", fontWeight: 'bold'} */}
                        {/* <Text style={{ fontSize: 13, fontWeight: 'bold',fontFamily: "Helvetica-Bold",textAlign:"right",}}>Due Amount : </Text> */}
                        {/* <Text style={{ fontSize: 13, fontWeight: 'bold',fontFamily: "Helvetica-Bold",textAlign:"right",}}> {parseFloat(ODAmt).toFixed(2)}</Text> */}


                        {/* </View> */}

                        <View style={[styles.tableRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            {/* Customer Name (Left Corner) */}
                            <Text style={{ fontSize: 13, fontWeight: 'bold', fontFamily: "Helvetica-Bold" }}>
                                Customer Name: {newData[0].Cust_Name}
                            </Text>

                            {/* Due Amount (Right Corner) */}
                            <Text style={{ fontSize: 13, fontWeight: 'bold', fontFamily: "Helvetica-Bold" }}>
                                Due Amount: {parseFloat(ODAmt).toFixed(2)}
                            </Text>
                        </View>

                        {/* <View style={styles.line} /> Line above headers */}
                        <View style={styles.table1}>
                            <View style={{ ...styles.tableRow1, fontFamily: "Helvetica-Bold" }}>
                                <Text style={{ ...styles.tableColHeader1, width: '4%', }}>Srl</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '7%' }}>Inv No</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '8%' }}>Inv Date</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '41%' }}>PO No</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '9%' }}>Amount</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '9%' }}>Received</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '8%' }}>Balance</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '8%' }}>Due Date</Text>
                                <Text style={{ ...styles.tableColHeader1, width: '7%' }}>Due Days</Text>
                            </View>
                            {/* <View style={styles.line} /> Line above headers */}
                            {newData.map((item, index) => (
                                <View>
                                    <View key={index} style={{ ...styles.tableRow1, fontSize: '9px', fontFamily: 'Helvetica' }}>
                                        <Text style={{ ...styles.tableCol1, width: '4%' }}>{index + 1}</Text>
                                        <Text style={{ ...styles.tableCol1, width: '7%' }}>{item.Inv_No}</Text>
                                        <Text style={{ ...styles.tableCol1, width: '8%' }}>{item.Inv_Date}</Text>
                                        <Text style={{ ...styles.tableCol1, width: '41%', flexWrap: 'nowrap' }}>{item.PO_No}</Text>
                                        <Text style={{ ...styles.tableColRight1, width: '9%', fontweight: 'bold' }}>{item.GrandTotal}</Text>
                                        <Text style={{ ...styles.tableColRight1, width: '9%' }}>{item.PymtAmtRecd}</Text>
                                        <Text style={{ ...styles.tableColRight1, width: '8%' }}>{item.Balance}</Text>
                                        <Text style={{ ...styles.tableCol1, width: '8%' }}>{moment(item.DespatchDate).add(item.creditTime, "days").format("DD-MM-YYYY")}</Text>
                                        <Text style={{ ...styles.tableColRight1, width: '7%' }}>{item.DueDays}</Text>
                                    </View>
                                    {/* <View style={styles.line}> </View> */}
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <Text style={styles.text}>No data available</Text>
                )}
            </View>
            <Footer pageNumber={1} />
        </Page>
        )
    </Document >
);

MyDocument.propTypes = {
    newData: PropTypes.array.isRequired,
    unitData: PropTypes.array.isRequired,
    ODAmt: PropTypes.string.isRequired
};


DuesPrint.propTypes = {
    DueReportData: PropTypes.array.isRequired,
    UnitData: PropTypes.array.isRequired,
    ODAmt: PropTypes.string.isRequired
};

const Header = ({ unitData, pageNumber }) => (
    <>
        <View style={styles.line} /> {/* Line above headers */}
        <View style={{ ...styles.tableRow, fontweight: 'bold' }}>
            <Text style={{ ...styles.tableColHeader, width: '5%' }}>Srl</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv No</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv Date</Text>
            <Text style={{ ...styles.tableColHeader, width: '20%' }}>PO No</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Amount</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Received</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Balance</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Date</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Days</Text>
        </View>
        <View style={styles.line} />
    </>
    // <View style={styles.header}>
    //     <Text style={styles.headerText}>{unitData[0].RegisteredName} - Page {pageNumber} </Text>
    //     <Image style={styles.logo} src={magodlogo} />
    // </View>
);
const Footer = ({ pageNumber }) => (
    <>
        <View style={styles.line} />
        {/* <View style={styles.footer}>
            <Text style={styles.footerText}>Page {pageNumber}</Text>
        </View> */}
    </>
);


