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
    handler: (app: ActualApp) => {
      return async (params: any) => {
        console.log("params", params);
        let tags = app.metadataCache.getTags();
        callback(params["x-success"], tags);
      };
    },
  },
  {
    path: "/files",
    params: [],
    method: "GET",
    handler: (app: ActualApp) => {
      return async (params: any) => {
        let files = Object.values(app.metadataCache.vault.fileMap) as ActualTFile[];
        for (let file of files) {
          file.parent = null;
          file.vault = null;
          file.children = null;
        }
        callback(params["x-success"], files);
      };
    },
  },
  {
    path: "/properties",
    params: [],
    method: "GET",
    handler: (app: ActualApp) => {
      return async (params: any) => {
        let properties = app.metadataCache.getAllPropertyInfos();
        let propertiesWithOptions = Object.values(properties).map((prop) => {
          let options = app.metadataCache.getFrontmatterPropertyValuesForKey(
            prop.name
          );
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
    handler: (app: ActualApp) => {
      return async (params: any) => {
        let iconicPluginSettings =
          app.plugins.plugins?.["iconic"]?.settings?.fileIcons;
        let directories = Object.values(app.vault.getAllFolders())
          .map((fi) => {
            return {
              name: fi.name,
              path: fi.path,
              icon: iconicPluginSettings?.[fi.path]?.icon ?? "folder",
            };
          });
        callback(params["x-success"], directories);
      };
    },
  },
  {
    path: "/vault/info",
    params: [],
    method: "GET",
    handler: (app: ActualApp) => {
      return async (params: any) => {
        let hasPeriodicNotes = app.plugins.enabledPlugins.has("periodic-notes");
        console.log("hasPeriodicNotes", hasPeriodicNotes);
        let vaultInfo = app.vault.getConfig();
        console.log("vaultInfo", vaultInfo);
        let vaultName = app.vault.getName();
        let actualInfo = app.vault.config;
        console.log("actualInfo", actualInfo);

        let returnInfo = {
          name: vaultName,
          id: app.appId,
        };
        callback(params["x-success"], returnInfo);
      };
    },
  },
  {
    path: "/templates",
    params: [],
    method: "GET",
    handler: (app: ActualApp) => {
      return async (params: any) => {
        let pre_templates =
          app.plugins.plugins?.["templater-obsidian"]?.settings
            ?.folder_templates;
        let templates = pre_templates.map((template: any) => {
          return {
            path: template.folder,
            file: template.template,
            properties: app.metadataCache.getCache(template.template)
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
    handler: (app: ActualApp) => {
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
          await app.vault.create(filePathFull, datay);
          // let createdFileUrl = encodeURIComponent(`obsidian://open?vault=${app.vault.getName()}&file=${createdFile.path}`);
          // callback(params["x-success"], createdFileUrl);
          // // if (params.openBehavior === "openInObsidian") {
          // //   app.workspace.getMostRecentLeaf()?.openFile(createdFile)
          // // }
        } catch (e) {}
      };
    },
  },
];
