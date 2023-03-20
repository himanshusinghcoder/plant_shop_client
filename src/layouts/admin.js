import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Styles from './admin.module.css'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { setSideBarOpen } from '../redux/layoutSlice'

function Admin() {
  const sideBar = useSelector(state => state.layout.isSideBar)
  const dispatch = useDispatch()
  return (
    <div style={{height: '100vh'}}>
    <div className={Styles.admin_layout_container}>
    {sideBar &&
        <div onClick={() => dispatch(setSideBarOpen())} className={Styles.overlay}></div>
      }
        <Sidebar></Sidebar>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <TopBar></TopBar>
        <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
        <Outlet />
        </div>
        </div>
    </div>
    <Footer />
    </div>
  )
}

export default Admin