const multer = require('multer');
const path = require('path');

const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// Hybrid Storage Strategy
// Set USE_S3=true in .env to enable AWS S3
const useS3 = process.env.USE_S3 === 'true';

let storage;

if (useS3) {
    console.log('Using AWS S3 Storage');
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    storage = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    });
} else {
    console.log('Using Local Disk Storage (uploads/)');
    storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
    });
}

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|doc|docx|txt/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'text/plain';

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and Documents only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
