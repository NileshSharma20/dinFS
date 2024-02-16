// @desc Return Paginated data
const paginateData =(dataList, currPage=1, recordlimit=50 )=>{
    const results = {}

    results.totalDataLength = dataList.length
    results.pageCount = Math.ceil(dataList.length / recordlimit)
    results.currentPage = currPage

    const firstIndex = (currPage-1)*recordlimit
    const lastIndex = currPage*recordlimit

    if(lastIndex<dataList.length){
        results.next={
            page : currPage+1
        }
    }

    if(firstIndex>0){
        results.prev = {
            page : currPage - 1
        }  
    }

    results.data = dataList.slice(firstIndex,lastIndex) 

    return results
}

module.exports = {paginateData}