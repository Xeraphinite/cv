import blurData from '@/public/blur-data.json';

export function getImageBlurData(imagePath: string): string {
  // Extract the image name from the path (e.g., "/avatar-128.png" -> "avatar-128")
  const imageName = imagePath.replace(/^\//, '').replace(/\.[^.]+$/, '');
  
  // Return the corresponding blur data or a fallback
  return blurData[imageName as keyof typeof blurData] || 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSd5QkHBIlzB8r+k/wARUh+dC6QP1U9V3bJyoSk+BWPY3NF5QvVxA3Ixz7kANaFUCAMjZVHKM+sP/2Q==';
}

export function getResponsiveImageProps(imagePath: string, sizes = "128px") {
  return {
    sizes,
    quality: 85,
    placeholder: "blur" as const,
    blurDataURL: getImageBlurData(imagePath),
  };
} 