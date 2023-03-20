import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { API_CALL } from '../helper';
import { API_METHODS } from '../constant';
import { BANNER } from '../constant/endpoint';
import { useSelector } from 'react-redux';

function Coursel() {
  const user = useSelector(state => state.user.userData)

  const [images, setImages] = useState([])

  const getBannerImages = async () => {
    const result = await API_CALL(API_METHODS.GET, BANNER, {}, user.token)
    if (result.data.status === 'success') {
      setImages(result.data.data.banner)
    }
  }

  useEffect(() => {
    getBannerImages()
  },[])
  return (
    <Carousel indicators={false}>
      {images.map(data => {
      return <Carousel.Item key={data}>
        <img
          className="d-block w-100"
          src={`${process.env.REACT_APP_SUPABASE_URL}${process.env.REACT_APP_IMAGE_PATH}/${data}`}
          alt="First slide"
          height={'500px'}
        />
      </Carousel.Item>
      })}
    </Carousel>

  )
}

export default Coursel