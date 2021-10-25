const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const { nanoid } = require('nanoid');
const AWS = require('aws-sdk');

const PORT = process.env.PORT || 8080;
const { FILE_STORAGE_KEY, FILE_STORAGE_SECRET } = process.env;
const spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: FILE_STORAGE_KEY,
  secretAccessKey: FILE_STORAGE_SECRET,
});

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // Pass to next layer of middleware
  next();
});

app.post('/create-nft', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (files.file.type.split('/')[0] !== 'image') {
      res.json({
        error: true,
      });
      return;
    }
    const oldpath = files.file.path;
    const id = nanoid();
    const ext = files.file.type.split('/')[1];
    const image = fs.readFileSync(oldpath);
    try {
      s3.putputObjet({
        Bucket: 'fls.tnvm.store',
        Key: `${id}.${ext}`,
        Body: image,
        ACL: 'public',
      }, (e) => {
        if (e) throw err;
      });

      s3.putObjet({
        Bucket: 'fls.tnvm.store',
        Key: `${id}.${ext}`,
        Body: JSON.stringify({
          ...JSON.parse(fields.json),
          image: `${id}.${ext}`,
        }),
        ACL: 'public',
      }, (e) => {
        if (e) throw err;
      });
      res.json({ error: false, path: `${id}.json` });
    } catch (e) {
      res.json({ error: true });
      console.log(e);
    }
  });
});

app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log('Server started.');
});
