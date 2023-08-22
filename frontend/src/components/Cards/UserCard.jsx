import React from 'react'
import "./Card.css"

function UserCard({info}) {
  return (
    <div className='card-container'>
        <p><span>id: </span> {info._id}</p>
        <p><span>username: </span>{info.username}</p>
        <p><span>firstname: </span> {info.firstname}</p>
        <p><span>lastname: </span> {info.lastname}</p>
        <p><span>roles: </span>{info.roles?.map((role,i)=><span style={{fontWeight:"normal"}} key={i}>{role} </span>)}</p>
        <br />
    </div>
  )
}

export default UserCard