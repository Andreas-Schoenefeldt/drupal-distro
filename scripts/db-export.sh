#!/bin/bash
echo "> drush --yes wd all (clear watchdog table)"
drush --yes wd all
echo "> drush sql:dump --gzip --structure-tables-list=\"search_index,search_total,search_dataset\" --result-file=\"gwo.sql\" (Export DB without search tables, as they tend to cause import failures)"
drush sql:dump --gzip --structure-tables-list="search_index,search_total,search_dataset" --result-file="db.sql"
echo "you can download the file now under /db.sql.gz"
