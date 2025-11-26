const STORAGE_KEY = 'shadowterminal_recent_items';
const MAX_ITEMS = 10;

export const getRecentItems = () => {
    try {
        const items = localStorage.getItem(STORAGE_KEY);
        const parsed = items ? JSON.parse(items) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to load recent items", e);
        return [];
    }
};

export const addRecentItem = (item) => {
    try {
        const items = getRecentItems();
        // Remove if exists (to move to top)
        const filtered = items.filter(i => i.id !== item.id);

        const newItem = {
            ...item,
            viewedAt: new Date().toISOString()
        };

        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save recent item", e);
    }
};
