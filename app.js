import express from 'express';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set(path.join(__dirname,'./views'))
app.set('view engine', pug)

app.get('/', (req, res) => res.json({msg:"Hello World"}))

app.listen(3000, () => console.log('Test running'))
