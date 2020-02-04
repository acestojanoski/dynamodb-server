const fs = require('fs');
const rimraf = require('rimraf');
const unziper = require('unzipper');
const retry = require('async-retry');
const {promisify} = require('util');
const downloadDynamodbAsync = require('../repository/download-dynamodb-async');
const {yellow, red} = require('chalk');
const path = require('path');
const os = require('os');

const rimrafAsync = promisify(rimraf);

const execute = () =>
	new Promise((resolve, reject) => {
		if (fs.existsSync(path.join(os.tmpdir(), 'dynamodb-local'))) {
			return resolve();
		}

		console.log(yellow('\n================================='));
		console.log(yellow('Unzipping dynamodb local...'));
		console.log(yellow('================================='));

		fs.createReadStream(path.join(os.tmpdir(), 'dynamodb-local.zip'))
			.pipe(
				unziper.Extract({
					path: path.join(os.tmpdir(), 'dynamodb-local'),
				})
			)
			.on('finish', resolve)
			.on('error', reject);
	});

module.exports = () =>
	retry(
		async bail => {
			let result;
			try {
				result = await execute();
			} catch (error) {
				console.log(red('\n================================='));
				console.log(red('Unzipping error...'));
				console.log(red('================================='));

				// retry previous step
				await rimrafAsync(path.join(os.tmpdir(), 'dynamodb-local.zip'));
				await downloadDynamodbAsync();
				throw error;
			}

			return result;
		},
		{retries: 1}
	);
