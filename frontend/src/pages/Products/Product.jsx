import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/products/productSlice';
import Loader from '../../components/Loader/Loader';
import { logOutUser } from '../../features/auth/authSlice';

function Product() {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const {productData, isLoading} = useSelector((state)=>state.product)
    const filteredProduct = productData?.filter(prod=>prod.sku===params.sku)[0]

    const { token, verified } = useSelector((state)=>state.auth)

    useEffect(()=>{
        if(!token){
            dispatch(logOutUser())
            navigate("/")
        }
        dispatch(getProducts({
            saveFile: false,
            itemCode:params.sku.split("-")[0]
          }))        
    },[])

  return (
    <>
    {isLoading && <Loader />}
    <div className="product-container">
        <h1>Product</h1>

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
    </div>
    </>
  )
}

export default Product