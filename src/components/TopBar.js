import React from 'react'
import Styles from './header.module.css'
import { BsPersonCircle, BsCart, BsHeart } from 'react-icons/bs';
import { AiOutlineMenu } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setSideBarOpen } from '../redux/layoutSlice';
import { ACCESS_LEVELS } from '../constant';
import { isEmpty } from 'lodash';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearUserData } from '../redux/userSlice';

function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.user.userData)
  const cart = useSelector(state => state.cart.cart)
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(clearUserData())
    navigate('/login')
  }
  return (
    <div className={Styles.header}>
      <div className={Styles.logo_box}>
        {!window.location.href.includes('/admin') && <Link className={Styles.link} to='/home'><img src='/leaf-logo.png' alt='....' width={100} loading='lazy' /></Link>}
        {window.location.href.includes('/admin') && <AiOutlineMenu className={Styles.menu_icon} size={35} onClick={() => dispatch(setSideBarOpen())} />}
      </div>
      <div>
      </div>
      {!location.pathname.includes('/login') && 
      <div>
        <Link to={'/wishlist'} className='text-decoration-none text-dark' ><BsHeart size={30} color='black' /></Link> &nbsp; &nbsp;
        <div className={Styles.cart_box}>
          <Link to={'/cart'}>
          <BsCart color='black' size={30}>
          </BsCart>
          </Link>
          {(!isEmpty(user?.cart)) && <span className={Styles.card_badge}>{user?.cart?.reduce((total, data) => total + data?.quantity, 0)}</span>}
          {(!isEmpty(cart)) && <span className={Styles.card_badge}>{cart.reduce((total, data) => total + data?.quantity, 0)}</span>}
        </div>&nbsp; &nbsp;
        <div className={Styles.account_box} style={{ position: 'relative', display: 'inline' }}>
          <BsPersonCircle size={30} />
          <div className={`${Styles.account_info} bg-dark bg-gradient`}>
            <span className='fs-3 m-2 text-light'>{user?.username}</span>
            {user.access_level >= ACCESS_LEVELS.ADMIN && <Link to={'/admin/users'} className='btn btn-success text-bold m-2 fs-4'>To Admin Panel</Link>}
            {!isEmpty(user) && <Link to={`/profile/${user.id}`} className='btn btn-success text-bold m-2 fs-4'>Profile</Link>}
            {!isEmpty(user) && <Link to={`/orders/${user.id}`} className='btn btn-warning text-bold m-2 fs-4'>Orders</Link>}
            {isEmpty(user) ? <button onClick={logout} className='btn btn-success fs-5 m-2'>Login</button> :
            <button onClick={logout} className='btn btn-danger fs-5 m-2'>Logout</button>
            }
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default TopBar
