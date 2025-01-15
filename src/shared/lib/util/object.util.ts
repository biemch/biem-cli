export const getValueByPath = (obj: unknown, path: (string | number)[]): unknown => {
	if (typeof obj !== 'object' || obj === null) {
		return undefined;
	}

	return path.reduce<unknown>((acc, key) => {
		if (acc && typeof acc === 'object') {
			return (acc as Record<string | number, unknown>)[key];
		}

		return undefined;
	}, obj);
};

export const maskSensitiveData = (data: Record<string, unknown>, sensitiveKeys = ['password']): Record<string, unknown> => {
	if (!data || typeof data !== 'object') {
		return data;
	}

	const masked: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(data)) {
		if (sensitiveKeys.includes(key.toLowerCase())) {
			masked[key] = '********';
		} else if (Array.isArray(value)) {
			masked[key] = value.map(item =>
				typeof item === 'object' && item !== null
					? maskSensitiveData(item as Record<string, unknown>, sensitiveKeys)
					: item,
			);
		} else if (typeof value === 'object' && value !== null) {
			masked[key] = maskSensitiveData(value as Record<string, unknown>, sensitiveKeys);
		} else {
			masked[key] = value;
		}
	}

	return masked;
};
