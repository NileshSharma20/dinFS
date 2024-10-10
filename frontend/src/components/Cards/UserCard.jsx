import { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'


import "./Card.css"
import UserForm from '../Forms/UserForm'

function UserCard({info}) {
  const [editFlag, setEditFlag] = useState(false)

  return (
    <>
    
    <div className='card-container'
      style={info.active?{}: {border:`1px solid red`}}
    >
        <div className='edit-btn' 
            onClick={()=>setEditFlag(!editFlag)}>
            {editFlag?<AiOutlineClose />:<FiEdit2 />}
        </div>
      {editFlag?
      <UserForm initialValue={info} setFlag={setEditFlag}/>
      :
      <>
        <p><span>id: </span> {info._id}</p>
        <p><span>username: </span>{info.username}</p>
        <p><span>firstname: </span> {info.firstname}</p>
        <p><span>lastname: </span> {info.lastname}</p>
        <p><span>active: </span>{info.active ?"Yes":"No"}</p>
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