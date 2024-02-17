// @desc Return Paginated data
const paginateData =(dataList, docCount, currPage=1, recordlimit=50, 
    pageCount, firstIndex, lastIndex )=>{
    const results = {}

    results.totalDataLength = docCount
    results.pageCount = pageCount
    results.currentPage = currPage

    if(lastIndex<docCount){
        results.next={
            page : currPage+1
        }
    }

    if(firstIndex>0){
        results.prev = {
            page : currPage - 1
        }  
    }

    results.data = dataList 

    return results
}

module.exports = {paginateData}