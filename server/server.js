const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');

const publicPath = path.join(__dirname, '../client/public');
app.use(express.static(publicPath));
app.use(parser.json());

MongoClient.connect('mongodb://localhost:27017')
  .then((client) => {
    // const db = client.db('name_of_db');
    // const nameOfCollection = db.collection('name_of_collection');
    // const nameOfRouter = createRouter(nameOfCollection);
    // app.use('/api/name_of_main_path', nameOfRouter);
  })
  .catch(console.error);

app.listen(3000, function() {
  console.log(`Listening on port ${this.address().port}`);
})
