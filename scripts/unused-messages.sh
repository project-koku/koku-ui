#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`

  MSG_FILE=$SCRIPT_DIR/../src/locales/messages.ts

  SRC_DIRS=($SCRIPT_DIR/../../ui-lib $SCRIPT_DIR/../../api $SCRIPT_DIR/../../utils $SCRIPT_DIR/../../../apps)
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

  echo "The following MessageDescriptor IDs may be unused:"
  echo ""

  FILES=`find "${SRC_DIRS[@]}" -type f -name \*.ts -o -name \*.tsx`

  for KEY in `grep "id: '" $MSG_FILE | awk -F: '{print $2}' | sed "s|[',]||g"`
  do
    JUNK=`grep "messages.$KEY" $FILES`
    if [ -z "$JUNK" ]; then
      echo "$KEY"
    fi
  done

  exit 0
}
