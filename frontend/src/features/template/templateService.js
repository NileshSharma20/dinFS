import axios from 'axios'


// Form Submit
const formSubmit = (formRes) => {
    var returnData = {}
    if(formRes.customer_name===null 
        || formRes.pricePerUnit===null 
        || formRes.unit===null){
        returnData = {
            customer_name:"",
            pricePerUnit:"",
            unit:""
        }
    }else{
        returnData = formRes
    }

    return returnData
  }

  const templateService = {
    formSubmit,
    
  }
  
  export default templateService