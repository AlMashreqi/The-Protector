const express = require('express');
const server = express();
 
server.all('/', (req, res) => {
  res.send(`Host is Up`)
})
 
function keepAlive() {
  server.listen(7622, () => { console.log("[*] Server is listening on Port 3000") });
}
 
module.exports = keepAlive;