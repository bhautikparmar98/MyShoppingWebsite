const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
       res.status(401).send('Not Authenticated')
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try{
        decodedToken = jwt.verify(token,'anysecretkey') //if it not verify then it return false else true
    }catch(err){
        res.status(401).send(err)
    }
    if(!decodedToken){ 
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        res.status(401).send({error:error})
    }
    req.userId = decodedToken.userId 
    next()
}