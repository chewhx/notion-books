import { loglert } from 'loglert';
import ora from 'ora';
import {
	DELETE_NOTION_KEYS,
	NOTION_DB_ID,
	RESET_NOTION_API_KEY,
	RESET_NOTION_DB_ID,
	SEARCH_BOOKS,
} from './constants';
import { normalizeCategories, promptSearchBooks } from './lib/books';
import { promptFirstAction } from './lib/init';
import {
	initKeystore,
	keystore,
	promptDeleteAllSecrets,
	promptNotionApiKey,
	promptNotionDatabaseId,
} from './lib/keystore';
import {
	createBookPageParameters,
	getDatabaseTags,
	notion,
} from './lib/notion';
import { resolveCategoriesToTags } from './utils/utils';

(async () => {
	console.time('📖 Done');
	try {
		console.clear();
		await initKeystore();

		const firstAction = await promptFirstAction();

		if (firstAction === SEARCH_BOOKS) {
			const book = await promptSearchBooks();

			const bookCategories = normalizeCategories(book.volumeInfo.categories);

			const currentBookTags = await getDatabaseTags(
				keystore.get(NOTION_DB_ID),
				'Tags'
			);

			const combinedBookCategories = resolveCategoriesToTags(
				currentBookTags,
				bookCategories
			);

			const bookPage = createBookPageParameters(
				{
					title: book?.volumeInfo?.title ?? '',
					subtitle: book?.volumeInfo?.subtitle ?? '',
					image: `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=h1080`,
					description: book?.volumeInfo?.description ?? '',
					authors: book?.volumeInfo?.authors ?? [],
					categories: combinedBookCategories,
				},
				keystore.get(NOTION_DB_ID)
			);

			const notionPromise = notion.pages.create(bookPage);

			ora.promise(notionPromise, {
				text: 'Add to Notion Database',
			});

			await notionPromise;

			loglert.success('Book added to notion database');
		}

		if (firstAction === RESET_NOTION_API_KEY) {
			await promptNotionApiKey();
		}

		if (firstAction === RESET_NOTION_DB_ID) {
			await promptNotionDatabaseId();
		}

		if (firstAction === DELETE_NOTION_KEYS) {
			await promptDeleteAllSecrets();
		}
	} catch (error) {
		if (error instanceof Error) {
			loglert.error(error.message);
		} else {
			console.error(error);
		}
	} finally {
		console.timeEnd('📖 Done');
	}
})();
