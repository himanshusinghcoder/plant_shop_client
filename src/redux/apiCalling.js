import axios from "axios"
import { PRODUCT } from "../constant/endpoint"
import { isEmpty } from "lodash"

export const getAllProducts = async (dispatch, dispatchFunction) => {
    const result =  await axios.get(PRODUCT)
    if(result.data.status === 'success'){
        if(!isEmpty(result.data.data)){
            dispatch(dispatchFunction(result.data.data))
        }
    }
}