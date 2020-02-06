#! /usr/bin/env node

import unzipDynamodbWithRetryAsync from './utils/unzip-dynamodb-with-retry-async';
import startDynamodbWithRetryAsync from './utils/start-dynamodb-with-retry-async';
import downloadDynamodbAsync from './repository/download-dynamodb-async';

downloadDynamodbAsync()
	.then(unzipDynamodbWithRetryAsync)
	.then(startDynamodbWithRetryAsync)
	.catch(console.error);
