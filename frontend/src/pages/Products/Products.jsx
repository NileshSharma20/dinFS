import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import {createProductDataJSON, getProducts} from "../../features/products/productSlice"
import Papa from 'papaparse'

import "./Products.css"
import Dropdown from '../../components/Dropdown/Dropdown';

function Products() {
  const dispatch = useDispatch();
  const {productData} =useSelector(
    (state)=>state.product
  )

  const [itemData, setItemData] = useState({
    saveFile: false,
    itemCode:""
  })
  
  const {saveFile, itemCode} = itemData

  const prodCodeList = [{
    name:"Shocker",
    code:"SKR",
  },
  {
    name:"Brake-Shoe",
    code:"BSH",
  },
  {
    name:"Disc-Pad",
    code:"DPD",
  },
  {
    name:"Mobil-Filter",
    code:"MOF",
  },
  {
    name:"Ball-Racer",
    code:"RSR",
  },
  {
    name:"Bendex",
    code:"BDX",
  },
  {
    name:"Foot-Rest",
    code:"FTR",
  },
  {
    name:"Air-Filter",
    code:"ARF",
  },
  {
    name:"Side-Stand",
    code:"SSN",
  },
  {
    name:"Main-Stand",
    code:"MSN",
  },
  ]

  /////////////////////////////////////////////////
  //////// Functions /////////////////////////////
  ////////////////////////////////////////////////

  const handleCSVFile=(e)=>{
      Papa.parse(e.target.files[0],{
      header:true,
      skipEmptyLines: true,
      complete: function(res){
        // setCsvData(res.data)
        }
      })
    }

  const onChange=(e)=>{
    setItemData((prevState)=>({
        ...prevState,
        [e.target.name]:e.target.value
    }))
  }
    
  const onSubmit=(e)=>{
    e.preventDefault()
      
    if(itemCode==="" || saveFile===null){
      alert(`Please enter Item Code`)
    }else{
      dispatch(getProducts(itemData))
    }
  }


  useEffect(()=>{
    console.log(`itemData=${JSON.stringify(itemData,null,4)}`)
  },[itemData])

  return (
    <div className='data-container'>

      <div className="form-container csv-upload">
        <form onSubmit={onSubmit}>

        <div className="form-grid">

          {/* <div className="form-group">

            <label>File</label>
            <input className='file-input'
              type="file"
              name="file"
              accpet=".csv"
              onChange={handleCSVFile}
              ></input>
          </div> */}

          <div className="form-group">
            <label>Item Code</label>
            {/* <select name="itemCode" id="itemCode" onChange={onChange}>
              {prodDropdownList.map((option,index)=>{
                <option value={option.code} key={index}>{option.name}</option>
              })}
            </select> */}
            {/* <input type="text"
              name='itemCode'
              id='itemCode'
              value={itemCode}
              placeholder='Item Code'
              onChange={onChange}
            /> */}

            <Dropdown  
              dataList={prodCodeList} 
              passItemCode={setItemData}
              />
          </div>

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
              {/* <h3 style={{fontSize:"1.5rem"}}>position</h3> */}
              <h3 style={{fontSize:"1.5rem"}}>sku</h3>
              <h3 style={{fontSize:"1.5rem"}}>mrp</h3>
              <h3 style={{fontSize:"1.5rem"}}>compatibileModels</h3>
            </div>
            {productData?.map((item,index)=>
            <div className="productCol" key={index}>
              <h3>{item.vehicleModel}</h3>
              <h3>{item.brandCompany}</h3>
              {/* <h3>{item.metaData.position}</h3> */}
              <h3>{item.sku}</h3>
              <h3>{item.mrp}</h3>
              <h3>{item.compatibileModels.map((item,i)=>{return <p key={i}>{item}</p>})}</h3>
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