import { isDarkMode } from "./darkMode";

export const getIconUrl = (icon: string) => {
	return `https://cdn.jsdelivr.net/gh/catppuccin/vscode-icons@v1.23.0/icons/${
		isDarkMode() ? "mocha" : "latte"
	}/${icon}.svg`;
};

export const hasIcon = (node: HTMLElement) => {
	return node.querySelector("img[src*='catppuccin/vscode-icons']");
};
