import { id, search } from '@chewhx/google-books';
import { inquirer } from './prompt';
import * as ora from 'ora';

export async function promptSearchBooks(): Promise<any> {
	const { searchTerm } = await inquirer({
		type: 'input',
		name: 'searchTerm',
		message: 'Search for book: ',
	});

	if (!searchTerm.length) {
		throw Error('No search term provided');
	}

	const searchBooksPromise = search(searchTerm, {}, { maxResults: 20 });

	ora.promise(searchBooksPromise, {
		text: `Search books on ${searchTerm}...`,
	});

	const { items } = await searchBooksPromise;

	const { book } = await inquirer({
		type: 'list',
		name: 'book',
		message: 'Which one would you like?: ',
		choices: items.map((e: any, i: number) => ({
			name: `${i + 1}. ${e.volumeInfo.title} ${
				e.volumeInfo.authors ? `by ${e.volumeInfo.authors.join(', ')}` : ''
			}`,
			value: e,
		})),
	});

	const promise = id(book.id);

	ora.promise(promise, {
		text: 'Get book details',
	});

	const res = await promise;

	return res;
}

export function normalizeCategories(categories: string[]): string[] {
	const set = new Set<string>();
	if (!categories || !categories.length) {
		return [];
	}
	categories.forEach((e) => {
		e.split('/').map((e) => {
			set.add(e.trim());
		});
	});
	return Array.from(set);
}
