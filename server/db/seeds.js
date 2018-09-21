use project_tweetdb;
db.dropDatabase();

db.saved_inputs.insertMany([
  {
    searchTerm: "Marcin"
  } ,
  {
    searchTerm: "Vicky"
  } ,
  {
    searchTerm: "Emil"
  } ,
  {
    searchTerm: "Emil"
  } ,
  {
    searchTerm: "Raphael"
  } 

]);
