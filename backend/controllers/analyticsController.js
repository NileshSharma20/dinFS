const asyncHandler = require('express-async-handler')

const { endOfDay } = require('date-fns/endOfDay')
const { startOfDay } = require('date-fns/startOfDay')

const Demandslip = require("../models/demandslipModel")

// @desc   Get Aggreagted Data for Demand Slips
// @route  GET /api/analytics/demandSlip
// @access Private
const demandSlipAggregateData = asyncHandler(async (req,res)=>{
    const { date, endDate } = req.query

    let searchParams = []

    if(date==='' || endDate === '' || (!date && endDate) ){
        res.status(400)
        throw new Error('Bad Request: Invalid Dates')
    }

    // Filter data within a date range
    if(date && endDate){
        let fromDateString = date.slice(4)+
                        '-'+date.slice(2,4)+
                        '-'+date.slice(0,2)
        let toDateString = endDate.slice(4)+
                        '-'+endDate.slice(2,4)+
                        '-'+endDate.slice(0,2)
        
        let fromDate = new Date(fromDateString)
        let toDate = new Date(toDateString)

        if(fromDate > toDate){
            res.status(400)
            throw new Error('Bad Request: From Date greater than To Date')
        }

        searchParams=[
            {createdAt:{$gte:startOfDay(fromDate)}},
            {createdAt:{$lte:endOfDay(toDate)}},
        ]
    }
    // Filter data for only 1 day/date
    else if(date && !endDate ){
        let fromDateString = date.slice(4)+
                        '-'+date.slice(2,4)+
                        '-'+date.slice(0,2)
        
        let fromDate = new Date(fromDateString)

        searchParams=[
            {createdAt:{$gte:startOfDay(fromDate)}},
            {createdAt:{$lte:endOfDay(fromDate)}},
        ]
    }
    // Filter data for past 7 days if dates are NOT mentioned
    else if(!date && !endDate){
        let toDate = new Date()
        let fromDate = new Date(toDate.getTime() - (7*24 * 60 * 60 * 1000))

        searchParams=[
            {createdAt:{$gte:startOfDay(fromDate)}},
            {createdAt:{$lte:endOfDay(toDate)}},
        ]
    }

    const aggData = await Demandslip.aggregate([
        {$match:{$and: searchParams}
        },
        {$group:{ _id:{ $concat:[
                        {$substr:["$ticketNumber",7,4]},
                        "-",
                        {$substr:["$ticketNumber",5,2]},
                        "-",
                        {$substr:["$ticketNumber",3,2]}
                    ]},
                    totalCost: {$sum: '$totalCost'}
                            
            }
        },{$project:{
                date:{ $dateFromString: {
                    dateString:"$_id"
                }},
                totalCost:1,
                dateString:"$_id",
                _id:0
            }
        },{ $sort: {date:1}}
    ])

    if(!aggData){
        res.status(404)
        throw new Error('No data found')
    }

    res.status(200).json(aggData)
})

module.exports={
    demandSlipAggregateData
}