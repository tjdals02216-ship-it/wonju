require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

// DB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB 연결 성공!'))
  .catch(err => console.log('DB 에러:', err));

// 지원 이력 스키마 (지원한 곳, 직무/프로그램명, 진행 상태)
const AppSchema = new mongoose.Schema({
  company: String,
  role: String,
  status: String,
});
const Application = mongoose.model('Application', AppSchema);

// 1. 메인 화면 (지원 목록 보기)
app.get('/', async (req, res) => {
  const apps = await Application.find();
  res.render('index', { apps: apps });
});

// 2. 추가 화면 열기
app.get('/write', (req, res) => {
  res.render('write');
});

// 3. DB에 지원 이력 저장하기
app.post('/write', async (req, res) => {
  await Application.create(req.body);
  res.redirect('/');
});

app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`));