import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
// import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { getFilteredDemandSlips, resetAfterNewDemandSlip, updateDemandSlip } from '../../features/orders/orderSlice';
import useAuth from '../../hooks/useAuth';

function UpdateOrderForm({ initialValue, setFlag}) {
    const dispatch = useDispatch();

    const {isAdmin, isManager} = useAuth()

    const {isSuccess, updatedDataFlag} = useSelector((state)=>state.orders)

    const pageLimit = 50

    const [formData, setFormData] = useState({
        ...initialValue, 
        recievedProductList: initialValue.orderedProductList,
        updateTotalCostLaterFlag: false
    })
    
    // const { deliveryPartnerName, distributorName } = formData

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

    const handleUpdateTotalCostLaterFlag = (e)=>{
        // let updateFlagValue = e.target.value
        // console.log(`checked:${updateFlagValue}`) 
        setFormData((prevState)=>({...prevState,
            updateTotalCostLaterFlag: e.target.checked
        }))
    }

    const handleNumField = (e) => {
        // const value = e.target.value.replace(/\D/g, "");
        let value = e.target.value.replace(/[^.0-9]/g, "")
        value = value.replace(/\s/g,"")

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
                item.quantity===0?
                    allQtyZeroBool=allQtyZeroBool && true 
                    :
                    allQtyZeroBool=allQtyZeroBool && false;
                
                // All qty same as ordered check
                item.quantity===formData.orderedProductList[index].quantity?
                    noQtyChangeBool = noQtyChangeBool && true
                    :
                    noQtyChangeBool = noQtyChangeBool && false;
                
                // return item
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

        let updatedDataStatus = (formData.status!=="failed" && formData.updateTotalCostLaterFlag)?
                                    "incomplete"
                                    :
                                    formData.dataStatus

        let updatedTotalCost = (formData.status==="failed" || formData.updateTotalCostLaterFlag)?
                                0
                                :
                                formData.totalCost
        
        // Total Cost Zero check for Partial and Fulfilled status (Update TotalCostLater flag check)
        if(formData.status!=="failed" 
            && Number(formData.totalCost)===0
            && !formData.updateTotalCostLaterFlag 
        ){
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
                totalCost: Number(updatedTotalCost),
                dataStatus: updatedDataStatus
            }

            delete updatedInfo.updateTotalCostLaterFlag
            
            console.log(`formData:${JSON.stringify(updatedInfo,null,4)}`)
            
            dispatch(updateDemandSlip(updatedInfo))
            
        }
    }
    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////

    // Reset updateTotalCostLaterFlag if Failed status is clicked
    useEffect(()=>{
        if(formData.status==="failed"){
            setFormData((prevState)=>({...prevState,
                updateTotalCostLaterFlag:false
            }))
        }
    },[formData.status])

    useEffect(()=>{
        if(isSuccess && updatedDataFlag){
            // dispatch(resetOrders())
            dispatch(getFilteredDemandSlips({
                filterStatus:'pending',
                page:1,
                limit:pageLimit
              }))

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
    <div className="card-row">
            <div className="card-element">

            <h3>{initialValue.ticketNumber}</h3>
            {(isAdmin||isManager) && 
            <h3>{initialValue?.username}</h3>
            }
            </div>
    </div>
    <br />
    <div className="card-row">
        <div className="card-element">
            <h3>Delivery Partner</h3>
            <p>{initialValue.deliveryPartnerName}</p>
        </div>

        <div className="card-element">
            <h3>Distributor</h3> 
            <p>{initialValue.distributorName}</p>
        </div>
    </div>
    <br />

    {/* <div className='card-container' style={{padding:"0", border:"none"}}> */}
        
        <form onSubmit={onSubmit} style={{width:`100%`}}>
            <div className="form-group">
                    <label>Status</label>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`partial`} 
                            value="partial"
                            defaultChecked={initialValue.status==="partial"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`partial`}>Partial</label>
                        </div>
                    {/* </div> */}

                    {/* <div className="radio-group"> */}
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`failed`} 
                            value="failed"
                            defaultChecked={initialValue.status==="failed"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`failed`}>Failed</label>
                        </div>
                    {/* </div> */}

                    {/* <div className="radio-group"> */}
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="status" 
                            id={`fulfilled`} 
                            value="fulfilled"
                            defaultChecked={initialValue.status==="fulfilled"?true:false}
                            onChange={onChange} />
                        <label htmlFor={`fulfilled`}>Fulfilled</label>
                        </div>
                    {/* </div> */}

                    </div>
                </div>

            {formData.status!=="failed" &&
            <>
            <div className="form-checkbox">
                <input type="checkbox" 
                    name="updateTotalCostLaterFlag" 
                    id={`${initialValue.ticketNumber} updateTotalCostLaterFlag`}
                    value={formData.updateTotalCostLaterFlag}
                    onChange={handleUpdateTotalCostLaterFlag} 
                />
                <label htmlFor="updateTotalCostLaterFlag">
                    Update Total Cost Later
                </label>
            </div>

             {!(formData.updateTotalCostLaterFlag) &&
             <div className="form-group">
                <label htmlFor={`totalCost`}>Total Cost</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'totalCost'
                    id={`totalCost`}
                    value = {formData.totalCost}
                    placeholder="Total Cost"
                    autoComplete='off'
                    onChange={handleNumField} 
                    style={{width:`40%`}}
                    />
            </div>}
        
            
            </>
            }

            {formData.status==="partial" &&
            // {/* // <div className="form-group" style={{width:`100%`}}> */}
            <div className='card-grid-prod-box'>    

                <div className="card-grid-row ">
                    <h3></h3>
                    <h3>Products</h3>
                    <h3>Ord.</h3>
                    <h3>Recv.</h3>
                </div>

                {/* {console.log(`prodData:${JSON.stringify(formData,null,4)}`)} */}
                {formData.recievedProductList.map((prod,k)=>{
                    return(

                    <div className="card-grid-row" key={k}>
                        <p>{k+1}.</p>

                        {/* <p>{prod.sku}</p>
                        
                        <p>{prod.productFullName}</p> */}
                        <div className="card-element">

                            <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                            <p>{prod.sku}</p>
                        </div>

                        <p>
                            {formData.orderedProductList.filter((x)=>x.sku===prod.sku)[0].quantity}
                        </p>
                        
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
                        {/* <br /> */}
                    </div>
                        )
                })}
            </div>
            }

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

export default UpdateOrderForm