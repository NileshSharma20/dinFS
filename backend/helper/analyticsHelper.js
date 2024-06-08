const fs = require('fs');
const Papa = require('papaparse');

const fileNameLookUp = {
    'vehicleModel':"vehicleModelAggregate.csv",
    'partNum':"partNumberAggregate.csv"
}

// @desc   Clean Mongo Aggregate data and save it locally
// @route  "../MongoData/vehicleModelAggregate.csv"
const createFieldAggregateMongoData = (mongoFile, fieldName) => {
    const cleanedData = mongoFile.map((item)=>{
        let skuString = ""

        if(item.skus){
            item.skus.forEach(sku => {
                if(skuString===""){
                    skuString = sku
                }else{
                    skuString = skuString + ", " + sku
                }
            });

            return{
                [fieldName]: item._id,
                skuList: skuString
            }
        }else{
            throw new Error('createFieldAggregateMongoData (HelperFunction):Invalid Data Format')
        }
    })

    const csvData = Papa.unparse(cleanedData,{newline: '\n'});
    
    if(!fileNameLookUp[fieldName] || fileNameLookUp[fieldName]===""){
        throw new Error("createFieldAggregateMongoData (HelperFunction): Invalid Field Name")
    }

    let filePath = `../MongoData/${fileNameLookUp[fieldName]}`
        
    fs.writeFile(filePath,csvData, (err)=>{
        if(err){
            console.log(`createMongoDataBackup (HelperFunction): Error during writing file: ${err}`)
        }else{
            console.log(`createMongoDataBackup (HelperFunction): vehicleModelAggregate.csv File written successfully\n`)
        }
    })

} 

module.exports = {
    createFieldAggregateMongoData
}