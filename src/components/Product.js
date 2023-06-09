import React, { useEffect, useState } from 'react'
import Styles from './product.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { addCart } from '../redux/cartSlice'
import { addProductToUserCart, addProductToWishList, removeProductFromWishList } from '../redux/userSlice'
import { API_CALL } from '../helper'
import { API_METHODS } from '../constant'
import { ALTER_PRODUCT } from '../constant/endpoint'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

function Product() {
    const { product_id } = useParams()
    const dispatch = useDispatch()
    const [productDeatils, setProductDetails] = useState({})
    const user = useSelector(state => state.user.userData)
    const cart = useSelector(state => state.cart.cart)
    const [image, setImage] = useState()
    const addToCart = async () => {
            if (isEmpty(user)) {
                const getCartFind = cart.find(data => data._id === productDeatils._id)
                if((productDeatils.quantity - get(getCartFind, 'quantity', 0))  > 0){
                    const addToCartData = {
                        price: productDeatils.price,
                        quantity: 1,
                        name: productDeatils.name,
                        image: productDeatils.image[0],
                        _id: productDeatils._id,
                        discount: productDeatils.discount
                    }
                    dispatch(addCart(addToCartData))
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title:  'sorry the product is out of stock',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } else {
                const getCartFind = user.cart.find(data => data._id === productDeatils._id)
                if((productDeatils.quantity - get(getCartFind, 'quantity', 0))  > 0){
                    const addToCartData = {
                        price: productDeatils.price,
                        quantity: 1,
                        name: productDeatils.name,
                        image: productDeatils.image[0],
                        discount: productDeatils.discount,
                        _id: productDeatils._id,
                    }
                    dispatch(addProductToUserCart(addToCartData))
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title:  'sorry the product is out of stock',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
    }

    const getProductInfo = async () => {
        const result = await API_CALL(API_METHODS.GET, ALTER_PRODUCT.replace(':product_id', product_id), {}, user.token)
        if(result.data.status === 'success'){
            setProductDetails(result.data.data)
            setImage(result.data.data.image[0])   
        }
    }

    const addToWishList = (id, status) => {
        if(status){
          dispatch(removeProductFromWishList(id))
        }else{
          dispatch(addProductToWishList(id))
        }
      }


    useEffect(() => { 
        if(isEmpty(productDeatils)){
            getProductInfo()
        }  
    })

    return (
        <div className={Styles.card}>
            <div className={Styles.photo}>
                <img src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${image}`} alt='' />
            </div>
            <div>
                {productDeatils?.image?.map(data => <img key={data} style={{ margin: '1rem' }} onClick={() => setImage(data)} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data}`} alt='' width={100} height={100} loading='lazy' />)}
            </div>
            <div className={Styles.description}>
                <h2>{productDeatils.name}</h2>
                <h3 className='fw-light'>{productDeatils.description}</h3>
                <h1>${productDeatils.price}</h1>
                {productDeatils.quantity ? <button onClick={addToCart} className='btn btn-outline-success'>Add to Cart</button> : <button disabled className='btn btn-secondary'>Out of Stock</button>}
                {!isEmpty(user) && <button onClick={() => addToWishList(product_id, user.wishlist.includes(product_id))} className={!user.wishlist.includes(product_id) ? 'btn btn-outline-danger' : 'btn btn-danger'}>Wishlist</button>}
            </div>
        </div>
    )
}

export default Product