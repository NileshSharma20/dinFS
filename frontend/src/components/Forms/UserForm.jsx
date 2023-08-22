import { useEffect } from 'react'
import { useDispatch } from "react-redux"

function UserForm({initialValue}) {
    const dispatch = useDispatch(); 

    const [formData, setFormData] = useState({
        username:'',
        firstname:'',
        lastname:'',
        roles:["Employee"]
    })

    const { username, firstname, lastname, roles } = formData

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
        let updatedRoles = [...roles]
        if(e.target.roles){
            updatedRoles = [...checked, event.target.value];
        }else{
            updatedRoles.splice(checked.indexOf(event.target.value), 1);
        }
        setFormData({...prevData, roles:updatedRoles})
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(username===null || firstname===null || lastname===null ||
            roles?.length || !Array.isArray(roles)){
            console.log(`Please enter valid data`)
        }else{
            console.log(`updatedData:${JSON.stringify(f)}`)
            dispatch(formResponseSubmit({
                customer_name,
                pricePerUnit,
                pricePerUnitOE,
                excDeliveryCharges,
                unit,
                product
            }))
        }
    }

    /////////////////////////////////////////////////
    //////// Hooks //////////////////////////////////
    ////////////////////////////////////////////////
    useEffect(()=>{
        setFormData(initialValue)
        console.log(`iV:${initialValue}`)
    },[])

  return (
    <div className='card-container'>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>username</label>
                <input type="text" 
                    className='form-control'
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
                    <label>roles</label>

                    <input value="Admin" type="checkbox" onChange={handleCheck} />
                    <input value="Admin" type="checkbox" onChange={handleCheck} />
                    <input value="Admin" type="checkbox" onChange={handleCheck} />

                    {/* <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id="admin" 
                            value="admin"
                            onChange={onChange} />
                        <label htmlFor="admin">Admin</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id="manager" 
                            value="manager"
                            onChange={onChange} />
                        <label htmlFor="manager">Manager</label>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-group-item">
                        <input type="radio" 
                            name="roles" 
                            id="employee" 
                            value="employee"
                            onChange={onChange} />
                        <label htmlFor="employee">Employee</label>
                        </div>
                    </div> */}
                </div>
        </form>
    </div>
  )
}

export default UserForm