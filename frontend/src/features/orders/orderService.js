import axios from 'axios'

// Live URI
const order_URI = 'https://api.dinmotoindia.com/api/order/'

// Local URI
// const order_URI = 'http://localhost:5000/api/order/'

const getAllDemandSlips = async(token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(order_URI, config)

    return response.data
}

const getFilteredDemandSlips = async(filterDate,token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let fullDate
    // yyyy-mm-dd

    if(!filterDate || filterDate===''){
        let currDate = new Date()
        let ticketDate = currDate.getDate()
        let ticketMonth = currDate.getMonth()+1
        let ticketYear = currDate.getFullYear()

        if(ticketDate<10){
            ticketDate = `0${ticketDate}`
        }

        if(ticketMonth<10){
            ticketMonth = `0${ticketMonth}`
        }

        fullDate = `${ticketDate}${ticketMonth}${ticketYear}`
    }else{
        fullDate=filterDate
    }

    const response = await axios.post(order_URI+`filter/${fullDate}`,{}, config)

    return response.data
}

const generateDemandSlip = async({demandSlipData, token})=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // API Call
    const response = await axios.post(order_URI, demandSlipData, config) 
    // console.log(`response:${JSON.stringify(response.data.demandSlipData,null,4)}`)
    return response.data.demandSlipData
}

// PATCH /:ticketNumber
const updateDemandSlip = async({updatedData, token})=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    // API Call
    const response = await axios.patch(order_URI+updatedData.ticketNumber, updatedData, config) 
    // console.log(`response:${JSON.stringify(response.data.demandSlipData,null,4)}`)
    return response.data
}

const orderService = {
    getAllDemandSlips,
    getFilteredDemandSlips,
    generateDemandSlip,
    updateDemandSlip,
}

export default orderService