import React,{ useState, useEffect } from 'react'
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { updateProduct } from '../../features/products/productSlice';

function ProductForm({initialValue, setFlag}) {
    const dispatch = useDispatch();

    const {isSuccess, message} = useSelector((state)=>state.product)

    const [formData, setFormData] = useState({
        itemCode: initialValue.itemCode,
        vehicleModel: initialValue.vehicleModel,
        brandCompany: initialValue.brandCompany,
        partNum: initialValue.partNum,
        sku: initialValue.sku,
        compatibleModels: initialValue.compatibleModels,
        qty: initialValue?.qty,
        mrp: initialValue.mrp,
        metaData: initialValue?.metaData
    })

    const [updatedMetaData, setUpdatedMetaData] = useState({...initialValue?.metaData})
    const [updatedModels, setUpdatedModels] = useState([...initialValue.compatibleModels])

    const {itemCode, vehicleModel, brandCompany, partNum, sku, mrp} = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onMetaDataChange=(e)=>{
        setUpdatedMetaData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onModelItemChange=(e,i)=>{
        const modelList = [...updatedModels]
        modelList[i] = e.target.value
        // console.log(modelList)
        setUpdatedModels(modelList)
    }

    const handleAddItem=()=>{
        const modelList = [...updatedModels,""]
        setUpdatedModels(modelList)
    }

    const handleItemDelete = (index)=>{
        const modelList = [...updatedModels]
        modelList.splice(index,1)
        // console.log(modelList)
        setUpdatedModels(modelList)
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(itemCode===null || vehicleModel===null || brandCompany===null ||
            partNum===null || mrp===null){
            console.log(`Please enter valid data`)
        }else{
            const prodInfo = {
                itemCode,
                vehicleModel,
                brandCompany,
                partNum,
                compatibleModels:updatedModels.join(","),
                mrp,
                ...updatedMetaData
            }
            
            // console.log(`formData:${JSON.stringify(prodInfo,null,4)}`)
            
            dispatch(updateProduct({prodInfo,sku}))
        }
    }

    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////
    useEffect(()=>{
        if(isSuccess && message===`Updated ${initialValue.sku}`){
            setFlag(false)
        }
    },[message])

  return (
    <div className='card-container' style={{padding:"0", border:"none"}}>
        <form onSubmit={onSubmit}>
            
            <div className="form-group">
                <label htmlFor={`itemCode`}>Item Code</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'itemCode'
                    id={`itemCode`}
                    value = {itemCode}
                    placeholder="itemCode"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`vehicleModel`}>Vehicle Model</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'vehicleModel'
                    id={`vehicleModel`}
                    value = {vehicleModel}
                    placeholder="vehicleModel"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`brandCompany`}>Brand Company</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'brandCompany'
                    id={`brandCompany`}
                    value = {brandCompany}
                    placeholder="brandCompany"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`partNum`}>Part Number</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'partNum'
                    id={`partNum`}
                    value = {partNum}
                    placeholder="partNum"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label >SKU</label>
                <div className="card-form-control">
                    {sku}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`mrp`}>MRP</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'mrp'
                    id={`mrp`}
                    value = {mrp}
                    placeholder="mrp"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group" 
                style={{display:"flex", flexDirection:"column", justifyContent:"center"}}
            >
                <label>Compatible Models</label>
                {updatedModels.map((model,index)=>{
                    return(
                        <div className='model-input-container' key={index}>
                            <input
                                className='card-form-control'
                                style={{width:"90%"}}
                                name= {model}
                                id={`model ${index}`}
                                value = {model}
                                placeholder="Model SKU"
                                autoComplete='off'
                                onChange={(e)=>onModelItemChange(e,index)}
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
            
            {initialValue?.metaData &&
            <div className="form-group">
                <label>Meta Data</label>
                <div className="card-form-control" 
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    {Object.keys(initialValue?.metaData).map((field,index)=>{
                        return(
                            <React.Fragment key={index}>
                                <label htmlFor={field}>{field}</label>
                                <input type="text" 
                                    className='card-form-control'
                                    name={field}
                                    id={field}
                                    value = {updatedMetaData[field]}
                                    placeholder={field}
                                    autoComplete='off'
                                    onChange={onMetaDataChange} />
                            {/* <p>{field}:{initialValue?.metaData[field]}</p>  */}
                            </React.Fragment>
                            )
                        })}
                </div>
            </div>
            }

            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Update
                </button>
            </div>
        
        </form>
    </div>
  )
}

export default ProductForm