const asyncHandler = require('express-async-handler')
const fs = require("fs")
const { generateBillTicket } = require('../helper/billHelper')


const User = require("../models/userModel")
const Bill = require("../models/billModel")
const Billhistory = require("../models/billHistoryModel")
const { paginateData } = require('../helper/paginationHelper')

// @desc   Create a new Bill
// @route  POST /api/bill/
// @access Private
const createNewBill = asyncHandler(async (req,res)=>{
    const {
        billProductList,
        totalCost,
        extraDiscount
    } = req.body

    const { username } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized: User does not exist or inactive')
    }
    
    const employeeId = employeeExists._id

    // Check if Billed Product List is empty or Total Cost is zero
    if(!totalCost || 
        !Array.isArray(billProductList) || 
        !billProductList.length){
            res.status(400)
            throw new Error(`Empty Product List or Zero Total Cost`)
    }

    // Total cost check
    let checkTotalPrice = billProductList.reduce((res,item)=>{
        let discountInt = (100 - item.prodDiscount)/100
        let discountedPrice = parseFloat((item.price*discountInt).toFixed(2))
        let totalItemPrice = discountedPrice*item.quantity

        return res+totalItemPrice
    },0)

    checkTotalPrice = Math.round(checkTotalPrice)-extraDiscount

    // console.log(`checkTotalPrice:${checkTotalPrice}\ttype:${typeof checkTotalPrice}`)

    const { ticketNumber, date } = await generateBillTicket()

    const newBillData = {
        ticketNumber,
        employeeId,
        username: employeeExists.username,
        totalCost: checkTotalPrice,
        extraDiscount: extraDiscount || 0,
        billProductList
    }

    const billData = await Bill.create(newBillData)
    const billHistoryData = await Billhistory.create(newBillData)
    // res.status(201).json({billData: newBillData})

    if(billData && billHistoryData){
        res.status(201).json({billData: newBillData})
    }else{
        res.status(400)
        throw new Error(`Upload Failure: Problem during uploading to Database`)
    }

})

// @desc   Get all Bills
// @route  GET /api/bill
// @access Private (Manager and above)
const getAllBills = asyncHandler(async(req,res)=>{
    const { username, roles } = req

    const currPage = parseInt(req.query.page) || 1
    const recordLimit = parseInt(req.query.limit) || 50
    
    const firstIndex = (currPage-1)*recordLimit
    const lastIndex = currPage*recordLimit
    
    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized: User does not exist or inactive')
    }

    // Check for Manager status
    if(!roles.includes("Manager")){
        res.status(403)
        throw new Error("Forbidden: Manager and above Access Level required")
    }

    const docCount = await Bill?.find().countDocuments()
    let bills = await Bill?.find()
                            .skip(firstIndex)
                            .limit(recordLimit)
                            .lean().exec()
    
    const pageCount = Math.ceil(docCount / recordLimit)
    
    if(currPage>pageCount){
        res.status(404)
        throw new Error('Page not Found')
    }

    const paginatedBills = 
        paginateData(bills, docCount, currPage, recordLimit,
            pageCount, firstIndex, lastIndex)

    // res.status(200).json(results)
    res.status(200).json(paginatedBills)
    
})

