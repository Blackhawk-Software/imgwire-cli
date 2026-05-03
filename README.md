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

- [`imgwire hello PERSON`](#imgwire-hello-person)
- [`imgwire hello world`](#imgwire-hello-world)
- [`imgwire help [COMMAND]`](#imgwire-help-command)
- [`imgwire login`](#imgwire-login)
- [`imgwire logout`](#imgwire-logout)
- [`imgwire plugins`](#imgwire-plugins)
- [`imgwire plugins add PLUGIN`](#imgwire-plugins-add-plugin)
- [`imgwire plugins:inspect PLUGIN...`](#imgwire-pluginsinspect-plugin)
- [`imgwire plugins install PLUGIN`](#imgwire-plugins-install-plugin)
- [`imgwire plugins link PATH`](#imgwire-plugins-link-path)
- [`imgwire plugins remove [PLUGIN]`](#imgwire-plugins-remove-plugin)
- [`imgwire plugins reset`](#imgwire-plugins-reset)
- [`imgwire plugins uninstall [PLUGIN]`](#imgwire-plugins-uninstall-plugin)
- [`imgwire plugins unlink [PLUGIN]`](#imgwire-plugins-unlink-plugin)
- [`imgwire plugins update`](#imgwire-plugins-update)
- [`imgwire whoami`](#imgwire-whoami)

## `imgwire hello PERSON`

Say hello

```
USAGE
  $ imgwire hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ imgwire hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `imgwire hello world`

Say hello world

```
USAGE
  $ imgwire hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ imgwire hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `imgwire plugins`

List installed plugins.

```
USAGE
  $ imgwire plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ imgwire plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/index.ts)_

## `imgwire plugins add PLUGIN`

Installs a plugin into imgwire.

```
USAGE
  $ imgwire plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into imgwire.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the IMGWIRE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the IMGWIRE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ imgwire plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ imgwire plugins add myplugin

  Install a plugin from a github url.

    $ imgwire plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ imgwire plugins add someuser/someplugin
```

## `imgwire plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ imgwire plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ imgwire plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/inspect.ts)_

## `imgwire plugins install PLUGIN`

Installs a plugin into imgwire.

```
USAGE
  $ imgwire plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into imgwire.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the IMGWIRE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the IMGWIRE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ imgwire plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ imgwire plugins install myplugin

  Install a plugin from a github url.

    $ imgwire plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ imgwire plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/install.ts)_

## `imgwire plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ imgwire plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ imgwire plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/link.ts)_

## `imgwire plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ imgwire plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ imgwire plugins unlink
  $ imgwire plugins remove

EXAMPLES
  $ imgwire plugins remove myplugin
```

## `imgwire plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ imgwire plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/reset.ts)_

## `imgwire plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ imgwire plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ imgwire plugins unlink
  $ imgwire plugins remove

EXAMPLES
  $ imgwire plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/uninstall.ts)_

## `imgwire plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ imgwire plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ imgwire plugins unlink
  $ imgwire plugins remove

EXAMPLES
  $ imgwire plugins unlink myplugin
```

## `imgwire plugins update`

Update installed plugins.

```
USAGE
  $ imgwire plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/update.ts)_

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
