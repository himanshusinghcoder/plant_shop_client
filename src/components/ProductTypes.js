import React from 'react'
import ProductCard from './ProductCard'
import Styles from './product.module.css'
import { Link } from 'react-router-dom'

function ProductTypes({ type, products, link }) {
    return (
        <div className='mt-2'>
            <h2 className='ms-4 bg-success bg-gradient text-light p-3'>{type} Products</h2>
            <div className={Styles.products_list}>
                {products.map(data => <ProductCard data={data} />)}
                {type === 'All' &&
                    <Link className={Styles.view_all} to={link}>{'View All ->'}</Link>
                }
            </div>
        </div>
    )
}

export default ProductTypes