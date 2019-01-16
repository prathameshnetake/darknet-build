const log = require('npmlog')
const { exec, spawn, isWin, flags } = require('./utils')
const findMsBuild = require('./find-msbuild')
const {
  rootDir,
  darknetRoot,
  opencvSrc,
  opencvContribSrc,
  opencvContribModules,
  opencvBuild,
  opencvLocalLib,
  numberOfCoresAvailable
} = require('../constants')

const tag = 'Yolo_v2'

function getIfExistsDirCmd(dirname, exists = true) {
  return isWin() ? `if ${!exists ? 'not ' : ''}exist ${dirname}` : ''
}

function getMkDirCmd(dirname) {
  return isWin() ? `${getIfExistsDirCmd(dirname, false)} mkdir ${dirname}` : `mkdir -p ${dirname}`
}

function getRmDirCmd(dirname) {
  return isWin() ? `${getIfExistsDirCmd(dirname)} rd /s /q ${dirname}` : `rm -rf ${dirname}`
}

function getMsbuildCmd(sln) {
  return [
    sln,
    '/p:Configuration=Release',
    `/p:Platform=${process.arch === 'x64' ? 'x64' : 'x86'}`
  ]
}

function getRunBuildCmd(msbuildExe) {
  if (msbuildExe) {
    return () => spawn(`${msbuildExe}`, getMsbuildCmd('./OpenCV.sln'), { cwd: opencvBuild })
      .then(() => spawn(`${msbuildExe}`, getMsbuildCmd('./INSTALL.vcxproj'), { cwd: opencvBuild }))
  }
  return () => spawn('make', ['install', `-j${numberOfCoresAvailable}`], { cwd: opencvBuild })
    // revert the strange archiving of libopencv.so going on with make install
    .then(() => spawn('make', ['all', `-j${numberOfCoresAvailable}`], { cwd: opencvBuild }))
}

function getMsbuildIfWin() {
  return isWin()
    ? findMsBuild()
      .then((msbuild) => {
        log.info('install', 'using msbuild:', msbuild)
        return msbuild
      })
    : Promise.resolve()
}

module.exports = function() {
  const darknetRepo = 'https://github.com/AlexeyAB/darknet.git'
  return getMsbuildIfWin().then(msbuild =>
    // exec(getMkDirCmd('darknet'), { cwd: rootDir })
    //   .then(() => spawn('git', ['clone', '-b', `${tag}`, '--single-branch', '--depth',  1, '--progress', darknetRepo], { cwd: darknetRoot }))
    //   // .then(getRunBuildCmd(isWin() ? msbuild.path : undefined))
    //   // .then(() => exec(getRmDirCmd('opencv'), { cwd: opencvRoot }))
    spawn('git', ['clone', '--single-branch', '--depth',  1, '--progress', darknetRepo], { cwd: rootDir })
  )
}
