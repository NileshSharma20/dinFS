const fs = require('fs');
const Papa = require('papaparse');

const filenameList ={
    "ALL":["productsMongo.csv"],
    "ICI":["itemCodeIndexMongo.csv", "itemCodeIndexUpdated.csv"],
    //
    "SKR":["shockerMongo.csv","shockerUpdated.csv"],
    "BSH":["brakeShoeMongo.csv", "brakeShoeUpdated.csv"],
    "DPD":["discpadMongo.csv", "discpadUpdated.csv"],
    "MOF":["mobilFilterMongo.csv", "mobilFilterUpdated.csv"],
    "RSR":["ballRacerMongo.csv", "ballRacerUpdated.csv"],
    "BDX":["bendexMongo.csv", "bendexUpdated.csv"],
    "FTR":["footRestMongo.csv", "footRestUpdated.csv"],
    "ARF":["airFilterMongo.csv", "airFilterUpdated.csv"],
    "SSN":["sideStandMongo.csv", "sideStandUpdated.csv"],
    "MSN":["mainStandMongo.csv", "mainStandUpdated.csv"],
    "CFA":["clutchAssemblyMongo.csv","clutchAssemblyUpdated.csv"],
    "ACC":["acceleratorCableMongo.csv","acceleratorCableUpdated.csv"],
    "CMA":["camShaftMongo.csv","camShaftUpdated.csv"],
    "CDI":["cdiMongo.csv","cdiUpdated.csv"],
    "CCC":["clutchCableMongo.csv","clutchCableUpdated.csv"],
    "RVM":["mirrorMongo.csv","mirrorUpdated.csv"],
    "RKR":["rockerMongo.csv","rockerUpdated.csv"],
    "SFR":["selfCutMongo.csv","selfCutUpdated.csv"],
    "TCH":["timingChainMongo.csv","timingChainUpdated.csv"],
    "TCT":["timingChainAdjusterMongo.csv","timingChainAdjusterUpdated.csv"],
    "SPK":["chainKitMongo.csv","chainKitUpdated.csv"],
    "CLP":["caliperMongo.csv","caliperUpdated.csv"],
    "CRB":["carburetorMongo.csv","carburetorUpdated.csv"],
    "TCP":["timingChainPadMongo.csv","timingChainPadUpdated.csv"],
    "VSG":["visorGlassMongo.csv","visorGlassUpdated.csv"],
    "CFP":["clutchPlateMongo.csv","clutchPlateUpdated.csv"],
    "LKT":["lockKitMongo.csv","lockKitUpdated.csv"],
    "SMC":["meterCableMongo.csv","meterCableUpdated.csv"],
    "RHS":["rightHandSwitchMongo.csv","rightHandSwitchUpdated.csv"],
    "ARM":["armatureMongo.csv","armatureUpdated.csv"],
    "BLN":["balancerMongo.csv","balancerUpdated.csv"],
    "BLT":["beltMongo.csv","beltUpdated.csv"],
    "BPA":["blockPistonAssebmlyCylinderKitMongo.csv","blockPistonAssebmlyCylinderKitUpdated.csv"],
    "BLV":["brakeLeverMongo.csv","brakeLeverUpdated.csv"],
    "BPL":["brakePedalMongo.csv","brakePedalUpdated.csv"],
    "CNA":["chainAdjusterMongo.csv","chainAdjusterUpdated.csv"],
    "CHS":["chassisMongo.csv","chassisUpdated.csv"],
    "CCN":["clutchCenterMongo.csv","clutchCenterUpdated.csv"],
    "CGP":["clutchGasketPackingMongo.csv","clutchGasketPackingUpdated.csv"],
    "CHB":["clutchHubMongo.csv","clutchHubUpdated.csv"],
    "CLV":["clutchLeverUpadted.csv","clutchLeverUpadted.csv"],
    "CPA":["clutchPulleyAssemblyMongo.csv","clutchPulleyAssemblyUpdated.csv"],
    "CWT":["clutchShoeMongo.csv","clutchShoeUpdated.csv"],
    "CSW":["clutchSwitchMongo.csv","clutchSwitchUpdated.csv"],
    "CYK":["clutchYokeMongo.csv","clutchYokeUpdated.csv"],
    "CON":["condensorMongo.csv","condensorUpdated.csv"],
    "KPH":["couplingHubMongo.csv","couplingHubUpdated.csv"],
    "CRA":["crankAssemblyMongo.csv","crankAssemblyUpdated.csv"],
    "DLV":["discLeverMongo.csv","discLeverUpdated.csv"],
    "DSP":["discPlateMongo.csv","discPlateUpdated.csv"],
    "DYK":["discYokeMongo.csv","discYokeUpdated.csv"],
    "DRB":["drumRubberMongo.csv","drumRubberUpdated.csv"],
    "DRM":["drumMongo.csv","drumUpdated.csv"],
    "TGR":["faceDriveMongo.csv","faceDriveUpdated.csv"],
    "FLS":["flasherMongo.csv","flasherUpdated.csv"],
    "RRD":["footRestRodMongo.csv","footRestRodUpdated.csv"],
    "FAS":["forkAssemblyMongo.csv","forkAssemblyUpdated.csv"],
    "FBL":["forkBallMongo.csv","forkBallUpdated.csv"],
    "BRL":["forkBarrelMongo.csv","forkBarrelUpdated.csv"],
    "FOS":["forkOilSealMongo.csv","forkOilSealUpdated.csv"],
    "FRD":["forkRodMongo.csv","forkRodUpdated.csv"],
    "FSW":["frontStopSwitchMongo.csv","frontStopSwitchUpdated.csv"],
    "FPT":["fuelPetrolTapMongo.csv","fuelPetrolTapUpdated.csv"],
    "FTC":["fuelTankCapMongo.csv","fuelTankCapUpdated.csv"],
    "GBS":["gearBoxSprocketMongo.csv","gearBoxSprocketUpdated.csv"],
    "GLV":["gearLeverMongo.csv","gearLeverUpdated.csv"],
    "GPD":["gearPinionDriveMongo.csv","gearPinionDriveUpdated.csv"],
    "GSF":["gearShaftMongo.csv","gearShaftUpdated.csv"],
    "GRP":["gripMongo.csv","gripUpdated.csv"],
    "HKT":["halfPackingKitMongo.csv","halfPackingKitUpdated.csv"],
    "HND":["handleMongo.csv","handleUpdated.csv"],
    "HLA":["headLightAssemblyMongo.csv","headLightAssemblyUpdated.csv"],
    "HDO":["headOringMongo.csv","headOringUpdated.csv"],
    "HTC":["htCoilMongo.csv","htCoilUpdated.csv"],
    "KKR":["kickPedalMongo.csv","kickPedalUpdated.csv"],
    "KSF":["kickShaftMongo.csv","kickShaftUpdated.csv"],
    "LST":["leverSetMongo.csv","leverSetUpdated.csv"],
    "MGP":["magnetPackingMongo.csv","magnetPackingUpdated.csv"],
    "MSP":["mainStandPinMongo.csv","mainStandPinUpdated.csv"],
    "MCA":["masterCylinderAssemblyMongo.csv","masterCylinderAssemblyUpdated.csv"],
    "SMA":["meterAssemblyMongo.csv","meterAssemblyUpdated.csv"],
    "SMD":["meterDriveMongo.csv","meterDriveUpdated.csv"],
    "SMP":["meterPinionMongo.csv","meterPinionUpdated.csv"],
    "SMS":["meterSensorMongo.csv","meterSensorUpdated.csv"],
    "OPM":["oilPumpMongo.csv","oilPumpUpdated.csv"],
    "OWY":["oneWayMongo.csv","oneWayUpdated.csv"],
    "PKT":["packingKitMongo.csv","packingKitUpdated.csv"],
    "PCL":["pickUpCoilMongo.csv","pickUpCoilUpdated.csv"],
    "PLC":["plugCapMongo.csv","plugCapUpdated.csv"],
    "PLS":["plugSocketMongo.csv","plugSocketUpdated.csv"],
    "RSW":["rearStopSwitchMongo.csv","rearStopSwitchUpdated.csv"],
    "RIM":["rimMongo.csv","rimUpdated.csv"],
    "RLR":["rollerKitMongo.csv","rollerKitUpdated.csv"],
    "SSM":["selfStartMotorMongo.csv","selfStartMotorUpdated.csv"],
    "SAS":["suspensionMongo.csv","suspensionUpdated.csv"],
    "TLA":["tailLightAssemblyMongo.csv","tailLightAssemblyUpdated.csv"],
    "TEE":["teeMongo.csv","teeUpdated.csv"],
    "TKT":["timingChainKitMongo.csv","timingChainKitUpdated.csv"],
    "VOS":["valveOilSealMongo.csv","valveOilSealUpdated.csv"],
    "VLV":["valveMongo.csv","valveUpdated.csv"],
    "VRT":["variatorMongo.csv","variatorUpdated.csv"],
}

