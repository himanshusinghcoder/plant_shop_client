import React, { useEffect, useState } from 'react'
import Input from '../../components/Input'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { USER } from '../../constant/endpoint'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { isEmpty } from 'lodash'
import { API_CALL } from '../../helper'
import { API_METHODS } from '../../constant'

function AdminUser() {
    const { user_id } = useParams()
    const user = useSelector(state => state.user.userData)
    const [userDetails, setUserDetails] = useState({
        username: '',
        password: '',
        access_level: 0
    })

    const setUserInfo = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    const addUser = async (e) => {
        e.preventDefault()
        if(isValidate()){
           await addOrUpdateUser()
        }
        
    }


    const addOrUpdateUser = async () => {
        if(isEmpty(userDetails.password)){
            delete userDetails.password
        }
        try {
            if(!isEmpty(user_id)){
               await API_CALL(API_METHODS.PATCH, `${USER}/${user_id}`, {...userDetails, access_level: Number(userDetails.access_level)}, user.token)
            }else{
                await axios.post(USER, { ...userDetails, access_level: Number(userDetails.access_level) })
            }
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'user successfully created or modify',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload()
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.response.data.error,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    const getUserData =  async () => {
        const res = await API_CALL(API_METHODS.GET, `${USER}/${user_id}`, {}, user.token)
        if(res.data.status === 'success'){
            setUserDetails({
                ...res.data.data,
                access_level: `${res.data.data.access_level}`
            })
        }
    }


    const isValidate = () => {
        let validate = true
        for (const key in userDetails) {
            if (isEmpty((userDetails[key])) && key !== 'password') {
                validate = false
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `Please fill the field ${key}`,
                    showConfirmButton: false,
                    timer: 1500
                })
                return validate    
            }
        }
       return validate
    }

    useEffect(() => {
        if(!isEmpty(user_id)){
            getUserData()
        }
    },[])
    return (
        <div className='d-flex flex-column align-items-center'>
            <h1 className='text-center mt-5 fs-2'>{user_id ? 'Edit' : 'Add'} User</h1>
            <form onSubmit={addUser}>
                <Input placeholder='Username' name={'username'} value={userDetails.username} onChange={setUserInfo} type={'email'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Password' name={'password'} value={userDetails.password} onChange={setUserInfo} type={'text'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Address (house no., area, city, pin code)' name={'address'} value={userDetails.address} onChange={setUserInfo} type={'text'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                {window.location.href.includes('/admin') && <Input placeholder='Access Level' type={'select'} name={'access_level'} value={userDetails.access_level} onChange={setUserInfo} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'>
                </Input>}
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <button type='submit' className='btn btn-success btn-lg fs-3 pe-5 ps-5 mt-3'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AdminUser