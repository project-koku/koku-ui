#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`

  LOCALES_DIR="$SCRIPT_DIR/../locales"
  TRANSLATIONS_FILE="$LOCALES_DIR/translations.json"

  TMP_DIR="/tmp/$SCRIPT.$$"
}

usage()
{
cat <<- EEOOFF

    This script will create a new translation file, based on the existing translations.json file.

    For the French translation; for example, a new locales/fr.json file is created and "EN" prefixes are replaced with "FR".

    sh [-x] $SCRIPT [-h] -<a|f|g>

    OPTIONS:
    h       Display this message
    a       All locales
    f       French
    g       German

EEOOFF
}

# main()
{
  default

  while getopts hafg c; do
    case $c in
      a) LOCALES="fr de";;
      f) LOCALES="fr";;
      g) LOCALES="de";;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$LOCALES" ]; then
    usage
    exit 1
  fi

  for LOCALE in `echo $LOCALES`
  do
    LOCALE_FILE="$LOCALES_DIR/$LOCALE.json"
    PREFIX=`echo "$LOCALE" | tr '[a-z]' '[A-Z]'`

    rm -rf $LOCALE_FILE

    # Prereq
    sed "s|{}|<>|g" $TRANSLATIONS_FILE |
    sed "s|{count,|<count,|g" |
    sed "s|{groupBy,|<groupBy,|g" |
    sed "s|{month,|<month,|g" |
    sed "s|{resolution,|<resolution,|g" |
    sed "s|{value,|<value,|g" |
    sed "s|{units,|<units,|g" |

    # Props
    sed "s|{back}|<back>|g" |
    sed "s|{costModel}|<costModel>|g" |
    sed "s|{count}|<count>|g" |
    sed "s|{create}|<create>|g" |
    sed "s|{date}|<date>|g" |
    sed "s|{day}|<day>|g" |
    sed "s|{endDate}|<endDate>|g" |
    sed "s|{infrastructureCost}|<infrastructureCost>|g" |
    sed "s|{learnMore}|<learnMore>|g" |
    sed "s|{metric}|<metric>|g" |
    sed "s|{month}|<month>|g" |
    sed "s|{name}|<name>|g" |
    sed "s|{percent}|<percent>|g" |
    sed "s|{percentage}|<percentage>|g" |
    sed "s|{provider}|<provider>|g" |
    sed "s|{startDate}|<startDate>|g" |
    sed "s|{source}|<source>|g" |
    sed "s|{supplementaryCost}|<supplementaryCost>|g" |
    sed "s|{units}|<units>|g" |
    sed "s|{url}|<url>|g" |
    sed "s|{uuid}|<uuid>|g" |
    sed "s|{value}|<value>|g" |
    sed "s|{value0}|<value0>|g" |
    sed "s|{value1}|<value1>|g" |
    sed "s|{year}|<year>|g" |

    # Fix name
    sed "s|name <name>|name {name}|g" |
    sed "s|one <name>|one {name}|g" |

    # Add prefix
    sed "s| {| {$PREFIX |g" |
    sed "s|: \"|: \"$PREFIX |g" |

    # Fixes
    sed "s|$PREFIX <count,|{count,|g" |
    sed "s|$PREFIX <groupBy,|{groupBy,|g" |
    sed "s|$PREFIX <month,|{month,|g" |
    sed "s|$PREFIX <resolution,|{resolution,|g" |
    sed "s|$PREFIX <value,|{value,|g" |
    sed "s|$PREFIX <units,|{units,|g" |
    sed "s|$PREFIX https|https|g" |
    sed "s|$PREFIX <provider>|{provider}|g" | # this is a filename
    sed "s|$PREFIX $PREFIX|$PREFIX|g" |
    sed "s|<|{|g" |
    sed "s|>|}|g" > $LOCALE_FILE

  done
}
