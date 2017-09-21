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

const tildeRegex = /^~/

const untildify = pathname =>
  pathname.match(tildeRegex)
    ? pathname.replace(tildeRegex, os.homedir())
    : pathname

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

  await Promise.all(
    manifest.websites.map(({ url, dirname }) => {
      return new Promise(async (resolve, reject) => {
        const subdir = path.join(BACKUP_DIR, dirname)
        await ensureDirExists(subdir)

        const wget = spawn("wget", [
          "--mirror",
          "--convert-links",
          "--no-verbose",
          "-w 1",
          "-P",
          subdir,
          url
        ])

        wget.on("close", code => {
          console.log(`backup of ${url} exited with code ${code}`)
          resolve()
        })

        wget.stdout.on("data", data => console.log(String(data)))

        wget.stderr.on("data",  data => console.log(String(data)))
      })
    })
  )
  console.log("all backups complete :)")
}

main()
