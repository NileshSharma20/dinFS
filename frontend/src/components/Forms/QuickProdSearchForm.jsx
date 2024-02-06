import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AiOutlinePlus, AiOutlineClose,AiOutlineSearch } from "react-icons/ai"
import { resetSearchProducts,searchProducts, searchSKUProducts,searchSKUProductsOnly } from '../../features/products/productSlice';
import { generateDemandSlip, getFilteredDemandSlips, resetAfterNewDemandSlip, resetOrders } from '../../features/orders/orderSlice';
import Loader from '../Loader/Loader';

import debouce from "lodash.debounce";

function QuickProdSearchForm({setToggleFlag,passNextFlag }) {
    const dispatch = useDispatch();

    const { productData, noMatch } = useSelector((state)=>state.product)
    const { newDemandSlip, isSuccess, isLoading, message } = useSelector((state)=>state.orders)

    const [newDSFlag, setNewDSFlag] = useState(false)

    const [searchInput, setSearchInput] = useState("");

    const [formData, setFormData] = useState({
        deliveryPartnerName: "",
        distributorName: "",
        orderedProductList: [{
            sku:"",
            productFullName:"",
            quantity:""
        }]
    })

    const [updatedOrderList, setUpdatedOrderList] = useState([{
        sku:"MANUAL",
        productFullName:"",
        quantity:""
    }])

    const [skuData, setSKUData] = useState({
        itemCode:"",
        vehicleModel:"",
        brandCompany:"",
        partNum:"",
        skuOnlyFlag:"true"
    })
      
    const { deliveryPartnerName, distributorName } = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    // const copyText=(text)=>{
    //     navigator.clipboard.writeText(text)
    // }
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    }

    // Debounce function
    const debouncedResults = debouce(handleSearchChange, 800)

    const handleModalClose =()=>{
        setNewDSFlag(false)
        setUpdatedOrderList([{
            sku:"",
            productFullName:"",
            quantity:""
        }])
        setFormData({
            deliveryPartnerName: "",
            distributorName: "",
            orderedProductList: [{
                sku:"MANUAL",
                productFullName:"",
                quantity:""
            }]
        })

        dispatch(resetSearchProducts())
    }

    // const handleNumField = (e) => {
    //     const value = e.target.value.replace(/\D/g, "");
    //     setFormData((prevState)=>({...prevState, 
    //         [e.target.name]:value}));
    // };

    const addItemfromSearch=(item)=>{
        const newItem = {
            sku: item.sku,
            productFullName: item.productFullName,
            quantity:""
        }
        
        // Check for Duplicates
        var duplicateCheck = []
        duplicateCheck = updatedOrderList.filter(prod=>prod.sku===item.sku)
        
        if(duplicateCheck.length>0){
            return alert('Item Already Exists')
        }

        setUpdatedOrderList((prevState)=>([
            ...prevState,
            newItem
        ]
        ))
    }

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onSKUChange=(e)=>{
        setSKUData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onOrderItemChange=(e,i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        if(e.target.name==="quantity"){
            const numValue = e.target.value.replace(/\D/g, "")
            orderItem[e.target.name] = numValue
        }else{
            orderItem[e.target.name] = e.target.value.toUpperCase()
        }

        setUpdatedOrderList(orderList)
    }

    const handleAddItem=()=>{
        const modelList = [...updatedOrderList,{sku:"MANUAL",productFullName:"",quantity:""}]
        setUpdatedOrderList(modelList)
    }

    const handleItemDelete = (index)=>{
        const modelList = [...updatedOrderList]
        modelList.splice(index,1)

        setUpdatedOrderList(modelList)
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        let emptyOrderListObj = []
        emptyOrderListObj = updatedOrderList.filter(prod=>(prod.sku===""
                                                    ||prod.productFullName===""
                                                    ||prod.quantity===""))

        if(emptyOrderListObj.length>0){
            return alert('Empty Field/s')
        }

        // if(updatedOrderList)

        if(deliveryPartnerName==="" || distributorName==="" || updatedOrderList.length===0 
            || !Array.isArray(updatedOrderList)){
            return alert(`Please enter valid data`)
        }else{
            const orderInfo = {
                deliveryPartnerName:deliveryPartnerName.toUpperCase(),
                distributorName:distributorName.toUpperCase(),
                orderedProductList:updatedOrderList,
            }
            
            // console.log(`formData:${JSON.stringify(orderInfo,null,4)}`)
            
            dispatch(generateDemandSlip(orderInfo))
            
        }
    }

    // Get SKU Products API call 
    const onSKUSubmit=(e)=>{
        e.preventDefault()
        
        if(skuData.itemCode===""){
            return alert(`Please Enter Item Code`)
        }else{
            setSearchInput("")
            dispatch(searchSKUProducts(skuData))
        }
    }

    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////

    // Search API call
    useEffect(()=>{
        if (searchInput!=="") {
        dispatch(searchProducts(searchInput))
        }
    },[searchInput])

    // Success reset
    useEffect(()=>{
        if(isSuccess && message!==""){
            // dispatch(resetOrders())
            dispatch(getFilteredDemandSlips())

            if(isSuccess){
                setFormData({
                    deliveryPartnerName: "",
                    distributorName: "",
                    orderedProductList: [{
                        sku:"MANUAL",
                        productFullName:"",
                        quantity:""
                    }]
                })

                setSKUData({
                    itemCode:"",
                    vehicleModel:"",
                    brandCompany:"",
                    partNum:"",
                    skuOnlyFlag:"true"
                })
                setSearchInput("")
                dispatch(resetAfterNewDemandSlip())
                setNewDSFlag(true)
                // passNextFlag(true)
                // setToggleFlag(false)
            }
        }
    },[isSuccess])

    // useEffect(()=>{
    //     console.log(`uOL:${JSON.stringify(updatedOrderList,null,4)}`)
    // },[updatedOrderList])

    // useEffect(()=>{
    //     console.log(`oL:${JSON.stringify(newDemandSlip.orderedProductList,null,4)}`)
    // },[newDemandSlip])

  return (
    <>
    {isLoading && <Loader/>}
    {newDSFlag &&
    <>
    <div className="modal-backdrop" ></div> 
        <div className='modal-container'>
            <div className="edit-btn"
                onClick={()=>handleModalClose()}
            >
            <AiOutlineClose />
            </div>
            <div className='ds-new-box'>

                <div className='ds-new-col'>

                <p><span>Ticket Number: </span>{`${newDemandSlip.ticketNumber}`}</p>
                <p><span>Date: </span>{`${newDemandSlip.date}`}</p>
                <br />

                <p><span>Delivery Partner Name: </span>{`${newDemandSlip.deliveryPartnerName}`}</p>
                <p><span>Distributor Name: </span>{`${newDemandSlip.distributorName}`}</p>
                {/* <br /> */}
                </div>

                <div className='ds-new-col'>
                <p>{`Prodcuts:`}</p>

                 {newDemandSlip.orderedProductList?.map((item,index)=>{
                     return(
                    <div className='ds-col-prod-list' key={index}>
                        <p><span>SKU: </span> {`${item.sku}`}</p>
                        <p><span>Product Full Name: </span> {`${item.productFullName}`}</p>
                        <p><span>Quantity: </span> {`${item.quantity}`}</p>
                        <br />
                    </div>
                    )
                })}
                </div>
            </div>

        </div>
    </>
    }
    <div className='card-container card-grid' style={{padding:"0", border:"none"}}>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor={`deliveryPartnerName`}>Delivery Partner Name</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'deliveryPartnerName'
                    id={`deliveryPartnerName`}
                    value = {deliveryPartnerName}
                    placeholder="Delivery Partner Name"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`distributorName`}>Distributor Name</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'distributorName'
                    id={`distributorName`}
                    value = {distributorName}
                    placeholder="Distributor Name"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group-flex" style={{marginBottom:`1rem`}}>
                <label>Products</label>
                {updatedOrderList.map((prod,index)=>{
                    return(
                        <div className='model-input-container' key={index}>
                            <section>

                            <input
                                className='card-form-control'
                                type='text'
                                style={{width:"99%",marginRight:"0.2rem"}}
                                name= {`sku`}
                                id={`sku ${index}`}
                                value = {prod.sku}
                                placeholder="Prod SKU"
                                autoComplete='off'
                                onChange={(e)=>onOrderItemChange(e,index)}
                                />
                             <input
                                className='card-form-control'
                                type='text'
                                style={{width:"99%",marginRight:"0.2rem"}}
                                name= {`productFullName`}
                                id={`productFullName ${index}`}
                                value = {prod.productFullName}
                                placeholder="Prod Full Name"
                                autoComplete='off'
                                onChange={(e)=>onOrderItemChange(e,index)}
                                />
                            </section>

                            <div style={{display:`flex`, 
                                flexDirection:`column`,
                                alignSelf:`flex-end`
                                }}
                            >

                            <div className="delete-btn" 
                                onClick={()=>handleItemDelete(index)}
                                >
                                <AiOutlineClose />
                            </div>
                             <input
                                className='card-form-control'
                                type='text'
                                style={{width:"99%",marginRight:"0.2rem"}}
                                name= {`quantity`}
                                id={`quantity ${index}`}
                                value = {prod.quantity}
                                placeholder="Qty"
                                autoComplete='off'
                                onChange={(e)=>onOrderItemChange(e,index)}
                                />

                            </div>

                        </div >
                    )
                })}
                    <br />
                <div className="add-btn"
                    onClick={handleAddItem}
                >
                    <AiOutlinePlus />
                </div>

            </div>
            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Generate
                </button>
            </div>
        </form>
        {/* /////////////////////////////// */}
        <form onSubmit={onSKUSubmit}>
            {/* Load Product Controls */}
            <div className="controlbox">

            <label style={{fontWeight:"bold"}}>Search</label>
            <div className="search-bar">
            <AiOutlineSearch className='search-icon'/>
            <input
                type="text"
                name="search"
                placeholder="Search for Product"
                onChange={debouncedResults}
                autoComplete='off'
                />

            </div>
            </div> 

            {/* Search by SKU */}
        <label style={{fontWeight:"bold"}}>Search by SKU</label>
        <div className="form-group" >
            <input type="text" 
                className='card-form-control'
                name= 'itemCode'
                id={`itemCode sku`}
                value = {skuData.itemCode}
                placeholder="Item Code"
                autoComplete='off'
                onChange={onSKUChange} 
                />
        </div>

        <div className="form-group">
            <input type="text" 
                className='card-form-control'
                name= 'vehicleModel'
                id={`vehicleModel sku`}
                value = {skuData.vehicleModel}
                placeholder="Vehicle Model"
                autoComplete='off'
                onChange={onSKUChange} />
        </div>

        <div className="form-group">
            <input type="text" 
                className='card-form-control'
                name= 'brandCompany'
                id={`brandCompany sku`}
                value = {skuData.brandCompany}
                placeholder="Brand Company"
                autoComplete='off'
                onChange={onSKUChange} />
        </div>

        <div className="form-group">
            <input type="text" 
                className='card-form-control'
                name= 'partNum'
                id={`partNum sku`}
                value = {skuData.partNum}
                placeholder="Part Number"
                autoComplete='off'
                onChange={onSKUChange} />
        </div>

        <div className="form-group">
            <button type="submit" className="submit-btn">
                Search
            </button>
        </div>

        {productData.length!==0 && !noMatch && 
        <div className="form-group">
            <label>Results {`(${productData.length})`}</label>
            <div className="search-result-container">

            <div 
            // className="card-form-control"
                // style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                {productData.map((item,i)=>{
                    return (
                        <div className='sku-list-item'
                        key={i}
                        onClick={()=>addItemfromSearch(item)}
                        >
                            <p>{i+1}</p>
                            
                            <section>
                                <p>
                                    {item.sku}
                                </p>
                                {/* <br /> */}
                                <p style={{fontWeight:"bold"}}>{item.productFullName}</p>
                            </section>
                        {/* <br /> */}
                        </div>
                    )
                })}
            </div>
            </div>
        </div>}
        
        {noMatch && <p>No Match Found</p>  }

        </form>
    </div>
    </>
  )
}

export default QuickProdSearchForm