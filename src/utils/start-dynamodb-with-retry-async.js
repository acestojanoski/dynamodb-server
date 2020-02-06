import shell from 'shelljs';
import retry from 'async-retry';
import unzipDynamodbWithRetryAsync from './unzip-dynamodb-with-retry-async';
import {yellow, red} from 'chalk';
import {promisify} from 'util';
import rimraf from 'rimraf';
import path from 'path';
import os from 'os';

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

export default () =>
	retry(
		async bail => {
			let result;

			try {
				result = await execute();
			} catch (error) {
				console.log(red('\n================================='));
				console.log(red('Starting dynamodb local server error...'));
				console.log(red('================================='));

				// retry previous step
				await rimrafAsync(path.join(os.tmpdir(), 'dynamodb-local'));
				await unzipDynamodbWithRetryAsync();
				throw error;
			}

			return result;
		},
		{retries: 1}
	);
