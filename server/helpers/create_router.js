const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function(collection) {
  const router = express.Router();

//INDEX
  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => {
        res.json(docs);
      })
  })

//SHOW
  router.get('/:id', (req, res) => {
      const id = req.params.id
      collection
      .find({_id: ObjectID(id)})
      .toArray()
      .then((docs) => res.json(docs));
  })

//CREATE
  router.post('/', (req, res) => {
    const newData = req.body;
    collection
      .insertOne(newData)
      .then(() => collection.find()
      .toArray())
      .then((docs) => res.json(docs));
  })

//DELETE
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection
    .deleteOne({_id: ObjectID(id)})
    .then(() => collection.find()
    .toArray())
    .then((docs) => res.json(docs));
  })

// We have no use for this with current design

// //UPDATE
//   router.put('/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedData = req.body;
//     collection
//     .updateOne(
//       {_id: ObjectID(id)},
//       {$set: updatedData}
//     )
//     .then(() => collection.find()
//     .toArray())
//     .then((docs) => res.json(docs));
//   })
//   return router;
// }

module.exports = createRouter;
