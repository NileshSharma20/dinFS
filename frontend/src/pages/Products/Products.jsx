import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { getProducts, resetProducts} from "../../features/products/productSlice"
// import Papa from 'papaparse'

import "./Products.css"
import Dropdown from '../../components/Dropdown/Dropdown';
import Loader from '../../components/Loader/Loader';
import { healthCheck, logOutUser } from '../../features/auth/authSlice';

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {productData, isLoading} =useSelector(
    (state)=>state.product
  )

  const {token,verified, isError} = useSelector((state)=>state.auth)

  const [showSKUFlag, setShowSKUFlag] = useState(false)
  const [prodNavFlag, setProdNavFlag] = useState(false)

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

  // const handleCSVFile=(e)=>{
  //     Papa.parse(e.target.files[0],{
  //     header:true,
  //     skipEmptyLines: true,
  //     complete: function(res){
  //       setCsvData(res.data)
  //       }
  //     })
  //   }

  // const onChange=(e)=>{
  //   setItemData((prevState)=>({
  //       ...prevState,
  //       [e.target.name]:e.target.value
  //   }))
  // }

  const handleProductClick = (sku) =>{
    if(prodNavFlag){
      dispatch(resetProducts())
      navigate(`${sku}`)
      // console.log(`edit data ${sku}`)
    }
  }
    
  const onSubmit=(e)=>{
    e.preventDefault()
      
    if(itemCode==="" || saveFile===null){
      alert(`Please enter Item`)
    }else{
      dispatch(getProducts(itemData))
    }
  }

  /////////////////////////////////////////////////
  //////// Hooks /////////////////////////////////
  ////////////////////////////////////////////////

  useEffect(()=>{
    // let id =async()=>{ setInterval(dispatch(healthCheck()),10*1000)}
    // id()
    
    if(isError || !token){
      // clearInterval(id)s
      dispatch(logOutUser())
      navigate("/")
    }

    dispatch(resetProducts())
  },[])

  return (
    <>
    {isLoading && <Loader />}
    <div className='data-container'>

      <div className="controlbox-container" >
        
        {/* Load Product Controls */}
        <form onSubmit={onSubmit}>

        <div className="controlbox">

          {/* <div className="form-group">

            <label>File</label>
            <input className='file-input'
            type="file"
            name="file"
            accpet=".csv"
            onChange={handleCSVFile}
              ></input>
            </div> */}

          <div className="control-section">
            <label>Item</label>

            <Dropdown  
              dataList={prodCodeList} 
              passItemCode={setItemData}
              />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">
                Submit
            </button>
          </div>

        </div>
        </form>
          
        {/* On Product Load Controls */}
        {productData.length>0 &&
          <div className="control-box">
          <div className="control-section">
            
            <div className="control-btn"
              style={{backgroundColor:`var(--buttonGreen)`}}
              onClick={()=>setShowSKUFlag(!showSKUFlag)}
            >
              {showSKUFlag?"Show Product Name":"Show SKU"}
            </div>
            
            <div className="control-btn"
              style={prodNavFlag?{backgroundColor:`var(--buttonRed)`}:{backgroundColor:`var(--buttonGreen)`}}
              onClick={()=>setProdNavFlag(!prodNavFlag)}
            >
              {prodNavFlag?"De-activate Products":"Activate Products"}
            </div>

          </div>
        </div>}


      </div>

      <div className='grid'>
        <div className="productCol-conatiner">
          {/* Product Fields */}
          {productData?.length>0 &&
            <div className="productCol">
                <h3>vehicleModel</h3>
                <h3>brandCompany</h3>
                <h3>sku</h3>
                <h3>mrp</h3>
                <h3>compatibleModels</h3>
                <h3>metaData</h3>
            </div>
          }

          {/* Product Data */}
          {productData?.map((item,index)=>
            <div className={`productCol ${prodNavFlag?"navProdCol":""}`}
              // style={prodNavFlag?{cursor:`pointer`}:{}} 
              key={index}
              onClick={()=>handleProductClick(item.sku)}
            >
              <h3>{item.vehicleModel}</h3>
              <h3>{item.brandCompany}</h3>
              <h3>{item.sku}</h3>
              <h3>{item.mrp}</h3>
              <h3>{item.compatibleModels.map((item,i)=>{
                return <p key={i}>{ 
                  showSKUFlag?
                  item
                  :
                  productData.filter(prod=>prod.sku===item).map(prod=>prod.vehicleModel+" "+prod.brandCompany)
                }
                </p>})}
              </h3>
              {item.metaData && 
              <h3>
                {Object.keys(item.metaData)?.map((k,i)=>{
                  return <p key={i}>{k}- {item.metaData[k]}</p>
                  } 
                )}
              </h3>
              }
            </div>
            )
          }
        </div>
        

    
      </div>

    </div>
    </>
  )
}

export default Products