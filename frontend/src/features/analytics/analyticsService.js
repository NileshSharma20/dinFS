import axios from 'axios'

const main_URI = process.env.REACT_APP_LOCAL_URI 
                || `https://api.dinmotoindia.com/api/`

const analytics_URI = main_URI+'analytics/' 

const getDemandslipAggregateData = async(filterParams, token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const accessLevel = filterParams.accessLevel
    let response = {}

    if(accessLevel){
        
        if(filterParams.length===0){
            // console.log(`fQS: ${analytics_URI+'demandSlip'}`)
            response = await axios.get(analytics_URI+'demandSlip', config)
        }

        else{
            let filterQueryString = '?'
            
            let fullDate
            const {filterDate,
                filterToDate, 
                // filterPublisherUsername, 
                // filterStatus,
                // filterTicketNum,
                // page, 
                // limit
            } = filterParams

            if(filterDate && filterDate!==''){
                fullDate = filterDate
                filterQueryString=filterQueryString+`date=${filterDate}`
            }
            
            if(filterDate!=='' && filterToDate && filterToDate!==''){
                filterQueryString = filterQueryString+`&endDate=${filterToDate}`
            }

            // console.log(`fQS: ${analytics_URI+'demandSlip'+filterQueryString}`)

            response = await axios.get(analytics_URI+'demandSlip'+filterQueryString, config)

        }
    }

    // const response = await axios.get(analytics_URI+'demandSlip', config)
    // console.log(`res:${JSON.stringify(response,null,4)}`)
    
    return response.data
}

const analyticsService = {
    getDemandslipAggregateData,
}

export default analyticsService