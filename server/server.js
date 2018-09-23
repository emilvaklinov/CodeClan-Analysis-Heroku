const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');
const Twitter = require('./helpers/twitter.js');

const publicPath = path.join(__dirname, '../client/public');
app.use(express.static(publicPath));
app.use(parser.json());
const twitter = new Twitter();

MongoClient.connect('mongodb://localhost:27017')
  .then((client) => {
    const db = client.db('project_tweetdb');
    const nameOfCollection = db.collection('saved_inputs');
    const nameOfRouter = createRouter(nameOfCollection);
    app.use('/api/inputs', nameOfRouter);
  })
  .catch(console.error);

app.get('/api/search-results', function (req, res) {
  twitter.getAllSearchResultsFromLast7DaysForSearchTerm("brexit")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(3000, function() {
  console.log(`Listening on port ${this.address().port}`);
})
