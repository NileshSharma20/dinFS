import { useEffect } from "react"

const useDate = () => {
  let currFullDate, date, month, year, hour, minute, second
  
  currFullDate = new Date()
  date = currFullDate.getDate()
  month = currFullDate.getMonth()+1
  year = currFullDate.getFullYear()
  hour = currFullDate.getHours()
  minute = currFullDate.getMinutes()
  second = currFullDate.getSeconds()
  // setInterval(function(){
    
  //   },1000)

  if(month<10){
      month = `0${month}`
  }
  if(minute<10){
      minute = `0${minute}`
  }
  
  // useEffect(()=>{},[])

  return (
    {date, month, year, hour, minute}
  )
}

export default useDate