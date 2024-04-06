const express = require('express');
const app = express();
const port = 3000;

const sharp = require('sharp');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('fat'));

app.listen(port, () => {
  console.log(`image compressor online: http://localhost:${port} 🛜`);
});

app.post('/compress', async (req, res) => {
  try {
    const { name, type, size, quality } = req.body;

    const valid = isValidBody({ name, type, size, quality });

    if (!valid) {
      res.status(418).send({ error: 'Body Argument Missing ❌' });
      return;
    }

    const outputPath = path.join(
      __dirname,
      'skinny',
      path.basename(`${name}-${size}-${quality}.${type}`)
    );

    await sharp(`fat/${name}.${type}`)
      .resize({ width: size }) // pixels
      .jpeg({ quality })
      .toFile(outputPath);

    res.send({ message: 'compression success 🚀', outputPath });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'compression error: check logs ❌' });
  }
});

function isValidBody({ name, type, size, quality }) {
  if (!name || !type || !size || !quality) {
    return false;
  }
  return true;
}
