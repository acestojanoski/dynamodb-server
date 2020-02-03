const fs = require('fs');
const https = require('https');
const {yellow} = require('chalk');
const path = require('path');
const os = require('os');

module.exports = () =>
	new Promise((resolve, reject) => {
		if (fs.existsSync(path.join(os.tmpdir(), 'dynamodb-local.zip'))) {
			return resolve();
		}

		console.log(yellow('\n================================='));
		console.log(yellow('Downloading dynamodb local...'));
		console.log(yellow('================================='));

		https.get(
			'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.zip',
			response => {
				response
					.pipe(
						fs.createWriteStream(
							path.join(os.tmpdir(), 'dynamodb-local.zip')
						)
					)
					.on('finish', resolve)
					.on('error', reject);
			}
		);
	});
