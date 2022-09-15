import Configstore from 'configstore';
import { loglert } from 'loglert';
import { KEYSTORE_NAME, NOTION_API_KEY, NOTION_DB_ID } from '../constants';
import { inquirer } from './prompt';

export const keystore = new Configstore(KEYSTORE_NAME);

export function checkConfigExists(key: string): boolean {
	return !!keystore.get(key);
}

export function setNotionDbId(value: string): void {
	return keystore.set(NOTION_DB_ID, value);
}

export function setNotionApiKey(value: string): void {
	return keystore.set(NOTION_API_KEY, value);
}

export async function promptNotionApiKey(): Promise<string> {
	const { notion_api_key } = await inquirer({
		name: NOTION_API_KEY,
		type: 'input',
		message: 'Input notion api key: ',
	});

	if (!notion_api_key) {
		throw Error('No api key input');
	}

	keystore.set(NOTION_API_KEY, notion_api_key);

	loglert.success(`Notion API Key set to ${notion_api_key}`, { name: 'DONE' });

	return notion_api_key;
}

export async function promptNotionDatabaseId(): Promise<string> {
	const { notion_db_id } = await inquirer({
		name: NOTION_DB_ID,
		type: 'input',
		message: 'Input notion database id: ',
		suffix: '(Press Ctrl+C to exit)',
	});

	if (!notion_db_id) {
		throw Error('No database id input');
	}

	keystore.set(NOTION_DB_ID, notion_db_id);

	loglert.success(`Notion Database ID set to ${notion_db_id}`, {
		name: 'DONE',
	});

	return notion_db_id;
}

export async function promptDeleteAllSecrets() {
	keystore.clear();

	loglert.success('Cleared api key and database id.', { name: 'DONE' });
}

export async function initKeystore(): Promise<void> {
	const notionApiKeyExists = checkConfigExists(NOTION_API_KEY);
	const notionDbIdExists = checkConfigExists(NOTION_DB_ID);

	if (!notionApiKeyExists) {
		await promptNotionApiKey();
	}

	if (!notionDbIdExists) {
		await promptNotionDatabaseId();
	}
}
