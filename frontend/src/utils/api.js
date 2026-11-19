// Centralized API configuration and URL sanitization
const rawUrl = import.meta.env.VITE_API_URL || '';

// Remove any trailing slashes and spaces
export const API_URL = rawUrl.trim().replace(/\/+$/, '') || (import.meta.env.PROD ? '' : 'http://localhost:5000');

/**
 * Returns a bulletproof image URL.
 * Automatically handles relative paths, local frontend assets, and backend host URLs.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Return relative path so it loads immediately from frontend public CDN,
  // falling back to backend API if needed via onError handler
  return cleanPath;
};
