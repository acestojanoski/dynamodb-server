const unzipDynamodbWithRetryAsync = require('../utils/unzip-dynamodb-with-retry-async');
const startDynamodbWithRetryAsync = require('../utils/start-dynamodb-with-retry-async');
const downloadDynamodbAsync = require('../repository/download-dynamodb-async');

module.exports = () =>
	downloadDynamodbAsync()
		.then(unzipDynamodbWithRetryAsync)
		.then(startDynamodbWithRetryAsync)
		.catch(console.error);
