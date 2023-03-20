import React from 'react'
import { Link } from 'react-router-dom'
import Styles from './home_manager.module.css'

const HOME_MANAGER = [
    {
        name: 'Banner',
        path: '/admin/home_manager/banner'
    },
]


function HomeManager() {
  return (
    <div className={Styles.container}>
        {HOME_MANAGER.map((data, i) => <Link key={i} to={data.path}>{data.name}</Link>)}
    </div>
  )
}

export default HomeManager