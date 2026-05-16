const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    // Express exposes headers as an object. Use lowercase key or req.get()
    const authHeader = req.headers['authorization'] || req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if(!token)return res.status(401).json({message: 'No token, authorization denied'});
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        res.status(401).json({message: 'Invalid token, authorization denied'});
    }
};

module.exports = authMiddleware;