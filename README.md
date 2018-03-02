# BattleSnake Admin

This project is for the admin dashboard of the 2018 [battlesnake.io](https://battlesnake.io) coding event.
The actual game server lives at <http://github.com/sendwithus/battlesnake-server>.

## Getting Started

Pull the repo, then run `./scripts/setup`

### Create some files

Create `./scripts/env-local.yml` and load it with:

```yaml
GITHUB_CLIENT_ID: <fill in with your own>
GITHUB_CLIENT_SECRET: <fill in with your own>
GITHUB_CALLBACK_URL: http://localhost:3009/auth/github/callback
REDIS_HOST: localhost
BATTLESNAKE_SERVER_HOST: http://localhost:3001
AUTH_REDIRECT_URL: http://localhost:3000
COOKIE_DOMAIN: localhost
SESSION_SECRET: any_appropriate_text
```

### Create Github OAuth vars

Go [here](https://github.com/settings/developers) to create a new Github OAuth app to get your credentials to fill in `GITHUB_CLIENT_*` values above.

More info here: <https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/>

### Run the required services

First, run `./scripts/services` to spin up all the services including the battlesnake game server.

Then, run the migration script for dynamodb `./scripts/migrate`.

### Start the server and client build

To get the server and client running, open two terminal windows and run `./scripts/run-server` and `./scripts/run-client` in them respectively.
