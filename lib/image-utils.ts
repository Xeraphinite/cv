// Blur data - generated from actual images
const blurData: Record<string, string> = {
	"avatar-illustrated":
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsSAAALEgHS3X78AAAAP0lEQVQImQE0AMv/AP7+/l9fX1lcXvv7+wDs6+qFaFUuHxfX2NkA4eTtn4Z5elpEsLa/AENWjgAAM2VLIA4pX/72GVjct+KFAAAAAElFTkSuQmCC",
	"portrait-original":
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVQImQE0AMv/ALTSnHSHYFxvSazYmgDS8bvOx7MVDwqLsYIAq+WmsZKKdGJdzv/DAH53WUpBPoV/bYZORsdpGcoDERy+AAAAAElFTkSuQmCC",
};

export function getImageBlurData(imagePath: string): string {
	// Match blur entries by file name so nested public subfolders remain safe.
	const normalizedPath = imagePath.split("?")[0];
	const imageName =
		normalizedPath
			.split("/")
			.pop()
			?.replace(/\.[^.]+$/, "") ?? "";

	// Return the corresponding blur data or a fallback
	return (
		blurData[imageName] ||
		"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSd5QkHBIlzB8r+k/wARUh+dC6QP1U9V3bJyoSk+BWPY3NF5QvVxA3Ixz7kANaFUCAMjZVHKM+sP/2Q=="
	);
}

export function getResponsiveImageProps(imagePath: string, sizes = "128px") {
	return {
		sizes,
		quality: 85,
		placeholder: "blur" as const,
		blurDataURL: getImageBlurData(imagePath),
	};
}
