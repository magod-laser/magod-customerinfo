// let API = "http://192.168.1.25:4001";
// let API = "http://localhost:4001";
// let API = "http://172.16.20.61:4001";
// let API = "http://172.16.20.39:3001";
//let API = "http://20.204.144.125:3001";

let API = process.env.REACT_APP_API_KEY;

export default {
  loginAPI: async (username, password, response) => {
    const rawResponse = await fetch(`${API}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const content = await rawResponse.json();
    // console.log(content);
    response(content);
  },
  getData: async (response) => {
    const rawResponse = await fetch("https://httpbin.org/post", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getUnits: async (response) => {
    const rawResponse = await fetch(`${API}/units/allunits`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getUnitbyId: async (id, response) => {
    const rawResponse = await fetch(`${API}/units/unit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const content = await rawResponse.json();
    response(content);
  },
  // Customer
  getCustomers: async (response) => {
    const rawResponse = await fetch(`${API}/customers/allcustomers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  // getting Existing Customer Details
  getCustomerdets: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/getcustomer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getCustomerDetails: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/getcustomerdetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  createCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  // Assembly PArt Customer
  assyPartCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerassy`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  assyInsertPartCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerinsassembly`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  updateCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerupdate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getCustBOMParts: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/getcustomerbomparts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  bompartsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/custbomparts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  bomAssemblyParts: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/bomassemblyparts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  drawingsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customersdrawings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  ordersCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerorders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getCombinedTaskSch: async (response) => {
    const rawResponse = await fetch(`${API}/order/getcombinedschdata`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //    body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    response(content);
  },

  getOrderScheduleData: async (data, response) => {
    const rawResponse = await fetch(`${API}/order/getorderscheduledata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getSelectedSchDwgData: async (data, response) => {
    const rawResponse = await fetch(`${API}/order/getselectedschdwgdata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  ordStatusCustomer: async (response) => {
    const rawResponse = await fetch(`${API}/customers/orderstatus`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    response(content);
  },
  orderScheduleCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/orderschedule`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  ordSchTasksCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/orderschtasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  orderDetailsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/orderdetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  orderInvoicesCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/orderinvoices`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getSalesTasksData: async (response) => {
    const rawResponse = await fetch(`${API}/order/getsalestasksdata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //   body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    response(content);
  },

  getSelectedSalesTaskList: async (data, response) => {
    const rawResponse = await fetch(`${API}/order/getselectedsalestasklist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getPrepareScheduleDetails: async (data, response) => {
    const rawResponse = await fetch(`${API}/order/preparescheduledetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  invDwgCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/orderinvdwg`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  schDetsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/schdets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  scheduleTasksCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/schtasksdets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  mtrlStockCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customermtrlstock`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  dueListCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerduelist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  dLInvFormCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerdlinvform`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  dLInvFormTaxDetsCustomer: async (data, response) => {
    const rawResponse = await fetch(
      `${API}/customers/customerdlinvformtaxdets`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  dueSummaryCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerduessummary`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  outStandingCustomers: async (response) => {
    const rawResponse = await fetch(`${API}/customers/customeroutstandings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //  body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    response(content);
  },
  individualCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/outstandinginvoices`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  receiptsinfoCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerreceiptsinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  receiptDetsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customerreceiptdets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  mtrlReceiptsCustomer: async (data, response) => {
    const rawResponse = await fetch(`${API}/customers/customermtrlreceipts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  mtrlReceiptDetailsCustomer: async (data, response) => {
    const rawResponse = await fetch(
      `${API}/customers/customermtrlrectdetails`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  // material Parts returned
  mtrlPartsReturnedCustomer: async (data, response) => {
    const rawResponse = await fetch(
      `${API}/customers/customermtrlpartsreturned`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  //material scrap and unused returned
  mtrlScrapUnusedReturnedCustomer: async (data, response) => {
    const rawResponse = await fetch(
      `${API}/customers/customermtrlscrapUnusedreturned`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  getMtrlGrades: async (response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/allmtrlgrades`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getEmployees: async (response) => {
    const rawResponse = await fetch(`${API}/employees/allsalesemployees`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getMtrlGrade: async (id, response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/mtrlgrade`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const content = await rawResponse.json();
    response(content);
  },
  // getMaterials: async (response) => {
  //     const rawResponse = await fetch(`${API}/materials/allmaterials`, {
  //         method: 'GET',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },
  getMtrlSources: async (response) => {
    const rawResponse = await fetch(`${API}/mtrlsources/allmtrlsources`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getStates: async (response) => {
    const rawResponse = await fetch(`${API}/states/allstates`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getCreditTerms: async (response) => {
    const rawResponse = await fetch(`${API}/creditterms/allcreditterms`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  // getProcessLists: async (response) => {
  //     const rawResponse = await fetch(`${API}/processlists/allprocesslists`, {
  //         method: 'GET',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },
  getSalesExecLists: async (response) => {
    const rawResponse = await fetch(
      `${API}/salesexecutives/allsalesexeclists`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  getTermsConditions: async (response) => {
    const rawResponse = await fetch(
      `${API}/termsconditions/alltermsconditions`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const content = await rawResponse.json();
    response(content);
  },
  checkdrawing: async (data, response) => {
    const rawResponse = await fetch(`${API}/checkdrawings/chkdrawings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  createOrder: async (data, response) => {
    const rawResponse = await fetch(`${API}/order/createorder`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getTaxDetails: async (qtype, response) => {
    const rawResponse = await fetch(`${API}/taxdetails/alltaxdetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qtype }),
    });
    const content = await rawResponse.json();
    response(content);
  },
  // getToleranceTypes: async (response) => {
  //     const rawResponse = await fetch(`${API}/tolerancetypes/alltolerancetypes`, {
  //         method: 'GET',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },
  getMtrlTypeLists: async (response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/allmtrltypelists`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getMtrlGrdTypes: async (data, response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/allmtrlgrdtypes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getMtrlShapeGrds: async (data, response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/allmtrlshapegrades`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getMtrlShapes: async (response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/allmtrlshapes`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  // getInspectionLevels: async (response) => {
  //     const rawResponse = await fetch(`${API}/inspectionlevels/allinspectionlevels`, {
  //         method: 'GET',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },
  getPackingLevels: async (response) => {
    const rawResponse = await fetch(`${API}/packinglevels/allpackinglevels`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  getQuotations: async (response) => {
    const rawResponse = await fetch(`${API}/quotation/getquotations`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //  body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    response(content);
  },
  getQuotationItems: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/getquotationitems`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getQtnTaxDetails: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/getqtntaxdetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  // saveQtnTaskListDetails: async (data, response) => {
  //     console.log("Save Task Data");
  //     console.log(data);
  //     const rawResponse = await fetch(`${API}/quotation/saveqtntasklistdetails`, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(data)
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },

  getQtntcDetails: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/getqtntcdetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getSelectedQuotation: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/getselectedquotation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  qtnStatusUpdate: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/quotationstatusupdate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getMaterialSpWt: async (data, response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/getmaterialspwt`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  saveNewMtrlGrades: async (data, response) => {
    const rawResponse = await fetch(`${API}/mtrlgrades/savenewmtrlgrades`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getQuotationList: async (data, response) => {
    console.log(data);
    const rawResponse = await fetch(`${API}/quotation/getquotationlist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  getQtnRejnReasons: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/getqtnrejnreasons`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  createQuotation: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/quotation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  updateQuotation: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/updatequotation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  qtnItemsDeleteandSave: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/qtnitemsdeleteandsave`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },

  qtnItemsDeletedSave: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/qtnitemsdeletedsave`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  // createOrder: async (data, response) => {
  //     console.log(data);
  //     console.log("createOrder API Conn");
  //     const rawResponse = await fetch(`${API}/order/createorder`, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(data)
  //     });
  //     const content = await rawResponse.json();
  //     response(content);
  // },
  getOrderData: async (data, response) => {
    console.log("getOrderData API Conn");
    const rawResponse = await fetch(`${API}/order/getorderdata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getOrderDwgData: async (data, response) => {
    console.log("getOrderDwgData API Conn");
    const rawResponse = await fetch(`${API}/order/getorderdwgdata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  deleteQtnItemData: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/deleteqtnitemdata`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  getTaxes: async (response) => {
    const rawResponse = await fetch(`${API}/taxes/alltaxdetails`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
  saveProfileListdata: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/saveprofilelistdata`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  saveQuotationItems: async (data, response) => {
    const rawResponse = await fetch(`${API}/quotation/quotationitemslist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    response(content);
  },
  dxfupload: async (files, response) => {
    const data = new FormData();
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }
    const rawResponse = await fetch(`${API}/file/uploaddxf`, {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
        // 'Content-Type': 'multipart/form-data'
      },
      body: data,
    });
    const content = await rawResponse.json();
    response(content);
  },

  //Paking and Invoice

  getData: async (response) => {
    const rawResponse = await fetch(`${API}/gettest/getdata`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },

  getCustomerData: async (response) => {
    const rawResponse = await fetch(`${API}/schedulelist/getallcustomers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
};
