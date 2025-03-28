import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DuesPrint from '../Printing/DuesPrint';
import { Button } from 'react-bootstrap';


export default function ModalPrintDueReport({ openDueReportPrintModal, DueReportData, UnitData, handleClose }) {
    //   console.log("in Print Modal",selectedWeek)
    //   const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
    const [fullscreen, setFullscreen] = useState(true);

    let dueamount = 0;
    const getoverdueamount = (DueReportData) => {
        let overdueamount = 0;
        let totalamount = 0;


        for (let i = 0; i < DueReportData.length; i++) {
            totalamount += parseFloat(DueReportData[i].InvTotal);
            dueamount += parseFloat(DueReportData[i].Balance);
        }
        return dueamount;
    }
    let ODAmt = getoverdueamount(DueReportData);

    const handleCls = () => {
        handleClose(false);
    }

    return (
        <div>

            <Modal show={openDueReportPrintModal} fullscreen={fullscreen} onHide={() => handleClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>List of Invoices Due For Payment</Modal.Title>
                    {/* <div style={{ textAlign: 'right', width:'950px' }}>
                        {"                "}
                        <Button variant="primary" onClick={() => handleCls()}>Close</Button>
                    </div> */}
                </Modal.Header>
                <Modal.Body><DuesPrint DueReportData={DueReportData} UnitData={UnitData} ODAmt={ODAmt} /></Modal.Body>
            </Modal>
        </div>
    );
}

