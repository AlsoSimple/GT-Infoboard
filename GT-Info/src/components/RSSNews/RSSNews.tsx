
import { useEffect, useState } from "react";
import { QRCodeImage } from "../QRCodeGenerator/QRCodeGenerator";
import { Carousel } from "../Carousel/Carousel";
import style from './RSSNews.module.scss'

interface RSSItem {
	title: string;
	description: string;
	link: string;
}

interface RSS2JSONResponse {
	status: string;
	items?: Array<{
		title?: string;
		description?: string;
		link?: string;
	}>;
}

async function fetchRSSItemsFromXML(RSS_URL: string): Promise<RSSItem[]> {
	const response = await fetch(RSS_URL);
	if (!response.ok) {
		throw new Error(`RSS request failed with status ${response.status}`);
	}

	const str = await response.text();
	const data = new window.DOMParser().parseFromString(str, "text/xml");
	if (data.querySelector("parsererror")) {
		throw new Error("RSS response is not valid XML");
	}

	const items = Array.from(data.querySelectorAll("item"));
	return items.map((el) => {
		const title = el.querySelector("title")?.innerHTML || "Untitled";
		const link = el.querySelector("link")?.textContent?.trim() || "";
		const rawDescription = el.querySelector("description")?.textContent || "";
		const description =
			rawDescription.startsWith("<![CDATA[") && rawDescription.endsWith("]]>")
				? rawDescription.slice(9, -3)
				: rawDescription;
		return { title, description, link };
	});
}

async function fetchRSSItemsFromJSON(RSS_URL: string): Promise<RSSItem[]> {
	const response = await fetch(RSS_URL);
	if (!response.ok) {
		throw new Error(`RSS request failed with status ${response.status}`);
	}

	const data = (await response.json()) as RSS2JSONResponse;
	if (data.status !== "ok" || !Array.isArray(data.items)) {
		throw new Error("RSS JSON response is invalid");
	}

	return data.items.map((item) => ({
		title: item.title || "Untitled",
		description: item.description || "",
		link: item.link || "",
	}));
}

export function RSSNews() {
	const [items, setItems] = useState<RSSItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const XML_PROXY_URL = "https://api.allorigins.win/raw?url=https://signprintpack.dk/feed/";
		const JSON_PROXY_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://signprintpack.dk/feed/";

		const loadRSSItems = async () => {
			try {
				setError(null);

				let data: RSSItem[] = [];
				try {
					data = await fetchRSSItemsFromXML(XML_PROXY_URL);
				} catch (xmlError) {
					console.warn("Primary XML RSS source failed, trying JSON fallback:", xmlError);
				}

				if (data.length === 0) {
					data = await fetchRSSItemsFromJSON(JSON_PROXY_URL);
				}

				if (data.length === 0) {
					setError("RSS feed returned no items");
					setItems([]);
					return;
				}

				setItems(data);
			} catch (loadError) {
				console.error("Error fetching RSS feed:", loadError);
				setError("Failed to load RSS feed");
				setItems([]);
			} finally {
				setLoading(false);
			}
		};

		void loadRSSItems();
	}, []);

	if (loading) return <div>Loading news...</div>;
	if (error) return <div>{error}</div>;
	if (items.length === 0) return <div>Ingen nyheder i feedet lige nu</div>;

	return (
		<div className={style.rssNewsContainer}>
			<Carousel
				items={items}
				interval={8000}
				renderItem={(item) => (
					<article className={style.feedItem}>
						<h2>{item.title}</h2>
						<section
							className={style.feedDescription}
							dangerouslySetInnerHTML={{ __html: item.description }}
						/>
						{item.link && (
							<div className={style.qrCode}>
								<QRCodeImage url={item.link} size={125} alt={`QR code for ${item.title}`} />
							</div>
						)}
					</article>
				)}
			/>
		</div>
	);
}