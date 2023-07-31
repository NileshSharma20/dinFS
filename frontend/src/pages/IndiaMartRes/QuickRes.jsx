import { useState } from "react"
import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import CopyForm from '../../components/CopyForm/CopyForm'

import "./IndiaMartRes.css"

function QuickRes() {

    const {formResponseData} =useSelector(
        (state)=>state.template
    )
    const [successPopup, setSuccessPopup] = useState(false)

    const {customer_name, pricePerUnit, pricePerUnitOE, excDeliveryCharges, unit, product} = formResponseData

    const ResponseList = [{
        text:`Hi ${customer_name}, thanks for the inquiry.\n\nWe can provide ${product===""?`the product`:product} at Rs.${pricePerUnit} per ${unit}${pricePerUnitOE!==""?` and Rs.${pricePerUnitOE} per ${unit}(Original)`:``}${excDeliveryCharges===`true`?"(excluding shipping charges)":""}.\n\nFor further details you can call us on 9230021058/ 08043818766 (preferred call time 10am to 11am).`
    },{
        text:`Hi ${customer_name}, thanks for the inquiry.\n\nWe can provide ${product===""?`the product`:product} at Rs.${pricePerUnit} per ${unit}${pricePerUnitOE!==""?` and Rs.${pricePerUnitOE} per ${unit}(Original)`:``}${excDeliveryCharges===`true`?"(excluding shipping charges)":""} onwards as per vehicle model. Kindly mention the model/s you are looking for.\n\nFor further details you can call us on 9230021058/ 08043818766 (preferred call time 10am to 11am).`
    },{
    //     text:`We can deliver ${product===""?`the product`:product} for Rs.${pricePerUnit} per ${unit} ${pricePerUnitOE!==""?`and Rs. ${pricePerUnitOE} per ${unit}`:``}.\n\nYou can call us on 08043818766/ 9230021058 (preferred call time between 10am to 11am).`
    // },{
        text:`Hi ${customer_name}, thanks for the inquiry but we do not deal in ${product===""?`this product`:product}.\n\nFor any further requirements you can call us on 08043818766/ 9230021058 (preferred call time between 10am to 11am).`
    },{
        text:`Hi ${customer_name}, thanks for the inquiry but ${product===""?`the product`:product} is currently out of stock.\n\nFor any further requirements you can call us on 08043818766/ 9230021058 (preferred call time between 10am to 11am).`
    },{
        text:`Hi ${customer_name}, thanks for the inquiry and sorry for our late response.\n\nWe can provide ${product===""?`the product`:product} at Rs.${pricePerUnit} per ${unit}${pricePerUnitOE!==""?` and Rs. ${pricePerUnitOE} per ${unit}`:``}.\n\nFor further details you can call us on 9230021058/ 08043818766 (preferred call time 10am to 11am).`
    },{
        text:`Hi ${customer_name}, thanks for the inquiry and sorry for our late response.\n\nWe can provide ${product===""?`the product`:product} at Rs.${pricePerUnit} per ${unit}${pricePerUnitOE!==""?` and Rs. ${pricePerUnitOE} per ${unit}`:``} onwards as per vehicle model. Kindly mention the model/s you are looking for.\n\nFor further details you can call us on 9230021058/ 08043818766 (preferred call time 10am to 11am).`
    },{
        text:`Hi ${customer_name}, thanks for the inquiry.\n\nWe do not supply to your location at the moment.\n\nFor any further queries/ inquiries you can call us on 9230021058/ 08043818766 (preferred call time 10am to 11am).`
    },]

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////
    const copyText=(text)=>{
        navigator.clipboard.writeText(text)
        setSuccessPopup(false)
        setTimeout(()=>{
            setSuccessPopup(true)
        },100)
        setTimeout(()=>{
            setSuccessPopup(false)
          },2000)
      }

  return (
    <div className='quick-res-container'>
    
    <CopyForm />
    
    <div className='copy-container'>

        {ResponseList.map((item, index)=>
            <div key={index}
                className='template-text' 
                onClick={()=>copyText(item.text)}>
                {item.text}
            </div>
        )}
      </div>

      <AnimatePresence>
        {successPopup && 
            <motion.div className="alert-content"
                initial={{opacity:0}} 
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.8}}
            >
                Messgae Copied
            </motion.div>
        }
    </AnimatePresence>
    
    </div>
  )
}

export default QuickRes