// @desc   Clean Mongo Collection data and save it locally
// @route  "../MongoData/shockerMongo.csv"
const createMongoDataBackup = (mongoFile,iC) =>{
    const jsonData = mongoFile.map((item)=>{
        //single object
        const mD = item.metaData

        if(mD){
        Object.entries(mD).forEach((entry)=>{
            //insert new objects
            const [key, value] = entry;
            item[key] = value; 
        })}
        delete item.metaData
        delete item.__v

        return {
            ...item,
        }
    }
    )

    // console.log(`item:${JSON.stringify(jsonData,null,4)}`)
    const csvData = Papa.unparse(jsonData,{newline: '\n'});
    var filePath

    //Finding right Path
    const dbKeys = Object.keys(filenameList)
    if(dbKeys.includes(iC)){
        filePath = `../MongoData/${ filenameList[iC][0] }` 
    }else if(iC.toUpperCase()==="ALL"){
        filePath = '../MongoData/productsMongo.csv'
    }
    
    fs.writeFile(filePath,csvData, (err)=>{
        if(err){
            console.log(`createMongoDataBackup (HelperFunction): Error during writing file: ${err}`)
        }else{
            console.log(`createMongoDataBackup (HelperFunction): ${filenameList[iC][0]} File written successfully\n`)
        }
    })
}

