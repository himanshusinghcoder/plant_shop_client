import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import { Link, useNavigate } from 'react-router-dom';
import { API_CALL } from '../helper';
import { API_METHODS } from '../constant';
import { ORDER } from '../constant/endpoint';
import { setUserData } from '../redux/userSlice';

const date = new Date()
const dateAfterSevenDays = date.setDate(date.getDate() + 7);
const deliveryDate = new Date(dateAfterSevenDays)
const confirmDeliveryDate = `${deliveryDate.getDate()}-${deliveryDate.getMonth()}-${deliveryDate.getFullYear()}`


function CheckoutCart() {
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        pin_code: '',
    })

    const placeOrder = async (e) => {
        e.preventDefault()
        const price_breakup = {
            total_item: user?.cart?.reduce((total, data) => total + data?.quantity, 0),
            total_price: user?.cart?.reduce((total, data) => total + data?.total_price, 0),
            discount_price: user?.cart?.reduce((total, data) => total + data?.total_price, 0) - user?.cart?.reduce((total, data) => total + data?.discount_price, 0),
            final_payment: user?.cart?.reduce((total, data) => total + data?.discount_price, 0),
        }
        const data = {
            ...orderDetails,
            address: `${orderDetails.address} ${orderDetails.city} ${orderDetails.state} (${orderDetails.pin_code})`,
            user_id: user.id,
            delivery_data:`${confirmDeliveryDate}`,
            price_breakup: price_breakup,
            products: user.cart
        }
        const result = await API_CALL(API_METHODS.POST, ORDER, data, user.token, true)
        if(result.data.status === 'success'){
            navigate(`/orders/${user.id}`)
            dispatch(setUserData({ ...user, cart: [] }))
        }
    }

    const setOrderAddress = (e) => {
        setOrderDetails({...orderDetails, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='fs-5'>Item Image</th>
                            <th className='fs-5'>Item Name</th>
                            <th className='fs-5'>Item Quantity</th>
                            <th className='fs-5'>Per Item Price</th>
                            <th className='fs-5'>Discount</th>
                            <th className='fs-5'>Total Item Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user?.cart.map(data => {
                            return <tr key={data._id}>
                                <td><Link to={`/product/${data._id}`}><img height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data?.image}`} alt={data?.name} /></Link></td>
                                <td className='fs-5'>{data?.name}</td>
                                <td className='fs-5'>{data?.quantity}</td>
                                <td className='fs-5'>Rs {data?.price}</td>
                                <td className='fs-5'>{data?.discount}%</td>
                                <td className='fs-5'>Rs {data?.discount_price}</td>
                            </tr>
                        })
                        }
                    </tbody>
                </Table>
                <div className='d-flex mb-3 flex-wrap'>
                    <div className='border flex-grow-1'>
                        <div className='fs-4 fw-medium'><span className='fw-light'>Total Items:-</span> {user?.cart?.reduce((total, data) => total + data?.quantity, 0)}</div>
                        <hr></hr>
                        <div className='fs-4 fw-medium'><span className='fw-light'>Total Price:-</span> Rs {user?.cart?.reduce((total, data) => total + data?.total_price, 0)}</div>
                        <hr></hr>
                        <div className='fs-4 fw-medium'><span className='fw-light'>Discount Price:-</span> Rs {user?.cart?.reduce((total, data) => total + data?.total_price, 0) - user?.cart?.reduce((total, data) => total + data?.discount_price, 0)}</div>
                        <hr></hr>
                        <div className='fs-4 fw-medium'><span className='fw-light'>Checkout Price:-</span> Rs {user?.cart?.reduce((total, data) => total + data?.discount_price, 0)}</div>
                        <hr></hr>
                        <div className='fs-4 fw-medium'><span className='fw-light'>Estimate Delivery:-</span> {confirmDeliveryDate}</div>
                        <hr></hr>
                    </div>
                    <div className='flex-grow-1 border'>
                        <form onSubmit={placeOrder}>
                            <div className="form-floating m-1">
                                <input type="text" className="form-control fs-4" name='name' id="person_name" required onChange={setOrderAddress} />
                                <label htmlFor="person_name">Full Name</label>
                            </div>
                            <div className="form-floating m-1">
                                <input type='number' className="form-control fs-4" name='phone_number' id="person_number" onChange={setOrderAddress}  required />
                                <label htmlFor="person_number">Phone Number</label>
                            </div>
                            <div className="form-floating m-1">
                                <input type="text" className="form-control fs-4" name='address' id="person_address" onChange={setOrderAddress} required />
                                <label htmlFor="person_address">Address</label>
                            </div>
                            <div className="form-floating m-1">
                                <input type="text" className="form-control fs-4" name='city' id="city" required onChange={setOrderAddress} />
                                <label htmlFor="city">City</label>
                            </div>
                            <div className="form-floating m-1">
                                <input type="text" className="form-control fs-4" name='state' id="State" required onChange={setOrderAddress} />
                                <label htmlFor="State">State</label>
                            </div>
                            <div className="form-floating m-1">
                                <input type="number" name='pin_code' className="form-control fs-4" id="pin_code" required onChange={setOrderAddress} />
                                <label htmlFor="pin_code">Pin Code</label>
                            </div>
                            <div className='text-center fs-4 mb-4'><button to={'/checkout'} className='btn btn-success btn-lg mt-4 ps-5 pe-5 '>Place Order</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCart