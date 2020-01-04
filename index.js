// Packages
const express = require('express');
const app = express();
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

// DB Connectin
const db = monk('localhost/twitter-clone');
const tweets = db.get('tweets');
const filter = new Filter();

app.use(express.json());
app.use(express.static('client'));

// Get all tweets
app.get('/tweets', (req, res) => {
  tweets.find().then(tweets => {
    res.json(tweets);
  });
});

// Check a tweet is valid
function isValidTweet(tweet) {
  return (
    tweet.name &&
    tweet.name.toString().trim() != '' &&
    tweet.content &&
    tweet.content.toString().trim() != ''
  );
}

// Rate limiter to prevent spamming
// Max 1 tweet every 60 seconds
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100
  })
);

// Post a new tweet
app.post('/tweets', (req, res) => {
  if (isValidTweet(req.body)) {
    const tweet = {
      // filter. removes any bad language
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date()
    };
    // tweet added to database
    tweets.insert(tweet).then(createdTweet => {
      res.json(createdTweet);
    });
  } else {
    // return errors
    res.status(422);
    res.json({
      message: 'Name and content required'
    });
  }
});

// app listening post
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