// @desc   Get Local CSV files and convert them to JSON
// @route  "../CsvData/shockerUpdated.csv"
const localCSVtoJSON = (iC) => {
    var csvFile
    //Finding right Path
    const dbKeys = Object.keys(filenameList)
    if(dbKeys.includes(iC)){
        csvFile = `../CsvData/${ filenameList[iC][1] }` 
    }else{
        throw new Error('ItemCode not found')
    }

    const csvData = fs.readFileSync(csvFile, 'utf8');

    const jsonData = Papa.parse(csvData, { header: true });

    console.log(`localCSVtoJSON helper:\n${iC}:${JSON.stringify(jsonData.data[0],null,4)}`)

    return jsonData.data
}


// @desc   Clean raw JSON (and SKU generation)
const cleanJsonData = (rawJson) => {
    var cleanedData = []

    if(!rawJson || rawJson.length===0){
        cleanedData=[]
    }else{

    cleanedData = rawJson.filter((item=>item.itemCode && item.productName && item.vehicleModel && item.brandCompany && item.partNum && item.mrp)).map((prod)=>{
        // console.log(`rawJSON:${JSON.stringify(rawJson)}`)
        var sku=""
        var productFullName = ""
        var metaData = []

        const cleanedProdName = prod.productName.toUpperCase()
        var prodName = cleanedProdName.replace(/ /g,'-')

        //itemCode cleanup
        const cleanedIC = prod.itemCode.toUpperCase()
        var iC = cleanedIC.replace(/ /g,'')
            // const iC = cleanedIC.split(" ").join("")
        
        //vehicleModel cleanup
        let cleanedVM =""
        var spaceRemovedVM = prod.vehicleModel?prod.vehicleModel.replace(/ /g,"").toUpperCase():""

        const delimitedVM = spaceRemovedVM.split('-',2)
        
        if(delimitedVM.length>1){
            cleanedVM = delimitedVM[0].slice(0,3)+delimitedVM[1]
        }else{
            cleanedVM = delimitedVM[0].slice(0,3)
        }

        const vM = cleanedVM

        //brandCompany cleanup
        var spaceRemovedBC = prod.brandCompany?prod.brandCompany.replace(/ /g,"").toUpperCase():""
        const cleanedBC = spaceRemovedBC.slice(0,3)
        const bC = cleanedBC

        //partNum cleanup
        var spaceRemovedPN = prod.partNum?prod.partNum.replace(/ /g,""):""
        const cleanedPN = spaceRemovedPN.split("-").join("")
        const cleanedPN2 = cleanedPN.split("/").join("")
        const pN = cleanedPN2.toUpperCase()

        //mrp cleanup
        const spaceRemovedMRP = prod.mrp?prod.mrp.replace(/ /g,''):""
        var cleanedMRP = spaceRemovedMRP.replace(/,/g,'')

        //qty cleanup
        const spaceRemovedQty = prod.qty?prod.qty.replace(/ /g,''):""
        var cleanedQty = spaceRemovedQty.replace(/,/g,'')

        //unit cleanup
        const spaceRemovedUnit = prod.unit?prod.unit.replace(/ /g,''):""
        var cleanedUnit = spaceRemovedUnit.toUpperCase()

        //compatibleModels cleanup and conversion to Array
        const spaceRemovedCM = prod.compatibleModels?prod.compatibleModels.replace(/ /g,''):""
        var delimitedCM = spaceRemovedCM.split(',')

        //SKU generation
        sku = iC+"-"+vM+"-"+bC+"-"+pN

        //Product Full Name generation
        productFullName = prodName + " " + spaceRemovedVM + " " + spaceRemovedBC + " " + pN

        const prodClone = Object.assign({},prod)
        delete prodClone.itemCode
        delete prodClone.productName
        delete prodClone.vehicleModel
        delete prodClone.brandCompany
        delete prodClone?.qty
        delete prodClone?.unit
        delete prodClone.partNum
        delete prodClone.mrp
        delete prodClone.compatibleModels

        Object.keys(prodClone).forEach(key=>{
            prodClone[key]=prodClone[key].toUpperCase()
        })

        metaData = prodClone
        
        return {
            itemCode: iC,
            productName: prodName,
            productFullName: productFullName,
            vehicleModel: spaceRemovedVM,
            brandCompany: spaceRemovedBC,
            partNum: pN,
            mrp: cleanedMRP,
            qty:cleanedQty,
            unit:cleanedUnit,
            sku: sku,
            compatibleModels: delimitedCM,
            metaData: metaData
        }
    })
}  

console.log(`cleanJsonData helper:\n${JSON.stringify(cleanedData[0],null,4)}`)

return cleanedData

}

// @desc Clean raw ItemCode JSON
const cleanItemCodeJsonData = (rawJson) => {
    var cleanedData = []

    if(!rawJson || rawJson.length===0){
        cleanedData=[]
    }else{
        cleanedData =rawJson.filter((item=>item.itemCode && item.productName)).map((itemData)=>{
            var cleanedItemCode = ""
            var cleanedProductName = ""

            cleanedItemCode = itemData.itemCode.toUpperCase()
            cleanedItemCode = cleanedItemCode.replace(/ /g,"")

            cleanedProductName = itemData.productName.toUpperCase()
            cleanedProductName = cleanedProductName.replace(/ /g,"")

            return{
                itemCode: cleanedItemCode,
                productName: cleanedProductName
            }
        })
    }

    return cleanedData
}

module.exports = {
    cleanJsonData,
    localCSVtoJSON,
    createMongoDataBackup,
    cleanItemCodeJsonData,
}