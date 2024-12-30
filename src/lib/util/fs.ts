import fs from 'node:fs';
import {
	dirname,
	join,
} from 'node:path';
import { fileURLToPath } from 'node:url';

export const getCurrentDirectory = () => {
	return process.cwd();
};

export const getHomeDirectory = () => {
	return process.env.USERPROFILE || process.env.HOME;
};

export const getPkgRootDirectory = () => {
	const currentFilePath = fileURLToPath(import.meta.url);
	return dirname(dirname(dirname(currentFilePath)));
};

export const ensureDirectoryExists = (directory: string) => {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, {
			recursive: true,
		});
	}
};

export const readFile = (file: string, encoding: BufferEncoding = 'utf8') => {
	return fs.readFileSync(file, encoding);
};

export const copyFile = (source: string, destination: string) => {
	fs.copyFileSync(source, destination);
};

export const writeFile = (destination: string, content: string) => {
	fs.writeFileSync(destination, content);
};

export const removeDirectory = (directory: string) => {
	if (fs.existsSync(directory)) {
		fs.rmSync(directory, {
			recursive: true, force: true,
		});
	}
};

export const getDirectoryContents = (directory: string = process.cwd(), arrayOfFiles: string[] = []) => {
	const files =	fs.readdirSync(directory);

	files.forEach((file) => {
		if (fs.statSync(`${directory}/${file}`).isDirectory()) {
			arrayOfFiles = getDirectoryContents(`${directory}/${file}`, arrayOfFiles);
		}
		else {
			arrayOfFiles.push(join(directory, '/', file));
		}
	});

	return arrayOfFiles;
};
