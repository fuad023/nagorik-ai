#!/bin/bash

set -e # tells the shell to exit the script if any command returns a non-zero exit code (i.e. fails)

run_sql_dir() {
  local dir="$1"
  for f in $(ls "$dir"/*.sql 2>/dev/null | sort); do
    echo "[Info] Running $f ..."
    MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" mysql -u root "${MYSQL_DATABASE}" < "$f"
  done
}

run_sql_dir /docker-entrypoint-initdb.d/schema
run_sql_dir /docker-entrypoint-initdb.d/seed

echo "[Info] Database initialization complete."
