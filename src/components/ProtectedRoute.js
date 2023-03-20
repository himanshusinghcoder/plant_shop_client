import { isEmpty } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({access_level}) {
    const user = useSelector(state => state.user.userData)
    if(access_level > user.access_level){
        return <Navigate to={-1} />
    }else{
        return !isEmpty(user) ? <Outlet /> : <Navigate to={'/login'} />
    }
}

export default ProtectedRoute