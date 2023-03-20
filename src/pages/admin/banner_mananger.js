import React, { useEffect, useState } from 'react'
import Input from '../../components/Input'
import { isEmpty } from 'lodash'
import Swal from 'sweetalert2'
import { deleteFile, uploadFileToSupabase } from '../../helper/supabase'
import { API_CALL } from '../../helper'
import { API_METHODS } from '../../constant'
import { BANNER } from '../../constant/endpoint'
import { useSelector } from 'react-redux'
import {AiFillDelete} from 'react-icons/ai'

function BannerManger() {
  const user = useSelector(state => state.user.userData)
  const [images, setImages] = useState([])
  const [files, setFiles] = useState([])

  const selectFile = async (e) => {
    let file = []
    for (let doc of e.target.files) {
      file.push(doc)
    }
    setFiles(file)
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
    if (isValidate()) {
      const result = await API_CALL(API_METHODS.POST, BANNER, { banner: [...image,...images] }, user.token, true)
      if (result.data.status === 'success') {
        setFiles([])
        await getBannerImages()
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `plant added successfully`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  }


  const isValidate = () => {
    let validate = true
    if (isEmpty(files)) {
      validate = false
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Upload the Banner images`,
        showConfirmButton: false,
        timer: 1500
      })
    }
    return validate
  }

  const getBannerImages = async () => {
    const result = await API_CALL(API_METHODS.GET, BANNER, {}, user.token)
    if (result.data.status === 'success') {
      setImages(result.data.data.banner)
    }
  }

  const deleteImages = async (fileName) => {
    const data = images.filter((data) => data !== fileName)
    await deleteFile(fileName)
    const result = await API_CALL(API_METHODS.POST, BANNER, { banner: data }, user.token, true)
    if (result.data.status === 'success') {
      getBannerImages()
    }
  }

  useEffect(() => {
    getBannerImages()
  },[])

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Banner Manager</h1>
      <form onSubmit={submitForm}>
        <Input placeholder='upload plant images' type={'file'} accept="image/*" border='1px solid #000' padding='10px 5px' width='300px' borderRadius='5px' margin='5px 0' alignItems='center' onChange={selectFile}></Input>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <button type='submit' className='btn btn-success btn-lg fs-3 pe-5 ps-5'>Submit</button>
        </div>
      </form>
      {!isEmpty(images) &&
      <div style={{ textAlign: 'center', margin: '1rem', width: '100%' }}>
        {images?.map(data => <div style={{ position: 'relative', display: 'inline', width: 100, margin: '1rem' }}> <img key={data} height={100} width={100} src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data}`} alt='' >
        </img>
          <AiFillDelete style={{ position: 'absolute', zIndex: 2, right: 5, cursor: 'pointer' }} color='red' size={20} onClick={() => deleteImages(data)}></AiFillDelete>
        </div>)}
      </div>
      }

    </div>
  )
}

export default BannerManger