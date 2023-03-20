const { supabase } = require("../configs/supabase")


export const uploadFileToSupabase = async (fileName, file) => {
    const {data, error} = await supabase.storage.from(process.env.REACT_APP_BUCKET_NAME).upload(fileName, file,{
      upsert: true
    })
    if(error){
      throw new Error(error.message)
    }
    return data.path
}

export const getFileURL = async (fileName) => {
  const { data : { publicUrl } }  = supabase.storage.from(process.env.REACT_APP_BUCKET_NAME).getPublicUrl(fileName)
  return publicUrl
}

export const deleteFile = async (fileName) => {
  const data = await supabase.storage.from(process.env.REACT_APP_BUCKET_NAME).remove(fileName)
} 
