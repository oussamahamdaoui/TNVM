const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 3000;

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
    const newpath = `./dist/fls/${id}.${ext}`;

    fs.rename(oldpath, newpath, (e) => {
      if (e) res.json({ error: true });
      else {
        fs.writeFile(`./dist/fls/${id}.json`, JSON.stringify({
          ...JSON.parse(fields.json),
          image: `/fls/${id}.${ext}`,
        }), (err2) => {
          if (err2) res.json({ error: true });
          else {
            res.json({ error: false, path: `/fls/${id}.json` });
          }
        });
      }
    });
  });
});

app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log('Server started.');
});
