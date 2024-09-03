import { basename } from "path";

function callback(url: string, data: any) {
  let formatData = JSON.stringify(data);
  let encodedData = encodeURIComponent(formatData);
  let fullUrl = url + "&data=" + encodedData;
  window.open(fullUrl, "_blank");
}

export const routes = [
  {
    path: "/tags",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        console.log("params", params);
        let tags = _app.metadataCache.getTags();
        callback(params["x-success"], tags);
      };
    },
  },
  {
    path: "/files",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        console.log("app", _app);
        let getFiles = Object.values(
          _app.vault.getMarkdownFiles()
        ) as ActualTFile[];
        let files = getFiles.map((file) => {
          return {
            basename: file.basename,
            extension: file.extension,
            path: file.path,
            name: file.name,
            stat: file.stat,
          };
        });
        callback(params["x-success"], files);
      };
    },
  },
  {
    path: "/properties",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        let cachedPropertyOptions: Record<string, any> = {};
        let properties = _app.metadataCache.getAllPropertyInfos();
        let propertiesWithOptions = Object.values(properties).map((prop) => {
          if (cachedPropertyOptions["prop.name"])
            return { ...prop, options: cachedPropertyOptions["prop.name"] };
          let options = _app.metadataCache.getFrontmatterPropertyValuesForKey(
            prop.name
          );
          if (options) cachedPropertyOptions[prop.name] = options;
          return { ...prop, options };
        });
        callback(params["x-success"], propertiesWithOptions);
      };
    },
  },
  {
    path: "/directories",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        let iconicPluginSettings =
          _app.plugins.plugins?.["iconic"]?.settings?.fileIcons;
        let directories = Object.values(_app.vault.getAllFolders(false)).map(
          (fi) => {
            return {
              name: fi.name,
              path: fi.path,
              icon: iconicPluginSettings?.[fi.path]?.icon ?? "folder",
            };
          }
        );
        callback(params["x-success"], directories);
      };
    },
  },
  {
    path: "/vault/info",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        let hasPeriodicNotes =
          _app.plugins.enabledPlugins.has("periodic-notes");
        console.log("hasPeriodicNotes", hasPeriodicNotes);
        let vaultName = _app.vault.getName();
        let returnInfo = {
          name: vaultName,
          id: _app.appId,
        };
        callback(params["x-success"], returnInfo);
      };
    },
  },
  {
    path: "/templates",
    params: [],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        let pre_templates =
          _app.plugins.plugins?.["templater-obsidian"]?.settings
            ?.folder_templates;
        let templates = pre_templates.map((template: any) => {
          return {
            path: template.folder,
            file: template.template,
            properties: _app.metadataCache.getCache(template.template)
              ?.frontmatter,
          };
        });
        console.log("templates", templates);
        callback(params["x-success"], templates);
      };
    },
  },
  {
    path: "/capture/page",
    params: ["path", "data"],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        try {
          let pathy: string = "";
          let filey: string = "";
          let datay: string = "";
          if (params.pathy) {
            pathy = decodeURIComponent(params.pathy);
          }
          if (params.file) {
            filey = decodeURIComponent(params.file);
          }
          datay = params.data;
          if (!pathy && !filey && !datay) return;
          let filePathFull = pathy + "/" + filey;
          let createdFile = await _app.vault.create(filePathFull, datay);
          let createdFileUrl = encodeURIComponent(
            `obsidian://open?vault=${_app.vault.getName()}&file=${
              createdFile.path
            }`
          );
          callback(params["x-success"], createdFileUrl);
          if (params.openBehavior === "openInObsidian") {
            _app.workspace.getMostRecentLeaf()?.openFile(createdFile);
          }
        } catch (e) {
          callback(params["x-error"], e);
        }
      };
    },
  },
  {
    path: "/capture/append",
    params: ["path", "data"],
    method: "GET",
    handler: (_app: ActualApp) => {
      return async (params: any) => {
        try {
          let pathy: string = "";
          let filey: string = "";
          let datay: string = "";
          if (params.pathy) {
            pathy = decodeURIComponent(params.pathy);
          }
          if (params.file) {
            filey = decodeURIComponent(params.file);
          }
          datay = params.data;
          if (!pathy && !filey && !datay) return;
          let filePathFull = _app.vault.getFileByPath(pathy + "/" + filey);
          let createdFile = await _app.vault.append(filePathFull, datay);
          let createdFileUrl = encodeURIComponent(
            `obsidian://open?vault=${_app.vault.getName()}&file=${
              filePathFull.path
            }`
          );
          callback(params["x-success"], createdFileUrl);
          if (params.openBehavior === "openInObsidian") {
            _app.workspace.getMostRecentLeaf()?.openFile(filePathFull);
          }
        } catch (e) {
          callback(params["x-error"], e);
        }
      };
    },
  },
];
