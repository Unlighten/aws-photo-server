// Use local .env file for env vars when not deployed
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const aws = require('aws-sdk/global')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
  accessKeyId: 'AKIAIS35FE7BVD7QF2GQ',
  secretAccessKey: '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',
  region: "us-east-1",
});

console.log('table', process.env)

// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'efa-chatapp',
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, Date.now().toString() + '.png');
    }
  })
})

// Expose the /upload endpoint
const app = require('express')();
const http = require('http').Server(app);

app.post('/upload', upload.single('photo'), (req, res, next) => {
  res.json(req.file)
})

let port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
