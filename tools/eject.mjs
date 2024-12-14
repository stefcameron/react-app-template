//
// Creates a copy of all files in this project into a specified directory
//

import fsp from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import process from 'process';
import { spawnSync } from 'child_process';

const verbose = process.argv.includes('--verbose');

const REPO_PATH = path.resolve(import.meta.dirname, '..');

// TODO: this would be much better with glob pattern matching, and then you could
//  read-in the `../.gitignore` and use those globs
const ignorePaths = [
  path.resolve(import.meta.dirname, '../.git'),
  path.resolve(import.meta.dirname, '../coverage'),
  path.resolve(import.meta.dirname, '../dist'),
  path.resolve(import.meta.dirname, '../node_modules'),
];

const usage = () => {
  console.log(
    `Usage: ${path.basename(process.argv[1])} DEST_DIR [--verbose]
- DEST_DIR: Directory to create (if doesn't exist) and copy files into (overwrite).
--verbose: Enables verbose logging.
`
  );
};

const copyFiles = async (destDir) => {
  let destDirExists = false;
  try {
    await fsp.access(destDir, constants.F_OK);
    destDirExists = true;
    // eslint-disable-next-line no-empty
  } catch {}

  if (destDirExists) {
    throw new Error(`Destination already exists: ${destDir}`);
  }

  await fsp.mkdir(destDir, { recursive: true });

  const files = await fsp.readdir(REPO_PATH, { withFileTypes: true });
  const promises = [];

  for (const file of files) {
    const filePath = path.resolve(REPO_PATH, file.name);
    const relPath = path.relative(REPO_PATH, filePath);
    const destPath = path.resolve(destDir, relPath);
    if (!ignorePaths.includes(filePath)) {
      verbose && console.log(`Copying ${relPath} to ${destPath}`);
      promises.push(
        fsp.cp(filePath, destPath, {
          recursive: true,
          force: true,
          preserveTimestamps: true,
        })
      );
    } else {
      verbose && console.log(`Skipping ${relPath}: Ignored`);
    }
  }

  await Promise.all(promises);

  console.log(`Project files copied to ${destDir}\n`);
};

//
// MAIN
//

if (!process.argv[2]) {
  console.error('ERROR: Provide a directory to create/copy to as a parameter');
  usage();
  process.exit(1);
}

const destDir = process.argv[2];
try {
  await copyFiles(path.resolve(import.meta.dirname, destDir));
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}

console.log('Initializing new git repo');
spawnSync('git', ['init'], { cwd: destDir });

console.log('Installing dependencies (npm)');
spawnSync('npm', ['install'], { cwd: destDir });

console.log(
  `\n💡 Remember to update the name, version, description, author, license,
  and other fields in ${path.join(destDir, 'package.json')}`
);
