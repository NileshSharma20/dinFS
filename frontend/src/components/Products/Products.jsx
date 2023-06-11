import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import {createProductDataJSON} from "../../features/products/productSlice"
import Papa from 'papaparse'

import "./Products.css"

function Products() {
  const dispatch = useDispatch();
  const {productData} =useSelector(
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
      
      if(csvData.length===0){
        alert(`Fill all the fields`)
      }else{
        console.log(`OK`)
        dispatch(createProductDataJSON(csvData))
    }
  }

  useEffect(()=>{
    // if(productTypeForm!=="" && csvData.length!==0){
      // const prodData = csvData.map((item)=>{return{...item, ProductType:productTypeForm}})
      // setFinalData(prodData)
    // }

    // console.log(`${JSON.stringify(csvData,null,4)}`)
  },[csvData])

  return (
    <div className='data-container'>

      {/* <div className="product-filter-container">
        <h1>Filter Box</h1>
      </div> */}

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

      
        

          {/* <div className="form-group">
            <label>Product</label>
            <input list="data" 
              onChange={(e)=>setProductTypeForm(e.target.value)}
              placeholder='Select product...'/>

              <datalist id="data">
                {prodDropdownList.map((item,index)=>
                  <option id={index}>{item.name}</option>
                  )}
              </datalist>

          </div> */}

          <div className="form-group">
                <button type="submit" className="submit-btn">
                   Upload
                </button>
            </div>

        </div>
      </form>
      </div>

      <div className='grid'>
        <div className="productCol-conatiner">
          <div className="productCol">
              <h3 style={{fontSize:"1.5rem"}}>vehicleModel</h3>
              <h3 style={{fontSize:"1.5rem"}}>brandCompany</h3>
              <h3 style={{fontSize:"1.5rem"}}>position</h3>
              <h3 style={{fontSize:"1.5rem"}}>sku</h3>
              <h3 style={{fontSize:"1.5rem"}}>colour</h3>
              <h3 style={{fontSize:"1.5rem"}}>compatibileModels</h3>
            </div>
            {productData?.map((item,index)=>
            <div className="productCol" key={index}>
              <h3>{item.vehicleModel}</h3>
              <h3>{item.brandCompany}</h3>
              <h3>{item.metaData.position}</h3>
              <h3>{item.sku}</h3>
              <h3>{item.metaData.colour}</h3>
              <h3>{item.compatibileModels}</h3>
            </div>
            )
            }
        </div>
        

    
      </div>

      {/* <div>
        <h2>shockerDownload</h2>

        <a
          href={ExamplePdf}
          download="Example-PDF-document"
          target="_blank"
          rel="noreferrer"
        >
          <button>Download .pdf file</button>
        </a>
      </div> */}

    </div>
  )
}

export default Products