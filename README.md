# Website scraper and archiver

This is a little node.js script which uses
[httrack](https://www.httrack.com/) to scrape a website and back it up to
S3 (although right now I haven't implemented the backup part yet...). It
is designed to be run as a cron job (or similar) in a continuous fashion,
using httrack's ability to fetch only new content to save incremental
backups.

## Usage

This script is meant to be run unattended, so it doesn't have a CLI.
Instead, it expects a `backup-manifest.json` file to be written to the
directory from which it is executed. This basically looks like this:

```js
{
  "websites" [ "en.wikipedia.org" ],
  "backup_dir": "~/my_huge_backup_directory"
}
```

Note: please don't try to scrape wikipedia. The `websites` array is an
array of all the sites you'd like to back up, and the `backup_dir` is an
optional location for the backups to be saved. If you don't specify one,
it will use `~/backups` instead.

Note that you need to already have the `httrack` executable installed.
I have only tested this with very recent versions of nodejs, if it's not
working get [nvm](https://github.com/creationix/nvm) and install whatever
the most recent version is.
