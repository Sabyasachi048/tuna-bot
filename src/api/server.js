const express = require('express');
const server = express();
require('dotenv').config();
const port = process.env.PORT;

server.get('/', (req, res) => {
	res.send('Hello World!');
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = server;