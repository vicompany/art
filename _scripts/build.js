const { spawn } = require('child_process');
const fs = require('fs-extra');
const glob = require('glob');
const os = require('os');
const path = require('path');

function getPathsByGlob(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

const DIRECTORY_DESTINATION = path.resolve(process.cwd(), 'dist');
const PATTERN_WEB = '*/_web';
const PROCESS_NPM = os.platform() === 'win32' ? 'npm.cmd' : 'npm';

const Project = {
  build(project) {
    return new Promise((resolve, reject) => {
      const process = spawn(PROCESS_NPM, ['run', 'build'], {
        cwd: project.directory,
        stdio: ['ignore', 'ignore', 'inherit'],
      });

      process.on('error', (error) => reject(error));
      process.on('close', () => resolve());
    });
  },

  copy(project, directory) {
    return fs.copy(project.copyDirectory, path.resolve(directory, project.path));
  },

  async create(directory) {
    const isNpmProject = await fs.pathExists(path.resolve(directory, 'package.json'));
    const hasNodeModulesDirectory = await fs.pathExists(path.resolve(directory, 'node_modules'));
    const projectPath = path.relative(process.cwd(), path.resolve(directory, '..')).replace(/\\/g, '/');

    return {
      copyDirectory: isNpmProject ? path.resolve(directory, 'dist') : directory,
      directory,
      name: projectPath,
      path: projectPath,
      requiresBuild: isNpmProject,
      requiresInstall: isNpmProject && !hasNodeModulesDirectory,
    };
  },

  install(project) {
    return new Promise((resolve, reject) => {
      const process = spawn(PROCESS_NPM, ['install'], {
        cwd: project.directory,
        stdio: ['ignore', 'ignore', 'inherit'],
      });

      process.on('error', (error) => reject(error));
      process.on('close', () => resolve());
    });
  },
};

(async () => {
  const webDirectories = (await getPathsByGlob(PATTERN_WEB))
    .map((p) => path.resolve(process.cwd(), p));

  const webProjects = await Promise.all(webDirectories
    .map((webDirectory) => Project.create(webDirectory)));

  const webProjectsNpm = webProjects.filter((p) => p.requiresBuild);

  for (const [index, project] of webProjectsNpm.entries()) {
    console.log(`Preparing "${project.name}" (${1 + index} of ${webProjectsNpm.length})`);

    if (project.requiresInstall) {
      await Project.install(project);
    }

    await Project.build(project);
  }

  for (const [index, project] of webProjects.entries()) {
    console.log(`Copying "${project.name}" (${1 + index} of ${webProjectsNpm.length})`);

    await Project.copy(project, DIRECTORY_DESTINATION);
  }
})();
