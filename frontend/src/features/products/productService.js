import axios from 'axios'

const prod_URI = '/api/prod/'

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

    return response.data
  } 

  const productService = {
    createProductDataJSON,  
    getProducts,
    searchProducts
  }
  
  export default productService