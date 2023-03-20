import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../redux/apiCalling';
import { setAllProducts } from '../../redux/productSlice';
import { isEmpty } from 'lodash';
import Table from 'react-bootstrap/Table';
import { ALTER_PRODUCT } from '../../constant/endpoint';
import { API_CALL } from '../../helper';
import { API_METHODS } from '../../constant';

function Products() {
    const state = useSelector(state => state.product)
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()


    const deleteProduct = async (id) => {
        const result = await API_CALL(API_METHODS.DELETE, ALTER_PRODUCT.replace(':product_id', id), {}, user.token)
        if (result.data.status === 'success') {
            const products = state.allProducts.filter(data => data._id !== id)
            dispatch(setAllProducts(products))
        }
    }

    const addProductToCategory = async (id,status,category) => {
        const result = await API_CALL(API_METHODS.PATCH, ALTER_PRODUCT.replace(':product_id', id), {[category]: status }, user.token, true)
        if(result.data.status === 'success'){
            getAllProducts(dispatch, setAllProducts)
        }
    }

    useEffect(() => {
        if (isEmpty(state.allProducts)) {
            getAllProducts(dispatch, setAllProducts)
        }
    })


    return (
        <div className='container-fluid'>
            <div className='text-end'><Link className={'btn btn-success btn-lg m-2'} to={'/admin/product'}>+ Add Product</Link></div>
            <div className='m-2'>
                <Table className='fs-4' striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th align='left'>S.no</th>
                            <th align='left'>Id</th>
                            <th align='left'>Image</th>
                            <th align='left'>Name</th>
                            <th align='left'>Featured</th>
                            <th align='left'>Trending</th>
                            <th align='left'>Edit</th>
                            <th align='left'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.allProducts?.map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data._id}</td>
                            <td><img src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data.image[0]}`} alt={data.name} height={50} width={60} /></td>
                            <td>{data.name}</td>
                            <td><button className={`btn btn-md w-100 ${data.is_featured ? 'btn-danger' : 'btn-success'}`} onClick={() => addProductToCategory(data._id, !data.is_featured, 'is_featured')}>{data.is_featured ? 'Remove' : 'Add'}</button></td>
                            <td><button className={`btn btn-md w-100 ${data.is_trending ? 'btn-danger' : 'btn-success'}`} onClick={() => addProductToCategory(data._id, !data.is_trending, 'is_trending')}>{data.is_trending ? 'Remove' : 'Add'}</button></td>
                            <td><Link to={`/admin/product/${data._id}`} className='btn btn-warning w-100'>Edit</Link></td>
                            <td><button className={'btn btn-danger w-100'} onClick={() => deleteProduct(data._id)}>Delete</button></td>
                        </tr>)}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Products