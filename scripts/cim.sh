#!/bin/bash
echo ""
echo "> composer install"
composer install
echo ""
echo "> drush --yes cr"
drush --yes cr
echo ""
echo "> drush --yes cim"
drush --yes cim
echo ""
echo "> drush --yes updb"
drush --yes updb
echo ""
echo "> drush --yes cr"
drush --yes cr
