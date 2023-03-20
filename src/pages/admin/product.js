import React, { useEffect, useState } from 'react'
import Input from '../../components/Input'
import axios from 'axios';
import { deleteFile, uploadFileToSupabase } from '../../helper/supabase';
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { API_CALL } from '../../helper';
import { API_METHODS } from '../../constant';
import { ALTER_PRODUCT } from '../../constant/endpoint';
import {AiFillDelete} from 'react-icons/ai'
function AdminProduct() {
    const { product_id } = useParams()
    const user = useSelector(state => state.user.userData)
    const [files, setFiles] = useState([])
    const [productDetails, setProductDetails] = useState({})
    const selectFile = async (e) => {
        let file = []
        for (let doc of e.target.files) {
            file.push(doc)
        }
        setFiles(file)
    }
    const setProductInfo = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }
    const submitForm = async (e) => {
        e.preventDefault()
        let image = []
        if (!isEmpty(files)) {
            await Promise.all(files.map(async data => {
                const filePath = await uploadFileToSupabase(data.name, data)
                image.push(filePath)
            }))
        }
        if(isValidate()){
            let result;
            if(isEmpty(product_id)){
                result = await axios.post(`${process.env.REACT_APP_URL}/product`, { ...productDetails, image: image }, {
                 headers: {
                     access_token: user.token
                 }
                })
            }else{
                result = await API_CALL(API_METHODS.PATCH, ALTER_PRODUCT.replace(':product_id', product_id), {...productDetails, image : [...productDetails.image, ...image]}, user.token)
            }
           if(result.data.status === 'success'){
               Swal.fire({
                   position: 'top-end',
                   icon: 'success',
                   title: `plant added successfully`,
                   showConfirmButton: false,
                   timer: 1500
                })
                window.location.reload()
           }
        }
    }

    const isValidate = () => {
        let validate = true
        for (const key in productDetails) {
            if (isEmpty((productDetails[key]))) {
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
        if(isEmpty(files) && isEmpty(product_id)){
            validate = false
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Upload the Plant images`,
                showConfirmButton: false,
                timer: 1500
            })
        }
       return validate
    }

    const getProductInfo = async () => {
        const result = await API_CALL(API_METHODS.GET, ALTER_PRODUCT.replace(':product_id', product_id), {}, user.token)
        if(result.data.status === 'success'){
            const data = result.data.data
            data.price = `${data.price}`
            data.discount = `${data.discount}`
            data.quantity = `${data.quantity}`
            setProductDetails(result.data.data)   
        }
    }


    const deleteImages = async (fileName) => {
        const data = productDetails.image.filter((data) =>  data !== fileName)
        if(!isEmpty(data)){
            await deleteFile(fileName)
            const result = await API_CALL(API_METHODS.PATCH, ALTER_PRODUCT.replace(':product_id', product_id), {image : data}, user.token)
            if(result.data.status === 'success'){
                setProductDetails({...productDetails, image: data})
            }
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `You Can't delete the last image`,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    useEffect(() => {
        if(!isEmpty(product_id) && isEmpty(productDetails)){
            getProductInfo()
        }
    })
    return (
        <div className='d-flex flex-column align-items-center'>
            <h1 className='text-center mt-2 fs-2 mt-5'>{isEmpty(product_id) ? 'Add' : 'Edit'} Product</h1>
            <form  onSubmit={submitForm}>
                <Input  placeholder='Name' name={'name'} value={productDetails?.name} onChange={setProductInfo} type={'text'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Description' name={'description'} value={productDetails?.description} onChange={setProductInfo} type={'text'} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Price' type={'number'} name={'price'} value={productDetails?.price} onChange={setProductInfo} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Quantity' type={'number'} name={'quantity'} value={productDetails?.quantity} onChange={setProductInfo} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='Discount' type={'number'} name={'discount'} value={productDetails?.discount} onChange={setProductInfo} border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0'></Input>
                <Input placeholder='upload plant images' type={'file'} accept="image/*" border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0' onChange={selectFile} ></Input>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <button type='submit' className='btn btn-success btn-lg fs-3 pe-5 ps-5 mt-3 mb-2'>Submit</button>
                </div>
            </form>
                {!isEmpty(product_id) &&
                    <div className='text-center mb-3'>
                        {productDetails?.image?.map(data => <div style={{position: 'relative', display: 'inline', width: 100, margin: '1rem'}}> <img loading='lazy' key={data} height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data}`} alt='' >
                        </img>
                        <AiFillDelete style={{position: 'absolute', zIndex: 2, right: 5, cursor: 'pointer'}} color='red' size={20} onClick={() => deleteImages(data)}></AiFillDelete>
                        </div>)}
                    </div>
                }
        </div>
    )
}

export default AdminProduct