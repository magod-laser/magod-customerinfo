import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import OSPrint from './OSPrint';
import { Button } from 'react-bootstrap';


export default function ModalPrintOSReport({ openOSPrintModal, OSData, UnitData, CName, handleClose }) {
    //   console.log("in Print Modal",selectedWeek)
    //   const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
    const [fullscreen, setFullscreen] = useState(true);

    let dueamount = 0;
    const getoverdueamount = (OSData) => {
        let overdueamount = 0;
        let totalamount = 0;
console.log("OS DATA : ",OSData);

        for (let i = 0; i < OSData.length; i++) {
            totalamount += parseFloat(OSData[i].InvTotal);
            dueamount += parseFloat(OSData[i].Balance);
        }
        return dueamount;
    }
    let ODAmt = getoverdueamount(OSData);

    const handleCls = () => {
        handleClose(false);
    }

    return (
        <div>

            <Modal show={openOSPrintModal} fullscreen={fullscreen} onHide={() => handleClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Outstanding Invoices Report</Modal.Title>
                    {/* <div style={{ textAlign: 'right', width:'950px' }}>
                        {"                "}
                        <Button variant="primary" onClick={() => handleCls()}>Close</Button>
                    </div> */}
                </Modal.Header>
                <Modal.Body><OSPrint OSData={OSData} UnitData={UnitData} CName={CName} /></Modal.Body>
            </Modal>
        </div>
    );
}

