import { useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const { token } = useSelector((state)=>state.auth)
    let isManager = false
    let isAdmin = false
    let isAccountant = false
    let isEmployee = false
    let status = ""

    if(token){
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isAccountant = roles.includes('Accountant')
        isEmployee = roles.includes('Employee')

        if(isEmployee){
            status = "Employee"
        }
        if(isAccountant){
            status = "Accountant"
        }
        if(isManager){
            status = "Manager"
        }
        if(isAdmin){
            status = "Admin"
        }

        return { username, roles, isManager, isAdmin, isAccountant, status }
    }

    return {username:"", roles:[], isManager, isAdmin, isAccountant, status}
}

export default useAuth