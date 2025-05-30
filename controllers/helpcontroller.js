const sclient=require('../utils/sanityClient')

const getallarticles=async(req,res)=>{
    const query=`*[_type=="helpArticle" && isPublished==true]{title,slug,category}`
    const articles=await sclient.fetch(query)
    res.json(articles)

};

const getarticlebyslug=async(req,res)=>{
    const {slug}=req.params;
    const query=`*[_type=="helpArticle"&& slug.current==$slug][0]`;
    const article=await sclient.fetch(query,{slug});
    if(!article){
        return res.status(404).json({message:"article not found"})
    }
    res.json(article)


}

module.exports={getallarticles,getarticlebyslug}