#!/bin/bash

api="true"
changelog="true"
license="true"
makefile="true"

while [[ $# -gt 1 ]]; do
  key="$1"

  case $key in
    -a|--api)
    api="$2"
    shift # past argument
    ;;
    -c|--changelog)
    changelog="$2"
    shift # past argument
    ;;
    -l|--license)
    license="$2"
    ;;
    -e|--env)
    env="$2"
    ;;
    -m|--makefile)
    makefile="$2"
    ;;
    *)
            # unknown option
    ;;
  esac
  shift
done

###############################################################################
# PACKAGE.md
###############################################################################

printf "Create documentation (PACKAGE.md)\n"
touch PACKAGE.md
node node_modules/.bin/package-json-to-readme --no-footer package.json > PACKAGE.md

###############################################################################
# README.md
###############################################################################

touch README.md
printf "" > README.md
# cat readme/LOGO.md >> README.md
# cat readme/BADGES.md > README.md
# printf "\n\n" >> README.md
# head -4 PACKAGE.md >> README.md
## printf "\n\n" >> README.md

printf "<!-- START doctoc -->\n<!-- END doctoc -->\n\n" >> README.md
printf "\n" >> README.md
cat readme/DOCUMENTATION.md >> README.md
printf "\n\n" >> README.md

printf "## Further information" >> README.md
printf "\n\n" >> README.md

printf -- "- [Module Details](./PACKAGE.md)" >> README.md
printf "\n\n" >> README.md


###############################################################################
# API.md
###############################################################################

if [ "$api" == "true" ]; then
  printf "Create documentation (API.md)\n"
  touch API.md
  printf "<!-- START doctoc -->\n<!-- END doctoc -->\n\n" >> API.md
  node node_modules/.bin/jsdoc2md package.json --no-cache --configure .jsdoc.json . > API.md
  node node_modules/.bin/doctoc API.md --github --title "## TOC" --maxlevel 2

  printf -- "- [Api Reference](./API.md)" >> README.md
  printf "\n\n" >> README.md
fi

###############################################################################
# MAKE.md
###############################################################################

MAKE_FILE=Makefile

if [[ -f "$MAKE_FILE" ]] && [[ "$makefile" == "true" ]]; then
  printf "Create documentation (MAKE.md)\n"

  printf "Target Call | Description | Dependencies\n---|---|---\n" > MAKE.md

  # find out what is the default goal (if set)
  DEFAULT_TARGET=$(awk 'BEGIN {FS = "^.DEFAULT_GOAL :=|^.DEFAULT_GOAL:= |^.DEFAULT_GOAL:="} /^.DEFAULT_GOAL.*/ {printf $2}' $MAKE_FILE | sed "s/ //g")
  if [ ! -z "$DEFAULT_TARGET" ]; then
     printf "  - Print default target: ${DEFAULT_TARGET}\n"
     printf "\`$ make\` | This calls the default target \`${DEFAULT_TARGET}\`. |\n" >> MAKE.md
  else
     printf "  - No default target found\n"
  fi

  # take care of all other targets
  printf "  - Print all targets"
  awk 'BEGIN {FS = ": |## "} /^[a-zA-Z_-]+:.*?## / {printf "\`$ make %s\` | %s | `%s`\n", $1, $3, $2}' Makefile | sed "s/| \`\`$/|/g" | sed "s/ \`$/\`/g"| sort  >> MAKE.md

  printf -- "- [Makefile Reference](./MAKE.md)" >> README.md
  printf "\n\n" >> README.md
fi

###############################################################################
# Finalize README.md
###############################################################################

if [ "$changelog" == "true" ]; then
  cat CHANGELOG.md >> README.md
  printf "\n\n" >> README.md
else
  printf -- "- [Changelog](./CHANGELOG.md)" >> README.md
  printf "\n\n" >> README.md
fi

if [ "$license" == "true" ]; then
  printf "## License\n\n" >> README.md
  cat LICENSE.md >> README.md
else
  printf -- "- [License](./LICENSE.md)" >> README.md
  printf "\n\n" >> README.md
fi

###############################################################################
# Create the TOC in README.md
###############################################################################

node node_modules/.bin/doctoc README.md --github --title "## TOC" --maxlevel 3
