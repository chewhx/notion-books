import { log } from './log';

export type NotionTag = {
	id?: string;
	name: string;
	color?:
		| 'default'
		| 'gray'
		| 'brown'
		| 'orange'
		| 'yellow'
		| 'green'
		| 'blue'
		| 'purple'
		| 'pink'
		| 'red';
};

export function resolveCategoriesToTags(
	existingTags: NotionTag[],
	newTags: string[]
) {
	const toCombinedNewTags = [...newTags];
	const toCombinedOldTags = [...existingTags];

	const combinedTags = [];
	let pushNewTag = true;

	if (!toCombinedNewTags.length) return [];

	while (toCombinedNewTags.length) {
		const currentTag: string = toCombinedNewTags.pop() || '';
		toCombinedOldTags.forEach((exTag, exIdx) => {
			if (exTag.name === currentTag) {
				combinedTags.push(exTag);
				toCombinedOldTags.splice(exIdx, 1);
				pushNewTag = false;
			}
		});

		pushNewTag
			? combinedTags.push({ name: currentTag, color: 'default' })
			: (pushNewTag = true);
	}

	log.info('Resolved existing and new tags.');
	return combinedTags;
}

export function stripHtmlTags(content: string) {
	return content.replace(/(<([^>]+)>)/gi, '');
}
