import { createSlice } from "@reduxjs/toolkit";



const productSlice = createSlice({
    name: 'product',
    initialState: {
        product: {},
        allProducts: []
    },
    reducers: {
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setAllProducts : (state, action) => {
            state.allProducts = action.payload
        },
        updateAllProductList : (state, action) => {
            state.allProducts.push(action.payload)
        }
    }
})



export const { setProduct, setAllProducts, updateAllProductList } = productSlice.actions

export default productSlice.reducer