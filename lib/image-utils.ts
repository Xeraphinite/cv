// Blur data - generated from actual images
const blurData: Record<string, string> = {
	"avatar-128":
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAP0lEQVR4nAE0AMv/AKCfnyMTChcAAJaXlgC2raq+jn2wgXKtpKAA//37q39yo3Zo5+TgAH1+glA7NGBGOlVYW3GaGEa5IBaiAAAAAElFTkSuQmCC",
	"avatar-256":
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAP0lEQVR4nAE0AMv/AKCfnyMTChcAAJaXlgC2raq+jn2wgXKtpKAA//37qn9ypXdo5+TgAH1+g1A7NGBGOlVYW3HGGEnMyY28AAAAAElFTkSuQmCC",
	"avatar-96":
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAP0lEQVR4nAE0AMv/AJubmyMTChgAAJGTkwC4raq9jn2vgnKvp6MA/vv7qH9voHVm5uPgAHN3ekw4MFtCNk9QU2spF981FsrfAAAAAElFTkSuQmCC",
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
