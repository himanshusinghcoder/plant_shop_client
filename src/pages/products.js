import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import Styles from '../components/product.module.css'
import { isEmpty } from 'lodash'
import { getAllProducts } from '../redux/apiCalling'
import { setAllProducts } from '../redux/productSlice'
import { useLocation } from 'react-router-dom'
function AllProducts() {
    const allProduct = useSelector(state => state.product.allProducts)
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()
    const location = useLocation()
    useEffect(() => {
        if (isEmpty(allProduct)) {
            getAllProducts(dispatch, setAllProducts)
        }
    })
    
    if(location.pathname.includes('/wishlist')){
        return <div className={Styles.products_list}>{allProduct?.filter(data => user?.wishlist?.includes(data._id)).map(data => <ProductCard data={data} key={data} />)}</div>
    }else{
        return <div className={Styles.products_list}>{allProduct?.map(data => <ProductCard data={data} key={data} />)}</div>
    }
}

export default AllProducts