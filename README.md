# Example Greenpeace's Eleventy project

This is a starter project to develop custom web pages for Greenpeace Spain.

## Install and run dev server

Clone the git repo:

```sh
git clone https://github.com/osvik/eleventy-boilerplate-2024.git
```

Install the dependencies:

```sh
npm install
```

Run a [local server in the port 8080](http://localhost:8080):

```sh
npm run server
```

## Features

### User

#### This repo

* Can be multilingual
* The page has good acessible
* The page is responsive and mobile first
* The page has good performance

#### Greenpeace forms

* Greenpeace downloads and petiton forms
* Greenpeace's petition counter
* Autofill the form with hbspt_token or with data from a previous forms in es.greenpeace.org

#### Other

* Cookie management compatible with es.greenpeace.org
* Page content is user customizable with `hbspt_token`
* Example standard navigation menu and footer
* Open graph to easily share in social media
* Generates social media share links

### Analytics

* Mixpanel with Greenpeace's standard
* GA4 with GP Spain standard
* AB test tool for Mixpanel, GA4 and Hotjar, with CRM support
* Adwords ad management
* Tracked social media share links

### Search Engine Optimization

* Open graph to easily share in social media
* Metas anc canonical url

### Developer features

* Easily develop in localhost with live refresh.
* Share the pages with the team with Github Pages while you develop them. Use branches for experiments.
* Critical CSS can be easily inserted.
* Eslint, formatters and Nunjucks templates in VS Code.
* Based in Alpinejs components.

## Develop and configure

Configure the web in this 4 files/folders:

1. _data/site.js - Mostly website
2. Folder jSon - Mostly language 
3. Page jSon - Page, mostly technical
4. Page html - Page, mostly content

### Build for Github pages and to commit in Git

Build the site into the docs folder, so it works in Github pages.

```bash
npm run build:github
```

### How to build for production

1. Ensure that [_data/site.js](_data/site.js) is properly configured.

2. Build the site with the production urls, also in the docs folder by running this command:
```bash
npm run build:prod
```

3. Deploy the assets folder to be accessed publically.

## Translate

Practically all language texts are in the folder json file, like for example `es.json`. For more than one language duplicate `es.json`.

## Notes

* [Greenpeace Identity](https://gpidentity.my.canva.site/)
