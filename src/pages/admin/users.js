import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { USER } from '../../constant/endpoint'
import { API_CALL } from '../../helper'
import { API_METHODS } from '../../constant'
import Table from 'react-bootstrap/Table';
import { isEmpty } from 'lodash'

function AllUsers() {
    const user = useSelector(state => state.user.userData)

    const [users, setAllUsers] = useState([])

    const getAllUsers = async () => {
        const res = await API_CALL(API_METHODS.GET, USER,{},user.token)
        if(res.data.status === 'success'){
            setAllUsers(res.data.data)
        }
    }

    const deleteUser = async (id) => {
        const res = await API_CALL(API_METHODS.DELETE, `${USER}/${id}`, {}, user.token)
        if(res.data.status === 'success'){
            setAllUsers(prevuser => prevuser.filter(data => data._id !== id))
        }
    }

    useEffect(() => {
        if(isEmpty(users)){
            getAllUsers()
        }
    })

    return (
        <div className='container-fluid'>
            <div className='text-end'><Link to={'/admin/user'} className='btn btn-success btn-lg m-2'>+ Add User</Link></div>
            <div className='m-2'>
            <Table className='fs-4' striped bordered hover responsive>
                <thead>
                    <tr>
                    <th align='left'>S.no</th>
                    <th align='left'>Id</th>
                    <th align='left'>Username</th>
                    <th align='left'>Edit</th>
                    <th align='left'>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((data, i) => <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{data._id}</td>
                        <td>{data.username}</td>
                        <td><Link to={`/admin/user/${data._id}`} className='btn btn-warning w-100'>Edit</Link></td>
                        <td><button className='btn btn-danger w-100' onClick={() => deleteUser(data._id)}>Delete</button></td>
                    </tr>)}
                </tbody>
            </Table>
            </div>
        </div>
    )
}

export default AllUsers