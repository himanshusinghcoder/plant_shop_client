import React, { useEffect } from 'react'
import Coursel from '../components/Coursel'
import ProductTypes from '../components/ProductTypes'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getAllProducts } from '../redux/apiCalling'
import { setAllProducts } from '../redux/productSlice'

function Home() {
  const allProduct = useSelector(state => state.product.allProducts)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isEmpty(allProduct)) {
      getAllProducts(dispatch, setAllProducts)

    }
  })

  return (
    <div>
      <Coursel />
      {!isEmpty(allProduct) &&
        <ProductTypes type={'All'} products={allProduct} link={'/products'} />
      }
      {!isEmpty(allProduct.filter(data => data?.is_featured)) &&
        <ProductTypes type={'Featured'} products={allProduct.filter(data => data?.is_featured)} />
      }
      {!isEmpty(allProduct.filter(data => data?.is_trending)) &&
        <ProductTypes type={'Trending'} products={allProduct.filter(data => data?.is_trending)} />
      }
      {!isEmpty(allProduct) &&
        <ProductTypes type={'Newly Arrived'} products={allProduct.slice(0, 4)} />
      }
    </div>
  )
}

export default Home