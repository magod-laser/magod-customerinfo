import React, { useEffect, useState } from "react";
import axios from "axios";
import { Page, Document, StyleSheet, View, Text, Image, } from "@react-pdf/renderer";
import { borderRight, padding, style, textAlign } from "@mui/system";
import { Table } from "react-bootstrap";
import magodlogo from "../../../../../../images/MagodLogo.png";

import moment from "moment";


const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
  },
  tableTitle: {
    marginLeft: "300px",
    marginTop: "20px",
    fontSize: 20,
    fontWeight: "bold",
  },
  code1: {
    fontFamily: "Helvetica-Bold",
    marginTop: "10px",
  },
  title2: {
    marginLeft: "100px",
  },
  shiftperiod: {
    marginLeft: "190px",
    marginTop: "10px",
  },
  boxdata: {
    border: "1px",
    padding: "10px",
    marginTop: "40px",
    width: "550px",
    marginLeft: "50px",
    marginRight: "100px",
  },
  tableview: {
    marginLeft: "30px",
    width: "750px",
  },
  Headingrow: {
    flexDirection: "row",
    width: "750px",
    alignItems: "Center",
    marginLeft: "20px",
    marginTop: 20,
    fontWeight: "bold",
  },
  Headingrow1: {
    flexDirection: "row",
    width: "800px",
    alignItems: "center",
    marginLeft: "20px",
    fontWeight: "bold",
  },
  machineHeading: {
    width: "80%",
  },
  operatorHeading: {
    width: "20%",
  },
  logo: {
    width: "70px",
    height: "70px",
  },
  logostyle: {
    marginTop: "15px",
    marginLeft: "40px",
  },
  code: {
    fontSize: "10px",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  codestyle: {
    marginLeft: "15px",
    marginTop: "25px",
  },
  MagodTitle: {
    width: "55%",
  },
  titleBold: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: "15px",
    marginTop: "25px",
  },
  typeofform: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: "15px",
  },
  tableContainer2: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: "15px",
    width: "160px",
  },
  quotationNumview: {
    fontSize: 12,
    width: "60px",
  },
  quotationNumDataview: {
    width: "100px",
  },
  quotesize: {
    fontSize: 12,
  },
  quotationNumData: {
    fontSize: 12,
  },
  dateview: {
    marginTop: "5px",
    fontSize: 12,
    width: "60px",
  },
  dateData: {
    width: "100px",
    marginTop: "4px",
  },
  datesize: {
    fontSize: 12,
  },
  validuptoView: {
    marginTop: "5px",
    fontSize: 12,
    width: "60px",
  },
  validuptodataView: {
    width: "100px",
    marginTop: "4px",
  },
  validsize: {
    fontSize: 12,
  },
  column: {
    flexDirection: "row",
  },
  text: {
    fontSize: 12,
  },
  pagenum: {
    width: 160,
    textAlign: "right",
  },
  cusdetailsection: {
    marginLeft: "30px",
    width: "70%",
    borderBottom: 1,
    borderTop: 1,
  },
  cusnameview: {
    width: "28%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  cusnamedata: {
    width: "70%",
    paddingBottom: "3px",
  },
  enquiryrefview: {
    width: "28%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  refdata: {
    width: "70%",
    paddingBottom: "3px",
  },
  enquirydateview: {
    width: "28%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  enquirydata: {
    width: "70%",
    paddingBottom: "3px",
  },
  contactsection: {
    width: "25%",
    borderBottom: 1,
    borderTop: 1,
  },
  contactview: {
    width: "30%",
    paddingBottom: "3px",
  },
  contactdata: {
    width: "70%",
    paddingBottom: "3px",
  },
  teleview: {
    width: "30%",
    paddingBottom: "3px",
  },
  teledata: {
    width: "70%",
    paddingBottom: "3px",
  },

  maintableview: {


    width: "790px",
    marginLeft: "30px",
  },
  datawithboldline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textDecoration: "underline",
  },
  datawithoutbline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  taskname: {
    marginLeft: "10px",
  },
  databox: {
    marginTop: "10px",
    width: "55%",
  },
  databox2: {
    marginTop: "10px",
    width: "45%",
  },
  materialdetailheading: {
    marginTop: "10px",
  },
  subdetails: {
    width: "60%",
    borderBottom: 1,
    borderLeft: 1,
    borderTop: 1,
  },
  subdetails2: {
    width: "60%",
    borderBottom: 1,
    borderRight: 1,
    borderTop: 1,
  },
  section1: {
    width: "60%",
  },
  section2: {
    width: "60%",
  },
  subsection1heading: {
    width: "55%",
    textAlign: "right",
  },
  subsection1data: {
    width: "45%",
    textAlign: "left",
  },
  subsection2heading: {
    width: "55%",
    textAlign: "right",
  },
  subsection2data: {
    width: "45%",
    textAlign: "left",
  },
  simtext: {
    fontSize: 10,
    padding: "3px",
  },
  simtextdata: {
    marginLeft: "5px",
    fontSize: 10,
    padding: "3px",
  },
  subsectionlastheading: {
    width: "55%",
    textAlign: "right",
    padding : "5px",
  },
  subsectionlastdata: {
    width: "45%",
    textAlign: "left",
  },
  subdetailspart2: {
    width: "50%",
  },
  sectionpart2: {
    width: "50%",
  },
  subdetail2part2: {
    width: "50%",
  },
  subsectionpart2: {
    width: "50%",
  },
  jobwordview: {
    width: "50%",
    textAlign: "right",
  },
  jobworktext: {
    fontFamily: "Helvetica-Bold",
    fontSize: "12px",
    textAlign: "right",
  },
  jobworkdataview: {
    width: "40%",
    textAlign: "left",
  },
  boldtextbox: {
    marginTop: "20px",
  },
  tableDisplay: {
    width: "100%",

    marginTop: "10px",
    borderBottom: 1,
    borderTop: 1,
  },
  drawingname: {
    width: "25%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center"
  },
  quantity: {
    width: "8%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  tableDataView: {
    width: "100%",
    borderBottom: 1,
  },
  tabletext: {
    fontSize: "10px"
  },
  totalDataView: {
    width: "100%",
    borderBottom: 1,
  },
  PageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 10,
    left: 270,
    textAlign: "center",
    color: "gray",
  },
  totaltext: {
    fontFamily: "Helvetica-Bold",
    fontSize: "10px"
  },

  linespace: {
    marginTop: "60px",
    textAlign: "center",
  },
  lineleft: {
    fontSize: 10,
    marginLeft: "70px",
    title: "center",
    titleBold: "bold",
  }  
  

});

