import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import {createProductDataJSON} from "../../features/products/productSlice"
import Papa from 'papaparse'

import "./Products.css"

function Products() {
  const dispatch = useDispatch();
  const {productData, brandsList} =useSelector(
    (state)=>state.product
  ) 

  const [csvData, setCsvData] = useState([])
  const [finalData, setFinalData]= useState([])
  const [productTypeForm, setProductTypeForm] = useState("") 

  const prodDropdownList = [{
    name:"Shocker",
    code:"SKR",
  },{
    name:"Brake-Shoe",
    code:"BRK",
  }]

  /////////////////////////////////////////////////
  //////// Functions /////////////////////////////
  ////////////////////////////////////////////////

  const handleCSVFile=(e)=>{
      Papa.parse(e.target.files[0],{
      header:true,
      skipEmptyLines: true,
      complete: function(res){
        setCsvData(res.data)
        }
      })
    }
    
    const onSubmit=(e)=>{
      e.preventDefault()
      
      if(csvData.length===0 && productTypeForm===""){
        alert(`Fill all the fields`)
      }else{
        
        dispatch(createProductDataJSON(finalData))
    }
  }

  useEffect(()=>{
    if(productTypeForm!=="" && csvData.length!==0){
      const prodData = csvData.map((item)=>{return{...item, ProductType:productTypeForm}})
      setFinalData(prodData)
    }
  },[productTypeForm, csvData])

  return (
    <div className='data-container'>

      <div className="product-filter-container">
        <h1>Filter Box</h1>
      </div>


      <div className='grid'>
        {/* <h1>Product Grid</h1> */}
        {brandsList.map((brand,index)=>
        
          <div key={index}>

            {productData.length>0 && 
              <div className='productCol-conatiner'>
              <h1>{brand.brandName} {productData[0].productType} ({productData?.filter((i)=>i.productBrand===brand.brandName).length})</h1>
              {productData.filter((i)=>i.productBrand===brand.brandName).map((item,index)=>
                <div className='productCol' key={index}>
                  <h3>{item.productName}</h3>
                  
                  <h3>{item.price}</h3>
                </div>)}
              </div>}

          </div>
        )}

        {productData.length>0 && 
        <div className='productCol-conatiner'>
          <h1>Un-named {productData[0].productType} ({productData?.filter((i)=>i.productBrand==="").length})</h1>
          {productData.filter(i=>i.productBrand==="").map((item,index)=>
            <div className='productCol' key={index}>
            <h3>{item.productName}</h3>
            
            <h3>{item.price}</h3>
          </div>
          ) }
        </div>
        }

    
      </div>
        
      <div className="form-container csv-upload">
        <form onSubmit={onSubmit}>

        <div className="form-grid">

          <div className="form-group">

            <label>File</label>
            <input className='file-input'
              type="file"
              name="file"
              accpet=".csv"
              onChange={handleCSVFile}
              ></input>
          </div>

          <div className="form-group">
            <label>Product</label>
            <input list="data" 
              onChange={(e)=>setProductTypeForm(e.target.value)}
              placeholder='Select product...'/>

              <datalist id="data">
                {prodDropdownList.map((item,index)=>
                  <option id={index}>{item.name}</option>
                  )}
              </datalist>

          </div>

          <div className="form-group">
                <button type="submit" className="submit-btn">
                   Upload
                </button>
            </div>

        </div>
      </form>
      </div>

    </div>
  )
}

export default Products