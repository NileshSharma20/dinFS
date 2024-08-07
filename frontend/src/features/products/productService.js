import axios from 'axios'

// const prod_URI = 'https://api.dinmotoindia.com/api/prod/'
const main_URI = process.env.REACT_APP_LOCAL_URI 
                  || `https://api.dinmotoindia.com/api/`

const prod_URI = main_URI+'prod/'

// Convert Product CSV Data to JSON Data
const createProductDataJSON = (csvFileData) => {
    var returnData = []
    if(csvFileData.length===0){
        returnData=[]
        console.log(`Error`)
    }else{
        returnData = 
        csvFileData.map((prod)=>{
          var sku=""
          var metaData = []

          const cleanedIC = prod.itemCode.toUpperCase()
          const iC = cleanedIC.replace(/ /g,'')
          // const iC = cleanedIC.split(" ").join("")
          
          let cleanedVM =""
          const spaceRemovedVM = prod.vehicleModel.replace(/ /g,"")

          const delimitedVM = spaceRemovedVM.split('-',2)
          if(delimitedVM.length>1){
            cleanedVM = delimitedVM[0].slice(0,3)+delimitedVM[1]
          }else{
            cleanedVM = delimitedVM[0].slice(0,3)
          }
          const vM = cleanedVM.toUpperCase()

          const spaceRemovedBC = prod.brandCompany.replace(/ /g,"")
          const cleanedBC = spaceRemovedBC.slice(0,3)
          const bC = cleanedBC.toUpperCase()

          const spaceRemovedPN = prod.partNum.replace(/ /g,"")
          const cleanedPN = spaceRemovedPN.split("-").join("")
          const pN = cleanedPN.toUpperCase()

          const delimitedCM = prod.compatibileModels.split(',')

          sku = iC+"-"+vM+"-"+bC+"-"+pN

          const prodClone = Object.assign({},prod)
          delete prodClone.itemCode
          delete prodClone.vehicleModel
          delete prodClone.brandCompany
          delete prodClone.partNum
          delete prodClone.mrp
          delete prodClone.compatibileModels

          metaData = prodClone

          return {
            itemCode: iC,
            vehicleModel: spaceRemovedVM,
            brandCompany: spaceRemovedBC,
            partNum: spaceRemovedPN,
            mrp: prod.mrp.replace(/ /g,""),
            sku: sku,
            compatibileModels: delimitedCM,
            metaData: metaData
          }
        })
    }

    return returnData
  }

  // Get Products
  const getProducts = async (itemData) => {
    const response = await axios.get(prod_URI + `${itemData.itemCode}`)
    // if(response.data){
    //   localStorage.setItem('productData', JSON.stringify(response.data))
    // }
    return response.data
  } 

  // Search Products
  const searchProducts = async (searchKey) => {
    const response = await axios.get(prod_URI +`search/${searchKey}`)

    const res = response.data.map((item)=>{
      var productFullName = item.productName+" "+item.vehicleModel+" "+item.brandCompany+" "+item.partNum
      return {...item, productFullName:productFullName} 
    })

    return res
  } 

  // Search Products
  const searchSKUProducts = async (itemData,skuOnlyFlag) => {
    const response = await axios.post(prod_URI +`search/sku/${skuOnlyFlag}`, itemData)
    // const res = response.data.map((item)=>{
    //   let additionalInfo=''
      
      // Foot Rest
      // if(item.itemCode==="FTR"){
      //   console.log(`in switch:${item.metaData.position}`)
      //   switch(item.metaData.position){
      //     case "FRLH":
      //       additionalInfo='FRONT LEFT'
      //       break;
          
      //     case "FRRH":
      //       additionalInfo='FRONT RIGHT'
      //       break;
          
      //     case "RRLH":
      //       additionalInfo='REAR LEFT'
      //       break;
          
      //     case "RRRH":
      //       additionalInfo='REAR RIGHT'
      //       break;
            
      //       // default:
      //       //   additionalInfo=''
      //       }
      // }

      // else if(item.itemCode==="RVM"){
      //   switch(item.metaData.position){
      //     case "LH":
      //       additionalInfo="LEFT"
      //       break;
          
      //     case "RH":
      //       additionalInfo="RIGHT"
      //       break;
      //   }
      // }
      
      // var productFullName = item.productName+" "+
      //                       item.vehicleModel+" "+
      //                       item.brandCompany+" "+
      //                       item.partNum
      
      // if(additionalInfo!==''){
      //   productFullName=productFullName+" "+additionalInfo
      // }
      // return {...item, productFullName:productFullName} 
    // })
    // console.log(JSON.stringify(res,null,4))
    return response.data
  } 

  // Update Products
  const updateProduct = async ({itemData,token}) => {
    const config = {
      headers: {
          Authorization: `Bearer ${token}`
      }
    }

    // console.log(`itemData SKU:${itemData.sku}`)
    // console.log(`itemData prodInfo:${JSON.stringify(itemData.prodInfo,null,4)}`)

    const response = await axios.patch(prod_URI +`${itemData.sku}`, itemData.prodInfo, config)

    return response.data
    // return itemData.sku
  } 

  const productService = {
    createProductDataJSON,  
    getProducts,
    searchProducts,
    searchSKUProducts,
    updateProduct
  }
  
  export default productService