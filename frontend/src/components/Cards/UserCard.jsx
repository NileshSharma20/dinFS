import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'

import "./Card.css"
import UserForm from '../Forms/UserForm'

function UserCard({info}) {
  const [editFlag, setEditFlag] = useState(false)

  return (
    <>
    
    <div className='card-container'>
        <div className='edit-btn' 
            onClick={()=>setEditFlag(!editFlag)}>
            <FiEdit2 />
        </div>
      {editFlag?
      <UserForm initialValue={info} setFlag={setEditFlag}/>
      :
      <>
        <p><span>id: </span> {info._id}</p>
        <p><span>username: </span>{info.username}</p>
        <p><span>firstname: </span> {info.firstname}</p>
        <p><span>lastname: </span> {info.lastname}</p>
        <p><span>active: </span>{info.active ?"true":"false"}</p>
        <p><span>roles: </span>
        {info.roles?.map((role,i)=><span style={{fontWeight:"normal"}} key={i}>{role} </span>)}</p>
        <br />
      </>
      }
    </div>
    </>
  )
}

export default UserCard