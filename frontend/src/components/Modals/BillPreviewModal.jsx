import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';

function BillPreviewModal({passFlag}) {
    const modalRef = useRef(0)

    const {previewData} = useSelector((state)=>state.billing)

    /////////////////////////////////////////////////
    /////////// Hooks ///////////////////////////////
    ////////////////////////////////////////////////

    //Pop up handling
    useEffect(()=>{
        let handler = (event) => {
            if(!modalRef.current.contains(event.target) 
            )
            {
                passFlag(false) 
            }
        };
        document.addEventListener("mousedown", handler);

        return()=>{
        document.removeEventListener("mousedown",handler);
        }
    })
    return (
    <>
    <div className="modal-backdrop"></div>
    <div className='legend-modal-container' ref={modalRef}>
        {/* <div className="billing-data-grid">
        </div> */}

        <div className="billing-data-grid">
            <h3>Product</h3>
            <h3>Price</h3>
            <h3>Quantity</h3>
            <h3>Disc.(%)</h3>
            <h3>Total(Rs.)</h3>

            {previewData?.billingProductList?.map((item,index)=>{
                return(
                    <React.Fragment key={index}>
                        <p>{item.productFullName}</p>
                        <p>{item.price}</p>
                        <p>{item.quantity} {item.unit}</p>
                        <p>{item.prodDiscount}</p>
                        <p>{item.price * item.quantity}</p>
                    </React.Fragment>
                )
            })}

        </div>
        <div className="billing-data-grid">
            <p></p>
            <p>Extra Disc.</p>
            <p>Rs.{previewData.extraDiscount}</p>
            <p>Grand Total</p>
            <p>Rs.{previewData.totalCost}</p>
        </div>
        <div className="" style={{width:`30%`, marginTop:`5vh`}}>
            <div className="submit-btn">
                Print
            </div>
        </div>
    </div>
    </>
  )
}

export default BillPreviewModal