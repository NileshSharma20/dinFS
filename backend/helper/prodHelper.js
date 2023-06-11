const fs = require('fs');
const Papa = require('papaparse');

// @desc   Clean Mongo Collection data and save it locally
const createMongoDataBackup = (mongoFile) =>{
    const jsonData = mongoFile.map((item)=>{
        //single object
        const mD = item.metaData

        Object.entries(mD).forEach((entry)=>{
            //insert new objects
            const [key, value] = entry;
            item[key] = value; 
        })
        delete item.metaData
        delete item.__v

        return {
            ...item,
        }
    }
    )

    // console.log(`item:${JSON.stringify(jsonData,null,4)}`)
    const csvData = Papa.unparse(jsonData,{newline: '\n'});
    fs.writeFile('../MongoData/shockerMongo.csv',csvData, (err)=>{
        if(err){
            console.log(`createMongoDataBackup(HelperFunction): Error during writing file: ${err}`)
        }else{
            console.log(`createMongoDataBackup(HelperFunction): File written successfully\n`)
        }
    })
}


// @desc   Clean JSON recieved from frontend and pass it to Controller
const cleanJsonData = (rawJson) => {
    var cleanedData = []

    if(!rawJson || rawJson.length===0){
        // res.status(400)
        // throw new Error('Please attach RAW JSON file')
        cleanedData=[]
    }else{

    cleanedData = rawJson.map((prod)=>{
        var sku=""
        var metaData = []

        //itemCode cleanup
        const cleanedIC = prod.itemCode.toUpperCase()
        const iC = cleanedIC.replace(/ /g,'')
            // const iC = cleanedIC.split(" ").join("")
        
        //vehicleModel cleanup
        let cleanedVM =""
        const spaceRemovedVM = prod.vehicleModel.replace(/ /g,"")

        const delimitedVM = spaceRemovedVM.split('-',2)
        
        if(delimitedVM.length>1){
            cleanedVM = delimitedVM[0].slice(0,3)+delimitedVM[1]
        }else{
            cleanedVM = delimitedVM[0].slice(0,3)
        }

        const vM = cleanedVM.toUpperCase()

        //brandCompany cleanup
        const spaceRemovedBC = prod.brandCompany.replace(/ /g,"")
        const cleanedBC = spaceRemovedBC.slice(0,3)
        const bC = cleanedBC.toUpperCase()

        //partNum cleanup
        const spaceRemovedPN = prod.partNum.replace(/ /g,"")
        const cleanedPN = spaceRemovedPN.split("-").join("")
        const pN = cleanedPN.toUpperCase()

        //mrp cleanup
        const spaceRemovedMRP = prod.mrp.replace(/ /g,'')
        const cleanedMRP = spaceRemovedMRP.replace(/,/g,'')

        //compatibileModels cleanup and conversion to Array
        const spaceRemovedCM = prod.compatibileModels.replace(/ /g,'')
        const delimitedCM = spaceRemovedCM.split(',')

        //SKU generation
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
            mrp: cleanedMRP,
            sku: sku,
            compatibileModels: delimitedCM,
            metaData: metaData
          }
    })
}  

return cleanedData

}

module.exports = {
    cleanJsonData,
    createMongoDataBackup,
}