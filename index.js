const path = require('path')
const fs = require('fs')
const { isWin, isOSX } = require('./install/utils')
const {
    darknetBinDir,
    darknetIncludes,
    darknetLibDir
} = require('./constants')
// const getLibs = require('./libs')({ isWin, isOSX, opencvModules, path, fs })

// const {
//   isAutoBuildDisabled
// } = require('./install/utils')

module.exports = {
  darknetLibDir,
  darknetIncludes,
  darknetBinDir,
//   getLibs,
}