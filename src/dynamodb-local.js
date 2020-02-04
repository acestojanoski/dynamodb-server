#! /usr/bin/env node

const program = require('commander');
const start = require('./commands/start');

program
	.command('start')
	.description('Start dynamodb local server')
	.action(start);

program.parse(process.argv);
