#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawn } = require("child_process")
const { promisify } = require("util")

// promisified versions of cb functions
const readFile = promisify(fs.readFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)

// the command we want to run
// httrack --update --footer "" $WEBSITE

const tildeRegex = /^~/

const untildify = pathname => {
  if (pathname.match(tildeRegex)) {
    return pathname.replace(tildeRegex, os.homedir())
  }
  return pathname
}

// Parse config, set up configuration details
const parseManifest = async () =>
  JSON.parse(await readFile("backup-manifest.json"))

// set BACKUP_DIR
const getBackupDir = manifest =>
  manifest.backup_dir
    ? path.resolve(untildify(manifest.backup_dir))
    : path.resolve(os.homedir(), "backups")

const ensureDirExists = async dirname => {
  if (!await exists(dirname)) {
    await mkdir(dirname)
  }
}

const main = async () => {
  const manifest = await parseManifest()

  const BACKUP_DIR = getBackupDir(manifest)

  await ensureDirExists(BACKUP_DIR)

  manifest.websites.forEach(website => {

  }

    main()
