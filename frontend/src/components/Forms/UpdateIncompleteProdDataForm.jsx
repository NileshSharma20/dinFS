import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { getFilteredDemandSlips, resetAfterNewDemandSlip, updateDemandSlip } from '../../features/orders/orderSlice';
import useAuth from '../../hooks/useAuth';

function UpdateIncompleteProdDataForm({initialValue}) {
    const dispatch = useDispatch();

    const {isAdmin, isManager, isAccountant} = useAuth()

    const {isSuccess, updatedDataFlag} = useSelector((state)=>state.orders)

    const [formData, setFormData] = useState({
        ...initialValue
    })
    
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

        // console.log(`nV:${numValue}`)
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
        // console.log(`updatedOL:${JSON.stringify(updatedOrderList,null,4)}`)
        // console.log(`orderedList:${JSON.stringify(formData.orderedProductList,null,4)}`)
        
        let emptyOrderListObj = []
        emptyOrderListObj = updatedOrderList.filter(prod=>(prod.sku===""
                                                    ||prod.productFullName===""
                                                    ||prod.quantity===""))

        //Check for Empty Order List
        if(emptyOrderListObj.length>0){
            return alert('Empty Field/s')
        }

        // Status-wise Order List update
        if(formData.status==="failed"){
            updatedOrderList = []
        }else if(formData.status==="fulfilled"){
            updatedOrderList = [...formData.orderedProductList]
        }

        // Invalid Partial Status input check
        if(formData.status==="partial"){
            let allQtyZeroBool = true
            let noQtyChangeBool = true

            updatedOrderList.map((item,index)=>{
                // All qty zero flag check
                `${item.quantity}`==='0'?
                    allQtyZeroBool=allQtyZeroBool && true 
                    :
                    allQtyZeroBool=allQtyZeroBool && false;
                
                // All qty same as ordered check
                `${item.quantity}`===formData.orderedProductList[index].quantity?
                    noQtyChangeBool = noQtyChangeBool && true
                    :
                    noQtyChangeBool = noQtyChangeBool && false;
                }
            )

            // Partial to Failed Alert
            if(allQtyZeroBool){
                return alert('All prodcut quantity zero:\nSet status to Failed')
            }

            // Partial to Fulfilled Alert
            if(noQtyChangeBool){
                return alert('Partial status invalid:\nSet Status to Fulfilled')
            }
        }


        // Total Cost Zero check for Partial and Fulfilled status
        if(formData.status!=="failed" && `${formData.totalCost}`==='0' ){
            return alert('Invalid Total Cost')
        }


        // Invalid status check
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
            
            // console.log(`formData:${JSON.stringify(updatedInfo,null,4)}`)
            
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
        <form onSubmit={onSubmit} style={{width:`100%`}}>

            <div className="form-group" style={{width:`100%`}}>

                {/* {console.log(`prodData:${JSON.stringify(formData,null,4)}`)} */}
                {formData.orderedProductList.map((prod,k)=>{
                    return(
                        // <div className="card-grid-row" key={i}>
                        //     <p>{i+1}.</p>

                        //     <div className="card-element">

                        //         <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                        //         <p>{prod.sku}</p>
                        //     </div>

                        //     <p>{prod.quantity} {prod?.unit}</p>
                            
                        //     {partialFlag && 
                        //         <p>{info.recievedProductList[i]?.quantity}</p>
                        //     }
                            
                        // </div>

                    <div className="card-grid-row" key={k}>
                        <p>{k+1}.</p>

                        {/* <p>{prod.sku}</p>
                        
                        <p>{prod.productFullName}</p> */}
                        <div className="card-element">

                            <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                            
                            {prod.sku.split("-").length===2
                                &&
                            <input
                                type="text" 
                                className='card-form-control'
                                name="brandCompany"
                                id={`${initialValue.ticketNumber} ${k} brandCompany`}
                                value = {formData.orderedProductList[k].brandCompany}
                                placeholder="Brand Company"
                                autoComplete='off'
                            />}

                            {(prod.sku.split("-").length===3 ||
                            prod.sku.split("-").length===2)
                                &&
                            <input
                                type="text" 
                                className='card-form-control'
                                name="partNum"
                                id={`${initialValue.ticketNumber} ${k} partNum`}
                                value = {formData.orderedProductList[k].partNum}
                                placeholder="Part Number"
                                autoComplete='off'
                            />}
                            
                            <p>{prod.sku}</p>
                        </div>

                        <p>
                            {prod.quantity} {prod?.unit}
                        </p>
                        
                        {initialValue.status==="partial" && 
                                <p>
                                {formData.recievedProductList.filter((x)=>x.sku===prod.sku)[0].quantity}

                                </p>
                        }
                        {/* <input
                            type="text" 
                            className='card-form-control'
                            name="quantity"
                            id={`${initialValue.ticketNumber} ${k} quantity`}
                            value = {formData.recievedProductList[k].quantity}
                            placeholder="qty"
                            autoComplete='off'
                            onChange={(e)=>onRecievedListChange(e,k)} 
                        /> */}
                        {/* <br /> */}
                    </div>
                        )
                })}
            </div>

            <div className="form-group">
                <button type="submit" className="submit-btn"
                    style={{width:`50%`, justifySelf:`center`}}
                >
                    Update
                </button>
            </div>
        </form>
    {/* </div> */}

    </>
  )
}

export default UpdateIncompleteProdDataForm