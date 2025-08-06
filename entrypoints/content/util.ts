type CallbackFn = (node: HTMLElement) => Promise<void>;

const pendingEl = new Set<HTMLElement>();

export const deduplicate = (callback: CallbackFn): CallbackFn => {
	return async (node) => {
		try {
			if (pendingEl.has(node)) {
				return;
			}

			pendingEl.add(node);

			return await callback(node);
		} finally {
			pendingEl.delete(node);
		}
	};
};
