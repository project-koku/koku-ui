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

    sh [-x] $SCRIPT [-h] -<b|p|s>

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
    sed "s|EN|$PREFIX|g" $TRANSLATIONS_FILE > $LOCALE_FILE
  done
}
