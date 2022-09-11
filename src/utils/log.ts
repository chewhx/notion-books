import { green, red, blue, yellow } from 'chalk';
import sym from 'log-symbols';

const success = (msg: string) =>
	console.log(`\n${sym.success} ${green.inverse(' Success ')} ${green(msg)}\n`);

const warning = (msg: string) =>
	console.log(
		`\n${sym.warning} ${yellow.inverse(' Warning ')} ${yellow(msg)}\n`
	);

const info = (msg: string) =>
	console.log(`\n${sym.info} ${blue.inverse(' Info ')} ${blue(msg)}\n`);

const error = (msg: string) =>
	console.log(`\n${sym.error} ${red.inverse(' Error ')} ${red(msg)}\n`);

export const log = {
	success,
	warning,
	info,
	error,
};
