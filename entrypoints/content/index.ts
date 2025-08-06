import { getIconUrl, hasIcon } from "@/entrypoints/content/catppuccin";
import { raf } from "@/entrypoints/content/dom";
import { findFileIcon, findFolderIcon } from "@/entrypoints/content/icon";

export default defineContentScript({
	matches: [
		"*://*.backlog.com/git/*",
		"*://*.backlog.jp/git/*",
		"*://*.backlog.com/subversion/*",
		"*://*.backlog.jp/subversion/*",
	],
	async main() {
		const { querySelector } = await import("./dom");

		querySelector(".cell-file-name", async (node) => {
			await raf();

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
		});

		querySelector(".updated-list__path", async (node) => {
			await raf();

			if (hasIcon(node)) return;

			const fileName =
				node.textContent?.trim().split("/").pop() || "_root_open";
			const icon = await findFileIcon(fileName);

			const imgEl = document.createElement("img");
			imgEl.src = getIconUrl(icon);
			imgEl.style.marginRight = "4px";
			imgEl.style.transform = "translateY(-25%)";

			node.querySelector("a")?.prepend(imgEl);
			node.querySelector("del")?.prepend(imgEl);
		});

		querySelector(".code-view__header-path", async (node) => {
			await raf();

			if (hasIcon(node)) return;

			const fileName =
				node.textContent?.trim().split("/").pop() || "_root_open";
			const icon = await findFileIcon(fileName);

			const imgEl = document.createElement("img");
			imgEl.src = getIconUrl(icon);
			imgEl.style.marginRight = "4px";
			imgEl.style.transform = "translateY(-15%)";

			node.prepend(imgEl);
		});
	},
});
