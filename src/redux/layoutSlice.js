import { createSlice } from "@reduxjs/toolkit";



const layoutSlice = createSlice({
    name: 'layout',
    initialState: {
        isSideBar: false
    },
    reducers: {
        setSideBarOpen: (state) => {
            state.isSideBar = !state.isSideBar
        }
    }
})



export const { setSideBarOpen } = layoutSlice.actions

export default layoutSlice.reducer