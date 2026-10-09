# OwnSafeAI Plugin

Your notes. Every AI. One home.

OwnSafeAI Plugin is a consumer product being developed for saving notes into separate contexts and bringing relevant notes into AI conversations. The planned integrations are Claude, Codex, and ChatGPT, connected to one OwnSafeAI account.

**Status:** in development. This repository currently contains the public website and an interactive preview. It does not yet contain a working plugin, account service, billing, or email delivery.

## Planned hosted service

- **Free:** one context, with no expiry.
- **Plus:** $3 per month, five contexts in total, and email-to-self.
- Explicit saving and retrieval, editable original notes, and export and deletion controls.

Each AI tool will require an initial connection. The invocation follows the tool's supported plugin or connector interface; `@ownsafeai` is the intended name where `@` selection is supported.

## Website

The dependency-free website is in `site/`. Preview it locally:

```sh
python3 -m http.server 4173 --directory site
```

Open http://localhost:4173. The preview uses sample data held only in page memory. It resets on reload, does not connect AI accounts, and does not send email.

The public website is hosted at https://ownsafeai.com. See [deployment notes](docs/website-deployment.md) for the existing static hosting arrangement and rollback process.

## Contributing

Feedback and contributions are welcome through GitHub issues and pull requests. Please avoid including real personal notes, access tokens, or account credentials in reports.

## License

The source in this repository is licensed under the MIT License. Hosted service subscriptions are separate from the source-code license.
