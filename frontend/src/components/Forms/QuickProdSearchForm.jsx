import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { searchSKUProductsOnly } from '../../features/products/productSlice';

function QuickProdSearchForm() {
    const dispatch = useDispatch();

    const {productSKUData, noMatch, isSuccess, message} = useSelector((state)=>state.product)

    const [formData, setFormData] = useState({
        deliveryPartnerName: "",
        distributorName: "",
        orderedProductList: [{
            sku:"",
            productFullName:"",
            quantity:""
        }]
    })

    const [orderedProductList, setOrderedProductList] = useState([{
        sku:"",
        productFullName:"",
        quantity:""
    }])
    const [updatedOrderList, setUpdatedOrderList] = useState([{
        sku:"",
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

        // console.log(`newItem:${JSON.stringify(newItem,null,4)}`)
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
        // e.preventDefault()
        var orderList = [...updatedOrderList]
        var orderItem = orderList[i]
        // console.log(`test0:${JSON.stringify(orderItem,null,4)}`)
        orderItem[e.target.name] = e.target.value
        console.log(`test:${JSON.stringify(orderItem,null,4)}`)
        setUpdatedOrderList(orderList)
        console.log(`ordeList:${JSON.stringify(orderList,null,4)}`)
    }

    const handleAddItem=()=>{
        const modelList = [...updatedOrderList,{sku:"",productFullName:"",quantity:""}]
        setUpdatedOrderList(modelList)
    }

    const handleItemDelete = (index)=>{
        const modelList = [...updatedOrderList]
        modelList.splice(index,1)
        // console.log(modelList)
        setUpdatedOrderList(modelList)
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(deliveryPartnerName==="" || distributorName==="" || updatedOrderList.length===0 
            || !Array.isArray(updatedOrderList)){
            console.log(`Please enter valid data`)
        }else{
            const orderInfo = {
                deliveryPartnerName,
                distributorName,
                orderedProductList:updatedOrderList,
                // partNum,
                // compatibleModels:updatedModeOrderList.join(","),
                // mrp,
                // ...updatedMetaData
            }
            
            console.log(`formData:${JSON.stringify(orderInfo,null,4)}`)
            
            // dispatch(updateProduct({prodInfo,sku}))
        }
    }

    // Get SKU Products API call 
    const onSKUSubmit=(e)=>{
        e.preventDefault()
        
        if(skuData.itemCode===""){
        alert(`Please Enter Item Code`)
        }else{
        dispatch(searchSKUProductsOnly(skuData))
        }
    }

    useEffect(()=>{
        console.log(`updatedList:${JSON.stringify(updatedOrderList,null,4)}`)
    },[updatedOrderList])


  return (
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

            <div className="form-group" 
                style={{display:"flex", flexDirection:"column", justifyContent:"center"}}
            >
                <label>Products</label>
                {updatedOrderList.map((prod,index)=>{
                    return(
                        <div className='model-input-container' key={index}>
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
                             <input
                                className='card-form-control'
                                type='text'
                                style={{width:"99%",marginRight:"0.2rem"}}
                                name= {`quantity`}
                                id={`quantity ${index}`}
                                value = {prod.quantity}
                                placeholder="Prod Quantity"
                                autoComplete='off'
                                onChange={(e)=>onOrderItemChange(e,index)}
                            />

                            <div className="delete-btn" 
                                onClick={()=>handleItemDelete(index)}
                            >
                                <AiOutlineClose />
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

        <label style={{fontWeight:"bold"}}>Search by SKU</label>
        <div className="form-group">
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

        {productSKUData.length!==0 && !noMatch && 
        <div className="form-group">
            <label>Results</label>
            <div className="card-form-control"
                style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
            >
                {productSKUData.map((item,i)=>{
                    return (
                        <div className='sku-list-item'
                            key={i}
                            onClick={()=>addItemfromSearch(item)}
                        >

                        <p>
                            {item.sku}
                        </p>
                        <p>{item.productFullName}</p>
                        <br />
                        </div>
                    )
                })}
            </div>
        </div>}
        
        {noMatch && <p>No Match Found</p>  }

        </form>
    </div>
  )
}

export default QuickProdSearchForm