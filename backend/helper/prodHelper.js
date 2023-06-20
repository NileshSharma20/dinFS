const fs = require('fs');
const Papa = require('papaparse');

// @desc   Clean Mongo Collection data and save it locally
// @route  "../MongoData/shockerMongo.csv"
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

// @desc   Get Local CSV files and convert them to JSON
// @route  "../CsvData/shockerUpdated.csv"
const localCSVtoJSON = () => {
    const csvFile = '../CsvData/shockerUpdated.csv'
    const csvData = fs.readFileSync(csvFile, 'utf8');

    const jsonData = Papa.parse(csvData, { header: true });

    return jsonData.data
}


// @desc   Clean raw JSON
const cleanJsonData = (rawJson) => {
    var cleanedData = []

    if(!rawJson || rawJson.length===0){
        cleanedData=[]
    }else{

    cleanedData = rawJson.filter((item=>item.itemCode && item.vehicleModel && item.brandCompany && item.partNum && item.mrp)).map((prod)=>{
        var sku=""
        var metaData = []

        //itemCode cleanup
        const cleanedIC = prod.itemCode.toUpperCase()
        var iC = cleanedIC.replace(/ /g,'')
            // const iC = cleanedIC.split(" ").join("")
        
        //vehicleModel cleanup
        let cleanedVM =""
        var spaceRemovedVM = prod.vehicleModel?prod.vehicleModel.replace(/ /g,""):""

        const delimitedVM = spaceRemovedVM.split('-',2)
        
        if(delimitedVM.length>1){
            cleanedVM = delimitedVM[0].slice(0,3)+delimitedVM[1]
        }else{
            cleanedVM = delimitedVM[0].slice(0,3)
        }

        const vM = cleanedVM.toUpperCase()

        //brandCompany cleanup
        var spaceRemovedBC = prod.brandCompany?prod.brandCompany.replace(/ /g,""):""
        const cleanedBC = spaceRemovedBC.slice(0,3)
        const bC = cleanedBC.toUpperCase()

        //partNum cleanup
        var spaceRemovedPN = prod.partNum?prod.partNum.replace(/ /g,""):""
        const cleanedPN = spaceRemovedPN.split("-").join("")
        const pN = cleanedPN.toUpperCase()

        //mrp cleanup
        const spaceRemovedMRP = prod.mrp?prod.mrp.replace(/ /g,''):""
        var cleanedMRP = spaceRemovedMRP.replace(/,/g,'')

        //compatibileModels cleanup and conversion to Array
        const spaceRemovedCM = prod.compatibileModels?prod.compatibileModels.replace(/ /g,''):""
        var delimitedCM = spaceRemovedCM.split(',')

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
    localCSVtoJSON,
    createMongoDataBackup,
}