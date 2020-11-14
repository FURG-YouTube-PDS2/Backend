import express from 'express';
import './database';

const app = express();

app.use(express.json());

app.listen(3334, () => {
  console.log('Server started on port 3334');
});
