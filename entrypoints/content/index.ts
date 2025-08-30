import { getIconUrl, hasIcon } from "@/entrypoints/content/catppuccin";
import { findFileIcon, findFolderIcon } from "@/entrypoints/content/icon";
import { deduplicate } from "@/entrypoints/content/util";

export default defineContentScript({
	matches: [
		"*://*.backlog.com/git/*",
		"*://*.backlog.jp/git/*",
		"*://*.backlog.com/subversion/*",
		"*://*.backlog.jp/subversion/*",
	],
	async main() {
		const { querySelector } = await import("./dom");

		querySelector(
			".cell-file-name",
			deduplicate(async (node) => {
				if (hasIcon(node)) return;

				const iconEl = node.querySelector("img");

				if (!iconEl) return;

				const text = node.textContent?.trim() || "";
				const icon = iconEl.src.includes("ico_folder")
					? await findFolderIcon(text)
					: await findFileIcon(text);

				iconEl.setAttribute("src", getIconUrl(icon));
				iconEl.removeAttribute("srcset");
				iconEl.setAttribute("width", "20px");
				iconEl.setAttribute("height", "18px");
				iconEl.style.objectFit = "contain";
			}),
		);

		querySelector(
			".updated-list__path",
			deduplicate(async (node) => {
				if (hasIcon(node)) return;

				const folders = node.textContent?.trim().split("/") || [];
				const fileName =
					folders.splice(folders.length - 1, 1)[0] || "_root_open";

				const folderIcon =
					folders.length > 0 ? await findFolderIcon(folders) : "_root";
				const fileIcon = await findFileIcon(fileName);

				for (const icon of [fileIcon, folderIcon]) {
					const imgEl = document.createElement("img");
					imgEl.src = getIconUrl(icon);
					imgEl.style.marginRight = "4px";
					imgEl.style.transform = "translateY(-25%)";

					node.querySelector("a")?.prepend(imgEl);
					node.querySelector("del")?.prepend(imgEl);
				}
			}),
		);

		querySelector(
			".code-view__header-path",
			deduplicate(async (node) => {
				if (hasIcon(node)) return;

				const folders = node.textContent?.trim().split("/") || [];
				const fileName =
					folders.splice(folders.length - 1, 1)[0] || "_root_open";

				const folderIcon =
					folders.length > 0 ? await findFolderIcon(folders) : "_root";
				const fileIcon = await findFileIcon(fileName);

				for (const icon of [fileIcon, folderIcon]) {
					const imgEl = document.createElement("img");
					imgEl.src = getIconUrl(icon);
					imgEl.style.marginRight = "4px";
					imgEl.style.transform = "translateY(-15%)";

					if (node.querySelector(`img[src="${CSS.escape(imgEl.src)}"]`))
						continue;

					node.prepend(imgEl);
				}
			}),
		);

		querySelector(
			"[data-blg-git-folder-icon]",
			deduplicate(async (node) => {
				const { blgGitFolderIcon = "" } = node.dataset;

				const folderIcon = await findFolderIcon(blgGitFolderIcon);
				const imgEl = document.createElement("img");
				imgEl.src = getIconUrl(folderIcon);
				imgEl.style.marginRight = "4px";
				imgEl.style.transform = "translateY(-15%)";

				node.prepend(imgEl);
			}),
		);

		querySelector(
			"[data-blg-git-file-icon]",
			deduplicate(async (node) => {
				const { blgGitFileIcon = "" } = node.dataset;

				const fileIcon = await findFileIcon(blgGitFileIcon);
				const imgEl = document.createElement("img");
				imgEl.src = getIconUrl(fileIcon);

				node.parentElement?.prepend(imgEl);
			}),
		);
	},
});
