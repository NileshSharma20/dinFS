import React from 'react'

const useTicket = () => {
    let currDate = new Date()
    let date = currDate.getDate()
    let month = currDate.getMonth()+1
    let year = currDate.getFullYear() 
    let hour = currDate.getHours()
    let minute = currDate.getMinutes()
    let second = currDate.getSeconds()
    
    let prevDate,counter

    if(typeof prevDate === "undefined"){
        prevDate = -1
        // console.log(`${prevDate},${date}`)
    }

    if(month<10){
        month = `0${month}`
    }
    if(minute<10){
        minute = `0${minute}`
    }
    if(second<10){
        second = `0${second}`
    }

    if(prevDate!==date){
        prevDate=date
        counter = 0
        console.log(`reset`)
    }else{
        counter++
    }

    const fullDate = date+month+year

    const ticket = counter.toString().padStart(3, '0')+fullDate
    // console.log(`ticket:${ticket}`)

    return ({ticket})
}

export default useTicket