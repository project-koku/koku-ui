#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`

  MSG_FILE=$SCRIPT_DIR/../src/locales/messages.ts

  SRC_DIR=$SCRIPT_DIR/../src
  TMP_DIR="/tmp/$SCRIPT.$$"
}

usage()
{
cat <<- EEOOFF

    This script will check for potentially unused i18n messages

    sh [-x] $SCRIPT [-h]

    OPTIONS:
    h       Display this message

EEOOFF
}

# main()
{
  default

  while getopts h c; do
    case $c in
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  FILES=`find $SRC_DIR -type f -name \*.ts -o -name \*.tsx`

  for KEY in `grep ': {' $MSG_FILE | awk -F: '{print $1}'`
  do
    if [ "$KEY" = "defaultMessage" -o "$KEY" = "description" ]; then
      continue
    fi
    JUNK=`grep "messages.$KEY" $FILES`
    if [ -z "$JUNK" ]; then
      echo "$KEY"
      if [ "$KEY" = "defaultMessage" ]; then
        exit 1
      fi
    fi
  done

  exit 0
}
