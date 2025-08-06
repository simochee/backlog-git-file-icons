export const findFileIcon = async (text: string) => {
	const { fileIcons } = await import(
		"catppuccin-vsc-icons/src/defaults/fileIcons"
	);
	const fileName = text.toLowerCase();

	for (const [key, { fileExtensions = [], fileNames = [] }] of Object.entries(
		fileIcons,
	)) {
		for (const name of fileNames) {
			if (fileName === name) {
				return key;
			}
		}

		for (const extension of fileExtensions) {
			if (fileName.endsWith(`.${extension}`)) {
				return key;
			}
		}

		if ("escape" in RegExp && typeof RegExp.escape === "function") {
			for (const name of fileNames) {
				if (new RegExp(`\\b${RegExp.escape(name)}\\.`).test(fileName)) {
					return key;
				}
			}
		}
	}

	return "_file";
};

export const findFolderIcon = async (text: string | string[]) => {
	const { folderIcons } = await import(
		"catppuccin-vsc-icons/src/defaults/folderIcons"
	);
	const folders = Array.isArray(text) ? text : text.toLowerCase().split("/");
	const folderName = folders.pop() || "";

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

	for (const [key, { folderNames = [] }] of Object.entries(folderIcons)) {
		for (const name of folderNames) {
			for (const folder of folders.toReversed()) {
				if (name === folder) {
					return `folder_${key}`;
				}
			}
		}
	}

	return "_folder";
};
