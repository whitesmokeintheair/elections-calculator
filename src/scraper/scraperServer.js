
const axios = require("axios");
const https = require('https')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

async function getHTML (url) {
  // At instance level
  const instance = axios.create({
      httpsAgent: new https.Agent({  
      rejectUnauthorized: false
      })
  });
  return instance.get(url);
}

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3001;

app.get('/favicon.ico', async (req, res) => {
  res.send('Icon is not defined')
})

app.get('*', async (req, res) => {
  const url = req.url.substr(1);
  console.log(url)
  try {
    const { data } = await getHTML(url);
    res.send(data)
  } catch (err) {
    res.json({ error: `${err.status}: ${err.statusText}`})
  }
})
 
app.listen(port, () => {
    console.log('We are live on ' + port);
});
