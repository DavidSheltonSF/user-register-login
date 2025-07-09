const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = path.join(__dirname, '..', '/uploads'); // Caminho absoluto
//     cb(null, folder); // Pasta onde os arquivos serão salvos
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Nome único pro arquivo
//   },
// });

// const upload = multer({ storage: storage });

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
