// Blur data - generated from actual images
const blurData: Record<string, string> = {
  "avatar-128": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nAFEALv/AODh4v8NBgb/BwQF/+jp6f8AzMfF/3pWSP9vT0P/1dPT/wD/////wZuJ/8ijlP//////AF9ZV/8+KSH/RDAl/3Fra/+Zrym4qmPm5gAAAABJRU5ErkJggg==",
  "avatar-256": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nAFEALv/AODh4v8HAQH/AgAA/+fn6P8Ay8fE/3hVRv9tTUH/1NLS/wD/////wJqI/8eik///////AF1XVf88Jx7/QS0j/29paf+NlSllw4DGnQAAAABJRU5ErkJggg==",
  "avatar-96": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nAFEALv/AODg4P8HAQH/AgAA/+fn6P8Ay8fE/3pWR/9tTkD/1NLS/wD/////wJiH/8eik///////AF1XV/88Jx7/Qi0k/29paf+NXiln3mqDngAAAABJRU5ErkJggg=="
};

export function getImageBlurData(imagePath: string): string {
  // Extract the image name from the path (e.g., "/avatar-128.png" -> "avatar-128")
  const imageName = imagePath.replace(/^\//, '').replace(/\.[^.]+$/, '');
  
  // Return the corresponding blur data or a fallback
  return blurData[imageName] || 
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