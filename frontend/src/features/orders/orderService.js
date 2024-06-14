import axios from 'axios'

// Live URI 
// const order_URI = 'https://api.dinmotoindia.com/api/order/'

// Local URI
const main_URI = process.env.REACT_APP_LOCAL_URI 
                  || `https://api.dinmotoindia.com/api/`

const order_URI = main_URI+'order/'

const getAllDemandSlips = async(token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(order_URI, config)
    // console.log(`res:${JSON.stringify(response,null,4)}`)
    
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

        const {filterTicketNum, filterStatus, page, limit} = filterParams
        
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
        // 12062024
        
        if(filterTicketNum && filterTicketNum!==''){
            filterQueryString = filterQueryString+`&ticketNum=${filterTicketNum}`
        }
        if(filterStatus && filterStatus!==''){
            
            filterQueryString = filterQueryString+`&status=${filterStatus}`
        }
        if(page){
            filterQueryString = filterQueryString+`&page=${page}`
        }
        if(limit){
            filterQueryString = filterQueryString+`&limit=${limit}`
        }
        

        response = await axios.get(order_URI+`filter?date=${fullDate}${filterQueryString}`, config)
    }
    // else if(!accessLevel)
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
                filterToDate, 
                filterPublisherUsername, 
                filterStatus,
                filterTicketNum,
                page, 
                limit
            } = filterParams

            if(filterDate && filterDate!==''){
                fullDate = filterDate
                filterQueryString=filterQueryString+`date=${filterDate}`
            }
            
            if(filterDate!=='' && filterToDate && filterToDate!==''){
                filterQueryString = filterQueryString+`&endDate=${filterToDate}`
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
            if(page && page!==0){
                filterQueryString = filterQueryString[filterQueryString.length-1]==='?'?
                                    filterQueryString+`page=${page}`
                                    :
                                    filterQueryString+`&page=${page}`
            }
            if(limit && limit!==0){
                filterQueryString = filterQueryString[filterQueryString.length-1]==='?'?
                                    filterQueryString+`limit=${limit}`
                                    :
                                    filterQueryString+`&limit=${limit}`
                }

            // console.log(`fQS: ${order_URI+`filter`+filterQueryString}`)

            response = await axios.get(order_URI+`filter`+filterQueryString, config)

        }
    }
    // console.log(`res:${JSON.stringify(response.data,null,4)}`)
    
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