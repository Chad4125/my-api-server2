const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Import MongoClient

const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = 9000;

app.use(bodyParser.json());
app.use(cors());
// MongoDB Connection
// mongoose.connect('mongodb://root:Forest256@dds-mj7aafa6d8c7ae041668-pub.mongodb.ap-northeast-2.rds.aliyuncs.com:3717,dds-mj7aafa6d8c7ae042465-pub.mongodb.ap-northeast-2.rds.aliyuncs.com:3717/admin?replicaSet=mgset-12662', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// MongoDB Schema
const voteSchema = new mongoose.Schema({
  color: String,

});

const Vote = mongoose.model('Vote', voteSchema);


// Prevent Cold Start Latency
app.get('/ping', async (req, res) => {
  try {
    res.status(200).send('pong');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Handle Vote Submission
app.post('/submit-vote', async (req, res) => {
  const { color } = req.body;

  try {
    const newVote = new Vote({ color });
    await newVote.save();
    res.status(201).json({ message: 'Vote submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get Current Voting Status
app.get('/voting-status', async (req, res) => {
  try {
    const votes = await Vote.find();
    const status = {
      totalVotes: votes.length,
      votesByColor: {},
    };

    votes.forEach((vote) => {
      if (status.votesByColor[vote.color]) {
        status.votesByColor[vote.color]++;
      } else {
        status.votesByColor[vote.color] = 1;
      }
    });

    res.status(200).json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});