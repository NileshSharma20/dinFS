import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'

import '../../pages/DemandSlip/DemandSlip.css'

function DemandSlipCard({info, partialFlag=false}) {
    const { isAdmin, isManager, isAccountant } = useAuth()

    const [statusColour, setStatusColour] = useState({})

    const createdTimeString = new Date(info.createdAt).toString().split(' ')[4]
    const updatedTimeString = new Date(info.updatedAt).toString().split(' ')[4]
    
    useEffect(()=>{
        if(info.status==='partial'){
            setStatusColour({backgroundColor:`#ffb703`})
        }else if(info.status==='failed'){
            setStatusColour({backgroundColor:`#e63946`})
        }else if(info.status==='fulfilled'){
            setStatusColour({backgroundColor:`#8ac926`})
        }else{
            setStatusColour({border:`1px solid black`})
        }
    },[])

  return (
    <>
    <div className='ds-slip-box'>
    <div style={{width:`100%`}}>
        <div className="card-row">
            <div className="card-element">

            <h3>{info.ticketNumber}</h3>
            {(isAdmin||isManager||isAccountant) && 
            <h3>{info?.username}</h3>
            }
            </div>

            <div className="card-element">
                <div className="status-circle"
                    style={statusColour}
                >
                </div>
            </div>

        </div>
        <br />

        {(isAdmin||isManager||isAccountant) && 
        <div className="card-row">
            <div className="card-element" 
                style={{gridColumn:`1/span 2`, marginBottom:`1rem`}}
            >
                <h3>
                {new Date(info.createdAt).toString().split(' ').splice(0,4).join(' ')}
                </h3>
            </div>

            {isAdmin && isManager &&
                <>
                <div className="card-element">
                    <h3>Created</h3>
                    {createdTimeString}
                </div>

                <div className="card-element">
                    <h3>Updated</h3>
                    {updatedTimeString}
                </div>
                </>
            }
        </div>
        }
        {/* <div className="card-row">
        </div> */}
        
        <br />
        
        <div className="card-row">
            <div className="card-element">
                <h3>Delivery Partner</h3>
                <p>{info.deliveryPartnerName}</p>
            </div>

            <div className="card-element">
                <h3>Distributor</h3> 
                <p>{info.distributorName}</p>
            </div>
        </div>
    {/* <p><span>Status: </span> {info.status}</p> */}

    <br />
    <p><span>Total Cost: </span>{info.totalCost}</p>
    <br />

    <div className="card-grid-row">
        <h3></h3>
        <h3>Products</h3>
        <h3>Ord.</h3>
        {partialFlag && <h3>Recv.</h3>}  
    </div>

    {/* <div className='ds-new-col'> */}
        {info.orderedProductList?.map((prod,i)=>
            <div className="card-grid-row" key={i}>
                <p>{i+1}.</p>

                <div className="card-element">

                    <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                    <p>{prod.sku}</p>
                </div>

                <p>{prod.quantity}</p>
                
                {partialFlag && 
                    <p>{info.recievedProductList[i]?.quantity}</p>
                }
                
                {/* <br /> */}
            {/* </React.Fragment>   */}
        </div>
        )}
    </div>
    </div>
    </>
  )
}

export default DemandSlipCard