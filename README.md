# Battlesnake Admin
This project is for the admin dashboard of the 2018 [battlesnake.io](https://battlesnake.io) coding event.
It's gameserver lives at http://github.com/battle-snake/battle_snake.

## getting started
pull the repo, then run `./scripts/setup`

### Create github oauth vars
https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/

### Create some files

#### `./scripts/env-local.yml` with this content:
```yaml
GITHUB_CLIENT_ID: <fill in with your own>
GITHUB_CLIENT_SECRET: <fill in with your own>
GITHUB_CALLBACK_URL: http://localhost:3000/auth/github/callback
REDIS_HOST: localhost
BATTLESNAKE_SERVER_HOST: http://localhost:3001
```
