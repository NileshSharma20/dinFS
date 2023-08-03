import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/products/productSlice';

function Product() {
    const params = useParams()
    const dispatch = useDispatch();

    const {productData} = useSelector((state)=>state.product)
    // const copyProdData = [...productData]
    // const [productData, setProductData] = useState([])
    const filteredProduct = productData?.filter(prod=>prod.sku===params.sku)[0]
    // const un

    useEffect(()=>{
        dispatch(getProducts({
            saveFile: false,
            itemCode:params.sku.split("-")[0]
          }))
        // const prodList = JSON.parse(localStorage.getItem('productData'))
        // setProductData(prodList)
        
    },[])
    
    // useEffect(()=>{
    //     console.log(`fP:${JSON.stringify(filteredProduct,null,4)}`)
    // },[filteredProduct])

  return (
    <div className="product-container">
        <h1>Product</h1>
        {/* <div> */}
            <p>itemCode:{filteredProduct?.itemCode} </p>
            <p>vehicleModel:{filteredProduct?.vehicleModel} </p>
            <p>brandCompany: {filteredProduct?.brandCompany} </p>
            <p>partNum:{filteredProduct?.partNum} </p>
            <p>sku:{filteredProduct?.sku} </p>
            <p>mrp:{filteredProduct?.mrp} </p>
            <br />
            <p>compatibleModels:</p>
            {filteredProduct?.compatibleModels.map((model,index)=>{
                return <p key={index}>{model}</p>
            })}
            <br />
            <p>metaData:</p>
            {filteredProduct?.metaData && Object.keys(filteredProduct?.metaData).map((field,index)=>{
                return(
                    <p key={index}>{field}:{filteredProduct?.metaData[field]}</p>
                )
            })}
        {/* </div> */}
    </div>
  )
}

export default Product