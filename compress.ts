import express, { Response, Request, Express } from 'express';
import sharp from 'sharp';
import path from 'path';

const app: Express = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('fat'));

app.listen(port, () => {
  console.log(`image compressor online: http://localhost:${port} 🛜`);
});

app.post('/compress', async (req: Request, res: Response) => {
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

function isValidBody({
  name,
  type,
  size,
  quality,
}: {
  name: string;
  type: string;
  size: number;
  quality: number;
}) {
  if (!name || !type || !size || !quality) {
    return false;
  }
  if (
    typeof name !== 'string' ||
    typeof type !== 'string' ||
    typeof size !== 'number' ||
    typeof quality !== 'number'
  ) {
    return false;
  }
  return true;
}
