import React, { useState } from 'react'
import GenerateBillForm from '../../components/Forms/GenerateBillForm'

function Billing() {
    const [activeTab, setActiveTab] = useState('generate-bill')

    const handleTabClick = (tabName) => {
        setActiveTab(tabName)
    }

  return (
    <div className='container'
        style={{ 
            justifyContent:"flex-start",
        }}
    >
        <div className="ds-filter-container">
            <div className={`ds-filter-btn ${activeTab==='generate-bill'?"ds-filer-btn-active":""}`}
            onClick={()=>handleTabClick('generate-bill')}
            >
            Generate Bill
            </div>

            <div className={`ds-filter-btn ${activeTab==='bill-history'?"ds-filer-btn-active":""}`}
            onClick={()=>handleTabClick('bill-history')}
            >
            History
            </div>
        </div>

        {activeTab==='generate-bill' &&
        <div className="ds-filter-data-container">
        
          {/* Generate Bill Receipt */}
          <>
          <div className="ds-content"
          >
            <div className="ds-search-container">
                <GenerateBillForm />
            </div>
          </div>
          </>

        </div>
        }

        {activeTab==='bill-history' &&
        <div className="ds-filter-data-container">
        
          {/* Create Demand Slip */}
          <>
          <div className="ds-content"
          >
            <div className="ds-search-container">
                    <h1>Bill History</h1>
            </div>
          </div>

          </>
        </div>
        }
    </div>
  )
}

export default Billing