import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AiOutlinePlus, AiOutlineClose,AiOutlineSearch } from "react-icons/ai"
import { resetSearchProducts,searchProducts, searchSKUProducts } from '../../features/products/productSlice';
import { generateDemandSlip, getFilteredDemandSlips, resetAfterNewDemandSlip } from '../../features/orders/orderSlice';
import Loader from '../Loader/Loader';

import debouce from "lodash.debounce";
import { setPreviewData } from '../../features/billing/billingSlice';

function GenerateBillForm({setModalFlag}) {
    const dispatch = useDispatch();

    const { productData, noMatch } = useSelector((state)=>state.product)
    const { newDemandSlip, isSuccess, isLoading, message } = useSelector((state)=>state.orders)

    const [newDSFlag, setNewDSFlag] = useState(false)

    const [searchInput, setSearchInput] = useState("");

    const tempDeliveryPartnerList=[
        "AAKASH",
        "GOUTAM",
        "SOUMEN",
        "BISU",
        "VINAY",
        "VIKAS",
        "DUTTA",
        "PINTU",
    ]

    const tempDistList = [
        "GAUTAM",
        "OM",
        "DUBEY",
        "PAPPU",
        "AS AUTO",
        "SAI AUTO",
        "CITY AUTO",
        "HP AUTO",
        "ROYAL AUTO DISTRIBUTORS",
        "UNIVERSAL AUTO",
        "V2",
        "KK ENTERPRISE",
        "TRADING AUTO",
        "SATYAM",
        "NEW HONDA",
        "AUTO IMPORTING",
        "PATODIYA",
        "MANOJ",
        "MOUSIN",
        "BUHRANI",
    ]

    const tempDiscountList =[
        0,
        5,
        10,
        15,
        20,
        25
    ]

    const [formData, setFormData] = useState({
        orderedProductList: [{
            sku:"",
            productFullName:"",
            quantity:"",
            unit:'PC',
            price:0,
            prodDiscount:0,
        }],
        extraDiscount:0,
        totalCost:0
    })

    const [updatedOrderList, setUpdatedOrderList] = useState([{
        sku:"MANUAL",
        productFullName:"",
        productBrandName:"",
        productPartNumber:"",
        quantity:"",
        unit:'PC',
        // price:,
        // prodDiscount:0,
    }])

    const [skuData, setSKUData] = useState({
        itemCode:"",
        vehicleModel:"",
        brandCompany:"",
        partNum:"",
        skuOnlyFlag:"true"
    })
      
    const { deliveryPartnerName, distributorName, dataStatus, totalCost, extraDiscount } = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    // const copyText=(text)=>{
    //     navigator.clipboard.writeText(text)
    // }
    const handleSearchChange = (e) => {
        e.preventDefault(e)

        setSearchInput(e.target.value);
        setSKUData({
            itemCode:"",
            vehicleModel:"",
            brandCompany:"",
            partNum:"",
            skuOnlyFlag:"true"
        })
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
            dataStatus:"complete",
            orderedProductList: [{
                sku:"",
                productFullName:"",
                productBrandName:"",
                productPartNumber:"",
                quantity:"",
                unit:'PC',
            }],
            extraDiscount:0,
            totalCost:0
        })

        dispatch(resetSearchProducts())
    }

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
            unit:"PC",
            // price:0,
            // prodDiscount:0,
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
        if(e.target.name==='extraDiscount'){
            const numValue = e.target.value.replace(/\D/g, "") || '0'
            setFormData((prevState)=>({
                ...prevState,
                [e.target.name]:parseInt(numValue)
            }))   
        }else{
            setFormData((prevState)=>({
                ...prevState,
                [e.target.name]:e.target.value
            }))        
        }
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
        // skuSplitList.length===4 ? 
        //     (newSku = newSku.join("-") +"-"+ orderItem.sku.split("-")[3])
        //     :
        newSku = newSku.join("-")

        if(skuSplitList.length===4){
            orderItem.productPartNumber=""
        }

        // console.log(`newSku:${newSku}`)
        
        orderItem.sku=newSku
        orderItem.productBrandName=""

        setUpdatedOrderList(orderList)
    }

    const handlePartNumberDelete =(i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        
        const splitSKU = orderItem.sku.split("-")
        let newSku 
        // newSku = newSku.join("-")
        
        if( !(splitSKU.length===2) && orderItem.productPartNumber!=="" ){
            newSku = splitSKU.slice(0,-1).join("-")
            orderItem.sku=newSku
        }
        // console.log(`newSku:${newSku}`)
        
        orderItem.productPartNumber=""

        setUpdatedOrderList(orderList)
    }

    const onOrderItemChange=(e,i)=>{
        let orderList = [...updatedOrderList]
        let orderItem = orderList[i]
        // console.log(`oI:${JSON.stringify(orderItem,null,4)}`)
        if(e.target.name==="quantity" 
            || e.target.name==="price" 
            || e.target.name==="prodDiscount"){
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
                                    unit:"PC",
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
        emptyOrderListObj = updatedOrderList.filter(prod=>(!prod.productFullName
                                                    ||!prod.quantity
                                                    ||!prod.unit
                                                    ||!prod.price        
                                                ))
        // var dataStatusCheck = "complete"

        const billingProdList = updatedOrderList.map((item)=>{
            let prodDisc = item.prodDiscount || 0
            return {...item,prodDiscount:prodDisc}
        })
        // console.log(`fOL:${JSON.stringify(finalOrderList,null,4)}`)

        if(emptyOrderListObj.length>0){
            return alert('Empty Field/s')
        }

        if(!formData.totalCost){
            return alert('Total Cost should not be 0')
        }
        
        if(updatedOrderList.length===0
            || !Array.isArray(updatedOrderList)){
            return alert(`Please enter valid data`)
        }else{
            const orderInfo = {
                billingProductList: billingProdList,
                extraDiscount: formData.extraDiscount,
                totalCost: formData.totalCost
            }
            
            console.log(`formData:${JSON.stringify(orderInfo,null,4)}`)
            setModalFlag(true)
            dispatch(setPreviewData(orderInfo))
            
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

    useEffect(()=>{
        let checkTotalPrice = updatedOrderList.reduce((res,item)=>{
            let discountInt = (100 - (item.prodDiscount || 0))/100
            let discountedPrice = parseFloat((item.price*discountInt).toFixed(2))
            let totalItemPrice = discountedPrice*item.quantity
    
            return res+totalItemPrice
        },0)
    
        checkTotalPrice = Math.round(checkTotalPrice)-formData.extraDiscount
        setFormData((prevState=>({
            ...prevState,
            totalCost:checkTotalPrice
        })))
    },[updatedOrderList, formData.extraDiscount])

    // Success reset
    useEffect(()=>{
        if(isSuccess && message!==""){
            // dispatch(resetOrders())
            dispatch(getFilteredDemandSlips())

            if(isSuccess){
                setFormData({
                    deliveryPartnerName: "",
                    distributorName: "",
                    dataStatus:"complete",
                    orderedProductList: [{
                        sku:"",
                        productFullName:"",
                        quantity:"",
                        unit:"PC"
                    }],
                    extraDiscount:0,
                    totalCost:0
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
                <label htmlFor={`extraDiscount`}>Extra Discount (Rs.)</label>
                <input type="text" 
                    className='card-form-control'
                    // list='extraDiscountList'
                    name= 'extraDiscount'
                    id={`extraDiscount`}
                    value = {extraDiscount}
                    placeholder="Extra Discount (Rs.)"
                    autoComplete='off'
                    onChange={onChange} />
                {/* <datalist id='deliveryPartnerNameList'>
                    {tempDeliveryPartnerList.map((parterName,index)=>{
                        return(
                            <option
                                key={index}
                                value={parterName}
                            >
                                {parterName}
                            </option>
                        )
                    })}
                </datalist> */}
            </div>

            <label>Products</label>
            <div className="form-group-flex" style={{marginBottom:`1rem`}}>
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
                                readOnly
                                />

                            {prod.sku!=="MANUAL"?
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
                                readOnly
                                />
                            :
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
                            }
                            
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

                            {/* changes */}
                            <div
                                style={{
                                    display:`grid`,
                                    flexDirection:`none`,
                                    gridTemplateColumns:`1fr 1fr`,
                                    columnGap:`0.1rem`
                                }}
                            >
                                <div style={{position:`relative`}}>
                                    <input
                                        className='card-form-control'
                                        type='text'
                                        style={{width:"100%"}}
                                        name= {`price`}
                                        id={`price ${index}`}
                                        value = {prod.price}
                                        placeholder="Price (Rs.)"
                                        onChange={(e)=>onOrderItemChange(e,index)}
                                        />   
                                </div> 
                                <div style={{position:`relative`}}>
                                    <input
                                        className='card-form-control'
                                        type='text'
                                        list='discountList'
                                        style={{width:"100%"}}
                                        name= {`prodDiscount`}
                                        id={`prodDiscount ${index}`}
                                        value = {prod.prodDiscount}
                                        placeholder="Discount (%)"
                                        onChange={(e)=>onOrderItemChange(e,index)}
                                        /> 

                                    <datalist id='discountList'>
                                        {tempDiscountList.map((discVal,index)=>{
                                            return(
                                                <option key={index} value={discVal}>
                                                    {discVal}
                                                </option>
                                            )
                                        })}
                                    </datalist> 
                                </div> 
                            </div>
                            {/* changes */}

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
                Total: Rs.{formData.totalCost || 0}
            </div>
            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Preview
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

export default GenerateBillForm