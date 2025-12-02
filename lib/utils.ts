/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error: any, context: string): string {
    let rawMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        rawMessage = error.message;
    } else if (typeof error === 'string') {
        rawMessage = error;
    } else if (error) {
        rawMessage = String(error);
    }

    if (rawMessage.includes("Unsupported MIME type")) {
        try {
            const errorJson = JSON.parse(rawMessage);
            const nestedMessage = errorJson?.error?.message;
            if (nestedMessage && nestedMessage.includes("Unsupported MIME type")) {
                const mimeType = nestedMessage.split(': ')[1] || 'unsupported';
                return `File type '${mimeType}' is not supported. Please use a format like PNG, JPEG, or WEBP.`;
            }
        } catch (e) {
            // Not a JSON string
        }
        return `Unsupported file format. Please upload an image format like PNG, JPEG, or WEBP.`;
    }
    
    return `${context}. ${rawMessage}`;
}

// 1x1 Transparent PNG as fallback
const FALLBACK_IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const urlToFile = async (url: string, filename: string): Promise<File> => {
    try {
        // Attempt simple fetch first
        const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type || 'image/png' });
    } catch (e) {
        console.warn(`Primary fetch failed for ${url}, trying fallback/cache-bust...`);
        try {
            const cacheBustUrl = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
            const response = await fetch(cacheBustUrl, { mode: 'cors', credentials: 'omit' });
            if (!response.ok) {
                 throw new Error(`Fetch retry failed: ${response.status}`);
            }
            const blob = await response.blob();
            return new File([blob], filename, { type: blob.type || 'image/png' });
        } catch (retryError) {
             console.error(`urlToFile completely failed for ${url}. Using placeholder.`, retryError);
             // Return a placeholder file instead of crashing the app
             const response = await fetch(FALLBACK_IMAGE_DATA_URL);
             const blob = await response.blob();
             return new File([blob], "placeholder.png", { type: 'image/png' });
        }
    }
};
