import { useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const { token } = useSelector((state)=>state.auth)
    let isManager = false
    let isAdmin = false
    let isEmployee = false
    let status = ""

    if(token){
        const decoded = jwtDecode(token)
        const { username,roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isEmployee = roles.includes('Employee')

        if(isEmployee){
            status = "Employee"
        }
        if(isManager){
            status = "Manager"
        }
        if(isAdmin){
            status = "Admin"
        }

        return { username, roles, isManager, isAdmin, status }
    }

    return {username:"", roles:[], isManager, isAdmin, status}
}

export default useAuth