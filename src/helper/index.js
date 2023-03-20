import axios from "axios"
import Swal from 'sweetalert2'
import { API_METHODS } from "../constant";
import { isEmpty } from "lodash";

export const API_CALL = async (method, endpoint,data= {}, token = null, showAlert = false) => {
    try {
        const result = (method === API_METHODS.GET || method === API_METHODS.DELETE) ? await axios[method](endpoint,{headers: {access_token: token} }) : await axios[method](endpoint,data,{headers: {access_token: token} })
        if(showAlert){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title:  result.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
        return result
    } catch (error) {
        console.log(">>",error.response.data);
        if(error.response.data.error.includes('Authenticated')){
                localStorage.clear()
                window.location.reload()
        }else{
            if(showAlert){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

    }
}




export const RemoveItemFromCart = (presentCartItems, id) => {
    const updatedCart =  presentCartItems.map(data => {
        if(data._id === id){
            if(data.quantity === 1){
                return {}
            }else{
                return {
                    ...data, 
                    quantity: data.quantity - 1,
                    total_price: data.total_price - data.price,
                    discount_price: Math.ceil(data.price - (data.price * (data.discount / 100))) * (data.quantity - 1)   
                }
            }
        }else{
            return data
        }
    })
    return updatedCart.filter(data => !isEmpty(data))
}



export const ADMIN_ROUTE = window.location.href.includes('/admin')
