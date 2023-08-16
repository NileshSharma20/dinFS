import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getAllUsers } from '../../features/users/usersSlice'
import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import useAuth from '../../hooks/useAuth'
import Loader from '../../components/Loader/Loader'

function Users() {
    const dispatch = useDispatch()
    const {token} = useSelector((state)=>state.auth)
    const {isAdmin} = useAuth()

    const {usersList, isLoading} = useSelector((state)=>state.users)

    useEffect(()=>{
        dispatch(getAllUsers())
    },[])

  return (
    <>
    {!token && <LoginAgainModal />}
    {isLoading && <Loader />}
    <div>
        
         <div className='form-container'>
            <div className="form-grid">
            {(isAdmin)?
            <>
                {/* <div className="form-group">
                    <div className="control-btn"
                        onClick={()=>dispatch(getAllUsers())}
                        >
                        User Data
                    </div>
                </div> */}

                {(usersList && usersList?.length!==0) && 
                    usersList?.map((userInfo,index)=>
                    <div key={index}>
                    <p>_id: {userInfo._id}</p>
                    <p>username:{userInfo.username}</p>
                    <p>firstname: {userInfo.firstname}</p>
                    <p>lastname: {userInfo.lastname}</p>
                    <p>roles:{userInfo.roles?.map((role,i)=><span key={i}>{role},</span>)}</p>
                    <br />
                    </div>
                    )
                }
            
            </>
            :
            <p>Unauthorized</p>
            }
            </div>
        </div>
    </div>
    </>
  )
}

export default Users