import React from 'react'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

function User() {
  return (
    <div>
        <TopBar />
        <div style={{minHeight: '60vh'}}>
        <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default User