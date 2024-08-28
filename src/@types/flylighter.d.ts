declare type Flow = {
	name: string;
	id: string;

	// Data
	outputDestination: PluginDestination | undefined;
	requestFunction?: any;

	// Config
	icon: { [key: string]: string, value: string };
	defaultAccount: string;
	keyboardShortcut: string | undefined;
	favorite: boolean;
	type: "database" | "page" | "bulk";
	focusOnOpen: { name: 'First Property', id: 'first'; } |
	{ name: 'First Empty Property', id: 'empty'; } |
	{ name: 'None', id: 'none'; };
	instantCapture: boolean;
	editorOnOpen: boolean;
	folder: string;
	omitArticleImages?: boolean;

	// Meta
	captureCount: number;
	lastPropSortEdit: number | undefined;
	lastCaptureTime: number | undefined;

	// Sync
	created_at: string;
	updated_at: string;
	synced_at: string;
	sync_flag: "synced" | "deleted" | "updated" | "created";
};

declare type PluginDestination = {
	name: string;
	id: string;
	plugin: string;
	icon: { [key: string]: string, value: string } | undefined;
	props: Array<FlowProperty> | undefined;
	pageContent: PageContentProperty;
	defaultSort?: boolean;
	propSort?: {
		static: FlowProperty[];
		visible: FlowProperty[];
		hidden: FlowProperty[];
	};
	page?: PluginDestinationPage;
	destinationName?: string;
	isHeader?: boolean
}

declare type PluginDestinationPage = {
	label: string;
	id: string;
	icon: { [key: string]: string, value: string } | undefined;
	url: string;
	children?: any[];
};

declare type FlowProperty = {
	name: string;
	id: string;
	type: Exclude<PropertyTypes, "pageContent">;
	
	// Data
	value?: any;
	dataItemValue?: InputDataItem;
	options?: any;
	requestFunction?: { func: (...args: any[]) => Promise<any>; args: any; };

	// Config
	visible: boolean;
	savedValue: any | undefined;
	savedInput: InputDataItem;
};

declare type PageContentProperty = {
	name: string;
	id: string;
	type: "pageContent";

	// Data
	value?: Array<InputDataItem>;
	options?: any;
	requestFunction?: { func: (...args: any[]) => Promise<any>; args: any; };

	// Config
	visible: boolean;
	savedValue: Array<InputDataItem>;
	savedInput: Array<InputDataItem>;
};

declare type InputDataItem = {
	id: string;
	uniqueId?: string;
	source: string;
	group?: string;
	preferredOutputs?: Array<string>;
	isPreferredGroupItem?: boolean;
	plugin?: string;
	value: any;
	isHighlight?: boolean;
	highlightData?: any;
	isChild?: number;
	metadata?: RichTextDataItem[];
	index?: number;
	parent?: InputDataItem[ 'id' ];
	dataItem: DataItem;
};




declare type RichTextDataItem = {
	type: 'text',
	text: {
		content: string,
		link?: {
			url: string;
		};
	};
	annotations: {
		bold: boolean;
		italic: boolean;
		strikethrough: boolean;
		underline: boolean;
		code: boolean;
		color: string | null;
	},
	plain_text: string;
	href?: string;
}

declare type DataItem = {
	type: string;
	[ key: string ]: any;
} & (
		| BookmarkDataItem
		| BulletedListDataItem
		| CalloutDataItem
		| CodeDataItem
		| FileDataItem
		| HeaderDataItem
		| HTMLDataItem
		| IconDataItem
		| ImageDataItem
		| MultiDataItem
		| NumberedListDataItem
		| PDFDataItem
		| ParagraphDataItem
		| QuoteDataItem
		| TableDataItem
		| RichTextDataItem
		| DateTimeDataItem
		| MultiDataItem
		| VideoDataItem
		| EmojiDataItem
		| CustomDataItem
		| null
	);
declare type BookmarkDataItem = {
	type: "bookmark",
	bookmark: {
		caption: string;
		url: string;
	};
};

declare type BulletedListDataItem = {
	type: "bulleted_list_item",
	bulleted_list_item: {
		rich_text: Array<RichTextDataItem>;
		children?: Array<DataItem>;
		color?: string;
	};
};

declare type CalloutDataItem = {
	type: "callout",
	callout: {
		icon: {
			type: "emoji",
			emoji: string;
		};
		rich_text: Array<RichTextDataItem>;
		children: Array<InputDataItem[ 'dataItem' ]>;
	};
};

declare type CodeDataItem = {
	type: "code",
	code: {
		language?: string,
		caption?: string;
		rich_text: Array<RichTextDataItem>;
	};
};

declare type DateTimeDataItem = {
	type: "date_time",
	date_time: {
		start: {
			year?: number;
			month?: number;
			day?: number;
			hour?: number;
			minute?: number;
			second?: number;
		};
		end?: {
			year?: number;
			month?: number;
			day?: number;
			hour?: number;
			minute?: number;
			second?: number;
		};
	};
	plain_text: string;
};

declare type FileDataItem = {
	type: "file",
	file: {
		caption: string;
		type: "external";
		external: {
			url: string;
		};
	};
};

type HeadingKeys = "heading_1" | "heading_2" | "heading_3";

declare type HeaderDataItem = {
	type: HeadingKeys;
} & {
		[ key in HeadingKeys ]?: {
			rich_text: Array<RichTextDataItem>;
			is_toggleable?: boolean;
			color?: any;
		}
	};

declare type HTMLDataItem = {
	type: "html",
	html: {
		html: string;
	};
	plain_text: string;
};
declare type IconDataItem = {
	type: "icon",
	icon: {
		type: "emoji";
		emoji: string;
	} | {
		type: "external";
		external: {
			url: string;
		};
	};
};

declare type ImageDataItem = {
	type: "image",
	image: {
		type: "external",
		external: {
			url: string;
		};
		caption?: Array<RichTextDataItem>;
	};
};

declare type MultiDataItem = {
	type: "multi";
	multi: Array<InputDataItem[ 'dataItem' ]>;
};

declare type CustomDataItem = {
	type: "custom";
	custom: Array<InputDataItem[ 'dataItem' ]>;
};

declare type NumberedListDataItem = {
	type: "numbered_list_item",
	numbered_list_item: {
		rich_text: Array<RichTextDataItem>;
		children?: any;
		color?: string;
	};
};

declare type PDFDataItem = {
	type: "pdf",
	pdf: {
		type: "external";
		external: {
			url: string;
		};
	};
};

declare type ParagraphDataItem = {
	type: "paragraph",
	paragraph: {
		rich_text: Array<RichTextDataItem>;
		color?: string;
		children?: Array<InputDataItem[ "dataItem" ]>;
	};
};

declare type QuoteDataItem = {
	type: "quote",
	quote: {
		rich_text: Array<RichTextDataItem>;
		color?: string;
	};
};

declare type TableDataItem = {
	type: "table",
	table: {
		"table_width": number,
		"has_column_header": boolean,
		"has_row_header": boolean,
		children: Array<{
			"type": "table_row",
			"table_row": {
				"cells": Array<RichTextDataItem[]>;
			};
		}>;
	};
};

declare type VideoDataItem = {
	type: "video",
	video: {
		type: "external";
		external: {
			url: string;
		};
	};
};

declare type EmojiDataItem = {
	type: "emoji",
	emoji: {
		emoji: string;
	};
};



