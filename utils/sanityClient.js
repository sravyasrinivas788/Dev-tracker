const {createClient}=require('@sanity/client')

const sclient=createClient({
    projectId:'qzvrdl0l',
    dataset:'production',
    apiVersion:'2025-05-30',
    useCdn:true
})
module.exports=sclient