import axios from 'axios'

const order_URI = '/api/order/'

const getAllDemandSlips = async(token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(order_URI, config)

    return response.data
}

const getFilteredDemandSlips = async(token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

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

    const fullDate = `${ticketDate}${ticketMonth}${ticketYear}`

    const response = await axios.post(order_URI+`filter/${fullDate}`,{}, config)

    return response.data
}

const orderService = {
    getAllDemandSlips,
    getFilteredDemandSlips,
}

export default orderService