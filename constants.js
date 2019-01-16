const path = require('path')
const os = require('os');

const { isWin } = require('./install/utils')

const rootDir = __dirname
const darknetRoot = path.join(rootDir, 'darknet')
const darknetBuild = path.join(darknetRoot, 'build/darknet')
const darknetIncludes = path.join(darknetRoot, 'include')
const darknetLibDir = isWin() ? path.join(darknetBuild, 'x64') : path.join(darknetBuild, 'lib')
const darknetBinDir = isWin() ? path.join(darknetBuild, 'x64') : path.join(darknetBuild, 'bin')

const numberOfCoresAvailable = os.cpus().length

module.exports = {
  rootDir,
  darknetRoot,
  darknetIncludes,
  darknetLibDir,
  darknetBinDir,
  numberOfCoresAvailable
}