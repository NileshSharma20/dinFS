import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import "./Form.css"
import { getAllUsers, updateUser } from '../../features/users/usersSlice';

function UserForm({initialValue, setFlag}) {
    const dispatch = useDispatch(); 

    const { isSuccess, message } = useSelector((state)=>state.users)

    const [formData, setFormData] = useState({
        id: initialValue._id,
        username: initialValue.username,
        firstname: initialValue.firstname,
        lastname: initialValue.lastname,
        active: initialValue.active,
        roles: initialValue.roles
    })

    const { id, username, firstname, lastname, active, roles } = formData
    const [checkList, setCheckList] = useState([...initialValue.roles])

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const handleRoles=(e)=>{
        if(e.target.value==="admin"){
            setCheckList(["Admin","Manager","Accountant","Employee"])
        }else if(e.target.value==="manager"){
            setCheckList(["Manager","Accountant","Employee"])
        }else if(e.target.value==="accountant"){
            setCheckList(["Accountant","Employee"])
        }else if(e.target.value==="employee"){
            setCheckList(["Employee"])
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(username===null || firstname===null || lastname===null ||
            !Array.isArray(roles)){
            console.log(`Please enter valid data`)
        }else{
            // console.log(`formData:${JSON.stringify(formData,null,4)}`)
            const userInfo = {
                id,
                username,
                firstname,
                lastname,
                active:active===true||active==="true"?true:false,
                roles
            }
            
            dispatch(updateUser(userInfo))
        }
    }

    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////
    
    useEffect(()=>{
        setFormData((prevState)=>({...prevState, roles:checkList}))
        // console.log(`formData:${JSON.stringify(formData,null,4)}`)
    },[checkList])

    useEffect(()=>{
        if(isSuccess && message!==""){
            dispatch(getAllUsers())

            if(isSuccess){
                // console.log(`get all finished`)
                setFlag(false)
             }
        }
    },[isSuccess])

  return (
    <div className='card-container' style={{padding:"0", border:"none"}}>
        <p><span style={{fontWeight:"bold", marginBottom:"0.5rem"}}>id: </span> {initialValue._id}</p>
        <form onSubmit={onSubmit}>

            <div className="form-group">
                <label htmlFor={`username ${initialValue.username}`}>username</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'username'
                    id={`username ${initialValue.username}`}
                    value = {username}
                    placeholder="Username"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`firstname ${initialValue.firstname}`}>firstname</label>
                <input type="text" 
                    className='form-control'
                    name= 'firstname'
                    id={`firstname ${initialValue.firstname}`}
                    value = {firstname}
                    placeholder="firstname"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label htmlFor={`lastname ${initialValue.lastname}`}>lastname</label>
                <input type="text" 
                    className='form-control'
                    name='lastname'
                    id={`lastname ${initialValue.lastname}`}
                    value = {lastname}
                    placeholder="lastname"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                    <label>active</label>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="active" 
                            id={`${initialValue.username} active true`} 
                            value={`true`}
                            defaultChecked={initialValue.active?true:false}
                            onChange={onChange} />
                        <label htmlFor={`${initialValue.username} active true`}>Yes</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="active" 
                            id={`${initialValue.username} active false`} 
                            value={`false`}
                            defaultChecked={initialValue.active?false:true}
                            onChange={onChange} />
                        <label htmlFor={`${initialValue.username} active false`}>No</label>
                        </div>
                    </div>
                </div>

            <div className="form-group">
                    <label>roles</label>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id={`${initialValue.username} role admin`} 
                            value="admin"
                            defaultChecked={initialValue.roles.includes("Admin")?true:false}
                            onChange={handleRoles} />
                        <label htmlFor={`${initialValue.username} role admin`}>Admin</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id={`${initialValue.username} role manager`} 
                            value="manager"
                            defaultChecked={initialValue.roles.includes("Manager") && 
                                            !initialValue.roles.includes("Admin") ?
                                            true:false}
                            onChange={handleRoles} />
                        <label htmlFor={`${initialValue.username} role manager`}>Manager</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id={`${initialValue.username} role accountant`} 
                            value="accountant"
                            defaultChecked={initialValue.roles.includes("Accountant") && 
                                            !initialValue.roles.includes("Admin") &&
                                            !initialValue.roles.includes("Manager") ?
                                            true:false}
                            onChange={handleRoles} />
                        <label htmlFor={`${initialValue.username} role accountant`}>Accountant</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id={`${initialValue.username} role employee`} 
                            value="employee"
                            defaultChecked={initialValue.roles.includes("Employee") && 
                                            !initialValue.roles.includes("Admin") && 
                                            !initialValue.roles.includes("Manager") && 
                                            !initialValue.roles.includes("Accountant") ?
                                            true:false}
                            onChange={handleRoles} />
                        <label htmlFor={`${initialValue.username} role employee`}>Employee</label>
                        </div>
                    </div>
                
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">
                        Update
                    </button>
                </div>
                
        </form>
    </div>
  )
}

export default UserForm