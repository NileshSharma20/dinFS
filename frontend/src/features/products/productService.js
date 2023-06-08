// import axios from 'axios'

// productData: [{
//     productType:"",
//     productBrand:"",
//     productName:"",
//     price:"",
//     unitInStock:"",
// }],

// CSV2JSONData = [{
//     Name:"",
//     Price:"",
//     ProductType:""
// }]

// Convert Product CSV Data to JSON Data
const createProductDataJSON = (csvFileData, brandsList) => {
    var returnData = []
    if( brandsList.length===0 || csvFileData.length===0){
        returnData=[]
        console.log(`Error`)
    }else{
        returnData = csvFileData.map((csvItem)=>{
            
            let brandCheck = "" 
            for(let i=0;i<brandsList.length;i++){
                if(csvItem.Name.includes(brandsList[i].brandName)){
                    brandCheck = brandsList[i].brandName
                }
            }
            
            return { 
                productName: csvItem.Name,
                productBrand: brandCheck,
                productType: csvItem.ProductType,
                price: csvItem.Price 
            }
        })
    }

    return returnData
  }

  const productService = {
    createProductDataJSON,  
  }
  
  export default productService