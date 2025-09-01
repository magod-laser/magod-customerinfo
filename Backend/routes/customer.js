const customerRouter = require("express").Router();
var createError = require("http-errors");
const {
  createFolder,
  copyallfiles,
  renameFolderIfExists,
} = require("../helpers/folderhelper");
const {
  misQuery,
  setupQuery,
  setupQueryMod,
  misQueryMod,
} = require("../helpers/dbconn");
const req = require("express/lib/request");
const { sendDueList } = require("../helpers/sendmail");
const { logger } = require("../helpers/logger");
const moment = require("moment");

const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

customerRouter.post("/allcustomers", async (req, res, next) => {
  try {
    misQueryMod(
      `Select *, p.CreditDays from magodmis.cust_data c
inner join magod_setup.paymentterms p on p.PaymentTerm = c.CreditTerms
order by Cust_name asc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post("/allcustcodename", async (req, res, next) => {
  try {
    misQueryMod(
      "Select Cust_Code,Cust_name from magodmis.cust_data order by Cust_name asc",
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post("/findcustcodebyname", async (req, res, next) => {
  try {
    await misQueryMod(
      `Select Cust_Code,Cust_name from magodmis.cust_data Where Cust_name = '${req.body.custname}' order by Cust_name asc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post("/getcustomerdetails", async (req, res, next) => {
  try {
    let custid = req.body.custcode;
    misQueryMod(
      `Select * from magodmis.cust_data where Cust_Code='${custid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post("/customer", async (req, res, next) => {
  try {
    const customerName = req.body.customerName;
    const branchName = req.body.branchName;
    const newQno = "";
    var isBranch = branchName != null ? 1 : 0;
    let msg = "";
    // Check if the customer already exists
    misQueryMod(
      `SELECT * FROM magodmis.cust_data WHERE LOWER(Cust_name) = LOWER("${customerName}")`,
      (err, result) => {
        if (err) {
          logger.error(err);
          return res.status(500).send("Error checking customer data");
        }

        if (result.length > 0) {
          misQueryMod(
            `UPDATE magodmis.cust_data SET IsBranch = "${isBranch}", Branch = "${branchName}" WHERE Cust_name = "${customerName}"
             AND Cust_Code = "${result[0].Cust_Code}"`,
            (err, result1) => {
              if (err) {
                logger.error(err);
                return res.status(500).send("Error updating customer data");
              }
              res.send(result1);
            }
          );
        } else {
          misQueryMod(
            `SELECT * FROM magod_setup.magod_runningno WHERE SrlType = 'CustCode' ORDER BY Id DESC LIMIT 1`,
            async (err, runningno) => {
              if (err) {
                logger.error(err);
                return res.status(500).send("Error fetching running number");
              }

              let month = new Date().toLocaleString("en-US", {
                month: "long",
              });
              console.log("Month : ", month);

              let qno = (parseInt(runningno[0]["Running_No"]) + 1)
                .toString()
                .padStart(4, "0");
              let dwgfolder = qno;
              console.log("Dwg Folder : ", dwgfolder);
              createFolder(
                "Customer",
                qno,
                dwgfolder,
                newQno,
                month,
                (err, fres) => {
                  if (err) logger.error(err);
                }
              );

              misQueryMod(
                `INSERT INTO magodmis.cust_data (Cust_Code, IsBranch, Cust_name, Branch, DwgLoc) VALUES ("${qno}", "${isBranch}", "${customerName}", "${branchName}", "${qno}")`,
                (err, ins) => {
                  if (err) {
                    logger.error(err);
                    return res
                      .status(500)
                      .send("Error inserting customer data");
                  }

                  if (ins && ins.affectedRows > 0) {
                    misQueryMod(
                      `UPDATE magod_setup.magod_runningno SET Running_No = Running_No + 1 WHERE SrlType = 'CustCode' AND Id = ${runningno[0].Id}`,
                      (err, updatedrunning) => {
                        if (err) {
                          logger.error(err);
                          return res
                            .status(500)
                            .send("Error updating running number");
                        }
                        res.send({ status: "success", custcode: qno });
                      }
                    );
                  }
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    next(error);
  }
});

customerRouter.post("/customerupdate", async (req, res, next) => {
  try {
    let msg = "";
    let {
      custcode,
      customerName,
      branchName,
      custAddress,
      city,
      pincode,
      state,
      stateid,
      country,
      compemail,
      crterms,
      maxcredit = 0.0,
      creditdays = 0,
      avepaydays = 0,
      gstno,
      panno,
      govtorg,
      isexport,
      custfoldername,
      custcurent,
      delivery,
      custContactData,
    } = req.body;

    const ccurrent = custcurent ? 1 : 0;
    const gstexempt = govtorg == 1 ? 1 : 0;
    let dwgfolder = "";

    misQueryMod(
      `SELECT * FROM magodmis.cust_data WHERE Cust_Code = '${custcode}'`,
      async (err, response) => {
        if (err) {
          msg = res.status(500).send("Error fetching customer data");
        }
        let govt = 0;
        let isexp = 0;
        if (response && response.length > 0) {
          dwgfolder = response[0].DwgLoc;
          console.log("customerupdating - Yes - 1");
          govt = !govtorg ? 0 : 1;
          isexp = !isexport ? 0 : 1;

          console.log("isexp-value", isexp);

          if (avepaydays == null || avepaydays == "") {
            avepaydays = 0;
          }

          if (maxcredit == null || maxcredit == "") {
            maxcredit = 0.0;
          }
          // Update customer data
          const updateQuery = `UPDATE magodmis.cust_data SET Branch = '${branchName}', Address = '${custAddress}', City = '${city}', StateId = '${stateid}',
         State = '${state}', Country = '${country}', Pin_Code = '${pincode}', EMail = '${compemail}', IsGovtOrg = ${govt}, IsForiegn = ${isexp},
          GST_Exempt = '${gstexempt}', CreditTerms = '${crterms}', CreditTime = ${creditdays}, CreditLimit = ${maxcredit}, AveragePymtPeriod = ${avepaydays},
            GSTNo = '${gstno}', PAN_No = '${panno}', DwgLoc = '${custfoldername}', CURRENT = '${ccurrent}', Delivery = '${delivery}', CustStatus = 'OK' 
            WHERE Cust_Code = '${custcode}'`;

          misQueryMod(updateQuery, async (err, response2) => {
            if (err) {
              logger.error("Error updating customer data:", err);
              //     console.error('Error updating customer data:', err);
            }

            if (custfoldername !== custcode) {
              // Logic for creating folder and copying files
            }
            // Delete existing contacts
            misQueryMod(
              `DELETE FROM magodmis.cust_contacts WHERE Cust_code = '${custcode}'`,
              async (err, deldata) => {
                if (err) {
                  logger.error(err);
                }

                // Update contact details
                for (let i = 0; i < custContactData.length; i++) {
                  const contact = custContactData[i];

                  // Check if contact already exists
                  misQueryMod(
                    `SELECT * FROM magodmis.cust_contacts WHERE Name = '${contact.conName}' AND Cust_code = '${custcode}'`,
                    async (err, contdata) => {
                      if (err) {
                        logger.error("Error checking contact data:", err);
                      }

                      if (contdata && contdata.length > 0) {
                        // Update existing contact
                        misQueryMod(
                          `UPDATE magodmis.cust_contacts SET Designation = '${contact.conDesignation}', E_mail = '${contact.conE_mail}', 
                               Dept = '${contact.conDept}', Tele_Office = '${contact.conTele_Office}', Tele_Mobile = '${contact.conTele_Mobile}'
                                WHERE Cust_code = '${custcode}' AND Name = '${contact.conName}'`,
                          (err, updata) => {
                            if (err) {
                              logger.error("Error updating contact:", err);
                            }
                          }
                        );
                      } else {
                        // Insert new contact
                        misQueryMod(
                          `INSERT INTO magodmis.cust_contacts (Cust_code, Name, Designation, E_mail, Dept, Tele_Office, Tele_Mobile) VALUES (
                    '${custcode}', '${contact.conName}', '${contact.conDesignation}', '${contact.conE_mail}', '${contact.conDept}', '${contact.conTele_Office}', 
                    '${contact.conTele_Mobile}')`,
                          (err, contins) => {
                            if (err) {
                              logger.error("Error inserting contact:", err);
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          });

          // createFolder("Customer", custcode,  custfoldername, '', (err, fres) => {});
          createFolder(
            "Customer",
            custcode,
            dwgfolder,
            custfoldername,
            "",
            (err, fres) => {}
          );

          //renameFolderIfExists(folderBase, custcode, custfoldername, callback);

        } else {
          msg = res.status(404).send("Customer not found");
        }
        res.send({ status: msg });
      }
    );
  } catch (error) {
    logger.error("Unexpected error:", error);
    next(error);
  }
});

// customerRouter.post('/customerupdate', async (req, res, next) => {
//   // console.log('customerupdate - Yes');
//   // console.log(req.body);
//    try {
//      let msg = '';
//      let { custcode,customerName, branchName, custAddress,  city, pincode, state, stateid, country, compemail, crterms, maxcredit = 0.0, creditdays = 0,
//        avepaydays = 0, gstno, panno, govtorg, isexport, custfoldername, custcurent, delivery, custContactData} = req.body;

//      const ccurrent = custcurent ? 1 : 0;
//      const gstexempt = govtorg == 1 ? 1 : 0;
//      let dwgfolder = '';

//      misQueryMod(`SELECT * FROM magodmis.cust_data WHERE Cust_Code = '${custcode}'`, async (err, response) => {
//        if (err) {
//     //     console.error('Error fetching customer data:', err);
//          msg= res.status(500).send('Error fetching customer data');
//        }
//        let govt = 0;
//        let isexp = 0;
//        if (response && response.length > 0) {
//          dwgfolder = response[0].DwgLoc;
//          console.log('customerupdating - Yes - 1');
//          govt = !govtorg ? 0: 1;
//          isexp = !isexport ? 0: 1;
//          if (avepaydays == null || avepaydays == "") {
//            avepaydays = 0;
//          }

//          if (maxcredit == null || maxcredit == "") {
//            maxcredit = 0.0;
//          }
//          // Update customer data
//          const updateQuery = `UPDATE magodmis.cust_data SET Branch = '${branchName}', Address = '${custAddress}', City = '${city}', StateId = '${stateid}',
//           State = '${state}', Country = '${country}', Pin_Code = '${pincode}', EMail = '${compemail}', IsGovtOrg = ${govt}, IsForiegn = ${isexp},
//            GST_Exempt = '${gstexempt}', CreditTerms = '${crterms}', CreditTime = ${creditdays}, CreditLimit = ${maxcredit}, AveragePymtPeriod = ${avepaydays},
//              GSTNo = '${gstno}', PAN_No = '${panno}', DwgLoc = '${custfoldername}', CURRENT = '${ccurrent}', Delivery = '${delivery}', CustStatus = 'OK'
//              WHERE Cust_Code = '${custcode}'`;

//          // const updateValues = [branchName, custAddress, city, stateid, state, country, pincode, compemail, govtorg, isexport, gstexempt, crterms,
//          //                        creditdays, maxcredit, avepaydays, gstno, panno, custfoldername, ccurrent, delivery, custcode];

//          misQueryMod(updateQuery,  async (err, response2) => {
//            if (err) {
//       //       console.error('Error updating customer data:', err);
//              msg = res.status(500).send('Error updating customer data');
//            }

//            if (custfoldername !== custcode) {
//              // Logic for creating folder and copying files
//            }
//            console.log('customerupdate - Yes - 3');
//            // Delete existing contacts
//            misQueryMod(`DELETE FROM magodmis.cust_contacts WHERE Cust_code = '${custcode}'`, async (err, deldata) => {
//              if (err) {
//       //         console.error('Error deleting contacts:', err);
//                msg= res.status(500).send('Error deleting contacts');
//              }

//              // Update contact details
//              for (let i = 0; i < custContactData.length; i++) {
//                const contact = custContactData[i];

//                // Check if contact already exists
//                misQueryMod(`SELECT * FROM magodmis.cust_contacts WHERE Name = '${contact.conName}' AND Cust_code = '${custcode}'`, async (err, contdata) => {
//                  if (err) {
//                    console.error('Error checking contact data:', err);
//                    msg= res.status(500).send('Error checking contact data');
//                  }

//                  if (contdata && contdata.length > 0) {
//                    // Update existing contact
//                    console.log('customerupdate - Yes - 5');
//                    misQueryMod(`UPDATE magodmis.cust_contacts SET Designation = '${contact.conDesignation}', E_mail = '${contact.conE_mail}',
//                                 Dept = '${contact.conDept}', Tele_Office = '${contact.conTele_Office}', Tele_Mobile = '${contact.conTele_Mobile}'
//                                  WHERE Cust_code = '${custcode}' AND Name = '${contact.conName}'`,
//                      (err, updata) => {
//                        if (err) {
//                          console.error('Error updating contact:', err);
//                          msg= res.status(500).send('Error updating contact');
//                        }
//                      }
//                    );
//                  } else {
//                   console.log('customerupdate - Yes - 6');
//                    // Insert new contact
//                    misQueryMod(`INSERT INTO magodmis.cust_contacts (Cust_code, Name, Designation, E_mail, Dept, Tele_Office, Tele_Mobile) VALUES (
//                      '${custcode}', '${contact.conName}', '${contact.conDesignation}', '${contact.conE_mail}', '${contact.conDept}', '${contact.conTele_Office}',
//                      '${contact.conTele_Mobile}')`,
//                      (err, contins) => {
//                        if (err) {
//                          console.error('Error inserting contact:', err);
//                          msg = res.status(500).send('Error inserting contact');
//                        }
//                      }
//                    );
//                  }
//                });
//              }

//            });
//          });

//         // createFolder("Customer", custcode,  custfoldername, '', (err, fres) => {});
//           createFolder("Customer", custcode, dwgfolder, custfoldername, '', (err, fres) => {});

//          //renameFolderIfExists(folderBase, custcode, custfoldername, callback);

//          res.send({ status: msg });
//        } else {
//          res.status(404).send('Customer not found');
//        }
//      });
//    } catch (error) {
//      console.error('Unexpected error:', error);
//      next(error);
//    }
//  });
customerRouter.post("/getcustomercontactdets", async (req, res, next) => {
  try {
    let custid = req.body.custcode;
    misQueryMod(
      `Select ContactID, Name as conName, Designation as conDesignation, Dept as conDept, E_mail as conE_mail,Tele_Office as conTele_Office,
                    Tele_Mobile as conTele_Mobile from magodmis.cust_contacts where Cust_Code='${custid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Existing Assembly Data for a Customer
customerRouter.post(`/customerassy`, async (req, res, next) => {

  try {
    const custcode = req.body.custcode;
    if (!custcode) res.send(createError.BadRequest());
    misQueryMod(
      `SELECT * FROM magodmis.cust_assy_data where Cust_Code = '${custcode}' order by MagodCode asc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Inserting Customer Assembly data
customerRouter.post("/customerinsassembly", async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const assycustpartid = req.body.partid;
    const assydescription = req.body.partdescription;
    const mtrlcost =
      req.body.mtrlcost == null || req.body.mtrlcost == ""
        ? 0
        : req.body.mtrlcost;
    const jwcost =
      req.body.jwcost == null || req.body.jwcost == "" ? 0 : req.body.jwcost;
    const assystatus = "Edit"; // req.body.assystatus;
    const Operation = req.body.Operation;
    const Material = req.body.Material;

    misQueryMod(
      `SELECT * FROM magodmis.cust_assy_data where Cust_code = '${custcode}' and AssyCust_PartId = '${assycustpartid}'`,
      (err, data) => {
        if (data.length > 0) {
          misQueryMod(
            `UPDATE magodmis.cust_assy_data SET AssyDescription='${assydescription}',MtrlCost=${mtrlcost},JobWorkCost=${jwcost},
            Status='Edit',Operation='${Operation}', Material='${Material}' 
            WHERE Cust_code = '${custcode}' and AssyCust_PartId = '${assycustpartid}'`,
            (err, updata) => {
              if (err) logger.error(err);
            }
          );
        } else {
          setupQuery(
            "SELECT *  FROM magod_setup.magod_runningno WHERE SrlType='Cust_AssyList' ORDER BY Id DESC LIMIT 1;",
            async (runningno) => {
              let magodassmid =
                "Assy" +
                (parseInt(runningno[0]["Running_No"]) + 1)
                  .toString()
                  .padStart(6, "0");
              console.log(magodassmid);

              await misQueryMod(
                `INSERT INTO magodmis.cust_assy_data ( Cust_code,MagodCode, AssyCust_PartId, AssyDescription,MtrlCost,JobWorkCost,Status,Operation, Material) 
          VALUES('${custcode}','${magodassmid}', '${assycustpartid}', '${assydescription}',${mtrlcost},${jwcost},'${assystatus}','${Operation}','${Material}')`,
                (err, ins) => {
                  if (err) logger.error(err);
                  console.log(ins);
                  if (ins.affectedRows == 1) {
                    setupQuery(
                      `UPDATE magod_setup.magod_runningno SET Running_No = Running_No + 1 WHERE SrlType='Cust_AssyList' And Id = ${runningno[0]["Id"]}`,
                      async (updatedrunning) => {
                        console.log(
                          `Updated running No ${JSON.stringify(updatedrunning)}`
                        );
                      }
                    );
                  }
                }
              );
              res.send({ magodassmid: magodassmid });
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

// Checking Duplicate Customer Assembly data
customerRouter.post("/chkassydupl", async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const assycustpartid = req.body.partid;
    if (assycustpartid != null) {
      misQueryMod(
        `SELECT * FROM magodmis.cust_assy_data where Cust_code = '${custcode}' and AssyCust_PartId = '${assycustpartid}'`,
        (err, data) => {
          if (err) logger.error(err);
          if (data.length > 0) {
            res.send({ status: "Duplicate" });
          } else {
            res.send({ status: "Not Duplicate" });
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

// Inserting Customer BOM PArts data
customerRouter.post("/custbomparts", async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const partid = req.body.partid;
    const partdescription = req.body.partdescription;

    if (!custcode || !partid || !partdescription)
      res.send(createError.BadRequest());
    setupQuery(
      `SELECT * FROM magodmis.cust_bomlist where Cust_code = '${custcode}' and PartId = '${partid}'`,
      async (data) => {
        if (data.length == 0) {
          setupQuery(
            "SELECT *  FROM magod_setup.magod_runningno WHERE SrlType='BOMList' ORDER BY Id DESC LIMIT 1;",
            async (runningno) => {
              let magodpartid =
                "BOM " +
                (parseInt(runningno[0]["Running_No"]) + 1)
                  .toString()
                  .padStart(10, "0");

              misQueryMod(
                `INSERT INTO magodmis.cust_bomlist ( MagodPartId, Cust_code,PartId, PartDescription) VALUES('${magodpartid}', '${custcode}','${partid}', '${partdescription}')`,
                (err, ins) => {
                  if (err) logger.error(err);
                  console.log(ins);
                  if (ins.affectedRows == 1) {
                    setupQuery(
                      `UPDATE magod_setup.magod_runningno SET Running_No = Running_No + 1 WHERE SrlType='BOMList' And Id = ${runningno[0]["Id"]}`,
                      async (updatedrunning) => {
                        console.log(
                          `Updated running No ${JSON.stringify(updatedrunning)}`
                        );
                      }
                    );

                    misQueryMod(
                      `Select * from magodmis.cust_bomlist where cust_code='${custcode}'`,
                      (err, data) => {
                        if (err) logger.error(err);
                        res.send({ data, status: "Success" });
                      }
                    );
                  }
                }
              );
            }
          );
        } else {
          res.send({ data, status: "Duplicate" });
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post("/getcustomercontactdets", async (req, res, next) => {
  try {
    const { custcode } = req.body.custcode;
    misQueryMod(
      `SELECT * FROM magodmis.contact_data where Cust_Code = '${custcode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// sending data to Customer Part Receipt
customerRouter.post(`/getcustomerbomparts`, async (req, res, next) => {
  try {
    const ccode = req.body.custcode;
    misQueryMod(
      `SELECT * FROM magodmis.cust_bomlist where Cust_code ='${ccode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Bom Assembly Parts
customerRouter.post("/bomassemblyparts", async (req, res) => {
  try {
    const ccode = req.body.custcode;
    const dataarray = req.body.dataarray;
    let retdata = [];
    let assyprtid = 0;
    let bompartid = 0;
    for (let i = 0; i < dataarray.length; i++) {
      const { assyPartId, partid, partdesc, qty } = dataarray[i];

      if (
        dataarray[i].partdesc !== "" &&
        dataarray[i].partid !== "" &&
        dataarray[i].partid !== null &&
        dataarray[i].partid !== undefined
      ) {
        misQueryMod(
          `Select assytbl.Id as assyid from magodmis.cust_assy_data assytbl 
          where AssyCust_PartId = '${dataarray[i].assyPartId}' and Cust_code='${ccode}'`,
          (err, assydata) => {
            assyprtid = assydata.assyId;
          }
        );
        misQueryMod(
          `SELECT bomlist.Id as custbompartid FROM magodmis.cust_bomlist as bomlist 
            where PartId = '${dataarray[i].partid}' and Cust_code='${ccode}'`,
          (err, bompart) => {
            bompartid = bompart.custbompartid;
          }
        );

        let sql = `SELECT * from magodmis.cust_assy_bom_list where Cust_AssyId = 
          (Select Id from magodmis.cust_assy_data where AssyCust_PartId = '${assyprtid}') 
          And Cust_BOM_ListId = (SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist 
          where PartId = '${dataarray[i].partid}' and Cust_code='${ccode}')`;

        misQueryMod(sql, (err, custbomdata) => {
          if (custbomdata == null || custbomdata.length == 0) {
            misQueryMod(`SET FOREIGN_KEY_CHECKS = 0;`, (err, data) => {});

            misQueryMod(
              `Insert into magodmis.cust_assy_bom_list (Cust_AssyId, Cust_BOM_ListId, Quantity)
            Values(
                 (Select assytbl.Id as assyid from magodmis.cust_assy_data assytbl where AssyCust_PartId = '${dataarray[i].assyPartId}' and Cust_code='${ccode}'),
                 (SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist where PartId = '${dataarray[i].partid}' and Cust_code='${ccode}'), ${dataarray[i].qty})`,
              (err, data) => {
                if (err) {
                  logger.error(err);
                } else {
                  retdata.push(data);
                }
              }
            );
            misQueryMod(`SET FOREIGN_KEY_CHECKS = 1;`, (err, data) => {});
          } else {
            misQueryMod(`SET FOREIGN_KEY_CHECKS = 0;`, (err, data) => {});
            misQueryMod(
              `Select assytbl.Id as assyid from magodmis.cust_assy_data assytbl 
              where AssyCust_PartId = '${dataarray[i].assyPartId}' and Cust_code='${ccode}'`,
              (err, massemid) => {
                misQueryMod(
                  `Update magodmis.cust_assy_bom_list SET Quantity= ${dataarray[i].qty} where Cust_AssyId = '${massemid[0].assyid}' 
                     And Cust_BOM_ListId = (SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist 
                      where PartId = '${dataarray[i].partid}' and Cust_code='${ccode}')`,
                  (err, data) => {
                    if (err) logger.error(err);
                    retdata.push(data);
                  }
                );
                // }
              }
            );
          }
        });
        misQueryMod(`SET FOREIGN_KEY_CHECKS = 1;`, (err, data) => {});
      } else {
        misQueryMod(`SET FOREIGN_KEY_CHECKS = 0;`, (err, data) => {});
        misQueryMod(
          `Select assytbl.Id as assyid from magodmis.cust_assy_data assytbl 
              where AssyCust_PartId = '${dataarray[i].assyPartId}' and Cust_code='${ccode}'`,
          (err, massemid) => {
            misQueryMod(
              `Update magodmis.cust_assy_bom_list SET Quantity= ${dataarray[i].qty} where Cust_AssyId = '${massemid[0].assyid}' 
                     And Cust_BOM_ListId = (SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist 
                      where PartId = '${dataarray[i].partid}' and Cust_code='${ccode}')`,
              (err, data) => {
                if (err) logger.error(err);
                retdata.push(data);
              }
            );
            // }
          }
        );
        misQueryMod(`SET FOREIGN_KEY_CHECKS = 1;`, (err, data) => {});
      }
    }
    res.send({ status: "success", data: retdata });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});

// Get Customer BOM Parts
customerRouter.post("/getcustpartdetails", async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    misQueryMod(
      `SELECT * FROM magodmis.cust_bomlist where Cust_code = '${custcode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Get Customer BOM Assembly Parts
customerRouter.post("/custbomassemblyparts", async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const assyId = req.body.custassyid;
    misQueryMod(
      `SELECT asm.AssyCust_PartId as assyPartId, bom.PartId as partid,bom.PartDescription as partdesc,asmbom.Quantity as qty from magodmis.cust_assy_data asm
        left outer join magodmis.cust_assy_bom_list asmbom on asmbom.Cust_AssyId = asm.Id
        left outer join magodmis.cust_bomlist bom on bom.Id = asmbom.cust_BOM_ListId
        where asm.Cust_Code='${custcode}' and asm.AssyCust_PartId ='${assyId}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Get Existing Customer

customerRouter.post(`/getcustomer`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) res.send(createError.BadRequest());
    misQueryMod(
      `SELECT * FROM magodmis.cust_data where Cust_Code = '${custcode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer drawing data
customerRouter.post(`/customersdrawings`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;

    if (!custcode) res.send(createError.BadRequest());

    misQueryMod(
      `SELECT Dwg_Code,Cust_Code,DwgName,Mtrl_Code,DxfLoc,Operation,MtrlCost,JobWorkCost,LOC,Holes,FORMAT(Part_Wt,3) as Weight FROM magodmis.dwg_data where Cust_Code = '${custcode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer Order data
customerRouter.post(`/customerorders`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const ordstatus = req.body.orderstatus;
    const ordtype = req.body.otype;
    const ordertype = req.body.ordertype;

    if (!custcode) res.send(createError.BadRequest());
    if (ordtype == null) {
      if (ordstatus !== "All") {
        misQueryMod(
          `SELECT o.*,c.Cust_name FROM magodmis.order_list o 
                left join magodmis.cust_data c on c.Cust_Code = o.Cust_Code
                WHERE o.Cust_Code='${custcode}' AND  Order_Status ='${ordstatus}'   ORDER BY o.Order_Date Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT o.*,c.Cust_name FROM magodmis.order_list o 
                left join magodmis.cust_data c on c.Cust_Code = o.Cust_Code  
                WHERE o.Cust_Code='${custcode}' ORDER BY o.Order_Date Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    } else {
      if (ordstatus != "All") {
        misQueryMod(
          `SELECT o.*,c.Cust_name FROM magodmis.order_list o 
                left join magodmis.cust_data c on c.Cust_Code = o.Cust_Code
                WHERE o.Cust_Code='${custcode}' AND  Order_Status ='${ordstatus}' and Type='${ordtype}' And Order_Type='${ordertype}'  ORDER BY o.Order_Date Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT o.*,c.Cust_name FROM magodmis.order_list o 
                left join magodmis.cust_data c on c.Cust_Code = o.Cust_Code  
                WHERE o.Cust_Code='${custcode}'  ORDER BY o.Order_Date Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

// geting customer Order Status data
customerRouter.post(`/orderstatus`, async (req, res, next) => {
  try {
    setupQuery(
      `SELECT * FROM magod_setup.magod_statuslist s where s.Function = 'Order' order by Seniority asc`,
      (data) => {
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer Order Schedule data
customerRouter.post(`/orderschedule`, async (req, res, next) => {
  console.log(req.body);
  try {
    const orderno = req.body.orderno;

    misQueryMod(
      `SELECT o.*  FROM magodmis.orderschedule o WHERE o.Order_No ='${orderno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer Order Schedule Tasks data
customerRouter.post(`/orderschtasks`, async (req, res, next) => {
  try {
    const orderno = req.body.orderno;
    const ordschid = req.body.ordschid;
    misQueryMod(
      `SELECT n.* FROM magodmis.nc_task_list n
        inner join magodmis.orderschedule o on o.ScheduleID = n.ScheduleID
        WHERE  o.Order_No ='${orderno}' and n.ScheduleID = '${ordschid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer Order Details data
customerRouter.post(`/orderdetails`, async (req, res, next) => {
  try {
    const orderno = req.body.orderno;
    misQueryMod(
      `SELECT o.*  FROM magodmis.order_details o WHERE o.Order_No ='${orderno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
// getting Customer ORder Invoice data
customerRouter.post(`/orderinvoices`, async (req, res, next) => {
  try {
    const orderno = req.body.orderno;
    misQueryMod(
      `SELECT n.* FROM magodmis.draft_dc_inv_register n, magodmis.orderschedule o 
        WHERE n.ScheduleID=o.ScheduleID AND o.Order_No ='${orderno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/orderinvdwg`, async (req, res, next) => {
  try {
    const dcinvno = req.body.dcinvno;
    misQueryMod(
      `SELECT * FROM magodmis.draft_dc_inv_details d WHERE d.DC_Inv_No= '${dcinvno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
customerRouter.post(`/schdets`, async (req, res, next) => {
  try {
    const scheduleid = req.body.ordschid;
    misQueryMod(
      `SELECT n.* FROM magodmis.orderscheduledetails n WHERE n.ScheduleID='${scheduleid}'`,
      (err, data) => {
        if (err) logger.error(err);
        console.log(data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/schtasksdets`, async (req, res, next) => {
  try {
    const nctaskid = req.body.nctaskid;
    misQueryMod(
      `SELECT t.* FROM magodmis.task_partslist t WHERE t.NcTaskId='${nctaskid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/printduereport`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());
    misQueryMod(
      `Select  case when DueDays > 365 then Sum(Balance) else 0 end as overDue,
        case when DueDays < 356 then Sum(Balance) else 0 end as dueamount
        from (SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,d.PymtAmtRecd,Cust_Code,(d.GrandTotal - d.PymtAmtRecd) as Balance
        FROM magodmis.draft_dc_inv_register d  WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}'
        and d.GrandTotal > d.PymtAmtRecd ) a`,
      (err, duestypedata) => {
        if (err) logger.error(err);
        misQueryMod(
          `SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,DC_Inv_No,IsDC,DATE_FORMAT(Dc_inv_Date, "%d/%l/%Y") AS 'Dc_inv_Date' ,DC_InvType,
                InvoiceFor,DC_No,DATE_FORMAT(DC_Date,"%d/%l/%Y") as 'DC_Date', Inv_No,DATE_FORMAT(Inv_Date,"%d/%l/%Y") as 'Inv_Date',PaymentDate,
                PymtAmtRecd,PaymentMode,GRNNo,Cust_Code,Cust_Name,PO_No, PO_Date, 
                Net_Total,InvTotal,Round_Off,GrandTotal,(GrandTotal - PymtAmtRecd) as Balance,Total_Wt,
                SummaryInvoice,BillType FROM magodmis.draft_dc_inv_register d 
                WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}' ORDER BY d.Inv_Date`,
          (err, duedata) => {
            if (err) logger.error(err);
            sendDueList(custdata, duestypedata, duedata, (err, data) => {
              if (err) logger.error(err);
            });
          }
        );
      }
    );
  } catch (error) {
    next(error);
  }
});
// geting customer material stock position data
customerRouter.post(`/customermtrlstock`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;

    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT MtrlStockID, count( MtrlStockID) as inStock,Cust_Docu_No, Mtrl_Code, DynamicPara1, DynamicPara2,Locked, Scrap 
                    FROM magodmis.mtrlstocklist  WHERE Cust_Code='${custcode}' 
                GROUP BY Mtrl_Code, DynamicPara1, DynamicPara2,Scrap, Locked ORDER BY  Locked DESC,Scrap DESC`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/getmtrlrvlist`, async (req, res, next) => {
  try {
    const type = req.body.Type;
    const status = req.body.Status;
    const source = req.body.Source;
    const ccode = req.body.custcode;
    if (!type || !status || !source) return res.send(createError.BadRequest());
    if (ccode == "") {
      if (source == "Magod") {
        misQueryMod(
          `SELECT * FROM magodmis.material_receipt_register m WHERE m.Type='${type}' 
                        AND m.RVStatus='${status}' and m.Cust_Code like '0000' ORDER BY  m.RVId Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT * FROM magodmis.material_receipt_register m WHERE m.Type='${type}'
                        AND m.RVStatus='${status}' and m.Cust_Code not like '0000' ORDER BY  m.RVId Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    } else {
      if (source == "Magod") {
        misQueryMod(
          `SELECT * FROM magodmis.material_receipt_register m WHERE m.Type='${type}' 
                        AND m.RVStatus='${status}' and m.Cust_Code like '0000' ORDER BY  m.RVId Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT * FROM magodmis.material_receipt_register m WHERE m.Type='${type}' 
                        AND m.RVStatus='${status}' and m.Cust_Code = '${ccode}' ORDER BY  m.RVId Desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

// geting customer material Receipts data

customerRouter.post(`/customermtrlreceipts`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;

    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT RVID,RV_No, RV_Date,  CustDocuNo, RVStatus,TotalWeight,updated, TotalCalculatedWeight 
        FROM magodmis.material_receipt_register WHERE Cust_Code='${custcode}' ORDER BY RV_Date DESC,RV_no DESC`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer material Receipts Details data
customerRouter.post(`/customermtrlrectdetails`, async (req, res, next) => {
  try {
    const rvid = req.body.rvid;

    if (!rvid) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT rvID, Mtrl_Code,DynamicPara1, DynamicPara2, Qty,updated FROM magodmis.mtrlreceiptdetails  WHERE rvID= '${rvid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer material Parts Returned data
customerRouter.post(`/customermtrlpartsreturned`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;

    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT d.DC_InvType, d.Inv_No, d.Inv_Date, d1.Material, sum(d1.SrlWt) as SrlWt 
      FROM magodmis.draft_dc_inv_register d, magodmis.dc_inv_summary d1 
      WHERE d.Cust_Code='${custcode}' AND (d.DCStatus='Closed' Or d.DCStatus='Despatched') 
      AND d.DC_Inv_No=d1.DC_Inv_No AND d.DC_InvType='Job Work' GROUP BY d1.Material, d.Inv_Date, d.Inv_No 
      ORDER BY d.Inv_Date Desc, d.Inv_No Desc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/updatebomassembly`, async (req, res, next) => {
  try {
    const mmagodid = req.body.mmagodid;
    const assemblyid = req.body.massyid;
    const asmstatus = req.body.assmstatus;
    const asmdesc = req.body.assmdesc;
    const mtrlcost = req.body.mtrlcost;
    const jbwrkcost = req.body.jobworkcost;
    const operation = req.body.Operation;
    const material = req.body.mtrl;
    misQueryMod(
      `Select * from magodmis.cust_assy_data where MagodCode='${mmagodid}'`,
      (err, data1) => {
        if (err) logger.error(err);
        if (data1.length > 0) {
          misQueryMod(
            `Update magodmis.cust_assy_data set AssyCust_PartId='${assemblyid}', Status='${asmstatus}',AssyDescription = '${asmdesc}',
            MtrlCost='${mtrlcost}',JobWorkCost='${jbwrkcost}',Operation='${operation}',Material='${material}' where MagodCode='${mmagodid}'`,
            (err, bomasmdata) => {
              if (err) logger.error(err);
              misQueryMod(
                `Select * from magodmis.cust_assy_data where Cust_Code = '${data1[0].Cust_Code}'`,
                (err, data) => {
                  res.send({ data, status: "success" });
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

// customerRouter.post(`/deletebomassmparts`, async (req, res, next) => {
//   console.log("Deleting Parts ");
//   try {
//     const asmid = req.body.assmid;
//     const asmpart = req.body.assmpartid;
//     misQueryMod(
//       `Select assytbl.Id as assyid from magodmis.cust_assy_data assytbl where AssyCust_PartId = '${asmid}'`,
//       (err, asmdata) => {
//         if (err) logger.error(err);
//         console.log(asmdata);
//         console.log(asmdata[0].assyid);
//         console.log(asmpart);
//         misQueryMod(
//           `SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist where PartId = '${asmpart}'`,
//           (err, asmprtdata) => {
//             if (err) logger.error(err);
//             console.log("asmprtdata " + asmprtdata[0].Id);
//             misQueryMod(
//               `Delete from magodmis.cust_assy_bom_list  where Cust_AssyId ='${asmdata[0].assyid}' and Cust_Bom_ListId='${asmprtdata[0].Id}'`,
//               (err, deldata) => {
//                 if (err) logger.error(err);
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     next(error);
//   }
// });

//===========================  To Check Duplicate BOM Assembly ===========================

customerRouter.post(`/checkbomassmparts`, async (req, res, next) => {

  try {
    let custcode = req.body.custcode;
    let partid = req.body.partid;
    let assyid = req.body.assyPartId;
    const asmdata = await getAssyData(custcode);
    const asmprtdata = await getBomData(partid, custcode);

    let hasDuplicate = false;

    for (let i = 0; i < asmdata.length; i++) {
      const bomdata = await getBomListData(asmdata[i].assyid, asmprtdata[0].Id);
      if (bomdata.length > 0) {
        hasDuplicate = true;
        break;
      }
    }

    if (hasDuplicate) {
      return res.send({ status: "Duplicates" });
    } else {
      return res.send({ status: "No Duplicates" });
    }
  } catch (error) {
    next(error);
  }
});

function getAssyData(custcode) {
  return new Promise((resolve, reject) => {
    misQueryMod(
      `SELECT assytbl.Id AS assyid FROM magodmis.cust_assy_data assytbl WHERE Cust_code='${custcode}'`,
      (err, asmdata) => {
        if (err) {
          reject(err);
        } else {
          resolve(asmdata);
        }
      }
    );
  });
}

function getBomData(partid, custcode) {
  return new Promise((resolve, reject) => {
    misQueryMod(
      `SELECT bomlist.Id FROM magodmis.cust_bomlist as bomlist WHERE PartId = '${partid}' and Cust_code='${custcode}'`,
      (err, asmprtdata) => {
        if (err) {
          reject(err);
        } else {
          resolve(asmprtdata);
        }
      }
    );
  });
}

function getBomListData(assyid, bomListId) {
  return new Promise((resolve, reject) => {
    misQueryMod(
      `SELECT * FROM magodmis.cust_assy_bom_list WHERE Cust_AssyId ='${assyid}' and Cust_Bom_ListId='${bomListId}'`,
      (err, bomdata) => {
        if (err) {
          reject(err);
        } else {
          resolve(bomdata);
        }
      }
    );
  });
}

// solution for partlist partid delete issue

customerRouter.post(`/deletebomassmparts`, async (req, res, next) => {
  try {
    const selectedbomdata = req.body.selectedbompart;
    const ccode = req.body.custcode;
    let responseSent = false; // Flag variable

    misQueryMod(
      `Select cad.Id as custassyid from magodmis.cust_assy_data cad where cad.AssyCust_PartId = '${selectedbomdata.assyPartId}'`,
      (err, asmdata) => {
        if (err) {
          logger.error(err);
          if (!responseSent) {
            res.send({ status: "error" }); // Send error response
            responseSent = true;
          }
          return;
        }
        console.log(asmdata[0].custassyid);
        misQueryMod(
          `SELECT cb.Id as custbomId FROM magodmis.cust_bomlist as cb where PartId = '${selectedbomdata.partid}' and Cust_code='${ccode}'`,
          (err, asmprtdata) => {
            if (err) {
              logger.error(err);
              if (!responseSent) {
                res.send({ status: "error" }); // Send error response
                responseSent = true;
              }
              return;
            }
            console.log("deletebomassmparts - asmprtdata : ", asmprtdata);
            misQueryMod(
              `Delete from magodmis.cust_assy_bom_list where Cust_AssyId = '${asmdata[0].custassyid}' and Cust_BOM_ListId = '${asmprtdata[0].custbomId}'`,
              (err, deldata) => {
                if (err) {
                  logger.error(err);
                  if (!responseSent) {
                    res.send({ status: "error" }); // Send error response
                    responseSent = true;
                  }
                  return;
                }
              }
            );
          }
        );
      }
    );
  } catch (error) {
    next(error);
  }
});

// geting customer material Parts Returned data
customerRouter.post(`/customermtrlscrapUnusedreturned`, async (req, res, next) => {
    try {
      const custcode = req.body.custcode;
      if (!custcode) return res.send(createError.BadRequest());

      misQueryMod(
        `SELECT d.DC_No, d.DC_Date, d1.Material, sum(d1.DC_Srl_Wt) as Total_Wt FROM magodmis.dc_register d
        inner join magodmis.dc_details d1 on d1.DC_ID=d.DC_ID
                            WHERE d.DC_Type='Material Return' AND d.Cust_Code='${custcode}'
                            GROUP BY d1.Material, d.DC_No, d.DC_Date ORDER BY d.DC_Date , d.DC_No desc`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

//get Company Details
customerRouter.post(`/getcompanydetails`, async (req, res, next) => {
  try {
    setupQuery(`SELECT * FROM magod_setup.magodlaser_units`, (data) => {
      res.send(data);
    });
  } catch (error) {
    next(error);
  }
});

// Customer Invoice and Payment Receipts data
customerRouter.post(`/customerduelist`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const crdays = req.body.crdays;
    if (!custcode) return res.send(createError.BadRequest());
    misQueryMod(
      `SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,d.DC_Inv_No,d.IsDC,d.ScheduleId,DATE_FORMAT(d.Inv_Date, "%d/%m/%Y") AS 'Inv_Date' ,d.DC_InvType,
        d.InvoiceFor,d.OrderNo,d.OrderScheduleNo,d.OrderDate,d.DC_No,DATE_FORMAT(d.DC_Date,"%d/%m/%Y") as 'DC_Date',
        d.DC_Fin_Year,Inv_No,DATE_FORMAT(Inv_Date,"%d/%m/%Y") as 'Inv_Date',d.Inv_Fin_Year,
        date_format(Date_Add(Inv_Date, Interval ${crdays} Day), "%d/%m/%Y") as 'PaymentDate',
        d.PmnyRecd,d.PymtAmtRecd,PaymentMode,d.PaymentReceiptDetails,d.GRNNo,d.Cust_Code,d.Cust_Name,d.Cust_Address,d.Cust_Place,d.Cust_State,d.Cust_StateId,c.CreditTime,
        d.PIN_Code,d.Del_Address,d.Del_StateId,d.ECC_No,d.GSTNo,d.TIN_No,d.KST_No,d.CST_No,d.PO_No, d.PO_Date, d.Net_Total,d.Pkng_chg,d.TptCharges,d.PN_PkngLevel,d.Discount,
        d.Pgm_Dft_Chg,  d.MtrlChg,d.AssessableValue,d.TaxAmount,d.Del_Chg,d.InvTotal,d.Round_Off,d.GrandTotal,(d.GrandTotal - d.PymtAmtRecd) as Balance,d.Total_Wt,
        d.ScarpWt,d.DCStatus,CenvatSrlNo,d.DespatchDate,d.DespatchTime,d.TptMode,d.VehNo,d.EWayBillRef,d.ExChapterHead,d.ExNotNo,d.DelDC_Inv,d.InspBy,d.PackedBy,
        d.Com_inv_id, d.Remarks,d.PO_Value,d.FB_Qty,d.FB_Quality,d.FB_Delivery,d.FB_Remarks,d.Del_responsibility,
        d.PaymentTerms,d.pkngLevel,d.SummaryInvoice,d.BillType,d.Sync_HOId,d.PAN_No,d.ST_No FROM magodmis.draft_dc_inv_register d 
        left outer join magodmis.cust_data c on c.Cust_Code = d.Cust_Code
        WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}' ORDER BY d.Inv_Date`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.post(`/customeroverduelist`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    const custcr = req.body.crdays;
    if (!custcode) return res.send(createError.BadRequest());
    let sqlqry = `SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,DC_Inv_No,IsDC,ScheduleId,DATE_FORMAT(inv_Date, "%d/%m/%Y") AS 'inv_Date' ,DC_InvType,
  InvoiceFor,OrderNo,OrderScheduleNo,OrderDate,DC_No,DATE_FORMAT(DC_Date,"%d/%m/%Y") as 'DC_Date',
  DC_Fin_Year,Inv_No,DATE_FORMAT(Inv_Date,"%d/%m/%Y") as 'Inv_Date',Inv_Fin_Year,
  date_format(Date_Add(Inv_Date, Interval ${custcr} Day), "%d/%m/%Y") as 'PaymentDate',
  PmnyRecd,PymtAmtRecd,PaymentMode,PaymentReceiptDetails,GRNNo,Cust_Code,Cust_Name,Cust_Address,Cust_Place,Cust_State,Cust_StateId,
  PIN_Code,Del_Address,Del_StateId,ECC_No,GSTNo,TIN_No,KST_No,CST_No,PO_No, PO_Date, Net_Total,Pkng_chg,TptCharges,PN_PkngLevel,Discount,
  Pgm_Dft_Chg,   MtrlChg,AssessableValue,TaxAmount,Del_Chg,InvTotal,Round_Off,GrandTotal,(GrandTotal - PymtAmtRecd) as Balance,Total_Wt,
  ScarpWt,DCStatus,CenvatSrlNo,DespatchDate,DespatchTime,TptMode,VehNo,EWayBillRef,ExChapterHead,ExNotNo,DelDC_Inv,InspBy,PackedBy,
  Com_inv_id, Remarks,PO_Value,FB_Qty,FB_Quality,FB_Delivery,FB_Remarks,Del_responsibility,
  PaymentTerms,pkngLevel,SummaryInvoice,BillType,Sync_HOId,PAN_No,ST_No FROM magodmis.draft_dc_inv_register d 
  WHERE  d.DCStatus='Despatched' and DateDiff(Curdate(),d.Inv_Date) > ${custcr} AND
  Cust_Code = '${custcode}' ORDER BY d.Inv_Date`;

    misQueryMod(sqlqry, (err, data) => {
      if (err) logger.error(err);
      res.send(data);
    });
  } catch (error) {
    next(error);
  }
});

// Customer - Dues data
customerRouter.post(`/customerdues`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(`SET SQL_MODE='';`, (err, sqlmode) => {});
    misQueryMod(
      `select Sum(Balance) as dueamount
            from (SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,(Select  p.CreditDays from magodmis.cust_data c
            inner join magod_setup.paymentterms p on p.PaymentTerm = c.CreditTerms
            where cust_Code = '${custcode}') as crdays
            ,d.PymtAmtRecd,Cust_Code,(d.GrandTotal - d.PymtAmtRecd) as Balance
            FROM magodmis.draft_dc_inv_register d  WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}'
            and d.GrandTotal > d.PymtAmtRecd ) a where a.DueDays > 0`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer - overdues data
customerRouter.post(`/customeroverdues`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());
    misQueryMod(`SET SQL_MODE='';`, (err, sqlmode) => {});
    misQueryMod(
      `select Sum(Balance) as OverDue
            from (SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,(Select  p.CreditDays from magodmis.cust_data c
            inner join magod_setup.paymentterms p on p.PaymentTerm = c.CreditTerms
            where cust_Code = '${custcode}') as crdays
            ,d.PymtAmtRecd,Cust_Code,(d.GrandTotal - d.PymtAmtRecd) as Balance
            FROM magodmis.draft_dc_inv_register d  WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}'
            and d.GrandTotal > d.PymtAmtRecd ) a where a.DueDays >  crdays`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer - Part Payment Duelist data
customerRouter.post(`/pprcustomerduelist`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());
    misQueryMod(
      `SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,DC_Inv_No,IsDC,ScheduleId,DATE_FORMAT(Dc_inv_Date, "%d/%m/%Y") AS 'Dc_inv_Date' ,DC_InvType,
        InvoiceFor,OrderNo,OrderScheduleNo,OrderDate,DC_No,DATE_FORMAT(DC_Date,"%d/%m/%Y") as 'DC_Date',
        DC_Fin_Year,Inv_No,DATE_FORMAT(Inv_Date,"%d/%m/%Y") as 'Inv_Date',Inv_Fin_Year,DATE_FORMAT(PaymentDate,"%d/%m%/%Y") as 'PaymentDate',
        PmnyRecd,PymtAmtRecd,PaymentMode,PaymentReceiptDetails,GRNNo,Cust_Code,Cust_Name,
        PO_No, PO_Date, Net_Total,Pkng_chg,TptCharges,PN_PkngLevel,Discount,
        Pgm_Dft_Chg,InvTotal,Round_Off,GrandTotal,(GrandTotal - PymtAmtRecd) as Balance,Total_Wt,
        DelDC_Inv, Com_inv_id, Remarks,PO_Value,FB_Qty,FB_Quality,FB_Delivery,FB_Remarks,Del_responsibility,
        PaymentTerms,pkngLevel,SummaryInvoice,BillType,Sync_HOId,PAN_No,ST_No FROM magodmis.draft_dc_inv_register d 
        WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}' and d.PymtAmtRecd > 0 and d.InvTotal > d.PymtAmtRecd
         ORDER BY d.Inv_Date`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

//Sned mails

customerRouter.post(`/sendmailwithattachment`, async (req, res, next) => {
  console.log("Send Mails with Attachment");
  try {
    const mailto = req.body.to;
    const copyto = req.body.cc;
    const mailsub = req.body.subject;
    const attachments = req.body.attachments;
    const mailbody = req.body.mailbody;

    sendDueList(custdata, duestypedata, duedata, (err, data) => {
      if (err) logger.error(err);
    });
  } catch (error) {
    next(error);
  }
});

//paymentterms

customerRouter.post(`/paymentterms`, async (req, res, next) => {
  try {
    const crterm = req.body.crterms;
    setupQueryMod(
      `Select CreditDays from magod_setup.paymentterms where PaymentTerm ='${crterm}'`,
      (err, data) => {
        if (err) logger.error(err);
        console.log("Credit Days : ", data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer Invoice form data from dc_invno
customerRouter.post(`/customerdlinvform`, async (req, res, next) => {
  try {
    const dcinvno = req.body.dcinvno;
    if (!dcinvno) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT * FROM magodmis.draft_dc_inv_details d WHERE d.Dc_Inv_No='${dcinvno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer Invoice form data from dc_invno - Tax Details
customerRouter.post(`/customerdlinvformtaxdets`, async (req, res, next) => {
  try {
    const dcinvno = req.body.dcinvno;
    if (!dcinvno) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT * FROM magodmis.dc_inv_taxtable d WHERE d.Dc_Inv_No='${dcinvno}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer Dues Summary
customerRouter.post(`/customerduessummary`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `Select Sum(DueAmt30) as DueAmt30, Sum(DueAmt60) as DueAmt60, Sum(DueAmt90) as DueAmt90, Sum(DueAmt180) as DueAmt180, Sum(DueAmt365) as DueAmt365, Sum(DueAmtAbv365) as DueAmtAbv365 from
        (SELECT dd.Cust_Code,
            CASE
                WHEN (DateDiff(Curdate(),dd.PaymentDate) <= 30) THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmt30,
           CASE
                WHEN ((DateDiff(Curdate(),dd.PaymentDate) > 30) and (DateDiff(Curdate(),dd.PaymentDate) <= 60))
                THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmt60,
             CASE
                WHEN ((DateDiff(Curdate(),dd.PaymentDate) > 60) and (DateDiff(Curdate(),dd.PaymentDate) <= 90))
                THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmt90,
             CASE
                WHEN ((DateDiff(Curdate(),dd.PaymentDate) > 90) and (DateDiff(Curdate(),dd.PaymentDate) <= 180))
                THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmt180,
             CASE
                WHEN ((DateDiff(Curdate(),dd.PaymentDate) > 180) and (DateDiff(Curdate(),dd.PaymentDate) <= 365))
                THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmt365,
             CASE
                WHEN (DateDiff(Curdate(),dd.PaymentDate) > 365) THEN (dd.GrandTotal - dd.PymtAmtRecd) 
                ELSE 0
            END AS DueAmtAbv365
           FROM magodmis.draft_dc_inv_register dd
        where (dd.PymtAmtRecd < dd.GrandTotal) and dd.Cust_Code ='${custcode}' and dd.DCStatus='Despatched') ab
        Group by Cust_Code`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
// Customers Outstanding Summary

customerRouter.post(`/customeroutstandings`, async (req, res, next) => {
  try {
   misQueryMod(
      `select ab.Cust_Code,ab.Cust_Name, Sum(DueAmt30 + DueAmt60 + DueAmt90 + DueAmt180 + DueAmt365 + DueAmtAbv365) as TotalDues,
        Sum(DueAmt30) as DueAmt30, Sum(DueAmt60) as DueAmt60, Sum(DueAmt90) as DueAmt90, 
       Sum(DueAmt180) as DueAmt180, Sum(DueAmt365) as DueAmt365, Sum(DueAmtAbv365) as DueAmtAbv365 from
       (SELECT dd.Cust_Code,c.Cust_Name,c.CreditTime,
           CASE
               WHEN (DateDiff(Curdate(),dd.inv_date) <= 30) THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmt30,
          CASE
               WHEN ((DateDiff(Curdate(),dd.inv_date) > 30) and (DateDiff(Curdate(),dd.inv_date) <= 60))
               THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmt60,
            CASE
               WHEN ((DateDiff(Curdate(),dd.inv_date) > 60) and (DateDiff(Curdate(),dd.inv_date) <= 90))
               THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmt90,
            CASE
               WHEN ((DateDiff(Curdate(),dd.inv_date) > 90) and (DateDiff(Curdate(),dd.inv_date) <= 180))
               THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmt180,
            CASE
               WHEN ((DateDiff(Curdate(),dd.inv_date) > 180) and (DateDiff(Curdate(),dd.inv_date) <= 365))
               THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmt365,
            CASE
               WHEN (DateDiff(Curdate(),dd.inv_date) > 365) THEN (dd.GrandTotal - dd.PymtAmtRecd) 
               ELSE 0
           END AS DueAmtAbv365
          FROM magodmis.draft_dc_inv_register dd 
       left outer join magodmis.cust_data c on c.Cust_Code = dd.Cust_Code 
       where (dd.PymtAmtRecd < dd.GrandTotal) and dd.DCStatus != 'Cancelled') ab
       where DueAmt30 > 0 or DueAmt60 >0 or DueAmt90 >0 or DueAmt180 > 0 or DueAmt365> 0 or DueAmtAbv365 > 0
       Group by Cust_Code Order by Cust_Name asc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
// customer outstanding invoices

customerRouter.post(`/outstandinginvoices`, async (req, res, next) => {
  console.log(req.body);
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT ddir.Inv_No,Date_Format(Inv_Date, '%d/%m/%Y') as Inv_Date, ddir.GrandTotal, ddir.PymtAmtRecd, (ddir.GrandTotal - ddir.PymtAmtRecd) as Due, 
        datediff(current_date(),ddir.Inv_Date) as DueDays, ddir.PO_No,c.credittime FROM magodmis.draft_dc_inv_register ddir
        inner join magodmis.cust_data c on c.Cust_code = ddir.Cust_Code
        WHERE  ddir.DCStatus ='Despatched' AND ddir.Cust_Code='${custcode}' ORDER BY ddir.Inv_Date`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
// Customer Receipts Info
customerRouter.post(`/customerreceiptsinfo`, async (req, res, next) => {
  try {
    const custcode = req.body.custcode;
    if (!custcode) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT * FROM magodmis.payment_recd_voucher_register p WHERE p.Cust_code='${custcode}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Customer Receipts Details
customerRouter.post(`/customerreceiptdets`, async (req, res, next) => {
  try {
    const recdpvid = req.body.recdpvid;
    if (!recdpvid) return res.send(createError.BadRequest());

    misQueryMod(
      `SELECT * FROM magodmis.payment_recd_voucher_details p WHERE p.RecdPVID='${recdpvid}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Endpoint to generate and save PDF
customerRouter.post("/duegenerate-pdf", async (req, res) => {
  const custcode = req.body.ccode;

  const doc = new PDFDocument({ margin: 20 });
  const ason = moment(new Date()).format("DD-MM-YYYY");
  const fileName = `Duelist_Of_${ason}.pdf`;
  // const filePath = path.join(process.env.FILE_SERVER_PDF_PATH, fileName);
  const filePath = path.join(
    process.env.FILE_SERVER_PDF_PATH + custcode,
    fileName
  );

  let magodlogo = "../MagodLogo.png"; // "../../../../../../../MagodLogo.png"

  await misQueryMod(
    "SELECT * FROM magod_setup.magodlaser_units",
    (err, unitData) => {
      misQueryMod(
        `SELECT DateDiff(Curdate(),d.Inv_Date) as DueDays,d.DC_Inv_No,d.IsDC,d.ScheduleId,DATE_FORMAT(d.Dc_inv_Date, "%d/%l/%Y") AS 'Dc_inv_Date' ,d.DC_InvType,
        d.InvoiceFor,d.OrderNo,d.OrderScheduleNo,d.OrderDate,d.DC_No,DATE_FORMAT(d.DC_Date,"%d/%l/%Y") as 'DC_Date',
        d.DC_Fin_Year,Inv_No,DATE_FORMAT(Inv_Date,"%d/%l/%Y") as 'Inv_Date',d.Inv_Fin_Year,DATE_FORMAT(d.PaymentDate,"%d/%l%/%Y") as 'PaymentDate',
        d.PmnyRecd,d.PymtAmtRecd,PaymentMode,d.PaymentReceiptDetails,d.GRNNo,d.Cust_Code,d.Cust_Name,d.Cust_Address,d.Cust_Place,d.Cust_State,d.Cust_StateId,c.CreditTime,
        d.PIN_Code,d.Del_Address,d.Del_StateId,d.ECC_No,d.GSTNo,d.TIN_No,d.KST_No,d.CST_No,d.PO_No, d.PO_Date, d.Net_Total,d.Pkng_chg,d.TptCharges,d.PN_PkngLevel,d.Discount,
        d.Pgm_Dft_Chg,  d.MtrlChg,d.AssessableValue,d.TaxAmount,d.Del_Chg,d.InvTotal,d.Round_Off,d.GrandTotal,(d.GrandTotal - d.PymtAmtRecd) as Balance,d.Total_Wt,
        d.ScarpWt,d.DCStatus,CenvatSrlNo,d.DespatchDate,d.DespatchTime,d.TptMode,d.VehNo,d.EWayBillRef,d.ExChapterHead,d.ExNotNo,d.DelDC_Inv,d.InspBy,d.PackedBy,
        d.Com_inv_id, d.Remarks,d.PO_Value,d.FB_Qty,d.FB_Quality,d.FB_Delivery,d.FB_Remarks,d.Del_responsibility,
        d.PaymentTerms,d.pkngLevel,d.SummaryInvoice,d.BillType,d.Sync_HOId,d.PAN_No,d.ST_No FROM magodmis.draft_dc_inv_register d 
        left outer join magodmis.cust_data c on c.Cust_Code = d.Cust_Code
        WHERE  d.DCStatus='Despatched' AND d.Cust_Code='${custcode}' 
        ORDER BY d.Inv_Date`,
        (err, newData) => {
          if (err) {
            console.log(err);
          }
          //    console.log("newData", newData);
          let OverDAmt = 0;
          if (newData.length > 0) {
            newData.forEach((item, i) => {
              OverDAmt += Number(item.Balance);
            });
            //      console.log("OverDAmt", OverDAmt);
          }
          if (newData.length > 0) {
            doc.pipe(fs.createWriteStream(filePath));
            const logoPath = path.join(__dirname, magodlogo); // Ensure to use the correct path to your logo
            const logoWidth = 30;
            const margin = 20; // Add the logo at the top left
            doc.image(logoPath, margin, margin, { width: logoWidth }); // Adjust the width as needed
            // Calculate the X coordinate for the text to be next to the logo
            const textX = margin + logoWidth + 10; // 10 units of space between the logo and the text const textY = margin;
            const textY = margin;

            // Add company details next to the logo
            // doc.fontSize(12).text(unitData[0].RegisteredName, textX, textY, { align: 'center', textDecoration: 'bold' });
            // doc.fontSize(10).text(unitData[0].Unit_Address, textX, textY + 15, { align: 'center' }); // 15 units down from the RegisteredName

            doc.fontSize(12).text(` ${unitData[0].RegisteredName}`, {
              align: "center",
              textDecoration: "bold",
            });
            doc
              .fontSize(10)
              .text(unitData[0].Unit_Address, { align: "center" }); // 15 units down from the RegisteredName

            doc.moveDown(1); // Add some space before the next section

            doc
              .fontSize(9)
              .text(`List of Invoices Due For Payment as on: ${ason}`, {
                align: "center",
              });
            const leftX = 30; // X coordinate for left-aligned text
            const rightX = 400; // X coordinate for right-aligned text (adjust as needed)
            const initialtextY = 80; //130; //290; // Y coordinate for both texts
            doc.moveDown();
            // Add customer details and due amount
            doc.text(
              `Customer Name: ${newData[0].Cust_Name}`,
              leftX,
              initialtextY,
              { align: "left" }
            );
            doc.text(
              `Due Amount: ${parseFloat(OverDAmt).toFixed(2)}`,
              rightX,
              initialtextY,
              { align: "right" }
            );
            doc.moveDown(); // Add some space before the table
            // Add table headers
            doc.fontSize(9);
            const tableTop = 100;
            const itemSpacing = 25;
            const headers = [
              "Srl",
              "Inv No",
              "Inv Date",
              "PO No",
              "Amount",
              "Received",
              "Balance",
              "Due Date",
              "Due Days",
            ];
            const headerX = [30, 60, 100, 160, 300, 350, 410, 470, 540];

            // Define function to print table headers
            function printTableHeaders(doc, headerX, tableTop) {
              const headers = [
                "Srl",
                "Inv No",
                "Inv Date",
                "PO No",
                "Amount",
                "Received",
                "Balance",
                "Due Date",
                "Due Days",
              ];
              //  doc.font('Helvetica-Bold');
              doc
                .moveTo(20, tableTop - 5)
                .lineTo(600, tableTop - 5)
                .stroke();
              headers.forEach((header, i) => {
                doc.text(header, headerX[i], tableTop);
              });
              doc
                .moveTo(20, tableTop + 15)
                .lineTo(600, tableTop + 15)
                .stroke();
              //   doc.font('Helvetica');
            }
            // Print initial table headers
            printTableHeaders(doc, headerX, tableTop);

            // Add table rows and handle page breaks
            let currentY = tableTop + 30;
            newData.forEach((item, i) => {
              if (currentY + itemSpacing > doc.page.height - 50) {
                doc.addPage();
                currentY = 50; // Adjust this based on the new top margin
                printTableHeaders(doc, headerX, currentY);
                currentY += 30; // Add some space after headers
              }
              const y = currentY;
              //  const y = tableTop + itemSpacing * (i + 1);
              doc.text(i + 1, headerX[0], y);
              doc.text(item.Inv_No, headerX[1], y);

              // Update to parse and format the date
              const invDate = moment(item.Inv_Date, "DD/MM/YYYY");
              if (invDate.isValid()) {
                doc.text(invDate.format("DD-MM-YYYY"), headerX[2], y);
              } else {
                doc.text("Invalid Date", headerX[2], y);
              }

              // Wrap text for PO_No column
              doc.text(item.PO_No, headerX[3], y, {
                width: 150, // Adjust the width as needed
                align: "left",
              });
              doc.text(item.InvTotal.toString(), headerX[4], y, {
                align: "right",
                width: 50,
              }); // Adjust width as needed
              doc.text(item.PymtAmtRecd.toString(), headerX[5], y, {
                align: "right",
                width: 50,
              }); // Adjust width as needed
              doc.text(item.Balance.toString(), headerX[6], y, {
                align: "right",
                width: 50,
              }); // Adjust width as needed
              doc.text(
                moment(item.DespatchDate).format("DD-MM-YYYY"),
                headerX[7],
                y
              );
              doc.text(item.DueDays, headerX[8], y);
              currentY += itemSpacing;
            });

            doc.moveDown();
            doc.on("end", () => addPageNumbers(doc));
            doc.end();
          }
        }
      );
    }
  );
  res.send("Sucess");
});

function addPageNumbers(doc) {
  const range = doc.bufferedPageRange(); // Get the total number of pages
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .text(`Page ${i + 1} of ${range.count}`, 300, doc.page.height - 30, {
        align: "center",
      });
  }
}

// Endpoint to generate and save PDF
customerRouter.post("/osgenerate-pdf", async (req, res) => {
  const custcode = req.body.custcode;
  const custname = req.body.custname;
  const fileName = `Outstanding_for_${custname}.pdf`;
  const filePath = path.join(
    process.env.FILE_SERVER_PDF_PATH + custcode,
    fileName
  );
  const doc = new PDFDocument({ margin: 20 });
  const ason = moment(new Date()).format("DD-MM-YYYY");

  let magodlogo = "../MagodLogo.png"; // "../../../../../../../MagodLogo.png"

  function printOSTableHeaders(doc, headerX, tableTop) {
    const headers = [
      "Inv No",
      "Inv Date",
      "Amount",
      "Received",
      "Balance",
      "Due Days",
      "PO No",
    ];
    doc
      .moveTo(20, tableTop + 5)
      .lineTo(600, tableTop + 5)
      .stroke();
    headers.forEach((header, i) => {
      doc.text(header, headerX[i], tableTop);
    });
    doc
      .moveTo(20, tableTop + 15)
      .lineTo(600, tableTop + 15)
      .stroke();
    //  doc.font('Helvetica');
  }

  if (!custcode) return res.send(createError.BadRequest());

  await misQueryMod(
    "SELECT * FROM magod_setup.magodlaser_units",
    async (err, unitData) => {
      if (err) logger.error(err);
      await misQueryMod(
        `SELECT ddir.Inv_No,ddir.Inv_Date, ddir.GrandTotal, ddir.PymtAmtRecd, (ddir.GrandTotal - ddir.PymtAmtRecd) as Due, 
      datediff(current_date(),ddir.Inv_Date) as DueDays, ddir.PO_No,c.credittime FROM magodmis.draft_dc_inv_register ddir
      inner join magodmis.cust_data c on c.Cust_code = ddir.Cust_Code
      WHERE  ddir.DCStatus ='Despatched' AND ddir.Cust_Code='${custcode}' ORDER BY ddir.Inv_Date`,
        (err, newData) => {
          if (err) logger.error(err);

          doc.pipe(fs.createWriteStream(filePath));

          const logoPath = path.join(__dirname, magodlogo); // Ensure to use the correct path to your logo
          const logoWidth = 30;
          const margin = 20; // Add the logo at the top left
          doc.image(logoPath, margin, margin, { width: logoWidth }); // Adjust the width as needed
          // Calculate the X coordinate for the text to be next to the logo
          const textX = margin + logoWidth + 10; // 10 units of space between the logo and the text const textY = margin;
          const textY = margin;

          // Add company details next to the logo
          doc.fontSize(12).text(`${unitData[0].RegisteredName}`, {
            align: "center",
            textDecoration: "bold",
          });
          doc.fontSize(10).text(unitData[0].Unit_Address, { align: "center" }); // 15 units down from the RegisteredName
          doc.moveDown(1); // Add some space before the next section

          doc
            .fontSize(9)
            .text(`Outstanding Invoices Report For ${req.body.custname}`, {
              align: "center",
            });
          doc.moveDown();
          // Add table headers
          doc.fontSize(9);
          const tableTop = 75;
          const itemSpacing = 25;
          const headers = [
            "Inv No",
            "Inv Date",
            "Amount",
            "Received",
            "Balance",
            "Due Days",
            "PO No",
          ];
          const headerX = [30, 80, 140, 210, 290, 360, 410, 460, 580];

          function printOSTableHeaders(doc, headerX, tableTop) {
            doc
              .moveTo(30, tableTop - 1)
              .lineTo(560, tableTop - 1)
              .stroke();
            headers.forEach((header, i) => {
              doc.text(header, headerX[i], tableTop + 1);
            });
            doc
              .moveTo(30, tableTop + 15)
              .lineTo(560, tableTop + 15)
              .stroke();
          }

          printOSTableHeaders(doc, headerX, tableTop);

          // Reset font to normal
          let currentY = tableTop + 25;
          newData.forEach((item, i) => {
            if (currentY + itemSpacing > doc.page.height - 50) {
              doc.addPage();
              currentY = 50; // Adjust this based on the new top margin
              printOSTableHeaders(doc, headerX, currentY);
              currentY += 30; // Add some space after headers
            }
            const y = currentY;
            doc.text(item.Inv_No, headerX[0], y);
            doc.text(moment(item.Inv_Date).format("DD/MM/YYYY"), headerX[1], y);
            doc.text(item.GrandTotal, headerX[2], y, {
              align: "right",
              width: 50,
            });
            doc.text(item.PymtAmtRecd, headerX[3], y, {
              align: "right",
              width: 50,
            });
            doc.text(item.Due, headerX[4], y, { align: "right", width: 50 });
            doc.text(item.DueDays, headerX[5], y, {
              align: "right",
              width: 40,
            });
            doc.text(item.PO_No, headerX[6], y);
            currentY += itemSpacing;
          });
          doc.end();
        }
      );
    }
  );
});

module.exports = customerRouter;
