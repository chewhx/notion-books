import { Client } from '@notionhq/client';
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { NOTION_API_KEY } from '../constants';
import { log } from '../utils/log';
import { keystore } from './keystore';

export const notion = new Client({
	auth: keystore.get(NOTION_API_KEY),
});

export async function getDatabaseTags(
	databaseId: string,
	propertyName: string
): Promise<any[]> {
	const response = await notion.databases.retrieve({
		database_id: databaseId,
	});
	const property = response.properties[propertyName];
	log.info('Retrieved current tags.');
	if (property.type === 'multi_select') {
		return property.multi_select.options;
	} else {
		return [];
	}
}

export function createBookPageParameters(
	book: {
		title: string;
		subtitle: string;
		image: string;
		authors: string[];
		description: string;
		categories: any[];
	},
	databaseId: string
): CreatePageParameters {
	return {
		parent: { database_id: databaseId },
		cover: { external: { url: book.image } },
		properties: {
			Name: {
				title: [
					{
						text: {
							content:
								book.title + (book.subtitle ? ` (${book.subtitle})` : ''),
						},
					},
				],
			},
			Author: {
				type: 'rich_text',
				rich_text: [
					{
						text: {
							content: book.authors.join(', '),
						},
					},
				],
			},
			Description: {
				type: 'rich_text',
				rich_text: [
					{
						text: {
							content: book.description.slice(0, 1999),
						},
					},
				],
			},
			Status: {
				type: 'multi_select',
				multi_select: [
					{
						name: 'Unread',
					},
				],
			},
			Tags: {
				type: 'multi_select',
				multi_select: [...book.categories],
			},
		},
	};
}
