![imgwire.dev Logo](https://cdn.imgwire.dev/6b024480-a5ac-426d-b539-2e4fccc4c6ac/26f80c13-48bd-4bb9-866e-5e9392b11a6a/4ba5fe50-433b-40db-a847-938d2081c21a?w=280&quality=80)

# `imgwire-cli`

The imgwire CLI lets you upload images, generate transform-ready CDN URLs, manage image delivery resources, and inspect imgwire metrics from your terminal. Use it for local workflows, scripts, CI jobs, and any place where you want shell access to the same imgwire resources exposed by the SDKs.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/imgwire-cli.svg)](https://npmjs.org/package/imgwire-cli)
[![Downloads/week](https://img.shields.io/npm/dw/imgwire-cli.svg)](https://npmjs.org/package/imgwire-cli)

> [!TIP]
> To authenticate, sign in or create an account at [imgwire.dev](https://imgwire.dev), then create a Server API Key in the imgwire dashboard for the environment you want to manage. Copy that key and run `imgwire login`. Read the full API and SDK documentation [here](https://docs.imgwire.dev/guides/backend-quickstart).

<!-- toc -->

- [`imgwire-cli`](#imgwire-cli)
- [Usage](#usage)
- [Authentication](#authentication)
- [Resources](#resources)
- [Common Workflows](#common-workflows)
- [Development](#development)
- [Commands](#commands)
<!-- tocstop -->

# Usage

Install the CLI globally once it is published:

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

You can inspect any command with `--help`:

```sh-session
$ imgwire images upload --help
$ imgwire images url --help
```

Most resource commands print JSON so they can be inspected with tools like `jq`. Commands designed for shell composition print plain text:

- `imgwire images upload PATH` prints the uploaded image ID.
- `imgwire images url [ID]` prints a CDN URL.
- `imgwire whoami` prints the current auth status.

# Authentication

Most commands require a Server API Key. Create one from the imgwire dashboard after signing in at [imgwire.dev](https://imgwire.dev). Treat this key like a password: it can perform server-side API operations for your environment.

Authenticate with a Server API Key:

```sh-session
$ imgwire login
```

Paste the key when prompted. The CLI stores it in the operating system credential store.

For non-interactive environments, set `IMGWIRE_API_KEY` instead:

```sh-session
$ IMGWIRE_API_KEY=sk_live_... imgwire whoami
```

Useful auth commands:

```sh-session
$ imgwire whoami
$ imgwire logout
```

# Resources

The CLI is organized by imgwire resource:

| Resource      | Topic                   | Common commands                                                                                                                                           |
| ------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Images        | `imgwire images`        | `list`, `get-image`, `create-image`, `upload`, `url`, `delete`, `bulk-delete`, `create-upload-token`, `create-bulk-download-job`, `get-bulk-download-job` |
| Custom Domain | `imgwire custom-domain` | `create`, `get-custom-domain`, `test-connection`, `delete`                                                                                                |
| CORS Origins  | `imgwire cors-origin`   | `list`, `create`, `get-cors-origin`, `update`, `delete`                                                                                                   |
| Metrics       | `imgwire metrics`       | `get-datasets`, `get-stats`                                                                                                                               |

List commands default to `--limit 25 --page 1`:

```sh-session
$ imgwire images list
$ imgwire cors-origin list --limit 50 --page 2
```

Metrics commands default to the current UTC day, hourly interval, and UTC timezone:

```sh-session
$ imgwire metrics get-stats
$ imgwire metrics get-datasets --date-start 2026-05-01T00:00:00Z --date-end 2026-05-01T23:59:59Z --interval hourly --tz UTC
```

# Common Workflows

Upload an image and print its image ID:

```sh-session
$ imgwire images upload ./hero.png
img_123
```

Generate a CDN URL for an existing image:

```sh-session
$ imgwire images url img_123 --width 500 --height 500 --resizing-type cover
https://cdn.imgwire.dev/...
```

Pipe upload into URL generation:

```sh-session
$ imgwire images upload ./hero.png | imgwire images url --width 500 --height 500 --resizing-type cover
https://cdn.imgwire.dev/...
```

The singular `image` alias is also available for pipeline readability:

```sh-session
$ imgwire images upload ./hero.png | imgwire image url --width 500 --height 500
```

Use `create-image` when you only want an upload URL and plan to perform the object upload yourself:

```sh-session
$ imgwire images create-image --filename hero.png --mimetype image/png --contentlength 1024
```

Bulk operations accept comma-separated image IDs:

```sh-session
$ imgwire images bulk-delete --image-ids img_123,img_456
$ imgwire images create-bulk-download-job --image-ids img_123,img_456
```

# Development

Run the CLI from this repository with the oclif dev entrypoint:

```sh-session
$ yarn install
$ yarn build
$ ./bin/dev.js --help
$ ./bin/dev.js images list
```

Use `yarn format`, `yarn build`, and `yarn test` before committing changes.

# Commands

<!-- commands -->

- [`imgwire cors-origin create PATTERN`](#imgwire-cors-origin-create-pattern)
- [`imgwire cors-origin delete ID`](#imgwire-cors-origin-delete-id)
- [`imgwire cors-origin get-cors-origin ID`](#imgwire-cors-origin-get-cors-origin-id)
- [`imgwire cors-origin list`](#imgwire-cors-origin-list)
- [`imgwire cors-origin update ID PATTERN`](#imgwire-cors-origin-update-id-pattern)
- [`imgwire custom-domain create HOSTNAME`](#imgwire-custom-domain-create-hostname)
- [`imgwire custom-domain delete`](#imgwire-custom-domain-delete)
- [`imgwire custom-domain get-custom-domain`](#imgwire-custom-domain-get-custom-domain)
- [`imgwire custom-domain test-connection`](#imgwire-custom-domain-test-connection)
- [`imgwire help [COMMAND]`](#imgwire-help-command)
- [`imgwire images bulk-delete`](#imgwire-images-bulk-delete)
- [`imgwire images create-bulk-download-job`](#imgwire-images-create-bulk-download-job)
- [`imgwire images create-image`](#imgwire-images-create-image)
- [`imgwire images create-upload-token`](#imgwire-images-create-upload-token)
- [`imgwire images delete ID`](#imgwire-images-delete-id)
- [`imgwire images get-bulk-download-job ID`](#imgwire-images-get-bulk-download-job-id)
- [`imgwire images get-image IMAGE-ID`](#imgwire-images-get-image-image-id)
- [`imgwire images list`](#imgwire-images-list)
- [`imgwire images upload PATH`](#imgwire-images-upload-path)
- [`imgwire images url [ID]`](#imgwire-images-url-id)
- [`imgwire login`](#imgwire-login)
- [`imgwire logout`](#imgwire-logout)
- [`imgwire metrics get-datasets`](#imgwire-metrics-get-datasets)
- [`imgwire metrics get-stats`](#imgwire-metrics-get-stats)
- [`imgwire whoami`](#imgwire-whoami)

## `imgwire cors-origin create PATTERN`

Create a CORS origin

```
USAGE
  $ imgwire cors-origin create PATTERN

ARGUMENTS
  PATTERN  CORS origin pattern

DESCRIPTION
  Create a CORS origin

EXAMPLES
  $ imgwire cors-origin create https://example.com
```

_See code: [src/commands/cors-origin/create.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/cors-origin/create.ts)_

## `imgwire cors-origin delete ID`

Delete a CORS origin

```
USAGE
  $ imgwire cors-origin delete ID

ARGUMENTS
  ID  CORS origin ID

DESCRIPTION
  Delete a CORS origin

EXAMPLES
  $ imgwire cors-origin delete cor_123
```

_See code: [src/commands/cors-origin/delete.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/cors-origin/delete.ts)_

## `imgwire cors-origin get-cors-origin ID`

Retrieve a CORS origin

```
USAGE
  $ imgwire cors-origin get-cors-origin ID

ARGUMENTS
  ID  CORS origin ID

DESCRIPTION
  Retrieve a CORS origin

EXAMPLES
  $ imgwire cors-origin get-cors-origin cor_123
```

_See code: [src/commands/cors-origin/get-cors-origin.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/cors-origin/get-cors-origin.ts)_

## `imgwire cors-origin list`

List CORS origins

```
USAGE
  $ imgwire cors-origin list [--limit <value>] [--page <value>]

FLAGS
  --limit=<value>  [default: 25] Number of records to return
  --page=<value>   [default: 1] Page number to return

DESCRIPTION
  List CORS origins

EXAMPLES
  $ imgwire cors-origin list --limit 25 --page 1
```

_See code: [src/commands/cors-origin/list.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/cors-origin/list.ts)_

## `imgwire cors-origin update ID PATTERN`

Update a CORS origin

```
USAGE
  $ imgwire cors-origin update ID PATTERN

ARGUMENTS
  ID       CORS origin ID
  PATTERN  Updated CORS origin pattern

DESCRIPTION
  Update a CORS origin

EXAMPLES
  $ imgwire cors-origin update cor_123 https://example.com
```

_See code: [src/commands/cors-origin/update.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/cors-origin/update.ts)_

## `imgwire custom-domain create HOSTNAME`

Create the custom domain

```
USAGE
  $ imgwire custom-domain create HOSTNAME

ARGUMENTS
  HOSTNAME  Hostname to configure

DESCRIPTION
  Create the custom domain

EXAMPLES
  $ imgwire custom-domain create images.example.com
```

_See code: [src/commands/custom-domain/create.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/custom-domain/create.ts)_

## `imgwire custom-domain delete`

Delete the custom domain

```
USAGE
  $ imgwire custom-domain delete

DESCRIPTION
  Delete the custom domain

EXAMPLES
  $ imgwire custom-domain delete
```

_See code: [src/commands/custom-domain/delete.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/custom-domain/delete.ts)_

## `imgwire custom-domain get-custom-domain`

Retrieve the custom domain

```
USAGE
  $ imgwire custom-domain get-custom-domain

DESCRIPTION
  Retrieve the custom domain

EXAMPLES
  $ imgwire custom-domain get-custom-domain
```

_See code: [src/commands/custom-domain/get-custom-domain.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/custom-domain/get-custom-domain.ts)_

## `imgwire custom-domain test-connection`

Test the custom domain connection

```
USAGE
  $ imgwire custom-domain test-connection

DESCRIPTION
  Test the custom domain connection

EXAMPLES
  $ imgwire custom-domain test-connection
```

_See code: [src/commands/custom-domain/test-connection.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/custom-domain/test-connection.ts)_

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

## `imgwire images bulk-delete`

Delete multiple images

```
USAGE
  $ imgwire images bulk-delete --image-ids <value>

FLAGS
  --image-ids=<value>  (required) Comma-separated image IDs

DESCRIPTION
  Delete multiple images

EXAMPLES
  $ imgwire images bulk-delete --image-ids img_123,img_456
```

_See code: [src/commands/images/bulk-delete.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/bulk-delete.ts)_

## `imgwire images create-bulk-download-job`

Create a bulk image download job

```
USAGE
  $ imgwire images create-bulk-download-job --image-ids <value>

FLAGS
  --image-ids=<value>  (required) Comma-separated image IDs

DESCRIPTION
  Create a bulk image download job

EXAMPLES
  $ imgwire images create-bulk-download-job --image-ids img_123,img_456
```

_See code: [src/commands/images/create-bulk-download-job.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/create-bulk-download-job.ts)_

## `imgwire images create-image`

Create a standard upload intent

```
USAGE
  $ imgwire images create-image --filename <value> [--contentlength <value>] [--mimetype <value>] [--upload-token
  <value>]

FLAGS
  --contentlength=<value>  Content length in bytes
  --filename=<value>       (required) Original file name
  --mimetype=<value>       Image MIME type
  --upload-token=<value>   Optional upload token

DESCRIPTION
  Create a standard upload intent

EXAMPLES
  $ imgwire images create-image --filename hero.png --mimetype image/png --contentlength 1024
```

_See code: [src/commands/images/create-image.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/create-image.ts)_

## `imgwire images create-upload-token`

Create an upload token

```
USAGE
  $ imgwire images create-upload-token

DESCRIPTION
  Create an upload token

EXAMPLES
  $ imgwire images create-upload-token
```

_See code: [src/commands/images/create-upload-token.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/create-upload-token.ts)_

## `imgwire images delete ID`

Delete an image

```
USAGE
  $ imgwire images delete ID

ARGUMENTS
  ID  Image ID to delete

DESCRIPTION
  Delete an image

EXAMPLES
  $ imgwire images delete img_123
```

_See code: [src/commands/images/delete.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/delete.ts)_

## `imgwire images get-bulk-download-job ID`

Retrieve a bulk image download job

```
USAGE
  $ imgwire images get-bulk-download-job ID

ARGUMENTS
  ID  Bulk download job ID

DESCRIPTION
  Retrieve a bulk image download job

EXAMPLES
  $ imgwire images get-bulk-download-job job_123
```

_See code: [src/commands/images/get-bulk-download-job.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/get-bulk-download-job.ts)_

## `imgwire images get-image IMAGE-ID`

Retrieve an image

```
USAGE
  $ imgwire images get-image IMAGE-ID

ARGUMENTS
  IMAGE-ID  Image ID to retrieve

DESCRIPTION
  Retrieve an image

EXAMPLES
  $ imgwire images get-image img_123
```

_See code: [src/commands/images/get-image.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/get-image.ts)_

## `imgwire images list`

List images

```
USAGE
  $ imgwire images list [--limit <value>] [--page <value>]

FLAGS
  --limit=<value>  [default: 25] Number of records to return
  --page=<value>   [default: 1] Page number to return

DESCRIPTION
  List images

EXAMPLES
  $ imgwire images list --limit 25 --page 1
```

_See code: [src/commands/images/list.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/list.ts)_

## `imgwire images upload PATH`

Upload an image and print the image ID

```
USAGE
  $ imgwire images upload PATH

ARGUMENTS
  PATH  Path to an image file to upload

DESCRIPTION
  Upload an image and print the image ID

EXAMPLES
  $ imgwire images upload ./hero.png

  $ imgwire images upload ./hero.png | imgwire images url --width 500 --height 500
```

_See code: [src/commands/images/upload.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/upload.ts)_

## `imgwire images url [ID]`

Generate a CDN URL for an image

```
USAGE
  $ imgwire images url [ID] [--a <value>] [--adjust <value>] [--background <value>] [--background-alpha <value>]
    [--bg <value>] [--bga <value>] [--bl <value>] [--blur <value>] [--br <value>] [--brightness <value>] [--c <value>]
    [--chroma-subsampling <value>] [--co <value>] [--col <value>] [--color-profile <value>] [--colorize <value>]
    [--contrast <value>] [--cp <value>] [--crop <value>] [--dpi <value>] [--dpr <value>] [--dt <value>] [--duotone
    <value>] [--el <value>] [--enlarge <value>] [--ex <value>] [--exar <value>] [--ext <value>] [--extend <value>]
    [--extend-ar <value>] [--extend-aspect-ratio <value>] [--extension <value>] [--f <value>] [--fl <value>] [--flip
    <value>] [--format <value>] [--g <value>] [--gr <value>] [--gradient <value>] [--gravity <value>] [--h <value>]
    [--height <value>] [--hu <value>] [--hue <value>] [--icc <value>] [--kcr <value>] [--keep-copyright <value>] [--l
    <value>] [--lightness <value>] [--mc <value>] [--mh <value>] [--min-height <value>] [--min-width <value>]
    [--monochrome <value>] [--mw <value>] [--neg <value>] [--negate <value>] [--norm <value>] [--normalise <value>]
    [--normalize <value>] [--padding <value>] [--pd <value>] [--pix <value>] [--pixelate <value>] [--preset <value>]
    [--progressive <value>] [--q <value>] [--quality <value>] [--ra <value>] [--resizing-algorithm <value>]
    [--resizing-type <value>] [--rot <value>] [--rotate <value>] [--sa <value>] [--saturation <value>] [--scp <value>]
    [--sh <value>] [--sharpen <value>] [--sm <value>] [--strip-color-profile <value>] [--strip-metadata <value>] [--w
    <value>] [--watermark <value>] [--watermark-offset <value>] [--watermark-position <value>] [--watermark-rotate
    <value>] [--watermark-shadow <value>] [--watermark-size <value>] [--watermark-text <value>] [--watermark-url
    <value>] [--width <value>] [--wm <value>] [--wm-rot <value>] [--wmp <value>] [--wmr <value>] [--wms <value>] [--wmsh
    <value>] [--wmt <value>] [--wmu <value>] [--z <value>] [--zoom <value>]

ARGUMENTS
  [ID]  Image ID. Reads from stdin when omitted.

FLAGS
  --a=<value>                    Set the a image URL transform
  --adjust=<value>               Set the adjust image URL transform
  --background=<value>           Set the background image URL transform
  --background-alpha=<value>     Set the background-alpha image URL transform
  --bg=<value>                   Set the bg image URL transform
  --bga=<value>                  Set the bga image URL transform
  --bl=<value>                   Set the bl image URL transform
  --blur=<value>                 Set the blur image URL transform
  --br=<value>                   Set the br image URL transform
  --brightness=<value>           Set the brightness image URL transform
  --c=<value>                    Set the c image URL transform
  --chroma-subsampling=<value>   Set the chroma-subsampling image URL transform
  --co=<value>                   Set the co image URL transform
  --col=<value>                  Set the col image URL transform
  --color-profile=<value>        Set the color-profile image URL transform
  --colorize=<value>             Set the colorize image URL transform
  --contrast=<value>             Set the contrast image URL transform
  --cp=<value>                   Set the cp image URL transform
  --crop=<value>                 Set the crop image URL transform
  --dpi=<value>                  Set the dpi image URL transform
  --dpr=<value>                  Set the dpr image URL transform
  --dt=<value>                   Set the dt image URL transform
  --duotone=<value>              Set the duotone image URL transform
  --el=<value>                   Set the el image URL transform
  --enlarge=<value>              Set the enlarge image URL transform
  --ex=<value>                   Set the ex image URL transform
  --exar=<value>                 Set the exar image URL transform
  --ext=<value>                  Set the ext image URL transform
  --extend=<value>               Set the extend image URL transform
  --extend-ar=<value>            Set the extend-ar image URL transform
  --extend-aspect-ratio=<value>  Set the extend-aspect-ratio image URL transform
  --extension=<value>            Set the extension image URL transform
  --f=<value>                    Set the f image URL transform
  --fl=<value>                   Set the fl image URL transform
  --flip=<value>                 Set the flip image URL transform
  --format=<value>               Set the format image URL transform
  --g=<value>                    Set the g image URL transform
  --gr=<value>                   Set the gr image URL transform
  --gradient=<value>             Set the gradient image URL transform
  --gravity=<value>              Set the gravity image URL transform
  --h=<value>                    Set the h image URL transform
  --height=<value>               Set the height image URL transform
  --hu=<value>                   Set the hu image URL transform
  --hue=<value>                  Set the hue image URL transform
  --icc=<value>                  Set the icc image URL transform
  --kcr=<value>                  Set the kcr image URL transform
  --keep-copyright=<value>       Set the keep-copyright image URL transform
  --l=<value>                    Set the l image URL transform
  --lightness=<value>            Set the lightness image URL transform
  --mc=<value>                   Set the mc image URL transform
  --mh=<value>                   Set the mh image URL transform
  --min-height=<value>           Set the min-height image URL transform
  --min-width=<value>            Set the min-width image URL transform
  --monochrome=<value>           Set the monochrome image URL transform
  --mw=<value>                   Set the mw image URL transform
  --neg=<value>                  Set the neg image URL transform
  --negate=<value>               Set the negate image URL transform
  --norm=<value>                 Set the norm image URL transform
  --normalise=<value>            Set the normalise image URL transform
  --normalize=<value>            Set the normalize image URL transform
  --padding=<value>              Set the padding image URL transform
  --pd=<value>                   Set the pd image URL transform
  --pix=<value>                  Set the pix image URL transform
  --pixelate=<value>             Set the pixelate image URL transform
  --preset=<value>               Set the preset image URL transform
  --progressive=<value>          Set the progressive image URL transform
  --q=<value>                    Set the q image URL transform
  --quality=<value>              Set the quality image URL transform
  --ra=<value>                   Set the ra image URL transform
  --resizing-algorithm=<value>   Set the resizing-algorithm image URL transform
  --resizing-type=<value>        Set the resizing-type image URL transform
  --rot=<value>                  Set the rot image URL transform
  --rotate=<value>               Set the rotate image URL transform
  --sa=<value>                   Set the sa image URL transform
  --saturation=<value>           Set the saturation image URL transform
  --scp=<value>                  Set the scp image URL transform
  --sh=<value>                   Set the sh image URL transform
  --sharpen=<value>              Set the sharpen image URL transform
  --sm=<value>                   Set the sm image URL transform
  --strip-color-profile=<value>  Set the strip-color-profile image URL transform
  --strip-metadata=<value>       Set the strip-metadata image URL transform
  --w=<value>                    Set the w image URL transform
  --watermark=<value>            Set the watermark image URL transform
  --watermark-offset=<value>     Set the watermark-offset image URL transform
  --watermark-position=<value>   Set the watermark-position image URL transform
  --watermark-rotate=<value>     Set the watermark-rotate image URL transform
  --watermark-shadow=<value>     Set the watermark-shadow image URL transform
  --watermark-size=<value>       Set the watermark-size image URL transform
  --watermark-text=<value>       Set the watermark-text image URL transform
  --watermark-url=<value>        Set the watermark-url image URL transform
  --width=<value>                Set the width image URL transform
  --wm=<value>                   Set the wm image URL transform
  --wm-rot=<value>               Set the wm-rot image URL transform
  --wmp=<value>                  Set the wmp image URL transform
  --wmr=<value>                  Set the wmr image URL transform
  --wms=<value>                  Set the wms image URL transform
  --wmsh=<value>                 Set the wmsh image URL transform
  --wmt=<value>                  Set the wmt image URL transform
  --wmu=<value>                  Set the wmu image URL transform
  --z=<value>                    Set the z image URL transform
  --zoom=<value>                 Set the zoom image URL transform

DESCRIPTION
  Generate a CDN URL for an image

EXAMPLES
  $ imgwire images url img_123 --width 500 --height 500 --resizing-type cover

  $ imgwire images upload ./hero.png | imgwire images url --width 500
```

_See code: [src/commands/images/url.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/images/url.ts)_

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

## `imgwire metrics get-datasets`

Retrieve metrics datasets

```
USAGE
  $ imgwire metrics get-datasets [--date-end <value>] [--date-start <value>] [--interval hourly|daily|weekly|monthly]
    [--tz <value>]

FLAGS
  --date-end=<value>    End date/time. Defaults to the end of the current UTC day.
  --date-start=<value>  Start date/time. Defaults to the beginning of the current UTC day.
  --interval=<option>   [default: hourly] Dataset interval
                        <options: hourly|daily|weekly|monthly>
  --tz=<value>          [default: UTC] IANA timezone

DESCRIPTION
  Retrieve metrics datasets

EXAMPLES
  $ imgwire metrics get-datasets --interval hourly --tz UTC
```

_See code: [src/commands/metrics/get-datasets.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/metrics/get-datasets.ts)_

## `imgwire metrics get-stats`

Retrieve metrics stats

```
USAGE
  $ imgwire metrics get-stats [--date-end <value>] [--date-start <value>] [--interval hourly|daily|weekly|monthly]
    [--tz <value>]

FLAGS
  --date-end=<value>    End date/time. Defaults to the end of the current UTC day.
  --date-start=<value>  Start date/time. Defaults to the beginning of the current UTC day.
  --interval=<option>   [default: hourly] Stats interval
                        <options: hourly|daily|weekly|monthly>
  --tz=<value>          [default: UTC] IANA timezone

DESCRIPTION
  Retrieve metrics stats

EXAMPLES
  $ imgwire metrics get-stats --interval hourly --tz UTC
```

_See code: [src/commands/metrics/get-stats.ts](https://github.com/Blackhawk-Software/imgwire-cli/blob/v0.0.0/src/commands/metrics/get-stats.ts)_

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
