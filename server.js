const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data')

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // serve os arquivos do front (html, css, js)

const API_SECRET = 'secret_YUEfIStswGEV3Ppg'; // sua chave da ConvertAPI

app.post('/convert', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const targetFormat = req.body.convertTo;
  const sourceFormat = path.extname(file.originalname).substring(1);
  
  const formData = new FormData();
formData.append('file', fs.createReadStream(file.path));

  try {
    const response = await axios.post(
      `https://v2.convertapi.com/convert/${sourceFormat}/to/${targetFormat}?Secret=${API_SECRET}`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    fs.unlinkSync(file.path); // deletar o arquivo enviado depois

    res.json({ downloadUrl: response.data.Files[0].Url });
  } catch (error) {
    console.error(error.response ? error.response.data : error);
    res.status(500).json({ error: 'Erro na conversão.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
