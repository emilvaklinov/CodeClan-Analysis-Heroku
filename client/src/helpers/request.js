const Request = function (url) {
  this.url = url;
};

Request.prototype.get = function (appendToUrl) {
  // console.log("get request", this.url + appendToUrl)
  if(appendToUrl){
    return fetch(this.url + appendToUrl)
    .then((response) => response.json());
  } else {
    return fetch(this.url)
    .then((response) => response.json());
  }
};

Request.prototype.post = function (payload) {
  return fetch(this.url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((response) => response.json());
};

// We have no use for this with current design

// Request.prototype.put = function (payload,id) {
//   return fetch(`${this.url}/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(payload),
//     headers: {'Content-Type': 'application/json'}
//   })
//   .then((response) => response.json());
// };

Request.prototype.delete = function (id) {
  return fetch(`${this.url}/${id}`, {
    method: 'DELETE'
  })
    .then((response) => response.json());
};


module.exports = Request;
