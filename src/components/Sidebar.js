import React from 'react'
import Styles from './sidebar.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'


const NAV_LINKS = [
  {
    id: 1,
    name: 'Product Manager',
    path: '/admin/products'
  },
  {
    id: 2,
    name: 'User Manager',
    path: '/admin/users'
  },
  {
    id: 3,
    name: 'Home Manager',
    path: '/admin/home_manager'
  }
]



function Sidebar() {
  const isSideBar = useSelector(state => state.layout.isSideBar)

  return (
    <div className={Styles.side_bar}  style={{left: isSideBar && 0}}>
      <div>
        <Link to='/home'><img src='/leaf-logo.png' alt='....' width={100} loading='lazy' /></Link>
      </div>
      {NAV_LINKS.map(data => 
      <NavLink className={({ isActive }) => (isActive ? Styles.active_nav_link : Styles.nav_link)} to={data.path} key={data.id}>{data.name}</NavLink>
        )}
    </div>
  )
}

export default Sidebar