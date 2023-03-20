import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import { API_CALL } from '../helper';
import { API_METHODS } from '../constant';
import { CANCEL_ORDER, ORDER } from '../constant/endpoint';
import { useSelector } from 'react-redux';

function Orders() {
    const { user_id } = useParams()
    const user = useSelector(state => state.user.userData)
    const [orders, setOrders] = useState([])
    const getAllOrders = async () => {
        const result = await API_CALL(API_METHODS.GET, `${ORDER}/${user_id}`, {}, user.token)
        if (result.data.status === 'success') {
            setOrders(result.data.data)
        }
    }

    const cancelOrder = async (id, product) => {
        const result = await API_CALL(API_METHODS.POST, CANCEL_ORDER.replace(':order_id', id), product, user.token, true)
        if (result.data.status === 'success') {
            await getAllOrders()
        }
    }
    useEffect(() => {
        getAllOrders()
    }, [])

    return (
        <div>
            <Table bordered>
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
                    {orders?.map((product) =>
                        <>
                            {product?.products?.map(data => {
                                return <tr key={data._id}>
                                    <td><Link to={`/product/${data._id}`}><img height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data?.image}`} alt={data?.name} /></Link></td>
                                    <td className='fs-5'>{data?.name}</td>
                                    <td className='fs-5'>{data?.quantity}</td>
                                    <td className='fs-5'>Rs {data?.price}</td>
                                    <td className='fs-5'>{data?.discount}%</td>
                                    <td className='fs-5'>Rs {data?.discount_price}</td>
                                </tr>
                            }
                            )}
                            <tr className='bg-dark text-white'>
                                <td className={'bg-light'}>{product.status !== 'Cancelled' ? <button className='btn btn-danger w-100' onClick={() => cancelOrder(product._id, product)}>Cancel Order</button> : <div className='text-danger fs-5 text-center fw-bold bg-light h-100'>Order Cancelled</div>}</td>
                                <td className='fs-4 fw-medium'>Delivered By :- {product?.delivery_data}</td>
                                <td className='fs-4 fw-medium'>{product?.price_breakup.total_item}</td>
                                <td className='fs-4 fw-medium'><span className='fw-light'>Total Price:-</span> Rs {product?.price_breakup.total_price}</td>
                                <td className='fs-4 fw-medium'><span className='fw-light'>Total Discount :- </span> Rs {product?.price_breakup.discount_price}</td>
                                <td className='fs-4 fw-medium'><span className='fw-light'>Final Price:-</span> Rs {product?.price_breakup.final_payment}</td>
                            </tr>
                        </>
                    )
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default Orders