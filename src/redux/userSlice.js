import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { API_CALL } from "../helper";
import { API_METHODS } from "../constant";
import { USER } from "../constant/endpoint";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: {}
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
            API_CALL(API_METHODS.PATCH, `${USER}/${state.userData.id}`, { user_cart: state.userData.cart }, state.userData.token)
        },
        addProductToUserCart: (state, action) => {
            const data = state.userData.cart.find(product => product._id === action.payload._id)
            if (!isEmpty(data)) {
                const newCart = state.userData.cart.map(data => {
                    if (data._id === action.payload._id) {
                        return {
                            ...data,
                            quantity: data.quantity + 1,
                            total_price: data.price * (data.quantity + 1),
                            discount_price: Math.ceil(data.price - (data.price * (data.discount / 100))) * (data.quantity + 1)
                        }
                    } else {
                        return data
                    }
                })
                state.userData = { ...state.userData, cart: newCart }
            } else {
                const cart = [...state.userData.cart, { ...action.payload, total_price: action.payload.price, discount_price: Math.ceil(action.payload.price - (action.payload.price * (action.payload.discount / 100))) }]
                state.userData = { ...state.userData, cart: cart }
            }
            API_CALL(API_METHODS.PATCH, `${USER}/${state.userData.id}`, { user_cart: state.userData.cart }, state.userData.token)
        },
        addProductToWishList: (state, action) => {
            state.userData.wishlist.push(action.payload)
            API_CALL(API_METHODS.PATCH, `${USER}/${state.userData.id}`, { user_wishlist: state.userData.wishlist }, state.userData.token)
        },
        removeProductFromWishList: (state, action) => {
            const wishlist = state.userData.wishlist.filter(data => data !== action.payload)
            state.userData.wishlist = wishlist
            API_CALL(API_METHODS.PATCH, `${USER}/${state.userData.id}`, { user_wishlist: wishlist }, state.userData.token)
        },
        clearUserData: (state) => {
            state.userData = {}
            localStorage.clear()
        },
    }
})



export const { setUserData, clearUserData, addProductToUserCart, addProductToWishList, removeProductFromWishList } = userSlice.actions

export default userSlice.reducer