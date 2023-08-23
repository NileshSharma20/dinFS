import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"

import "./Form.css"
import { getAllUsers, updateUser } from '../../features/users/usersSlice';

function UserForm({initialValue, setFlag}) {
    const dispatch = useDispatch(); 

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

    const handleCheck=(e)=>{
        const {value, checked} = e.target

        if(checked && !checkList.includes(value)){
            setCheckList(prev=>[...prev, value])
        }else if(!checked){
            setCheckList(prev=>prev.filter(role => role!==value))
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(username===null || firstname===null || lastname===null ||
            !Array.isArray(roles)){
            console.log(`Please enter valid data`)
        }else{
            const userInfo = {
                id,
                username,
                firstname,
                lastname,
                active: active==="true"?true:false,
                roles
            }
            // console.log(`updatedData:${JSON.stringify(userInfo,null,4)}`)
            
            dispatch(updateUser(userInfo))
            dispatch(getAllUsers())
            setFlag(false)
        }
    }

    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////

    useEffect(()=>{
        // console.log(`formData:${JSON.stringify(formData,null,4)}`)
    },[formData])
    
    useEffect(()=>{
        // console.log(`checkList:${checkList}`)
        setFormData((prevState)=>({...prevState, roles:checkList}))
    },[checkList])

    useEffect(()=>{
        // console.log(`form roles:${roles}`)
    },[roles])

  return (
    <div className='card-container' style={{padding:"0", border:"none"}}>
        <p><span style={{fontWeight:"bold", marginBottom:"0.5rem"}}>id: </span> {initialValue._id}</p>
        <form onSubmit={onSubmit}>
            {/* <div className="form-grid"> */}

            <div className="form-group">
                <label>username</label>
                <input type="text" 
                    className='card-form-control'
                    name= 'username'
                    id='username'
                    value = {username}
                    placeholder="Username"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label>firstname</label>
                <input type="text" 
                    className='form-control'
                    name= 'firstname'
                    id='firstname'
                    value = {firstname}
                    placeholder="firstname"
                    autoComplete='off'
                    onChange={onChange} />
            </div>

            <div className="form-group">
                <label>lastname</label>
                <input type="text" 
                    className='form-control'
                    name= 'lastname'
                    id='lastname'
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
                            id="true" 
                            value="true"
                            defaultChecked={initialValue.active?true:false}
                            onChange={onChange} />
                        <label htmlFor="true">Yes</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="active" 
                            id="false" 
                            value="false"
                            defaultChecked={initialValue.active?false:true}
                            onChange={onChange} />
                        <label htmlFor="false">No</label>
                        </div>
                    </div>
                </div>

            <div className="form-group">
                    <label>roles</label>

                    <div className="form-checkbox">
                        <input type="checkbox"
                            name="role-checkbox"
                            id='Admin'
                            value="Admin"
                            defaultChecked={initialValue.roles.includes("Admin")?true:false}
                            onChange={handleCheck} />
                        <span>Admin</span>
                    </div>

                    <div className="form-checkbox">
                        <input type="checkbox" 
                            name="role-checkbox"
                            id='Manager'
                            value="Manager"
                            defaultChecked={initialValue.roles.includes("Manager")?true:false}
                            onChange={handleCheck} />
                        <span>Manager</span>
                    </div>

                    <div className="form-checkbox">
                        <input type="checkbox"  
                            name="role-checkbox"
                            id='Employee'
                            value="Employee"
                            defaultChecked={initialValue.roles.includes("Employee")?true:false} 
                            onChange={handleCheck} />
                        <span>Employee</span>
                    </div>
                
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">
                        Submit
                </button>
            {/* </div> */}
            </div>
        </form>
    </div>
  )
}

export default UserForm