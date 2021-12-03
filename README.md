# VI ART

This repo holds some web-based art for our on-premise art installation.

## Add art

Commit whatever you like in a subdirectory of your name or pseudonym! For example:

```
amy/my-project-1
amy/my-project-2
```

The subfolder `<name>/_web` is reserved. This folder will be deployed to GitHub pages as either static site or after a build.

1. If `<name>/web/package.json` exists:
    1. Run `npm run build`
    2. Deploy the `<name>/web/dist` directory as `vicompany.github.io/art/<name>`
2. If `<name>/web/package.json` does’t exist, but `<name>/_web` does:
    1. Deploy `<name>/web` as `vicompany.github.io/art/<name>`