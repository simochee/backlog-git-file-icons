export const findFileIcon = async (text: string) => {
	const { fileIcons } = await import(
		"catppuccin-vsc-icons/src/defaults/fileIcons"
	);

	for (const [key, { fileExtensions = [], fileNames = [] }] of Object.entries(
		fileIcons,
	)) {
		for (const name of fileNames) {
			if (text === name) {
				return key;
			}
		}

		for (const extension of fileExtensions) {
			if (text.endsWith(`.${extension}`)) {
				return key;
			}
		}
	}

	return "_file";
};

export const findFolderIcon = async (text: string) => {
	const { folderIcons } = await import(
		"catppuccin-vsc-icons/src/defaults/folderIcons"
	);
	const folderName = text.split("/").pop();

	if (folderName === "..") {
		return "_root_open";
	}

	for (const [key, { folderNames = [] }] of Object.entries(folderIcons)) {
		for (const name of folderNames) {
			if (folderName === name) {
				return `folder_${key}`;
			}
		}
	}

	return "_folder";
};
