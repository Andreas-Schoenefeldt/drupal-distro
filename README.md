# Bootstrap Drupal Distro

A well functioning drupal distro based on a bootstrap 5 theme

## Software Stack

* php 8.3
* [composer](https://getcomposer.org) >= 2.7
* nodejs 18.19
* [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/) as frontend CSS Framework

## Local Setup

* run `./scripts/install.sh`
* start the local php development server via `npm start`

## Deployments

Folders that need to be persistent:
* `./web/sites/default/files` - public user uploaded files
* `./private` - user and system protected files

**php.ini settings to look out for:**
* `upload_max_filesize: 10M`
* `post_max_size: 10M`

The following commands have to be executed:

```shell
# php dependency update
composer install --no-interaction --no-progress --no-dev --optimize-autoloader

# production build of the assets
npm install --unsafe-perm
gulp build

# drupal config and database update
./vendor/bin/drush --yes updatedb --no-cache-clear
./vendor/bin/drush --yes cache-rebuild
./vendor/bin/drush --yes cim
./vendor/bin/drush --yes cache-rebuild

# optional: run tests
```
