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
        console.log(app);
        let tags = app.metadataCache.getTags();
        console.log("tags", tags);
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
        let files = Object.values(app.vault.fileMap);
        for (let file of files) {
          file.parent = null;
          file.vault = null;
          file.children = null;
        }
        console.log("files", files);
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
        console.log("properties", properties);
        let propertiesWithOptions = Object.values(properties).map((prop) => {
          let options = app.metadataCache.getFrontmatterPropertyValuesForKey(
            prop.name
          );
          return { ...prop, options };
        });
        console.log("propertiesWithOptions", propertiesWithOptions);
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
        let directories = Object.values(app.vault.fileMap)
          .filter(
            (file) => !file.extension && file.path !== "/" && !file.deleted
          )
          .map((fi) => {
            return {
              name: fi.name,
              path: fi.path,
              icon: iconicPluginSettings?.[fi.path]?.icon ?? "folder",
            };
          });
        console.log("directories", directories);
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
        console.log("vaultName", vaultName);
        let getFoldd = app.vault.getAllFolders();
        console.log("getFoldd", getFoldd);
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
        let templates = pre_templates.map((template) => {
          console.log("template", template);
          console.log(
            "properties",
            app.metadataCache.getCache(template.template)?.frontmatter
          );
          console.log(
            "app.metadataCache.getFileInfo",
            app.metadataCache.getFileInfo(template.template)
          );
          console.log(
            "app.metadataCache.getFileCache",
            app.metadataCache.getFileCache(template.template)
          );
          console.log(
            "app.vault.getAbstractFileByPath",
            app.vault.getAbstractFileByPath(template.template)
          );
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
          console.log("data", params);
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
          console.log("pathy", pathy);
          console.log("filey", filey);
          console.log("datay", datay);
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
