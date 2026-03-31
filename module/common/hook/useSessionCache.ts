'use client';

/**
 * Hook to manage data in sessionStorage with a TTL (Time-To-Live).
 * @param key The key to store the data under in sessionStorage.
 * @param ttl Time to live in milliseconds. Default is 30 minutes.
 */
export const useSessionCache = <T>(key: string, ttl: number = 1000 * 60 * 30) => {
    
    const get = (): T | null => {
        if (typeof window === 'undefined') return null;
        
        try {
            const item = sessionStorage.getItem(key);
            if (!item) return null;
            
            const cachedValue = JSON.parse(item);
            const now = new Date().getTime();
            const cachedAt = new Date(cachedValue.timestamp).getTime();
            
            // Check if the cache has expired
            if (now - cachedAt > ttl) {
                sessionStorage.removeItem(key);
                return null;
            }
            
            return cachedValue.data as T;
        } catch (error) {
            console.error(`Error reading from sessionStorage for key "${key}":`, error);
            return null;
        }
    };

    const set = (data: T) => {
        if (typeof window === 'undefined') return;
        
        try {
            const cacheData = {
                data,
                timestamp: new Date().toISOString()
            };
            sessionStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error(`Error saving to sessionStorage for key "${key}":`, error);
        }
    };

    const clear = () => {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(key);
    };

    return { get, set, clear };
};
