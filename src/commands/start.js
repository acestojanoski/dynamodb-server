const unzipAsync = require('../utils/unzip-async');
const startDynamodbLocalAsync = require('../utils/start-dynamodb-local-async');
const downloadDynamodbLocalAsync = require('../utils/download-dynamodb-local-async');

module.exports = () =>
	downloadDynamodbLocalAsync()
		.then(unzipAsync)
		.then(startDynamodbLocalAsync)
		.catch(console.error);
