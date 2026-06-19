import { getBackendOrigin, DEFAULT_FALLBACK_AVATAR } from '@/config';

/**
 * Resolve a backend-relative URL into an absolute URL the browser can load.
 * Returns undefined for empty input and falls back to DEFAULT_FALLBACK_AVATAR
 * when explicitly asked via the second argument.
 */
export function useImageResolver() {
    const backendOrigin = getBackendOrigin();

    function resolveImageUrl(
        url: string | null | undefined,
        fallback: string | null = DEFAULT_FALLBACK_AVATAR,
    ): string | undefined {
        if (!url) return fallback ?? undefined;
        if (/^https?:\/\//i.test(url)) return url;
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        const normalized = url.startsWith('/') ? url : `/${url}`;
        return `${backendOrigin}${normalized}`;
    }

    return { resolveImageUrl, backendOrigin };
}
