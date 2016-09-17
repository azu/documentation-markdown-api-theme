#!/bin/bash
declare currentDir=$(cd $(dirname $0);pwd)
declare parentDir="${currentDir}/../"
tmpfile=$(mktemp)
# update
$(npm bin)/documentation build --access public --theme ${parentDir}/src/index.js -f html -o ${tmpfile} ${parentDir}/example/example.js
cat ${tmpfile} | $(npm bin)/add-text-to-markdown ${parentDir}/README.md --section "Example Output" -w
