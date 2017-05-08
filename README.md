# Raincatcher

[Lerna](https://lernajs.io/)-based single repo for raincatcher modules.

## How to run

```
npm install
npm run bootstrap
npm start
```

## Basic workflow targetting the original separate repos

1. Add the original remotes to your working copy
```
node scripts add-remotes
```
2. Pull all newest changes
```
node scripts pull apps/* packages/*
```
3. Make local changes
```
git checkout -b my-branch
echo 'hello world' > apps/raincatcher-demo-auth/newFile
git commit -am "Example commit"
```
4. Verify which subrepos have suffered a change
```
npm run diff
> apps/raincatcher-demo-auth
```
5. [Optional] Add remotes to your own forks
```
node scripts add-remotes myGithubUsername
```
The above will add remotes as in `myGithubUsername-raincatcher-demo-auth    git@github.com:myGithubUsername/raincatcher-demo-auth.git`

6. Push changes to remotes
```
node scripts push apps/raincatcher-demo-auth -r my-branch -o 'myGithubUsername'
```

7. Open PRs to multiple single-repos at once
```
node scripts pr apps/raincatcher-demo
```

## Additional script documentation

### List the available scripts
By running `node scripts` you'll see a list of available commands, each supports an additional `-h` flag to display their individual help and expected arguments.

Additionally most support a `-n` flag to run without making any actual changes, and instead outputting the equivalent shell commands that would be executed or debug info.

### diff
Available as `npm run diff`, this command will list modules that were changed between the current `HEAD` and the optional git ref, defaulting to `HEAD~1`, i.e. the previous commit:

`npm --ref=master run diff`

### Fetching and updating changes to the individual remotes

Run `node scripts fetch` to pick up any new updates to git remotes containing the individual modules.

`node scripts merge-all` will then merge the `gitref` reference/branch from the default or prefixed set of remotes.

*Examples*:

- `node scripts fetch-and-merge`: merges all changes to default remotes' `master` branches
- `node scripts fetch-and-merge RAINCATCH-123`: merges all changes to default remotes' `RAINCATCH-123` branches
- `node scripts fetch-and-merge RAINCATCH-123 'myGhUsername-'`: merges all changes to `RAINCATCH-123` branches from `myGhUsername-`-prefixed remotes
