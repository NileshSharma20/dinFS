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
            productBrandName:"",
            productPartNumber:"",
            quantity:"",
            unit:'PC',
        }]
    })

    const [updatedOrderList, setUpdatedOrderList] = useState([{
        sku:"MANUAL",
        productFullName:"",
        productBrandName:"",
        productPartNumber:"",
        quantity:"",
        unit:'PC',
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
            sku:"MANUAL",
            productFullName:"",
            productBrandName:"",
            productPartNumber:"",
            quantity:"",
            unit:'PC',
        }])
        setFormData({
            deliveryPartnerName: "",
            distributorName: "",
            orderedProductList: [{
                sku:"",
                productFullName:"",
                productBrandName:"",
                productPartNumber:"",
                quantity:"",
                unit:'PC',
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
        let prodBrand = item.productFullName.split(" ")[2]
        let prodPartNum = item.productFullName.split(" ")[3]
        let newProdFullName = item.productFullName.split(" ").slice(0,2).join(" ")

        // console.log(`brand: ${prodBrand}\npartNum:${prodPartNum}`)
        const newItem = {
            sku: item.sku,
            productFullName: newProdFullName,
            productBrandName: prodBrand,
            productPartNumber: prodPartNum,
            quantity:"",
            unit:"PC"
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

    const handleBrandNameDelete =(i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        const skuSplitList = orderItem.sku.split("-")

        let newSku = skuSplitList.slice(0,2)
        
        skuSplitList.length===4 ? 
            (newSku = newSku.join("-") +"-"+ orderItem.sku.split("-")[3])
            :
            (newSku = newSku.join("-"))

        // console.log(`newSku:${newSku}`)
        
        orderItem.sku=newSku
        orderItem.productBrandName=""

        setUpdatedOrderList(orderList)
    }

    const handlePartNumberDelete =(i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        
        let newSku = orderItem.sku.split("-").slice(0,-1)
        newSku = newSku.join("-")
        // console.log(`newSku:${newSku}`)
        
        orderItem.sku=newSku
        orderItem.productPartNumber=""

        setUpdatedOrderList(orderList)
    }

    const onOrderItemChange=(e,i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        // console.log(`oI:${JSON.stringify(orderItem,null,4)}`)
        if(e.target.name==="quantity"){
            const numValue = e.target.value.replace(/\D/g, "")
            orderItem[e.target.name] = numValue
        }else if(e.target.name==="productPartNumber"){
            let newSku = orderItem.sku.split("-").slice(0,3)
            newSku = newSku.join("-")
            newSku = newSku+"-"+e.target.value.toUpperCase()
            // console.log(`newSku:${newSku}\npN:${e.target.value}`)
            
            orderItem.sku=newSku
            orderItem[e.target.name]=e.target.value.toUpperCase()
        }else{
            orderItem[e.target.name] = e.target.value.toUpperCase()
        }

        // console.log(JSON.stringify(orderItem,null,4))
        setUpdatedOrderList(orderList)
    }

    const handleAddItem=()=>{
        const modelList = [...updatedOrderList,
                                    {sku:"MANUAL",
                                    productFullName:"",
                                    quantity:"",
                                    unit:"PC"
                                }]
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
                                                    ||prod.quantity===""
                                                    ||prod.unit===""))

        const finalOrderList = updatedOrderList.map((orderItem)=>{
                                    let finalProductFullName = orderItem.productFullName
                                    orderItem.productBrandName &&
                                        (finalProductFullName=finalProductFullName+" "+orderItem.productBrandName)
                                    
                                    orderItem.productPartNumber &&
                                        (finalProductFullName=finalProductFullName+" "+orderItem.productPartNumber)
                                    
                                    // delete orderItem.productBrandName
                                    // delete orderItem.productPartNumber
                                    
                                    return  {
                                        sku:orderItem.sku,
                                        productFullName:finalProductFullName,
                                        quantity:parseInt(orderItem.quantity),
                                        unit:orderItem.unit
                                    }
                                })

        console.log(`fOL:${JSON.stringify(finalOrderList,null,4)}`)

        if(emptyOrderListObj.length>0){
            return alert('Empty Field/s')
        }
        
        if(deliveryPartnerName==="" || distributorName==="" || updatedOrderList.length===0 
            || !Array.isArray(updatedOrderList)){
            return alert(`Please enter valid data`)
        }else{
            const orderInfo = {
                deliveryPartnerName:deliveryPartnerName.toUpperCase(),
                distributorName:distributorName.toUpperCase(),
                orderedProductList:finalOrderList,
            }
            
            console.log(`formData:${JSON.stringify(orderInfo,null,4)}`)
            
            // dispatch(generateDemandSlip(orderInfo))
            
        }
    }

    // Get SKU Products API call 
    const onSKUSubmit=(e)=>{
        e.preventDefault()

        let cleanedSKUData = {
            itemCode:skuData.itemCode.trim(),
            vehicleModel:skuData.vehicleModel.trim(),
            brandCompany:skuData.brandCompany.trim(),
            partNum:skuData.partNum.trim(),
            skuOnlyFlag:"true"
        }
        
        if(skuData.itemCode===""){
            return alert(`Please Enter Item Code`)
        }else{
            setSearchInput("")
            dispatch(searchSKUProducts(cleanedSKUData))
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
                        sku:"",
                        productFullName:"",
                        quantity:"",
                        unit:"PC"
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
                        <p><span>Quantity: </span> {`${item.quantity} ${item.unit}`}</p>
                        {/* <p><span></span></p> */}
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
                                placeholder="Product"
                                autoComplete='off'
                                onChange={(e)=>onOrderItemChange(e,index)}
                                />
                            
                            {prod.sku!=="MANUAL" &&
                                <div
                                style={{
                                    display:`grid`,
                                    flexDirection:`none`,
                                    gridTemplateColumns:`1fr 1fr`,
                                    columnGap:`0.1rem`,
                                    width:`calc(100% - 0.2rem)`,
                                    // border:`1px solid red`
                                }}
                            >
                                <div style={{position:`relative`}}>
                                    <div className="delete-btn" 
                                        onClick={()=>handleBrandNameDelete(index)}
                                    >
                                    <AiOutlineClose />
                                    </div>

                                    <input
                                        className='card-form-control'
                                        type='text'
                                        style={{width:"100%"}}
                                        name= {`productBrandName`}
                                        id={`productBrandName ${index}`}
                                        value = {prod.productBrandName}
                                        placeholder="Brand Name"
                                        readOnly
                                        />   
                                </div> 

                                <div style={{position:`relative`}}>
                                    <div className="delete-btn" 
                                        onClick={()=>handlePartNumberDelete(index)}
                                    >
                                    <AiOutlineClose />
                                    </div>
                                    <input
                                        className='card-form-control'
                                        type='text'
                                        style={{width:"100%"}}
                                        name= {`productPartNumber`}
                                        id={`productPartNum ${index}`}
                                        value = {prod.productPartNumber}
                                        placeholder="Part Number"
                                        readOnly
                                        />                          
                                </div>

                            </div>}

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

                            <div className="card-form-quantity-box">

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

                            
                            <select name='unit' id={`unit${index}`}
                                defaultValue={"PC"}
                                onChange={(e)=>onOrderItemChange(e,index)}
                                >
                                <option value="PC">PC</option>
                                <option value="SET">SET</option>
                                <option value="PAIR">PAIR</option>
                                <option value="BOX">BOX</option>
                                <option value="ML">ML</option>
                                <option value="L">L</option>
                            </select>
                            
                            </div>
                            
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