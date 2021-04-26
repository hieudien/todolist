const multer = require("multer")

// setup image storage
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_IMAGE_PATH)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})
// image uploader
const uploadImage = multer({ storage: imageStorage })

// csv filter
const csvFilter = (req, file, cb) => {
    if (file.originalname.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
}
// setup csv storeage
const csvStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_CSV_PATH)
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.csv')
      }
})
// csv uploader
const uploadCsv = multer({ storage: csvStorage, fileFilter: csvFilter });

module.exports = { uploadImage, uploadCsv }