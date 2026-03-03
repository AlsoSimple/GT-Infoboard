
import React, { useEffect, useState } from "react";
import { QRCodeImage } from "../QRCodeGenerator/QRCodeGenerator";

interface RSSItem {
	title: string;
	description: string;
	link: string;
}

async function fetchRSSItems(RSS_URL: string): Promise<RSSItem[]> {
	try {
		const response = await fetch(RSS_URL);
		const str = await response.text();
		const data = new window.DOMParser().parseFromString(str, "text/xml");
		const items = Array.from(data.querySelectorAll("item"));
		return items.map((el) => {
			const title = el.querySelector("title")?.innerHTML || "Untitled";
			const link = el.querySelector("link")?.textContent?.trim() || "";
			const rawDescription = el.querySelector("description")?.textContent || "";
			const description =
				rawDescription.startsWith("<![CDATA[") && rawDescription.endsWith("]]")
					? rawDescription.slice(9, -3)
					: rawDescription;
			return { title, description, link };
		});
	} catch (error) {
		console.error("Error fetching or parsing RSS feed:", error);
		return [];
	}
}

export function RSSNews() {
	const [items, setItems] = useState<RSSItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const RSS_URL = "https://api.codetabs.com/v1/proxy?quest=https://signprintpack.dk/feed/";
		fetchRSSItems(RSS_URL)
			.then((data) => {
				setItems(data);
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to load RSS feed");
				setLoading(false);
			});
	}, []);
	console.log(items);
	

	if (loading) return <div>Loading news...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div id="feed">
			{items.map((item, idx) => (
				<article className="feed-item" key={idx}>
					<h2>{item.title}</h2>
					<section
            className="feed-description"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
					{item.link && (
						<div className="qr-code">
							<QRCodeImage url={item.link} size={100} alt={`QR code for ${item.title}`} />
						</div>
					)}
				</article>
			))}
		</div>
	);
}