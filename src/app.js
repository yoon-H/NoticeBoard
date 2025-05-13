import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', [
    
]);

app.listen(PORT, () => {
  console.log(PORT, '서버가 열렸습니다.');
});
