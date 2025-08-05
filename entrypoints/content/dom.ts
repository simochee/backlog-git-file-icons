export const querySelector = (
	selector: string,
	callback: (node: HTMLElement) => void,
) => {
	const nodeMatcher = (node: HTMLElement) => {
		if (node.matches(selector)) {
			callback(node);
			return;
		}

		for (const el of node.querySelectorAll(selector)) {
			if (el instanceof HTMLElement) {
				callback(el);
			}
		}
	};

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement) {
						nodeMatcher(node);
					}
				}
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
	nodeMatcher(document.body);
};
