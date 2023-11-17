import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { searchSKUProductsOnly } from '../../features/products/productSlice';

function QuickProdSearchForm() {
    const dispatch = useDispatch();

    const {productSKUData, noMatch, isSuccess, message} = useSelector((state)=>state.product)

    const [skuData, setSKUData] = useState({
        itemCode:"",
        vehicleModel:"",
        brandCompany:"",
        partNum:"",
        skuOnlyFlag:"true"
      })

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const copyText=(text)=>{
        navigator.clipboard.writeText(text)
    }

    const onSKUChange=(e)=>{
        setSKUData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
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
  return (
    <div>
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
            <label>SKU</label>
            <div className="card-form-control"
                style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
            >
                {productSKUData.map((item,i)=>{
                    return (
                    <p className='sku-list-item'
                    key={i}
                    onClick={()=>copyText(item.sku)}
                    >
                        {item.sku}
                    </p>
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