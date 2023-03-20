import React from 'react';
import Styles from './product_card.module.css'
import { Link } from 'react-router-dom';
import { BsHeartFill, BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../redux/productSlice';
import { isEmpty } from 'lodash';
import { addProductToWishList, removeProductFromWishList } from '../redux/userSlice';


const ProductCard = ({ data }) => {
  const user = useSelector(state => state.user.userData)
  
  const dispatch = useDispatch()

  const addToWishList = (id, status) => {
    if(status){
      dispatch(removeProductFromWishList(id))
    }else{
      dispatch(addProductToWishList(id))
    }
  }


  return (
    <div className={Styles["product-card"]}>
        <div className={Styles["product-image-container"]}>
          <img className={Styles["product-image"]} src={process.env.REACT_APP_SUPABASE_URL + process.env.REACT_APP_IMAGE_PATH + '/' + data.image[0]} alt={data.name} />
        </div>
        <div className={Styles["product-info"]}>
          <h3 className={Styles["product_title"]}>{data.name}</h3>
          <h4 className={Styles.product_describtion}>{data.describtion}</h4>
          <h5 className={Styles.product_price}>Rs. {data.price}</h5>
        </div>
      <div className={Styles.product_view}>
        {!isEmpty(user) && <BsHeartFill color={user.wishlist.includes(data._id)  ? 'red' : 'white'} onClick={() => addToWishList(data._id, user.wishlist.includes(data._id))}  style={{ cursor: 'pointer' }} size={30}></BsHeartFill>}
        <Link to={`/product/${data._id}`} onClick={() => dispatch(setProduct(data))}><BsSearch color='white' style={{ cursor: 'pointer' }} size={30}></BsSearch></Link>
    </div>
    </div >
  );
};

export default ProductCard;