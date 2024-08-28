import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import os from "os";

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const buildMode = process.argv[2];
const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: buildMode === "production" ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
});

async function copyFile(src, dest) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(src);
		const writeStream = fs.createWriteStream(dest);

		readStream.on('error', reject);
		writeStream.on('error', reject);
		writeStream.on('finish', resolve);

		readStream.pipe(writeStream);
	});
}

async function zipFolder(srcFolder, zipFilePath) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(zipFilePath);
		const archive = archiver('zip');

		output.on('close', resolve);
		archive.on('error', reject);

		archive.pipe(output);
		archive.directory(srcFolder, path.basename(srcFolder));
		archive.finalize();
	});
}

if (buildMode === "production" || buildMode === "action") {
	await context.rebuild();

	// Create the production folder
	const folderName = 'flylighter';
	const packagesPath = path.join(os.homedir(), 'Dev', 'flylighter', 'packages');
	try {
		if (!fs.existsSync(folderName)) {
			fs.mkdirSync(folderName);
		}

		// Copy files to production folder
		await copyFile('main.js', path.join(folderName, 'main.js'));
		await copyFile('styles.css', path.join(folderName, 'styles.css'));
		await copyFile('manifest.json', path.join(folderName, 'manifest.json'));

		// Read the version from manifest.json
		const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
		const version = manifest.version;

		// Create the packages directory if it doesn't exist
		if (!fs.existsSync(packagesPath)) {
			fs.mkdirSync(packagesPath, { recursive: true });
		}

		// Zip the folder
		const zipFileName = `flylighter_obsidian-plugin_${version}.zip`;
		const zipFilePath = path.join(packagesPath, zipFileName);
		await zipFolder(folderName, zipFilePath);

		// Clean up the production folder
		fs.rmSync(folderName, { recursive: true, force: true });

	} catch (err) {
		console.error('Error during production build:', err);
		process.exit(1);
	}

	process.exit(0);
} else {
	await context.watch();
}