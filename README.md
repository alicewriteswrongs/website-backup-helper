# Website scraper and archiver

This is a little node.js script which uses
[httrack](https://www.httrack.com/) to scrape a website and back it up to
S3. It is designed to be run as a cron job (or similar) in a continuous
fashion, using httrack's ability to fetch only new content to save
incremental backups.
