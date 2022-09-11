import {
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
	promptNotionApiKey,
	promptNotionDatabaseId,
} from './lib/keystore';
import {
	createBookPageParameters,
	getDatabaseTags,
	notion,
} from './lib/notion';
import { log } from './utils/log';
import { resolveCategoriesToTags } from './utils/utils';

(async () => {
	console.time('📖 Done');
	try {
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

			await notion.pages.create(bookPage);

			log.success('Book added to notion database');
		}

		if (firstAction === RESET_NOTION_API_KEY) {
			await promptNotionApiKey();
		}

		if (firstAction === RESET_NOTION_DB_ID) {
			await promptNotionDatabaseId();
		}
	} catch (error) {
		if (error instanceof Error) {
			log.error(error.message);
			console.log(error);
		} else {
			console.error(error);
		}
	} finally {
		console.timeEnd('📖 Done');
	}
})();
