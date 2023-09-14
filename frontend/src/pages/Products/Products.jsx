import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { getProducts, searchProducts, resetProducts, searchSKUProducts} from "../../features/products/productSlice"
// import Papa from 'papaparse'
import debouce from "lodash.debounce";

import "./Products.css"
import Dropdown from '../../components/Dropdown/Dropdown';
import Loader from '../../components/Loader/Loader';
import { logOutUser } from '../../features/auth/authSlice';

import { AiOutlineSearch } from "react-icons/ai"

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {productData,noMatch, isLoading } =useSelector(
    (state)=>state.product
  )

  const {token, isError} = useSelector((state)=>state.auth)

  const [showSKUFlag, setShowSKUFlag] = useState(false)
  const [prodNavFlag, setProdNavFlag] = useState(false)

  const [searchInput, setSearchInput] = useState("");

  const [itemData, setItemData] = useState({
    // saveFile: false,
    itemCode:""
  })

  const [skuData, setSKUData] = useState({
    itemCode:"",
    vehicleModel:"",
    brandCompany:"",
    partNum:""
  })
  
  const { itemCode } = itemData

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

  const handleProductClick = (sku) =>{
    if(prodNavFlag){
      dispatch(resetProducts())
      navigate(`${sku}`)
    }
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  }

  const onSKUChange=(e)=>{
    setSKUData((prevState)=>({
        ...prevState,
        [e.target.name]:e.target.value
    }))
}

  // Debounce function
  const debouncedResults = debouce(handleSearchChange, 800)
  
  // Get Products API call 
  const onSubmit=(e)=>{
    e.preventDefault()
      
    if(itemCode===""){
      alert(`Please enter Item`)
    }else{
      setSearchInput("")
      dispatch(getProducts(itemData))
    }
  }

  // Get SKU Products API call 
  const onSKUSubmit=(e)=>{
    e.preventDefault()
      
    if(skuData.itemCode===""){
      alert(`Please Enter Item Code`)
    }else{
      dispatch(searchSKUProducts(skuData))
    }
  }

  /////////////////////////////////////////////////
  //////// Hooks /////////////////////////////////
  ////////////////////////////////////////////////

  // Logout on Bad Token
  useEffect(()=>{    
    if(isError || !token){
      dispatch(logOutUser())
      navigate("/login")
    }

    dispatch(resetProducts())
  },[])

  // Debounce Search
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  // Search API call
  useEffect(()=>{
    if (searchInput!=="") {
      dispatch(searchProducts(searchInput))
    }
  },[searchInput])

  return (
    <>
    {isLoading && <Loader />}
    <div className='data-container'>
      
      <div className="controlbox-container" >
        
        {/* Load Product Controls */}
        <div className="controlbox" style={{width:"80%"}}>

          <label style={{fontWeight:"bold"}}>Search</label>
          <div className="search-bar">
            <AiOutlineSearch className='search-icon'/>
            <input
              type="text"
              name="search"
              placeholder="Search for Product"
              onChange={debouncedResults}
              autoComplete='off'
              />

        </div>
        </div>

        <form onSubmit={onSKUSubmit}>

          <label style={{fontWeight:"bold"}}>Search by SKU</label>
          <div className="form-group">
                {/* <label htmlFor={`itemCode sku`}>Item Code</label> */}
                <input type="text" 
                    className='form-control'
                    name= 'itemCode'
                    id={`itemCode sku`}
                    value = {skuData.itemCode}
                    placeholder="Item Code"
                    autoComplete='off'
                    onChange={onSKUChange} />
            </div>

            <div className="form-group">
                {/* <label htmlFor={`vehicleModel sku`}>Vehicle Model</label> */}
                <input type="text" 
                    className='form-control'
                    name= 'vehicleModel'
                    id={`vehicleModel sku`}
                    value = {skuData.vehicleModel}
                    placeholder="Vehicle Model"
                    autoComplete='off'
                    onChange={onSKUChange} />
            </div>

            <div className="form-group">
                {/* <label htmlFor={`brandCompany sku`}>Brand Company</label> */}
                <input type="text" 
                    className='form-control'
                    name= 'brandCompany'
                    id={`brandCompany sku`}
                    value = {skuData.brandCompany}
                    placeholder="Brand Company"
                    autoComplete='off'
                    onChange={onSKUChange} />
            </div>

            <div className="form-group">
                {/* <label htmlFor={`partNum sku`}>Part Number</label> */}
                <input type="text" 
                    className='form-control'
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
        </form>
        

        
        <form onSubmit={onSubmit}>
        
        {/* Search Input */}

        <div className="controlbox">

          <div className="control-section">
            <label>Product Category</label>

            <Dropdown  
              dataList={prodCodeList} 
              passItemCode={setItemData}
              />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">
                Search
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

      {noMatch &&  
        <h3>No Match</h3>
      }

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
                  // Write logic for when whole list isnt loaded
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