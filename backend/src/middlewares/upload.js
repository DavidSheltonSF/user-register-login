const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, '..', '/uploads'); // Caminho absoluto
    cb(null, folder); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nome único pro arquivo
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
