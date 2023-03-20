import React from 'react'

function Footer() {
    return (
        <div style={{ height: 200, background: '#000000d4', gridTemplateColumns: '1fr 1fr 1fr', display: 'grid', color: '#ffffff',justifyItems: 'center' }}>
            <div> 
                <img src='/leaf-logo.png' alt='....' width={100} /> 
                <h2 style={{textAlign: 'center'}}>Nature Life</h2>    
            </div>
            <div>
                <h3 style={{margin: 10}}>Home</h3>
                <h3 style={{margin: 10}}>About Us</h3>
                <h3 style={{margin: 10}}>All Products</h3>
                <h3 style={{margin: 10}}>New Arrivals</h3>
            </div>
            <div>
                <h3 style={{margin: 10}}>Contact Us</h3>
                <h3 style={{margin: 10}}>something@mail.com</h3>
                <h3 style={{margin: 10}}>+91-9898989898</h3>
            </div>
        </div>
    )
}

export default Footer