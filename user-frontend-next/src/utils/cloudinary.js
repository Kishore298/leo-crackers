/**
 * Generates an optimized Cloudinary URL for a given original URL.
 * 
 * @param {string} url - The original Cloudinary URL.
 * @param {number} width - The target width. Recommended values: 100, 400, 800, 1200, 1920.
 * @returns {string} The optimized Cloudinary URL.
 */
export const getOptimizedCloudinaryUrl = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Ensure we are working with an original upload URL without existing transformations
  // Format is usually: https://res.cloudinary.com/cloudname/image/upload/v12345/filename.jpg
  
  // If the URL already has transformations (unlikely based on our backend, but good to check), 
  // or doesn't have /upload/, return as is or handle carefully.
  if (!url.includes('/upload/')) return url;

  // Remove any existing transformations if they exist right after /upload/
  // by splitting at /upload/ and finding the version or filename
  const parts = url.split('/upload/');
  const baseUrl = parts[0];
  const restUrl = parts[1];
  
  // If restUrl starts with a v followed by numbers (e.g. v1700000000), it's the version
  // If it has other things before the v, they might be transformations. 
  // For safety, we just inject our transformations right after /upload/.
  // f_auto: automatic format (WebP/AVIF depending on browser support)
  // q_auto: automatic quality optimization
  // c_limit: don't scale up images if they are smaller than the requested width
  // w_{width}: set the width
  
  // Clean up any existing transformations that might have been manually added
  // This is a simple replace that assumes the standard upload structure
  // It handles the BannerCarousel.jsx logic properly too.
  
  const transformations = `f_auto,q_auto,c_limit,w_${width}`;
  
  // Check if there are already transformations (if restUrl doesn't start with v or folder)
  // Actually, Cloudinary allows injecting transformations right after /upload/ even if version is present
  return `${baseUrl}/upload/${transformations}/${restUrl.replace(/c_scale,w_\d+\/q_auto,f_auto\//, '')}`;
};
