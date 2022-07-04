const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log(`Received event ${req.body.type}`);
  res.send({});
});

app.listen(4000, () => {
  console.log(`listening on port 4000 for posts service...`);
});

// docker run 711b0708d62eb357a34e64b21aea30eb0723fe2b2392292282dfd12ed25f5ce5
