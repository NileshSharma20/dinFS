import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getAllUsers } from '../../features/users/usersSlice'

import "./User.css"

import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import useAuth from '../../hooks/useAuth'
import Loader from '../../components/Loader/Loader'
import UserCard from '../../components/Cards/UserCard'

function Users() {
    const dispatch = useDispatch()
    const {token} = useSelector((state)=>state.auth)
    const {isAdmin} = useAuth()

    const { usersList, isLoading } = useSelector((state)=>state.users)

    useEffect(()=>{
        dispatch(getAllUsers())
    },[])

  return (
    <>
    {!token && <LoginAgainModal />}
    {isLoading && <Loader />}
    <div>
        
         <div className='form-container' style={{width:"60vw"}}>
            <div className="form-grid">
            {(isAdmin)?
            <>
                <div className="form-group">

                    <div className="header">
                        <h3>User Data</h3>
                    </div>
                
                </div>

                <div className="user-card-grid">

                {(usersList && usersList?.length!==0) && 
                    usersList?.map((userInfo,index)=>
                    
                    <div key={index}>
                        <UserCard info={userInfo} />
                    </div>
                    )
                }
                </div>
            
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