const DuesTable = ({ newData }) => {
  console.log("NewData", newData);
  console.log(newData["qtntsklist"][0]["Task_Mtrl_Weight"]);
  const [Tabledata, setTabledata] = useState([]);
  const [index, setIndex] = useState(0);
  let [totaljw, setTotaljw] = useState(0);
  let [totalmtrl, setTotalmtrl] = useState(0);
  let [total, setTotal] = useState(0);

  let [ptotaljw, setPTotaljw] = useState(0);
  let [ptotalmtrl, setPTotalmtrl] = useState(0);
  let [ptotal, setPTotal] = useState(0);
  let [totaltaskjwrate, setTotalTaskJwRate] = useState(0);
  const recordsPerPage = 2;
  const totalPages = Math.ceil(Tabledata.length / recordsPerPage);

  const firstItemData = Tabledata[0];

  useEffect(() => {
    newData["qtntsklist"].map((item, index) => {
      // totaljw += item.TaskJobWorkCost;
      // totalmtrl += item.Task_Mtrl_Cost;
      // total += item.TaskJobWorkCost + item.Task_Mtrl_Cost;

      totaljw += Number(item.Task_Qtn_JW_Rate);
      totalmtrl += Number(item.Task_Qtn_Mtrl_Rate);
      total += Number(item.Task_Qtn_JW_Rate) + Number(item.Task_Qtn_Mtrl_Rate);

      console.log(totaljw);
      console.log(totalmtrl);
      console.log(total);
    });

    setTotaljw(totaljw);
    setTotalmtrl(totalmtrl);
    setTotal(total);

   // item1.Task_Qtn_JW_Rate + item1.Task_Qtn_Mtrl_Rate

    newData["qtnprof"].map((item1,index) => {
      ptotaljw += (Number(item1.Unit_JobWork_Cost) * Number(item1.QtyNested)); 
      ptotalmtrl += (Number(item1.Unit_Mtrl_Cost) * Number(item1.QtyNested)); 
      ptotal += ((Number(item1.Unit_JobWork_Cost) + Number(item1.Unit_Mtrl_Cost)) * Number(item1.QtyNested));

     
    });
    setPTotaljw(ptotaljw);
    setPTotalmtrl(ptotalmtrl);
    setPTotal(ptotal);
    console.log("ptotal", ptotal);
  }, []);

  return (
    <Document>
      {/* {Array.from({ length: totalPages }, (_, pageIndex) => ( */}
      {/* <Page key={pageIndex} size="A4" style={[styles.page, pageIndex === 0 ? styles.firstPage : null]} orientation="landscape"> */}
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.tableContainer}>
          {/* {Tabledata.map((item, index) => ( */}
          <View>
            {/* key={index} > */}
            {/* {index === 0 && ( */}
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.row}>
                  <View style={styles.logostyle}>
                    <Image src={magodlogo} style={styles.logo} />
                  </View>
                  <View style={styles.codestyle}>
                    <Text style={styles.code}>F 29 Rev 4</Text>
                  </View>
                </View>
              </View>

              <View style={styles.MagodTitle}>
                <View>
                  <Text style={styles.titleBold}>
                    Magod Laser Machining Pvt Ltd : {newData["unitdata"][0]["UnitName"]}
                  </Text>
                  <Text style={styles.typeofform}>Quotation Estimation Form</Text>
                </View>
              </View>

              <View style={styles.tableContainer2}>
                <View>
                  <View style={[styles.pageNumberContainer, { textAlign: "right" }]}>
                    <Text
                      style={styles.pageNumberText}
                      render={({ pageNumber }) =>
                        `${pageNumber}`
                      }
                      fixed
                    />
                  </View>


                  <View style={styles.row}>
                    <View style={styles.quotationNumview}>
                      <Text style={styles.quotesize}>Type</Text>
                    </View>
                    <View style={styles.quotationNumDataview}>
                      <Text style={styles.quotationNumData}>{newData["qtnidchk"][0]["QtnType"]}</Text>
                    </View>
                  </View>

                  <View style={styles.column}>
                    <View style={styles.dateview}>
                      <Text>QtnNo</Text>
                    </View>
                    <View style={styles.dateData}>
                      <Text style={styles.datesize}>{newData["qtnidchk"][0]["QtnNo"]}</Text>
                    </View>
                  </View>

                  <View style={styles.column}>
                    <View style={styles.validuptoView}>
                      <Text>Status</Text>
                    </View>
                    <View style={styles.validuptodataView}>
                      <Text style={styles.validsize}>{newData["qtnidchk"][0]["QtnStatus"]}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* )} */}
            <hr />
          </View>
          {/* ))} */}

          {/* {Tabledata.map((item, index) => (*/}

          <View>
            {/* key={index}> */}
            {/* {pageIndex === 0 && index === 0 && ( */}
            <View style={styles.row}>
              <View style={styles.cusdetailsection}>
                <View style={styles.column}>
                  <View style={styles.cusnameview}>
                    <Text style={styles.text}>CustomerName</Text>
                  </View>
                  <View style={styles.cusnamedata}>
                    <Text style={styles.text}>
                      {newData["qtnidchk"][0]["CustomerName"]}
                    </Text>
                  </View>
                </View>

                <View style={styles.column}>
                  <View style={styles.enquiryrefview}>
                    <Text style={styles.text}>EnquiryRef</Text>
                  </View>
                  <View style={styles.refdata}>
                    <Text style={styles.text}>{newData["qtnidchk"][0]["EnquiryRef"]}</Text>
                  </View>
                </View>

                <View style={styles.column}>
                  <View style={styles.enquirydateview}>
                    <Text style={styles.text}>EnquiryDate</Text>
                  </View>
                  <View style={styles.enquirydata}>
                    <Text style={styles.text}>{moment(newData["qtnidchk"][0]["EnquiryDate"]).format("DD/MM/YYYY")}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contactsection}>
                <View style={styles.column}>
                  <View style={styles.contactview}>
                    <Text style={styles.text}>Contact</Text>
                  </View>

                  <View style={styles.contactdata}>
                    <Text style={styles.text}>{newData["qtnidchk"][0]["Contact"]}</Text>
                  </View>
                </View>

                <View style={styles.column}>
                  <View style={styles.teleview}>
                    <Text style={styles.text}>Tele</Text>
                  </View>

                  <View style={styles.teledata}>
                    <Text style={styles.text}>{newData["qtnidchk"][0]["CustTele"]}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* )} */}
            <hr />
          </View>

          {/* ))} */}


          {/*  {Tabledata.slice(
              pageIndex * recordsPerPage,
              (pageIndex + 1) * recordsPerPage
            ).map((item, index) => (*/}

          {/* <View key={index} style={styles.maintableview}> */}
          {newData["qtntsklist"].length > 0 && newData["qtntsklist"].map((qtitem, index) => (
            <View style={styles.maintableview}>
              <View style={styles.column}>
                <View style={styles.databox}>
                  <View style={styles.column}>
                    <View style={styles.taskview}>
                      <Text style={styles.datawithboldline}>Task No :</Text>
                    </View>
                    <View style={styles.taskdata}>
                      <Text style={styles.datawithboldline}>{qtitem.TaskNo}</Text>
                      {/* <Text style={styles.datawithboldline}>{newData["qtntsklist"][0]["TaskNo"]}</Text> */}
                    </View>

                    <View style={styles.taskname}>
                      <Text style={styles.datawithboldline}>
                        {/* {newData["qtntsklist"][0]["Operation"]}&nbsp;/&nbsp;{newData["qtntsklist"][0]["InspLevel"]}&nbsp;/&nbsp;{newData["qtntsklist"][0]["Tolerance"]} */}
                        {qtitem.Operation}&nbsp;/&nbsp;{qtitem.InspLevel}&nbsp;/&nbsp;{qtitem.Tolerance}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.materialdetailheading}>
                    <Text style={styles.datawithoutbline}>
                      {/* {newData["qtntsklist"][0]["material"]}&nbsp;/&nbsp;{newData["qtntsklist"][0]["MtrlGrade"]}&nbsp;/&nbsp;{newData["qtntsklist"][0]["Thickness"]}&nbsp;/&nbsp;{newData["qtntsklist"][0]["mtrl_code"]} */}
                      {qtitem.material}&nbsp;/&nbsp;{qtitem.MtrlGrade}&nbsp;/&nbsp;{qtitem.Thickness}&nbsp;/&nbsp;{qtitem.mtrl_code}
                    </Text>
                  </View>

                  <View style={styles.column}>
                    <View style={styles.subdetails}>
                      <View>
                        <View style={style.section1}>
                          <View style={styles.column}>
                            <View style={styles.subsection1heading}>
                              <Text style={styles.simtext}>LOC / Pierces</Text>
                            </View>
                            <View style={styles.subsection1data}>
                              {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["TaskLOC"]}/ {newData["qtntsklist"][0]["TaskHoles"]}</Text> */}
                              <Text style={styles.simtextdata}>{(qtitem.TaskLOC).toFixed(3)}/ {qtitem.TaskHoles}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Drawings/ Nested</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["CountOfDwg_Name"]}/ {newData["qtntsklist"][0]["CountOfDwg_Name"]}</Text> */}
                            <Text style={styles.simtextdata}>{qtitem.TaskDwgs}/ {qtitem.TaskNests}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Parts/ Nested</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["CountOfDwg_Name"]}/ {newData["qtntsklist"][0]["SumOfQty"]}</Text> */}
                            <Text style={styles.simtextdata}>{qtitem.TaskParts}/ {qtitem.SumOfQty}</Text>
                            {/* {newData["qtntsklist"][0]["TaskNests"]} */}
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Nests/ Sheets</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["TaskNests"]}/{newData["qtntsklist"][0]["TotalSheet"]}</Text> */}
                            <Text style={styles.simtextdata}>{qtitem.TaskNests}/{qtitem.TotalSheet}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          {/* <View style={styles.subsectionlastheading}> */}
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>
                              Net / Rect / Nested Wt.
                            </Text>
                          </View>
                          <View style={styles.subsection1data}>
                            <Text style={styles.simtextdata}>
                              {/* {parseFloat(newData["qtntsklist"][0]["Task_Net_wt"]).toFixed(3)}/{parseFloat(newData["qtntsklist"][0]["TaskRectWeight"]).toFixed(3)}/{newData["qtntsklist"][0]["Task_Mtrl_Weight"].toFixed(3)} */}
                              {parseFloat(qtitem.Task_Net_wt).toFixed(3)}/{parseFloat(qtitem.TaskRectWeight).toFixed(3)}/{qtitem.Task_Mtrl_Weight.toFixed(3)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.subdetails2}>
                      <View>
                        <View style={style.section2}>
                          <View style={styles.column}>
                            <View style={styles.subsection1heading}>
                              <Text style={styles.simtext}>
                                Cutting / Pierce Rate
                              </Text>
                            </View>
                            <View style={styles.subsection1data}>
                              {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_cuttingRate"]}/{newData["qtntsklist"][0]["Task_PierceRate"]}</Text> */}
                              <Text style={styles.simtextdata}>{qtitem.Task_cuttingRate}/{qtitem.Task_PierceRate}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>
                              Setup/Sheet Loading Rate
                            </Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_SettingUpRate"]}/{newData["qtntsklist"][0]["Task_Setup_loading_charge"]}</Text> */}
                            {/* <Text style={styles.simtextdata}>{titem.Task_SettingUpRate}/{titem.Task_Setup_loading_charge}</Text> */}
                            <Text style={styles.simtextdata}>{qtitem.Task_SettingUpRate}/{qtitem.Task_SheetHandlingRate}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Material Handling/Kg</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_mtrlHandlingRate"]}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_mtrlHandlingRate).toFixed(2)}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Material Rate/Kg</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_Qtn_Mtrl_Rate"]}</Text> */}
                            <Text style={styles.simtextdata}>{qtitem.Task_Mtrl_rate}</Text>
                          </View>
                        </View>

                        {/* <View style={styles.column}>
                             <View style={styles.subsectionlastdata}>

          <Text style={styles.simtextdata}>*/}
                              {/* {parseFloat(newData["qtntsklist"][0]["Task_Net_wt"]).toFixed(3)}/{parseFloat(newData["qtntsklist"][0]["TaskRectWeight"]).toFixed(3)}/{newData["qtntsklist"][0]["Task_Mtrl_Weight"].toFixed(3)} */}
                              {/* {parseFloat(titem.Task_Net_wt).toFixed(3)}/{parseFloat(titem.TaskRectWeight).toFixed(3)}/{titem.Task_Mtrl_Weight.toFixed(3)}
                            </Text>
                          </View>
                        </View>  */}
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.databox2}>
                  <View style={styles.column}>
                    <View style={styles.subdetailspart2}>
                      <View>
                        <View style={style.sectionpart2}>
                          <View style={styles.column}>
                            <View style={styles.subsection1heading}>
                              <Text style={styles.simtext}>Cutting Charge</Text>
                            </View>
                            <View style={styles.subsection1data}>
                              {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["Task_Basic_Cutting_Cost"]).toFixed(2)}</Text> */}
                              <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_Basic_Cutting_Cost).toFixed(2)}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Programming</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["Task_Pgme_charge"]).toFixed(2)}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_Pgme_charge).toFixed(2)}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>
                              SetUp and Sheet Handling
                            </Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["Task_SettingUpRate"]) + parseFloat(newData["qtntsklist"][0]["Task_Setup_loading_charge"])}</Text> */}
                            {/* <Text style={styles.simtextdata}>{parseFloat(titem.Task_SettingUpRate) + parseFloat(titem.Task_Setup_loading_charge)}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_Setup_loading_charge)}</Text>
                            {/* {parseFloat(newData["qtntsklist"][0]["Task_SettingUpRate"]).toFixed(2)}</Text> */}
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Material Handling</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_Mtrl_Handling_Charge"]}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_Mtrl_Handling_Charge).toFixed(2)}</Text>
                            {/* parseFloat(parseFloat(newData["qtntsklist"][0]["Task_Mtrl_Weight"]) * parseFloat(newData["qtntsklist"][0]["Task_mtrlHandlingRate"])).toFixed(2)} </Text> */}
                            {/* newData["qtntsklist"][0]["Task_Qtn_Mtrl_Rate"])} </Text> */}
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Base Rate Job Work</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["TaskJobWorkCost"])}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.TaskJobWorkCost).toFixed(2)}</Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Base Rate Material</Text>
                          </View>
                          <View style={styles.subsection1data}>
                            {/* <Text style={styles.simtextdata}>{newData["qtntsklist"][0]["Task_Mtrl_rate"]}</Text> */}
                            <Text style={styles.simtextdata}>{parseFloat(qtitem.Task_Mtrl_Cost).toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.subdetail2part2}>
                      <View>
                        <View style={style.subsectionpart2}>
                          <View style={styles.column}>
                            <View style={styles.subsection1heading}>
                              <Text style={styles.simtext}>Rate/ Mtr</Text>
                            </View>
                            <View style={styles.subsection1data}>

                              {/* <Text style={styles.simtextdata}>{parseFloat((newData["qtntsklist"][0]["Task_Mtrl_Cost"] + newData["qtntsklist"][0]["TaskJobWorkCost"]) / newData["qtntsklist"][0]["TaskLOC"]).toFixed(2)}</Text> */}
                              <Text style={styles.simtextdata}>{parseFloat((qtitem.Task_Mtrl_Cost + qtitem.TaskJobWorkCost) / qtitem.TaskLOC).toFixed(2)}</Text>

                              {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["Task_cuttingRate"]).toFixed(2)}</Text> */}
                            </View>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.subsection1heading}>
                            <Text style={styles.simtext}>Rate/ KG</Text>
                          </View>
                          <View style={styles.subsection1data}>
                          <Text style={styles.simtextdata}>{((Number(qtitem.Task_Qtn_JW_Rate) + Number(qtitem.Task_Qtn_Mtrl_Rate)) / qtitem.Task_Net_wt).toFixed(2)}</Text>
                            {/* <Text style={styles.simtextdata}>{parseFloat(newData["qtntsklist"][0]["Task_Qtn_JW_Rate"] / newData["qtntsklist"][0]["Task_Net_wt"]).toFixed(2)}</Text> */}
                            {/* <Text style={styles.simtextdata}>{titem.Task_Mtrl_Rate}</Text> */}
                          </View>
                        </View>

                        <View style={styles.boldtextbox}>
                          <View style={styles.column}>
                            <View style={styles.jobwordview}>
                              <Text style={styles.jobworktext}>Job Work :</Text>
                            </View>
                            <View style={styles.jobworkdataview}>
                              {/* <Text style={styles.jobworktext}>{parseFloat(newData["qtntsklist"][0]["TaskJobWorkCost"]).toFixed(2)}</Text> */}
                              {ptotal >= qtitem.Task_Qtn_JW_Rate ? <Text style={styles.jobworktext}>{parseFloat(ptotal).toFixed(2)}</Text> : 
                              <Text style={styles.jobworktext}>{parseFloat(qtitem.Task_Qtn_JW_Rate).toFixed(2)}</Text>}
                              {/* {titem.TaskJobWorkCost)}</Text> */}
                            </View>
                          </View>

                          <View style={styles.column}>
                            <View style={styles.jobwordview}>

                              <Text style={styles.jobworktext}>Material :</Text>
                            </View>
                            <View style={styles.jobworkdataview}>
                              {/*  <Text style={styles.jobworktext}>{item.materialcharge}</Text>*/}
                              {/* <Text style={styles.jobworktext}>{parseFloat(newData["qtntsklist"][0]["Task_Mtrl_Cost"]).toFixed(2)}</Text> */}
                              <Text style={styles.jobworktext}>{parseFloat(qtitem.Task_Mtrl_Cost).toFixed(2)}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.tableDisplay}>
                <View style={styles.column}>
                  <View style={styles.drawingname}>
                    <Text style={styles.datawithoutbline}>Drawing name</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Qty</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Nested</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>LOC</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Pierce</Text>
                  </View>
                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>CF</Text>
                  </View>
                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Dwgs</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Perimeter</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Open</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>JW Cost</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Mtrl Cost</Text>
                  </View>              

                  <View style={styles.quantity}>
                    <Text style={styles.datawithoutbline}>Total</Text>
                  </View>
                </View>

              </View>
              
              {/* {newData["qtnprof"].filter(qtnprof => qtnprof.TaskNo === titem.TaskNo).map((item) => ( */}
              
              {/* {newData["qtnprof"].length > 0 && newData["qtnprof"].map((titem, index) => ( */}
                {newData["qtnprof"].length > 0 && newData["qtnprof"].filter(qtnprof => qtnprof.TaskNo === qtitem.TaskNo).map((item) => (
              
                <View style={styles.tableDataView}>
                   {/* key={index}> */}

                  <View style={styles.column}>
                    <View style={styles.drawingname}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Dwg_Name"]}</Text> */}
                      <Text style={styles.tabletext}>{item.Dwg_Name}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Qty"]}</Text> */}
                      <Text style={styles.tabletext}>{item.Qty}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["QtyNested"]}</Text> */}
                      <Text style={styles.tabletext}>{item.QtyNested}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["LOC"]}</Text> */}
                      <Text style={styles.tabletext}>{item.LOC}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["NoofPierces"]}</Text> */}
                      <Text style={styles.tabletext}>{item.NoofPierces}</Text>
                    </View>
                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Complexity"]}</Text> */}
                      <Text style={styles.tabletext}>{item.Complexity}</Text>
                    </View>
                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["DwgExists"] > 0 ? 'True' : 'False'}</Text> */}
                      <Text style={styles.tabletext}>{item.DwgExists < 0 ? 'True' : 'False'}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["perimeter"]}</Text> */}
                      <Text style={styles.tabletext}>{"False"}</Text>
                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["OutOpen"]}</Text> */}
                      <Text style={styles.tabletext}>{item.OutOpen == '-1' ? 'True' : 'False'}</Text>
                      {/* <Text style={styles.tabletext}>{'False'}</Text> */}
                    </View>

                    <View style={styles.quantity}>
                      <Text style={styles.tabletext}>{parseFloat(item.Unit_JobWork_Cost).toFixed(2)}</Text>
                      {/* {item.Unit_JobWork_Cost}</Text> */}

                    </View>

                    <View style={styles.quantity}>
                      {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Unit_Material_cost"]}</Text> */}
                      <Text style={styles.tabletext}>{parseFloat(item.Unit_Material_cost).toFixed(2)}</Text>
                    </View>

                    <View style={styles.quantity}>
                      
                      
                    {/* <Text style={styles.totaltext}>{parseFloat(((Number(item.Unit_JobWork_Cost) ) * item.QtyNested) ).toFixed(2)}</Text> */}
                    {/* <Text style={styles.totaltext}>{newData["qtnprof"][0]["total"]}</Text> */}
                      <Text style={styles.totaltext}>{parseFloat(((Number(item.Unit_JobWork_Cost) + Number(item.Unit_Material_cost)) * item.QtyNested) ).toFixed(2)}</Text>
                      {/* <Text style={styles.totaltext}>{parseFloat(item.Unit_JobWork_Cost + item.Unit_Material_cost).toFixed(2)}</Text> */}
                    </View>
                  </View>


                </View>
                // </View>
                // )}
                // </View>
              ))}
              <View style={styles.totalDataView}>  </View>
              {/* <View style={styles.totalDataView}>  </View>
              <View style={styles.totalDataView}>  </View>
              <View style={styles.totalDataView}>  </View>
              <View style={styles.totalDataView}>  </View> */}

            </View>
          ))}

          {/* <View  style={styles.datawithoutbline}> </View>*/}
          {/* <View > </View>
          <View > </View>
          <View > </View>  */}
           <View style={styles.linespace}> {/*tableDisplay}> */}
            <View style={styles.column}>
              {/* <View style={styles.linespace}> */}
                {/* <Text style={styles.linespace}>         </Text> */}
              {/* </View>*/}
             
              <View style={styles.drawingname}> 
                <Text style={styles.lineleft}>Estimation Summary</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableDisplay}>
            <View style={styles.column}>
              <View style={styles.drawingname}>
                <Text style={styles.datawithoutbline}>Task No</Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>

              {/* <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}> </Text>
              </View> */}

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}>JW Cost</Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}>Mtrl Cost</Text>
              </View>

              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}>Total</Text>
              </View>
            </View>
          </View>

        </View>
        {/* ))}  */}
        {/* {newData["qtntsklist"][0]["TaskNo"]} */}
        {/* </View> */}

        {newData["qtntsklist"].length > 0 && newData["qtntsklist"].map((item, index) => (
          // <View style={styles.tableDataView}>

          <View style={styles.column}>
            <View style={styles.drawingname}>    {/* style={styles.drawingname}> */}
              {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Dwg_Name"]}</Text> */}
              <Text style={styles.tabletext}>{item.TaskNo}</Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>         </Text>
            </View>

            {/* <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>         </Text>
              </View>

              <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>         </Text>
              </View>

              <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>           </Text>
              </View>
              <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>           </Text>
              </View>
              <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>           </Text>
              </View>
              <View style={styles.quantity}>
                
                <Text style={styles.datawithoutbline}>         </Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.datawithoutbline}>         </Text>
              </View> */}

            <View style={styles.quantity}>
              {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["Complexity"]}</Text> */}
              {/* <Text style={styles.tabletext}>{parseFloat(item.TaskJobWorkCost).toFixed(2)}</Text> */}
              <Text style={styles.tabletext}>{parseFloat(item.Task_Qtn_JW_Rate).toFixed(2)}</Text>
            </View>
            <View style={styles.quantity}>
              {/* <Text style={styles.tabletext}>{newData["qtnprof"][0]["DwgExists"] > 0 ? 'True' : 'False'}</Text> */}
              {/* <Text style={styles.tabletext}>{parseFloat(item.Task_Mtrl_Cost).toFixed(2)}</Text> */}
              <Text style={styles.tabletext}>{parseFloat(item.Task_Qtn_Mtrl_Rate).toFixed(2)}</Text>
            </View>
            <View style={styles.quantity}>
              {/* <Text style={styles.datawithoutbline}>{parseFloat(item.TaskJobWorkCost + item.Task_Mtrl_Cost).toFixed(2)}</Text> */}
              <Text style={styles.datawithoutbline}>{parseFloat(Number(item.Task_Qtn_JW_Rate) + Number(item.Task_Qtn_Mtrl_Rate)).toFixed(2)}</Text>
            </View>

          </View>
          // </View>
        ))}
        <View style={styles.tableDisplay}>
          <View style={styles.column}>
            <View style={styles.drawingname}>
              <Text style={styles.datawithoutbline}>TOTAL            : </Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>      </Text>
            </View>

            {/* <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>      </Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>      </Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>        </Text>
            </View>
            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>        </Text>
            </View>
            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>     </Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>   </Text>
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>   </Text>
            </View> */}

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>{parseFloat(totaljw).toFixed(2)}</Text>
              
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>{parseFloat(totalmtrl).toFixed(2)}</Text>
              
            </View>

            <View style={styles.quantity}>
              <Text style={styles.datawithoutbline}>{parseFloat(total).toFixed(2)}</Text>
              
            </View>
          </View>

        </View>



      </Page>
      {/* ))} */}
    </Document >

  );
};

export default DuesTable;
