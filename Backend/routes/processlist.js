const processlistRouter = require("express").Router();
var createError = require('http-errors');

const { misQuery, mchQueryMod } = require('../helpers/dbconn');
const { logger } = require("../helpers/logger");

// processlistRouter.get('/allprocesslists', async (req, res, next) => {
//     try {
//         misQuery("Select * from magodmis.process_list order by ProcessDescription asc", (data) => {
//             res.send(data)
//         })
//     } catch (error) {
//         next(error)
//     }
// });

// processlistRouter.post('/allprocesslistsmch', async (req, res, next) => {
//     console.log("allprocesslistsmch")
//     try {
//         mchQueryMod("Select * From machine_data.operationslist order by Operation asc", (err,data) => {
//             console.log("allprocesslistsmch : ",data);
//             res.send(data)
//         })
//     } catch (error) {
//         next(error)
//     }
// })

processlistRouter.post("/allprocesslists", async (req, res, next) => {
    console.log("allprocesslists");
	try {
		const sqlQuery = `
            SELECT 
    sol.OperationID, ol.Operation, 'service' AS type
FROM machine_data.service_operationslist sol
INNER JOIN machine_data.operationslist ol ON sol.OperationID = ol.OperationID

UNION

SELECT 
    sol.OperationID, ol.Operation, 'profile_cutting' AS type
FROM machine_data.profile_cuttingoperationslist sol
INNER JOIN machine_data.operationslist ol ON  sol.OperationID = ol.OperationID; `;

mchQueryMod(sqlQuery, (err, data) => {
    if (err) logger.error();
			// console.log("data", data);
			res.send(data);
		});
	} catch (error) {
		next(error);
	}
});



module.exports = processlistRouter