import {
	DELETE_NOTION_KEYS,
	RESET_NOTION_API_KEY,
	RESET_NOTION_DB_ID,
	SEARCH_BOOKS,
} from '../constants';
import { inquirer } from './prompt';

export async function promptFirstAction() {
	const { action } = await inquirer({
		name: 'action',
		type: 'list',
		message: 'Welcome to Notion Books: ',
		choices: [
			{
				name: SEARCH_BOOKS,
				value: SEARCH_BOOKS,
			},
			{
				name: RESET_NOTION_API_KEY,
				value: RESET_NOTION_API_KEY,
			},
			{
				name: RESET_NOTION_DB_ID,
				value: RESET_NOTION_DB_ID,
			},
			{ name: DELETE_NOTION_KEYS, value: DELETE_NOTION_KEYS },
		],
	});

	return action;
}
