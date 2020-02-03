const shell = require('shelljs');
const retry = require('async-retry');
const unzipAsync = require('./unzip-async');
const {yellow, red} = require('chalk');
const {promisify} = require('util');
const rimraf = require('rimraf');
const path = require('path');
const os = require('os');

const rimrafAsync = promisify(rimraf);

const execute = () =>
	new Promise((resolve, reject) => {
		console.log(yellow('\n================================='));
		console.log(yellow('Starting dynamodb local server...'));
		console.log(yellow('================================='));

		const basePath = path.join(os.tmpdir(), 'dynamodb-local');
		const javaLibraryPath = path.join(basePath, 'DynamoDBLocal_lib');
		const jarPath = path.join(basePath, 'DynamoDBLocal.jar');

		shell.exec(
			`java -Djava.library.path=${javaLibraryPath} -jar ${jarPath} -sharedDb`,
			(code, stdout, stderr) => {
				if (stderr) {
					reject(stderr);
				} else {
					resolve(stdout);
				}
			}
		);
	});

module.exports = () =>
	retry(
		async bail => {
			let result;

			try {
				result = await execute();
			} catch (error) {
				console.log(red('\n================================='));
				console.log(red('Starting dynamodb local error...'));
				console.log(red('================================='));

				await rimrafAsync(path.join(os.tmpdir(), 'dynamodb-local'));
				await unzipAsync();
				throw error;
			}

			return result;
		},
		{retries: 1}
	);
