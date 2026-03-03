
import React from "react";

export interface QRCodeImageProps {
	url: string;
	size?: number;
	alt?: string;
	className?: string;
	margin?: number;
	dark?: string;
	light?: string;
}

export function QRCodeImage({
	url,
	size = 220,
	alt = "QR code",
	className = "",
	margin = 1,
	dark = "000000",
	light = "ffffff",
}: QRCodeImageProps) {
	if (typeof url !== "string" || url.trim() === "") {
		return null;
	}

	const normalizedSize = Math.max(64, Math.min(1000, Number(size) || 220));
	const normalizedMargin = Math.max(0, Math.min(10, Number(margin) || 1));

	const qrEndpoint = "https://api.qrserver.com/v1/create-qr-code/";
	const params = new URLSearchParams({
		size: `${normalizedSize}x${normalizedSize}`,
		margin: String(normalizedMargin),
		color: dark,
		bgcolor: light,
		data: url.trim(),
	});

	const src = `${qrEndpoint}?${params.toString()}`;

	return (
		<img
			src={src}
			alt={alt}
			width={normalizedSize}
			height={normalizedSize}
			loading="lazy"
			decoding="async"
			className={className}
		/>
	);
}
