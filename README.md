# imgwire-cli

The official imgwire.dev CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/imgwire-cli.svg)](https://npmjs.org/package/imgwire-cli)
[![Downloads/week](https://img.shields.io/npm/dw/imgwire-cli.svg)](https://npmjs.org/package/imgwire-cli)

<!-- toc -->

- [imgwire-cli](#imgwire-cli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g imgwire-cli
$ imgwire COMMAND
running command...
$ imgwire (--version)
imgwire-cli/0.0.0 darwin-arm64 node-v25.6.0
$ imgwire --help [COMMAND]
USAGE
  $ imgwire COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`imgwire help [COMMAND]`](#imgwire-help-command)
- [`imgwire login`](#imgwire-login)
- [`imgwire logout`](#imgwire-logout)
- [`imgwire whoami`](#imgwire-whoami)

## `imgwire help [COMMAND]`

Display help for imgwire.

```
USAGE
  $ imgwire help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for imgwire.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.46/src/commands/help.ts)_

## `imgwire login`

Authenticate with an imgwire Server API Key

```
USAGE
  $ imgwire login [--api-key-stdin]

FLAGS
  --api-key-stdin  Read the Server API Key from stdin instead of prompting

DESCRIPTION
  Authenticate with an imgwire Server API Key

EXAMPLES
  $ imgwire login

  printf '%s' "$IMGWIRE_API_KEY" | imgwire login --api-key-stdin
```

_See code: [src/commands/login.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/login.ts)_

## `imgwire logout`

Remove the stored imgwire Server API Key

```
USAGE
  $ imgwire logout

DESCRIPTION
  Remove the stored imgwire Server API Key

EXAMPLES
  $ imgwire logout
```

_See code: [src/commands/logout.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/logout.ts)_

## `imgwire whoami`

Show the current imgwire authentication status

```
USAGE
  $ imgwire whoami

DESCRIPTION
  Show the current imgwire authentication status

EXAMPLES
  $ imgwire whoami
```

_See code: [src/commands/whoami.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/whoami.ts)_

<!-- commandsstop -->
