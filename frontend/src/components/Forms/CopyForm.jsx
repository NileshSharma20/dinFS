import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import {formResponseSubmit} from "../../features/template/templateSlice"
import "./Form.css"

function CopyForm() {
    const dispatch = useDispatch(); 

    const [formData, setFormData] = useState({
        customer_name:'',
        pricePerUnit:'',
        pricePerUnitOE:'',
        unit:'',
        product:'',
    })

    const {customer_name, pricePerUnit, pricePerUnitOE, excDeliveryCharges, unit, product} = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(customer_name===null || pricePerUnit===null || unit===null){
            console.log(`Please enter valid data`)
        }else{
            dispatch(formResponseSubmit({
                customer_name,
                pricePerUnit,
                pricePerUnitOE,
                excDeliveryCharges,
                unit,
                product
            }))
        }
    }

  return (
    <>
        <div className='form-container left-border-form'>
        <form onSubmit={onSubmit}>

            <div className="form-grid">
                <div className="form-group">
                    <label>Name *</label>
                    <input type="text" 
                        className='form-control'
                        name= 'customer_name'
                        id='customer_name'
                        value = {customer_name}
                        placeholder="Customer's name"
                        autoComplete='off'
                        onChange={onChange} />
                </div>

                <div className="form-group">
                    <label>Price Per Unit *</label>
                    <input type="text" 
                        className='form-control'
                        name= 'pricePerUnit'
                        id='pricePerUnit'
                        value = {pricePerUnit}
                        placeholder='Price Per Unit'
                        onChange={onChange}
                        // onKeyPress={(e) => !/[0-9, ]/.test(e.key) && e.preventDefault()} 
                        />
                </div>

                <div className="form-group">
                    <label>Price Per Unit #2</label>
                    <input type="text" 
                        className='form-control'
                        name= 'pricePerUnitOE'
                        id='pricePerUnitOE'
                        value = {pricePerUnitOE}
                        placeholder='Alternate Price Per Unit'
                        onChange={onChange}
                        // onKeyPress={(e) => !/[0-9, ]/.test(e.key) && e.preventDefault()} 
                        />
                </div>

                <div className="form-group">
                    <label>Excluding Delivery Charges</label>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="excDeliveryCharges" 
                            id="true" 
                            value="true"
                            onChange={onChange} />
                        <label htmlFor="true">Yes</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="excDeliveryCharges" 
                            id="false" 
                            value="false"
                            onChange={onChange} />
                        <label htmlFor="false">No</label>
                        </div>
                    </div>
                </div>

                <div className="form-group ">
                    <label>Unit *</label>
                    
                    <div className='radio-group'>
                    <div className="radio-group-item">
                        <input type="radio" 
                            name="unit" 
                            id="piece" 
                            value="piece"
                            onChange={onChange} />
                        <label htmlFor="piece">Piece</label>
                    </div>

                    <div className="radio-group-item">
                        <input type="radio" 
                            name="unit" 
                            id="set" 
                            value="set"
                            onChange={onChange} />
                        <label htmlFor="set">Set</label>
                    </div>

                    <div className="radio-group-item">
                        <input type="radio" 
                            name="unit" 
                            id="litre" 
                            value="litre"
                            onChange={onChange} />
                        <label htmlFor="litre">Litre</label>
                    </div>

                    <div className="radio-group-item">
                        <input type="radio" 
                            name="unit" 
                            id="mL" 
                            value="mL"
                            onChange={onChange} />
                        <label htmlFor="mL">mL</label>
                    </div>

                    
                    </div>
                </div>

                <div className="form-group">
                    <label>Product</label>
                    <input type="text" 
                        className='form-control'
                        name= 'product'
                        id='product'
                        value = {product}
                        placeholder='Product'
                        onChange={onChange}
                        />
                </div>
            </div>


            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </div>
            {/* <p>* Mandatory Fields</p> */}

        </form>
        </div>
    </>
  )
}

export default CopyForm