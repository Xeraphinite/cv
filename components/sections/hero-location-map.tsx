"use client";

import {
	Map as InteractiveMap,
	MapMarker,
	MarkerContent,
} from "@/components/ui/map";

const MAP_MARKER_COORDINATES: [number, number] = [113.31915, 23.10902];
const MAP_CAMERA_CENTER: [number, number] = [113.3158, 23.1068];

interface HeroLocationMapProps {
	locationLabel: string;
}

export function HeroLocationMap({ locationLabel }: HeroLocationMapProps) {
	return (
		<section
			className="hero-location-map relative h-36 w-full overflow-hidden"
			aria-label={locationLabel}
		>
			<InteractiveMap
				className="h-full w-full"
				center={MAP_CAMERA_CENTER}
				zoom={14.15}
				attributionControl={false}
				dragPan
				dragRotate={false}
				scrollZoom
				doubleClickZoom={false}
				touchZoomRotate
			>
				<MapMarker
					longitude={MAP_MARKER_COORDINATES[0]}
					latitude={MAP_MARKER_COORDINATES[1]}
				>
					<MarkerContent />
				</MapMarker>
			</InteractiveMap>
		</section>
	);
}