// @desc   Get date filtered Bills
// @route  GET /api/bills/filter
// @access Private
const getFilteredBills = asyncHandler(async(req,res)=>{
    const { date, 
            endDate,
            publisherUsername, 
            status, 
            ticketNum,
            dataStatus    
        } = req.query
    
    const currentDate = new Date();

    let todayDate = currentDate.getDate();
    let todayMonth = currentDate.getMonth() + 1;
    let todayYear = currentDate.getFullYear();

    if(todayDate<10){
        todayDate = `0${todayDate}`
    }
    
    if(todayMonth<10){
        todayMonth = `0${todayMonth}`
    }

    const fullCurrentDateString = todayYear+'-'+todayMonth+'-'+todayDate
    const fullCurrentDate = new Date(fullCurrentDateString)

    const fullCurrentDateClean = todayYear+todayMonth+todayDate

    // let weekAgoDate = new Date(fullCurrentDate - 7 * 24 * 60 * 60 * 1000)
    // console.log(`week ago date: ${weekAgoDate}`)
    
    // Pagination Params 
    const currPage = parseInt(req.query.page) || 1
    const recordLimit = parseInt(req.query.limit) || 50

    const firstIndex = (currPage-1)*recordLimit
    const lastIndex = currPage*recordLimit
    
    // VerifyJWT params
    const { username, roles } = req

    // Start data validation
    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }
    
    var bills, docCount, pageCount

    // Employee Level Access
    if(!roles?.length || !Array.isArray(roles) ||
        !roles.includes("Accountant")){

            // Employee Level Access
            let searchParams = []

            // Params based search string
            if(ticketNum){
                searchParams=[{ticketNumber:{ $regex:ticketNum}},
                    ...searchParams]
            }

            // Find all incase of no search params
            if(searchParams.length!==0){
                docCount = await Bill.find({$and: [
                            ...searchParams,
                            {ticketNumber:{ $regex:fullCurrentDateClean}},
                            {username:username},
                            {employeeId: employeeExists._id.toString()},
                            ]
                            })
                        .countDocuments()
                
                bills = await Bill.find({$and: [
                                ...searchParams,
                                {ticketNumber:{ $regex:date}},
                                {username:username},
                                {employeeId: employeeExists._id.toString()},
                            ]
                            },
                        '-_id -__v -employeeId -createdAt -updatedAt')
                        .skip(firstIndex)
                        .limit(recordLimit)
                        .lean().exec()
            }
            // Parameterized search
            else{
                docCount = await Bill.find({
                                username:username,
                                employeeId: employeeExists._id.toString(),
                                ticketNumber:{ $regex: date}
                            
                        }).countDocuments()

                bills = await Bill.find({
                        username:username,
                        employeeId: employeeExists._id.toString(),
                        ticketNumber:{ $regex: date}
                    
                        },'-_id -__v -employeeId -createdAt -updatedAt')
                        .skip(firstIndex)
                        .limit(recordLimit)
                        .lean().exec()
            }
        
        }else if(roles.includes("Accountant") && !roles.includes("Manager")){
            // Accountant Level Access
            let searchParams = []
            let weekAgoDate = new Date(fullCurrentDate - 7 * 24 * 60 * 60 * 1000)

            // Maximum Date Range for Accountant is 7days from today
            searchParams = [
                {createdAt:{$gte:startOfDay(weekAgoDate)}},
                {createdAt:{$lte:endOfDay(fullCurrentDate)}}
            ]

            // Params based search string
            if(date && !endDate){
                let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2)
                let fromDate = new Date(fromDateString) 
                
                if(fromDate < weekAgoDate){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(weekAgoDate)}},
                        {createdAt:{$lte:endOfDay(weekAgoDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: Date Range Greater than 7 days')
                }else{
                    searchParams=[{ticketNumber:{ $regex:date}}, ...searchParams]
                }
            }
            if(date && endDate){
                let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2) 
                let toDateString = endDate.slice(4)+
                                    '-'+endDate.slice(2,4)+
                                    '-'+endDate.slice(0,2)
                let fromDate = new Date(fromDateString) 
                let toDate = new Date(toDateString) 

                if(fromDate < weekAgoDate && !(toDate>fullCurrentDate)){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(weekAgoDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: Date Range Greater than 7 days')
                }else if(toDate>fullCurrentDate && !(fromDate<weekAgoDate)){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(fullCurrentDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: End Date Greater than Today')
                }else if(fromDate < weekAgoDate && toDate>fullCurrentDate){
                    searchParams=[...searchParams]
                }else{
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                }

            }
        
            if(publisherUsername){
                searchParams = [{username:publisherUsername}, ...searchParams]
            }
            if(ticketNum){
                searchParams=[{ticketNumber:{ $regex:ticketNum}},
                    ...searchParams]
            }

            // Parameterized search
            docCount = await Bill.find({$and: searchParams})
                                    .countDocuments()

            bills = await Bill.find({$and: searchParams}
                                    ,'-_id -__v')
                                    .skip(firstIndex)
                                    .limit(recordLimit)
                                    .lean().exec()

        }else{
            // Manager and Admin Level Access
                let searchParams = []

                // Params based search string
                if(date && !endDate){
                    searchParams=[{ticketNumber:{ $regex:date}}, ...searchParams]
                }
                if(date && endDate){
                    let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2)
                    let toDateString = endDate.slice(4)+
                                    '-'+endDate.slice(2,4)+
                                    '-'+endDate.slice(0,2)
                    let fromDate = new Date(fromDateString)
                    let toDate = new Date(toDateString) 
                    
                    // console.log(`fD:${startOfDay(fromDate)}`)
                    // console.log(`tD:${endOfDay(toDate)}`)
                    // .toISOString()
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                }
                if(publisherUsername){
                    searchParams = [{username:publisherUsername}, ...searchParams]
                }
                if(ticketNum ){
                    searchParams=[{ticketNumber:{ $regex:ticketNum}},
                        ...searchParams]
                }

                // Find all incase of no search params
                if(!date && !status && !publisherUsername && !ticketNum & !dataStatus){
                    docCount = await Demandslip?.find().countDocuments()

                    bills = await Demandslip?.find({}
                                        ,'-id -__v')
                                        .skip(firstIndex)
                                        .limit(recordLimit)
                                        .lean().exec()
                }
                // Parameterized search
                else{
                    docCount = await Bill.find({$and: searchParams})
                                            .countDocuments()

                    bills = await Bill.find({$and: searchParams}
                                            ,'-_id -__v')
                                            .skip(firstIndex)
                                            .limit(recordLimit)
                                            .lean().exec()
                }
    }

    // Paginate Data
    if(docCount){
        pageCount = Math.ceil(docCount / recordLimit)
        
        if(currPage>pageCount){
            res.status(404)
            throw new Error('Page not Found')
        }
    }else{
        let results = {
            totalDataLength:0,
            pageCount:1,
            currentPage:1,
            data: bills
        }
        return res.status(200).json(results)
    }
    
    
    const paginatedBills = paginateData(bills, docCount, 
        currPage, recordLimit, pageCount, firstIndex, lastIndex)

    res.status(200).json(paginatedBills)
})

module.exports={
    createNewBill,
    getAllBills,
    getFilteredBills,
}