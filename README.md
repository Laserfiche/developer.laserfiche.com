# developer.laserfiche.com

Laserfiche developer portal: https://developer.laserfiche.com
First published 5/23/2024

## Building documentation locally

### Prerequisites: <tag id="local_prereq">

1. [Install Ruby and bundler](https://jekyllrb.com/docs/installation/)
   - See the instructions [here](https://jekyllrb.com/docs/) to install jekyll and bundler.
     - You may need to add the zscaler.crt (rename extension to .pem) to your rubygems certificate folder, e.g.: `C:\Ruby33-x64\lib\ruby\3.3.0\rubygems\ssl_certs\rubygems.org`
     - You may also need to paste the zscaler.crt content into `C:\Ruby33-x64\bin\etc\ssl\cert.pem`
   - Verify installation running [check.rb](https://github.com/rubygems/ruby-ssl-check/blob/master/check.rb)
   - run `gem install bundler`
   - run `gem install jekyll`
     - If fails to download a package, you may need to manually download and install it. E.g. `gem install ffi -v 1.17.0`
1. navigate to the src directory
1. remove the Gemfile.lock, if it exists
1. run `bundle install`
1. run `bundle exec jekyll serve`

- Check installations and versions:

  ```sh
  gem --version
  bundle --version
  jekyll --version
  ```

### Build the static website and serve locally

1. Navigate to directory `<project_path>/src`.
1. Run `bundle install` to install all the dependencies needed to serve.
   - Troubleshoot:
     - If you see error `Gem::RemoteFetcher::FetchError bad response Forbidden 403`, stay under directory `/src` and follow [the steps](#fetch_error) in the dependency issues in the prerequisites to install the dependency from a local .gem file.
1. Run `bundle exec jekyll serve --destination ../_site` to build and serve the documentation.
1. Open <http://localhost:4000> in a browser.

## Adding a new page, or modifying an existing one

All website content is defined under the folder `/src/docs`. Each page is defined by a folder containing a file named `index.md`, and optionally linked static assets such as images.

The `index.md` jekyll front matter defines page data such as navigation order, title, and optional nested pages. For example:

```
---
layout: default
title: Laserfiche Title
nav_order: 2
has_children: true
---
```

to view changes in the browser, run `jekyll serve --watch` and browse <http://localhost:4000>. Refresh to see changes.

## Configuring Redirects

To redirect from a list of links to a page, add a redirect-from key in the front matter of the page, and then list the links you want to redirect from in a bulleted list. For example:

```
---
layout: default
title: Save a Document to Laserfiche
redirect_from:
  - /docs/user-documentation/save-to-laserfiche
  - /docs/user-docs/save-to-lf
nav_order: 1
parent: Laserfiche Title
---
```

## Using html-proofer to test the relative links

To check if there are any dead relative links in the project, navigate to src, and run

```sh
jekyll build
bundle exec rake
```

NOTE: If `rake` fails with error `Could not open library 'libcurl.dll'`

- Download CURL from https://curl.se/download.html
- Copy the correct version of the curl DLL (e.g. libcurl-x64.dll for Windows 64 bit) into the Ruby bin folder (e.g.`C:\Ruby33-x64\bin`) and rename to `libcurl.dll`.

## Previewing pages from build artifact

### Steps to preview in IIS:

1. Trigger the [documentation build pipeline](./.github/workflows/build-documentation.yml) from your feature branch.
1. Download the artifact `github-pages` from the your build.
1. Extract the `artifact.tar` file from the artifact.
1. Extract the files from the `artifact.tar` file.
1. Create a website in IIS pointing to the folder containing the extracted files. NOTE: IIS may not work if the folder is under `Users/your.name`.
1. Open the website from IIS.

### Steps to preview using jekyll:

1. Trigger the [documentation build pipeline](./.github/workflows/build-documentation.yml) from your feature branch.
1. Download the artifact `github-pages`from the your build.
1. Extract the files from the artifact and navigate to the directory of the extracted files.
1. Run `jekyll serve` and browse <http://127.0.0.1:4000/>

## Pushing to production

To push documentation changes to production, create a Pull Request to merge into the default branch. The PR completion will trigger the [documentation build pipeline](./.github/workflows/build-documentation.yml) which builds and publishes the documentation. You can view the results on [Github Pages](https://laserfiche.github.io).
