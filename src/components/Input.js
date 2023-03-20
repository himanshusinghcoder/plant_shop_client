import React from 'react'
import Styles from './input.module.css'

function Input({ type, value, name, placeholder, accept, onChange ,required,...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{fontSize: '1.6rem'}}>{placeholder}</label>
      <input required={required ? true : false} value={value} name={name} className={Styles.input} type={type} accept={accept} placeholder={placeholder} style={props} multiple onChange={onChange}></input>
    </div>
  )
}

export default Input