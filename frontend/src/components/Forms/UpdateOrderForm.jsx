import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { getFilteredDemandSlips, resetAfterNewDemandSlip, updateDemandSlip } from '../../features/orders/orderSlice';

function UpdateOrderForm({ initialValue, setFlag}) {
    const dispatch = useDispatch();

    const {isSuccess, updatedDataFlag} = useSelector((state)=>state.orders)

    const [formData, setFormData] = useState({
        ...initialValue, 
        recievedProductList: initialValue.orderedProductList
    })
    
    const { deliveryPartnerName, distributorName } = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onRecievedListChange=(e,i)=>{
        var tempList = [...formData.recievedProductList]

        const numValue = e.target.value.replace(/\D/g, "");

        console.log(`nV:${numValue}`)
        const intInputValue = parseInt(numValue.replace(/\D/g, ""),10)
        const intMaxValue = parseInt(initialValue.orderedProductList[i].quantity,10)
        
        if(intInputValue>intMaxValue){
            return alert('Invalid Quanity')
        }
        var tempItem = tempList[i]
        let newItem = {
            sku:tempItem.sku,
            productFullName:tempItem.productFullName,
            quantity:intInputValue?intInputValue:0
        }


        // tempItem["quantity"] = e.target.value
        tempList.splice(i,1,newItem)

        // console.log(`itemList:${JSON.stringify(tempList,null,4)}`)
        setFormData((prevState)=>({
            ...prevState,
            recievedProductList:tempList
        }))

    }

    const handleNumField = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setFormData((prevState)=>({...prevState, 
            [e.target.name]:value}));
    };

    const onSubmit = (e) =>{
        e.preventDefault()

        let updatedOrderList = [...formData.recievedProductList]
        console.log(JSON.stringify(updatedOrderList,null,4))
        let emptyOrderListObj = []
        emptyOrderListObj = updatedOrderList.filter(prod=>(prod.sku===""
                                                    ||prod.productFullName===""
                                                    ||prod.quantity===""))

        if(emptyOrderListObj.length>0){
            return alert('Empty Field/s')
        }

        if(formData.status==="failed"){
            updatedOrderList = []
        }else if(formData.status==="fulfilled"){
            updatedOrderList = [...formData.orderedProductList]
        }

        if( formData.status==="" 
            || (formData.status!=="partial" && formData.status!=="fulfilled" && formData.status!=="failed") 
            || !Array.isArray(updatedOrderList)
            ){
            return alert(`Please enter valid data`)
        }else{
            const updatedInfo = {
                ...formData,
                recievedProductList: updatedOrderList,
            }
            
            console.log(`formData:${JSON.stringify(updatedInfo,null,4)}`)
            
            dispatch(updateDemandSlip(updatedInfo))
            
        }
    }
    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////

    // useEffect(()=>{
    //     console.log(`iV:${JSON.stringify(initialValue,null,4)}`)
    // },[])

    useEffect(()=>{
        if(isSuccess && updatedDataFlag){
            // dispatch(resetOrders())
            dispatch(getFilteredDemandSlips())

            if(isSuccess){
                dispatch(resetAfterNewDemandSlip())
                // setNewDSFlag(true)
                // passNextFlag(true)
                // setToggleFlag(false)
            }
        }
    },[isSuccess, updatedDataFlag])

  return (
    <>
    <div className='card-container' style={{padding:"0", border:"none"}}>
        <p><span>Ticket Number: </span> {initialValue.ticketNumber}</p>
        <p><span>Delivery Partner Name: </span>{initialValue.deliveryPartnerName}</p>
        <p><span>Distributor Name: </span> {initialValue.distributorName}</p>
    
        <form onSubmit={onSubmit}>
            <div className="form-group">
                    <label>Status</label>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`${initialValue.ticketNumber} partial`} 
                            value="partial"
                            defaultChecked={initialValue.status==="partial"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`${initialValue.ticketNumber} partial`}>Partial</label>
                        </div>
                    {/* </div> */}

                    {/* <div className="radio-group"> */}
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`${initialValue.ticketNumber} failed`} 
                            value="failed"
                            defaultChecked={initialValue.status==="failed"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`${initialValue.ticketNumber} failed`}>Failed</label>
                        </div>
                    {/* </div> */}

                    {/* <div className="radio-group"> */}
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`${initialValue.ticketNumber} fulfilled`} 
                            value="fulfilled"
                            defaultChecked={initialValue.status==="fulfilled"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`${initialValue.ticketNumber} fulfilled`}>Fulfilled</label>
                        </div>
                    {/* </div> */}

                    </div>
                </div>

            {formData.status!=="failed" &&
             <div className="form-group">
                <label htmlFor={`totalCost`}>Total Cost</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'totalCost'
                    id={`totalCost`}
                    value = {formData.totalCost}
                    placeholder="Total Cost"
                    autoComplete='off'
                    onChange={handleNumField} />
            </div>}

            {formData.status==="partial" &&

            <div className="form-group">
                <label>Products</label>
                {formData.recievedProductList.map((prod,k)=>{
                    return(

                    <div key={k}>
                        <p>{prod.sku}</p>
                        {/* <br /> */}
                        <p>{prod.productFullName}</p>
                        {/* <br /> */}
                        <input
                            type="text" 
                            className='card-form-control'
                            name="quantity"
                            id={`${initialValue.ticketNumber} ${k} quantity`}
                            value = {formData.recievedProductList[k].quantity}
                            placeholder="qty"
                            autoComplete='off'
                            onChange={(e)=>onRecievedListChange(e,k)} 
                        />
                        <br />
                    </div>
                        )
                })}
            </div>
            }

            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Update
                </button>
            </div>
        </form>
    </div>

    </>
  )
}

export default UpdateOrderForm