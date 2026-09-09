/**
 * Generates an optimized Cloudinary URL for a given original URL.
 * 
 * @param {string} url - The original Cloudinary URL.
 * @param {number} width - The target width. Recommended values: 100, 400, 800, 1200, 1920.
 * @returns {string} The optimized Cloudinary URL.
 */
export const getOptimizedCloudinaryUrl = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  if (!url.includes('/upload/')) return url;

  const parts = url.split('/upload/');
  const baseUrl = parts[0];
  const restUrl = parts[1];
  
  const transformations = `f_auto,q_auto,c_limit,w_${width}`;
  
  return `${baseUrl}/upload/${transformations}/${restUrl.replace(/c_scale,w_\d+\/q_auto,f_auto\//, '')}`;
};
