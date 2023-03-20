import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import { isEmpty } from 'lodash';
import { API_CALL, RemoveItemFromCart } from '../helper';
import { addProductToUserCart, setUserData } from '../redux/userSlice';
import { addCart, emptyCart, setCart } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { API_METHODS } from '../constant';
import { ALTER_PRODUCT } from '../constant/endpoint';
import Swal from 'sweetalert2';


function Cart() {
    const cart = useSelector(state => state.cart.cart)
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()
    const removeItem = (id) => {
        if (!isEmpty(user)) {
            const newCart = RemoveItemFromCart(user.cart, id)
            dispatch(setUserData({ ...user, cart: newCart }))
        } else {
            const newCart = RemoveItemFromCart(cart, id)
            dispatch(setCart(newCart))
        }
    }

    const addToCart = async (data) => {
        const getProductQuantity = await API_CALL(API_METHODS.GET, ALTER_PRODUCT.replace(':product_id', data._id))
        if ((getProductQuantity.data.data.quantity - data.quantity) > 0) {
            if (isEmpty(user)) {
                const addToCartData = {
                    price: data.price,
                    quantity: 1,
                    name: data.name,
                    image: data.image,
                    _id: data._id,
                    discount: data.discount
                }
                dispatch(addCart(addToCartData))
            } else {
                const addToCartData = {
                    price: data.price,
                    quantity: 1,
                    name: data.name,
                    image: data.image,
                    _id: data._id,
                    discount: data.discount
                }
                dispatch(addProductToUserCart(addToCartData))
            }
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'sorry the product is out of stock',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const clearCart = () => {
        if (!isEmpty(user)) {
            dispatch(setUserData({ ...user, cart: [] }))
        } else {
            dispatch(emptyCart())
        }
    }

    return (
        <div>
            {(!isEmpty(user.cart) || !isEmpty(cart)) &&
                <div className='text-end'>
                    <button className='btn btn-danger btn-lg m-2' onClick={clearCart}>Empty Cart</button>
                </div>
            }
            {(!isEmpty(user.cart) || !isEmpty(cart)) ?
                <>
                    {isEmpty(user) && <>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th className='fs-5'>Item Image</th>
                                    <th className='fs-5'>Item Name</th>
                                    <th className='fs-5'>Item Quantity</th>
                                    <th className='fs-5'>Per Item Price</th>
                                    <th className='fs-5'>Discount</th>
                                    <th className='fs-5'>Total Item Price</th>
                                    <th className='fs-5'>Add/Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(data => {
                                    return <tr key={data._id}>
                                        <td><Link to={`/product/${data._id}`}><img loading='lazy' height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data?.image}`} alt={data?.name} /></Link></td>
                                        <td className='fs-5'>{data?.name}</td>
                                        <td className='fs-5'>{data?.quantity}</td>
                                        <td className='fs-5'>Rs {data?.price}</td>
                                        <td className='fs-5'>{data?.discount}%</td>
                                        <td className='fs-5'>Rs {data?.discount_price}</td>
                                        <td><button className='btn btn-success' onClick={() => addToCart(data)}>&nbsp; + Add &nbsp;</button>&nbsp; <button className='btn btn-danger' onClick={() => removeItem(data?._id)}>&nbsp;- Remove&nbsp;</button></td>
                                    </tr>
                                })
                                }
                            </tbody>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className='fs-4'>Total Item</th>
                                    <th className='fs-4'>Total Price</th>
                                    <th className='fs-4'>Total Discount</th>
                                    <th className='fs-4'>Final Checkout Price</th>
                                    <th className='fs-4'>Checkout</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='fs-4'>{cart.reduce((total, data) => total + data?.quantity, 0)}</td>
                                    <td className='fs-4'>Rs {cart.reduce((total, data) => total + data?.total_price, 0)}</td>
                                    <td className='fs-4'>Rs {cart.reduce((total, data) => total + data?.total_price, 0) - cart.reduce((total, data) => total + data?.discount_price, 0)}</td>
                                    <td className='fs-4'>Rs {cart.reduce((total, data) => total + data?.discount_price, 0)}</td>
                                    <td className='fs-4'><Link to={'/login'} className='btn btn-primary btn-lg'>Checkout</Link></td>
                                </tr>
                            </tbody>
                        </Table>
                    </>
                    }
                    {!isEmpty(user) && <>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th className='fs-5'>Item Image</th>
                                    <th className='fs-5'>Item Name</th>
                                    <th className='fs-5'>Item Quantity</th>
                                    <th className='fs-5'>Per Item Price</th>
                                    <th className='fs-5'>Discount</th>
                                    <th className='fs-5'>Total Item Price</th>
                                    <th className='fs-5'>Add/Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user?.cart.map(data => {
                                    return <tr key={data._id}>
                                        <td><Link to={`/product/${data._id}`}><img loading='lazy' height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data?.image}`} alt={data?.name} /></Link></td>
                                        <td className='fs-5'>{data?.name}</td>
                                        <td className='fs-5'>{data?.quantity}</td>
                                        <td className='fs-5'>Rs {data?.price}</td>
                                        <td className='fs-5'>{data?.discount}%</td>
                                        <td className='fs-5'>Rs {data?.discount_price}</td>
                                        <td><button className='btn btn-success' onClick={() => addToCart(data)}>&nbsp; + Add &nbsp;</button>&nbsp; <button className='btn btn-danger' onClick={() => removeItem(data._id)}>&nbsp;- Remove&nbsp;</button></td>
                                    </tr>
                                })
                                }
                            </tbody>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className='fs-4'>Total Item</th>
                                    <th className='fs-4'>Total Price</th>
                                    <th className='fs-4'>Total Discount</th>
                                    <th className='fs-4'>Final Checkout Price</th>
                                    <th className='fs-4'> Checkout</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='fs-4'>{user?.cart?.reduce((total, data) => total + data?.quantity, 0)}</td>
                                    <td className='fs-4'>Rs {user?.cart?.reduce((total, data) => total + data?.total_price, 0)}</td>
                                    <td className='fs-4'>Rs {user?.cart?.reduce((total, data) => total + data?.total_price, 0) - user?.cart?.reduce((total, data) => total + data?.discount_price, 0)}</td>
                                    <td className='fs-4'>Rs {user?.cart?.reduce((total, data) => total + data?.discount_price, 0)}</td>
                                    <td className='fs-4'><Link to={'/checkout'} className='btn btn-primary btn-lg'>Checkout</Link></td>
                                </tr>
                            </tbody>
                        </Table>
                    </>
                    }
                </>
                : <div className='text-center'>
                    <div className='fs-1'>Your Cart is Empty</div>
                    <Link className='btn btn-success btn-lg' to={'/'}>Go Shopping</Link>
                </div>}

        </div>
    )
}

export default Cart