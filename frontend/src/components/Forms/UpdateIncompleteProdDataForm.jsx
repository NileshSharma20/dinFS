import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getFilteredDemandSlips, resetAfterNewDemandSlip, updateIncompleteDemandSlip } from '../../features/orders/orderSlice';
import useAuth from '../../hooks/useAuth';

function UpdateIncompleteProdDataForm({initialValue}) {
    const dispatch = useDispatch();

    const {isAccountant} = useAuth()

    const {isSuccess, updatedDataFlag} = useSelector((state)=>state.orders)

    const [updatedData, setUpdatedData] = useState({
        totalCost: initialValue.totalCost,
        orderedProductList: initialValue.orderedProductList.map((item)=>{
            let prod = {...item}
            if(item.sku.split("-").length===3){
                prod.partNum=""
            }else if(item.sku.split("-").length===2){
                prod.partNum=""
                prod.brandCompany=""
            }

            return prod
        })
    })
    
    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    // const onChange=(e)=>{
    //     setFormData((prevState)=>({
    //         ...prevState,
    //         [e.target.name]:e.target.value
    //     }))
    // }

    const onBrandCompanyChange=(e,i)=>{
        var tempList = [...updatedData.orderedProductList]
        var tempItem = tempList[i]

        var spaceRemovedBC = e.target.value?e.target.value.replace(/ /g,"").toUpperCase():""
        // const cleanedBC = spaceRemovedBC.slice(0,3)
        // const bC = cleanedBC

        let newItem = {
            ...tempItem,
            brandCompany:spaceRemovedBC
        }

        tempList.splice(i,1,newItem)

        setUpdatedData((prevState)=>({
            ...prevState,
            orderedProductList:tempList
        }))

    }

    const onPartNumberChange=(e,i)=>{
        var tempList = [...updatedData.orderedProductList]
        var tempItem = tempList[i]

        var spaceRemovedPN = e.target.value?e.target.value.replace(/ /g,""):""
        // const cleanedPN = spaceRemovedPN.split("-").join("")
        // const cleanedPN2 = cleanedPN.split("/").join("")
        // const pN = cleanedPN2.toUpperCase()

        let newItem = {
            ...tempItem,
            partNum: spaceRemovedPN
        }

        tempList.splice(i,1,newItem)

        setUpdatedData((prevState)=>({
            ...prevState,
            orderedProductList:tempList
        }))
    }

    const handleNumField = (e) => {
        let value = e.target.value.replace(/[^.0-9]/g, "")
        value = value.replace(/\s/g,"")

        setUpdatedData((prevState)=>({...prevState, 
            [e.target.name]:value}));
    };

    const onSubmit = (e) =>{
        e.preventDefault()

        if(!isAccountant){
            return alert('Forbidden: Minimum Accountant Access required')
        }   

        let emptyOrderListObj = []
        let newDataStatus = "incomplete"
        emptyOrderListObj = updatedData.orderedProductList.filter(prod=>(
                                        prod?.partNum===""
                                        || prod?.brandCompany===""
                                    ))

        // console.log(`eOL:${JSON.stringify(emptyOrderListObj,null,4)}`)

        // Check for Empty Order List
        if(emptyOrderListObj.length>0 || !updatedData.totalCost
            || Number(updatedData.totalCost)===0
            || typeof updatedData.totalCost === "undefined" 
        ){
            return alert('Empty or Invalid Field/s')
        }else{
            newDataStatus = "complete"
        }

        const updatedInfo = {
            ...initialValue,
            dataStatus: newDataStatus,
            orderedProductList: updatedData.orderedProductList,
            totalCost: Number(updatedData.totalCost)
        }
        
        console.log(`formData:${JSON.stringify(updatedInfo,null,4)}`)
            
        dispatch(updateIncompleteDemandSlip(updatedInfo))
            
        // }
    }
    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////

    // useEffect(()=>{
    //     console.log(`iV:${JSON.stringify(initialValue,null,4)}`)
    // },[])

    useEffect(()=>{
        // console.log(`uD;${JSON.stringify(updatedData,null,4)}`)
    },[updatedData])

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
        <br />
        <p><span>Total Cost: </span>
            {initialValue.totalCost===0?
                <input
                    type="text" 
                    className='card-form-control'
                    name="totalCost"
                    id={`${updatedData.ticketNumber} totalCost`}
                    value = {updatedData.totalCost}
                    placeholder=""
                    autoComplete='off'
                    onChange={(e)=>handleNumField(e)} 
                    style={{width:`40%`}}
                />
                :
                updatedData.totalCost
            }
        </p>
        <br />

        <div className="card-grid-row">
            <h3></h3>
            <h3>Products</h3>
            <h3>Ord.</h3>
            {initialValue.status==="partial" && <h3>Recv.</h3>}  
        </div>

            <div className="form-group" style={{width:`100%`}}>

                {updatedData.orderedProductList.map((prod,k)=>{
                    return(

                    <div className="card-grid-row" key={k}>
                        <p>{k+1}.</p>

                        <div className="card-element">

                            <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                            
                            {prod.sku.split("-").length===2
                                &&
                            <input
                                type="text" 
                                className='card-form-control'
                                name="brandCompany"
                                id={`${initialValue.ticketNumber} ${k} brandCompany`}
                                value = {updatedData.orderedProductList[k].brandCompany?updatedData.orderedProductList[k].brandCompany:""}
                                placeholder="Brand Company"
                                autoComplete='off'
                                onChange={(e)=>onBrandCompanyChange(e,k)}
                            />}

                            {(prod.sku.split("-").length===3 ||
                            prod.sku.split("-").length===2)
                                &&
                            <input
                                type="text" 
                                className='card-form-control'
                                name="partNum"
                                id={`${initialValue.ticketNumber} ${k} partNum`}
                                value = {updatedData.orderedProductList[k].partNum?updatedData.orderedProductList[k].partNum:""}
                                placeholder="Part Number"
                                autoComplete='off'
                                onChange={(e)=>onPartNumberChange(e,k)}
                            />}
                            
                            <p>{prod.sku}</p>
                        </div>

                        <p>
                            {prod.quantity} {prod?.unit}
                        </p>
                        
                        {initialValue.status==="partial" && 
                                <p>
                                {initialValue.recievedProductList.filter((x)=>x.sku===prod.sku)[0].quantity}

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