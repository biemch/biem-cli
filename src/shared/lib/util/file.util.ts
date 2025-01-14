import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from 'node:fs';
import {
	join,
	resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

export const getCurrentDirectory = () => {
	return process.cwd();
};

export const getHomeDirectory = () => {
	return process.env.USERPROFILE || process.env.HOME;
};

export const getTemplateDirectory = () => {
	return resolve(
		fileURLToPath(import.meta.url),
		'../../../..',
		`template`,
	);
};

export const pathExists = (path: string) => {
	return existsSync(path);
};

export const ensureDirectoryExists = (directory: string) => {
	if (!pathExists(directory)) {
		mkdirSync(directory, {
			recursive: true,
		});
	}
};

export const readFile = (file: string, encoding: BufferEncoding = 'utf8') => {
	return readFileSync(file, encoding);
};

export const copyFile = (source: string, destination: string) => {
	copyFileSync(source, destination);
};

export const writeFile = (destination: string, content: string) => {
	writeFileSync(destination, content);
};

export const removeDirectory = (directory: string) => {
	if (existsSync(directory)) {
		rmSync(directory, {
			recursive: true, force: true,
		});
	}
};

export const getDirectoryContents = (directory: string = process.cwd(), arrayOfFiles: string[] = []) => {
	const files =	readdirSync(directory);

	files.forEach((file) => {
		if (statSync(`${directory}/${file}`).isDirectory()) {
			arrayOfFiles = getDirectoryContents(`${directory}/${file}`, arrayOfFiles);
		}
		else {
			arrayOfFiles.push(join(directory, '/', file));
		}
	});

	return arrayOfFiles;
};
