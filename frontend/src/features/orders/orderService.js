import axios from 'axios'
import useAuth from '../../hooks/useAuth'

// const prod_env = process.env.NODE_ENV

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

    // console.log(`env check:${JSON.stringify(prod_env)===JSON.stringify("developement")}`)
    const response = await axios.get(order_URI, config)
    
    return response.data
}

const getFilteredDemandSlips = async(filterParams,token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let response
    let fullDate // yyyy-mm-dd
    const accessLevel = filterParams.accessLevel 
    
    // Employee Level Access
    if(!accessLevel){
        let filterQueryString = ''

        const {filterTicketNum} = filterParams
        
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
        
        if(filterTicketNum && filterTicketNum!==''){
            filterQueryString = filterQueryString+`&ticketNum=${filterTicketNum}`
        }
        

        response = await axios.get(order_URI+`filter?date=${fullDate}${filterQueryString}`, config)
    }
    // Admin and Managaer Level Access
    else{   

        // No filter params
        if(filterParams.length===0){
            response = await axios.get(order_URI+`filter`, config)
        }
        // Minimum one filter param
        else{
            let filterQueryString = '?'
            const {filterDate, 
                filterPublisherUsername, 
                filterStatus,
                filterTicketNum } = filterParams

            if(filterDate && filterDate!==''){
                fullDate = filterDate
                filterQueryString=filterQueryString+`date=${filterDate}`
            }
            
            if(filterPublisherUsername && filterPublisherUsername!==''){

                filterQueryString = filterQueryString[filterQueryString.length-1]==='?'?
                                    filterQueryString+`publisherUsername=${filterPublisherUsername}`
                                    :
                                    filterQueryString+`&publisherUsername=${filterPublisherUsername}`
            }

            if(filterStatus && filterStatus!==''){

                filterQueryString = filterQueryString[filterQueryString.length-1]==='?'?
                                    filterQueryString+`status=${filterStatus}`
                                    :
                                    filterQueryString+`&status=${filterStatus}`
            }

            if(filterTicketNum && filterTicketNum!==''){

                filterQueryString = filterQueryString[filterQueryString.length-1]==='?'?
                                    filterQueryString+`ticketNum=${filterTicketNum}`
                                    :
                                    filterQueryString+`&ticketNum=${filterTicketNum}`
            }

            console.log(`fQS: ${order_URI+`filter`+filterQueryString}`)

            response = await axios.get(order_URI+`filter`+filterQueryString, config)

        }
    }
    
    return response.data
    // if(!filterDate || filterDate===''){
    //     let currDate = new Date()
    //     let ticketDate = currDate.getDate()
    //     let ticketMonth = currDate.getMonth()+1
    //     let ticketYear = currDate.getFullYear()
        
    //     if(ticketDate<10){
    //         ticketDate = `0${ticketDate}`
    //     }
        
    //     if(ticketMonth<10){
    //         ticketMonth = `0${ticketMonth}`
    //     }
        
    //     fullDate = `${ticketDate}${ticketMonth}${ticketYear}`
    // }else{
    // }

    
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