import React, { useState } from 'react'
import Input from '../components/Input'
import Styles from './login.module.css'
import axios from 'axios'
import { LOGIN, REGISTER, USER } from '../constant/endpoint'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { isEmpty } from 'lodash'
import { API_CALL } from '../helper'
import { API_METHODS } from '../constant'
import { emptyCart } from '../redux/cartSlice'

function Login() {
    const cart = useSelector(state => state.cart.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState({
        username: '',
        password: ''
    })
    const setUserInfo = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const loginUser = async (e) => {
        if (e) {
            e.preventDefault()
        }
        try {
            const result = await axios.post(LOGIN, userDetails)
            if (result.data.status === 'success') {
                if (isEmpty(result.data.data.cart)) {
                    const data = { ...result.data.data, cart: cart }
                    if (!isEmpty(cart)) {
                        await API_CALL(API_METHODS.PATCH, `${USER}/${data.id}`, { user_cart: data.cart }, data.token)
                    }
                    setTimeout(() => {
                        dispatch(setUserData(data))
                        dispatch(emptyCart())
                    }, 500)
                    navigate('/home')
                } else {
                    const data = { ...result.data.data }
                    const oldCartIds = []
                    const newCartData = data.cart.map(data => {
                        oldCartIds.push(data._id)
                        const existProduct = !isEmpty(cart) && cart.find(oldCart => oldCart._id === data._id)
                        if (!isEmpty(existProduct)) {
                            return {
                                ...data,
                                discount_price: data.discount_price + existProduct.discount_price,
                                price: data.price + existProduct.price,
                                quantity: data.quantity + existProduct.quantity,
                                total_price: data.total_price + existProduct.total_price,
                            }
                        } else {
                            return data
                        }
                    })
                    const oldCart = cart.filter(data => !oldCartIds.includes(data._id))
                    data.cart = [...newCartData, ...oldCart]
                    await API_CALL(API_METHODS.PATCH, `${USER}/${data.id}`, { user_cart: data.cart }, data.token)
                    setTimeout(() => {
                        dispatch(setUserData(data))
                        dispatch(emptyCart())
                    }, 500)
                    navigate('/home')
                }
            }
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


    const signUpUser = async (e) => {
        e.preventDefault()
        const result = await API_CALL(API_METHODS.POST, REGISTER, { ...userDetails, access_level: 20 }, null)
        if (result.data.status === 'success') {
            await loginUser()
        }
    }


    return (
        <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form className={Styles.login_form}>
                <Input placeholder='Username' name={'username'} value={userDetails.username} onChange={setUserInfo} type={'email'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0' required={true}></Input>
                <Input placeholder='Password' name={'password'} value={userDetails.password} onChange={setUserInfo} type={'password'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0' required={true}></Input>
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-lg btn-success m-2' type='submit' onClick={loginUser}>Sign In</button>
                    <button className='btn btn-lg btn-info m-2' type='submit' onClick={signUpUser}>Sign Up</button>̋
                </div>
            </form>
        </div>
    )
}

export default Login