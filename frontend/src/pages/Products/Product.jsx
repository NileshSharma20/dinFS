import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchSKUProducts } from '../../features/products/productSlice';
import { logOutUser } from '../../features/auth/authSlice';
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'

import "./Products.css"

import Loader from '../../components/Loader/Loader';
import ProductForm from '../../components/Forms/ProductForm';
import useAuth from '../../hooks/useAuth';

function Product() {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [editFlag, setEditFlag] = useState(false)

    const {productData, isLoading, message} = useSelector((state)=>state.product)
    const filteredProduct = productData?.filter(prod=>prod.sku===params.sku)[0]

    const { token } = useSelector((state)=>state.auth)
    const { isAdmin } = useAuth()

    useEffect(()=>{
        if(!token){
            dispatch(logOutUser())
            navigate("/")
        }
        dispatch(searchSKUProducts({
            itemCode:params.sku.split("-")[0],
            vehicleModel:params.sku.split("-")[1],
            brandCompany:params.sku.split("-")[2],
            partNum:params.sku.split("-")[3]
          }))        
    },[])

    useEffect(()=>{
        if(!editFlag && message===`Updated ${params.sku}`){
            dispatch(searchSKUProducts({
                itemCode:params.sku.split("-")[0],
                vehicleModel:params.sku.split("-")[1],
                brandCompany:params.sku.split("-")[2],
                partNum:params.sku.split("-")[3]
              }))   
        }
    },[editFlag])

  return (
    <>

    {isLoading && <Loader />}
    <div className="product-container">
        {isAdmin && 
            <div className='edit-btn' 
                onClick={()=>setEditFlag(!editFlag)}>
                {editFlag?<AiOutlineClose />:<FiEdit2 />}
            </div>
        }

        <h1>Product</h1>
        
        {editFlag?
        <ProductForm initialValue={filteredProduct} setFlag={setEditFlag}/>
        :
        <>
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
        </>}

    </div>
    </>
  )
}

export default Product