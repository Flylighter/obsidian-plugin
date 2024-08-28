import { Plugin, App, MetadataCache, TFile, Vault } from "obsidian";
declare global {
  interface ActualPlugin extends Plugin {
    app: ActualApp;
  }

  interface ActualApp extends App {
    metadataCache: ActualMetadataCache;
    vault: ActualVault;
    plugins: ActualPlugin;
    appId: string;
  }

  interface ActualPlugin extends Plugin {
    plugins: any;
    enabledPlugins: any;
  }

  interface ActualTFile extends TFile {
    children: any;
    vault: Vault | null;
    deleted: boolean;
  }

  type PropertyTypes = "text" | "multitext" | "aliases" | "tags" | "date";

  interface ActualVault extends Vault {
    fileMap: Record<string, ActualTFile>;
    getConfig: () => any;
    config: any;
  }

  type TagsReturnType = Record<string, number>;
  type ActualProperties = { name: string; type: PropertyTypes; count: number };
  type ActualPropertiesWithOptions = ActualProperties & { options: string[] };

  interface ActualMetadataCache extends MetadataCache {
    getAllPropertyInfos(): Record<string, ActualProperties>;
    getCachedFiles(): string[];
    getFrontmatterPropertyValuesForKey(key: string): string[];
    getTags(): TagsReturnType;
    getFileInfo(file: ActualTFile): any;
  }
}
