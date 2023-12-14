const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 9000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017,8.213.159.230:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const voteSchema = new mongoose.Schema({
  color: String,
});

const Vote = mongoose.model('Vote', voteSchema);

app.get('/ping', async (req, res) => {
  try {
    res.status(200).send('pong');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

app.get('/voting-status', async (req, res) => {
  try {
    const status = await Vote.aggregate([
      {
        $group: {
          _id: '$color',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          color: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    const totalVotes = status.reduce((acc, colorCount) => acc + colorCount.count, 0);

    res.status(200).json({ totalVotes, votesByColor: status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});