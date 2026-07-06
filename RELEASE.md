# Release

This repository publishes through `pnpm release`. Version bumps are handled by Changesets before publish, and npm authentication is configured once through npmrc.

## Configure once

Create a granular npm access token on npmjs.com with:

- read/write access for the `@a2ui-vue3-elementplus` scope or the target packages;
- bypass 2FA enabled;
- publish permission for the npm organization/scope.

Then save it to your user-level npmrc:

```powershell
npm config set registry https://registry.npmjs.org/ --location=user
npm config set "//registry.npmjs.org/:_authToken" "npm_xxx" --location=user
npm whoami --registry https://registry.npmjs.org/
```

Do not put the real token in the repository `.npmrc`.

## Publish

After npmrc is configured:

Create a changeset for the release:

```powershell
pnpm changeset
```

Then publish:

```powershell
pnpm release
```

`pnpm release` runs:

```bash
pnpm release:check && changeset version && pnpm build && changeset publish
```

`pnpm release:check` checks that changed packages have a release changeset. `changeset version` then consumes the files in `.changeset/`, updates package versions, and keeps the linked public packages on the same version. If you only want to update package versions and changelogs without publishing, run:

```powershell
pnpm version-packages
```

If `pnpm release` reports that packages changed but no changesets were found, run `pnpm changeset` first and choose the release type. Without a `.changeset/*.md` file, Changesets has no version bump to apply.

Before the first publish, make sure the npm organization/scope `@a2ui-vue3-elementplus` exists and the token can publish packages under it.

## References

- npm: [Creating and viewing access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens/)
- npm: [Requiring 2FA for package publishing and settings modification](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)
