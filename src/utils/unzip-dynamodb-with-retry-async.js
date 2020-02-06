import fs from 'fs';
import rimraf from 'rimraf';
import unziper from 'unzipper';
import retry from 'async-retry';
import {promisify} from 'util';
import downloadDynamodbAsync from '../repository/download-dynamodb-async';
import {yellow, red} from 'chalk';
import path from 'path';
import os from 'os';

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

export default () =>
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
