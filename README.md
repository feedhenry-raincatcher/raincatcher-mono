# RainCatcher

[Lerna](https://lernajs.io/)-based single repo for raincatcher modules.

## How to run

```
npm install
npm run bootstrap
npm start
```

## Pulling changes from multiple repos

1. Add the original remotes to your working copy
```
./scripts/add-remotes
```
2. Pull all newest changes
```
./scripts/fetch-and-merge
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
./scripts/add-remotes myGithubUsername
```
The above will add remotes as in `myGithubUsername-raincatcher-demo-auth    git@github.com:myGithubUsername/raincatcher-demo-auth.git
6. Push changes to remotes
```
./scripts/push apps/raincatcher-demo-auth my-branch 'myGithubUsername-'
```

## Additional script documentation

### diff
Available as `npm run diff`, this command will list modules that were changed between the current `HEAD` and the optional git ref, defaulting to `HEAD~1`, i.e. the previous commit:

`npm --ref=master run diff`

### Fetching and updating changes to the individual remotes

Run `./scripts/fetch` to pick up any new updates to git remotes containing the individual modules.

`./scripts/merge <<gitref:master>> <<remote-prefix>>` will then merge the `gitref` reference/branch from the default or prefixed set of remotes.

*Examples*:

- `./scripts/fetch-and-merge`: merges all changes to default remotes' `master` branches
- `./scripts/fetch-and-merge RAINCATCH-123`: merges all changes to default remotes' `RAINCATCH-123` branches
- `./scripts/fetch-and-merge RAINCATCH-123 'myGhUsername-'`: merges all changes to `RAINCATCH-123` branches from `myGhUsername-`-prefixed remotes