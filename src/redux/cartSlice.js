import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";



const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: []
    },
    reducers: {
        addCart: (state, action) => {
            const data = state.cart.find(product => product._id === action.payload._id)
            if(!isEmpty(data)){
                const newCart = state.cart.map(data => {
                    if(data._id === action.payload._id){
                        return {
                            ...data,
                            quantity: data.quantity + 1,
                            total_price: data.price * (data.quantity + 1),
                            discount_price: Math.ceil(data.price - (data.price * (data.discount/100))) * (data.quantity + 1) 
                        }
                    }else{
                        return data
                    }
                })
                state.cart = newCart
            }else{
                state.cart.push({...action.payload,total_price: action.payload.price,                             discount_price: Math.ceil(action.payload.price - (action.payload.price * (action.payload.discount/100)))})
            }
        },
        emptyCart: (state) => {
            state.cart = []
        },
        setCart: (state, action) => {
            state.cart = action.payload
        }
    }
})



export const { addCart, emptyCart, setCart} = cartSlice.actions

export default cartSlice.reducer