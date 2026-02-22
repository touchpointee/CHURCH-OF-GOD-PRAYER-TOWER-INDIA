export function normalizeEventBody(body: Record<string, unknown>): Record<string, unknown> {
    const dateType = (body.dateType as string) || 'single';
    const out = { ...body };
    if (typeof body.date === 'string') out.date = new Date(body.date);
    if (typeof body.dateEnd === 'string') out.dateEnd = new Date(body.dateEnd);
    if (dateType === 'range') {
        out.time = '';
        if (out.dateEnd == null || (out.date instanceof Date && out.dateEnd instanceof Date && out.date > out.dateEnd)) {
            throw new Error('End date must be on or after start date.');
        }
    } else {
        out.dateEnd = undefined;
        if (!body.date || !body.time) {
            throw new Error('Date and time are required for single-date events.');
        }
    }
    return out;
}
