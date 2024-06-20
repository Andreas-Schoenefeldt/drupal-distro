#!/bin/bash

# script to simplify an initial install
# @todo improve by choices

echo ""
echo "> mkdir -p web/sites/default/files/translations (create the directory which is missing by default in drupal 9)"
mkdir -p web/sites/default/files/translations
echo ""
echo "> composer install"
composer install
echo ""
echo "> npm install"
npm install
echo ""
echo "> gulp build"
gulp build
echo ""
echo "> Installation done, please create a settings.default.php and import the initial database"
