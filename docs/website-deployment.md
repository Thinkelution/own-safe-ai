# Website deployment

The static website in `site/` is served by the existing Nginx host for `ownsafeai.com` and `www.ownsafeai.com`. This deployment does not provision an AWS service or change DNS.

## Existing hosting

- SSH host alias: `itsmyserver`.
- Nginx virtual host: `/etc/nginx/sites-available/ownsafeai`.
- Document root: `/var/www/ownsafeai`.
- TLS is handled by the existing Let's Encrypt configuration.

Only files from `site/` belong in the public document root. Do not copy credentials, Git metadata, or server configuration into it.

## Release process

1. Preview the site locally and verify the context tabs, sample note saving, prompt preparation, and narrow-screen layout.
2. Copy `site/` into a new timestamped directory under `/var/www/ownsafeai-releases/`.
3. Ensure Nginx can read the release (directories `0755`, files `0644`).
4. Preserve the previous document root as a rollback copy. For the first conversion from a directory to a release symlink, move the original directory into the releases folder.
5. Point `/var/www/ownsafeai` at the new release. Future symlink changes can be atomic.
6. Verify HTTPS on the apex and `www` domains, all linked assets, and HTTP-to-HTTPS redirects. Confirm obsolete page and asset content is no longer served.

The Nginx configuration gives CSS, JavaScript and images a long immutable cache lifetime. Use a new versioned asset filename whenever an asset changes after publication, and update its reference in `index.html`.

## Rollback

Point `/var/www/ownsafeai` at the previous release or preserved original directory. Keep rollback copies outside the public document root. No Nginx reload is needed when only the document-root symlink changes.
