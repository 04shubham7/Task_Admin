const {S3Client} = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3=new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY,
    },
});

const canUseS3 = Boolean(
    process.env.AWS_BUCKET_NAME &&
    (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY) &&
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY)
);

const upload=multer({
    storage: canUseS3
        ? multerS3({
            s3:s3,
            bucket:process.env.AWS_BUCKET_NAME,
            metadata:(req,file,cb)=>{
                cb(null,{fieldName:file.fieldname});
            },
            key:(req,file,cb)=>{
                cb(null,`tasks/${Date.now()}_${file.originalname}`);
            },
        })
        : multer.memoryStorage(),
    fileFilter:(req,file,cb)=>{
        if(file.mimetype === "application/pdf"){
            cb(null,true);
        } else {
            cb(new Error("Only PDF files are allowed"),false);
        }
    },
    limits:{files:3},
});

module.exports={ upload, canUseS3 };