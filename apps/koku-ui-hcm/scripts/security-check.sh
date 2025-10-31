#!/bin/sh

# Subject: Recent NPM compromised libraries S1ngularity/NX
# Date: Tue, 16 Sep 2025 10:07:54 -0400
#
# Red Hat Product Security and Information Security are aware of another supply chain compromise affecting numerous
# Node.js (npm) components. In this instance, the malicious code added to these packages functions as a worm to collect
# credentials to CI/CD tools and attempts to automatically propagate further using those harvested credentials. Due to
# this, we expect the scope of affected NPM libraries to expand rapidly in a very short timespan.
#
# Please refer to the list of known compromised packages at the bottom of this announcement. 187 have been identified
# and we expect this list is not exhaustive. ProdSec and InfoSec are continuing to monitor the situation; information
# may change over time.

PKGS=" \
@ahmedhfarag/ngx-perfect-scrollbar \
@ahmedhfarag/ngx-virtual-scroller \
@art-ws/common \
@art-ws/config-eslint \
@art-ws/config-ts \
@art-ws/db-context \
@art-ws/di \
@art-ws/di-node \
@art-ws/eslint \
@art-ws/fastify-http-server \
@art-ws/http-server \
@art-ws/openapi \
@art-ws/package-base \
@art-ws/prettier \
@art-ws/slf \
@art-ws/ssl-info \
@art-ws/web-app \
@crowdstrike/commitlint \
@crowdstrike/falcon-shoelace \
@crowdstrike/foundry-js \
@crowdstrike/glide-core \
@crowdstrike/logscale-dashboard \
@crowdstrike/logscale-file-editor \
@crowdstrike/logscale-parser-edit \
@crowdstrike/logscale-search \
@crowdstrike/tailwind-toucan-base \
@ctrl/deluge \
@ctrl/golang-template \
@ctrl/magnet-link \
@ctrl/ngx-codemirror \
@ctrl/ngx-csv \
@ctrl/ngx-emoji-mart \
@ctrl/ngx-rightclick \
@ctrl/qbittorrent \
@ctrl/react-adsense \
@ctrl/shared-torrent \
@ctrl/tinycolor \
@ctrl/torrent-file \
@ctrl/transmission \
@ctrl/ts-base32 \
@hestjs/core \
@hestjs/cqrs \
@hestjs/demo \
@hestjs/eslint-config \
@hestjs/logger \
@hestjs/scalar \
@hestjs/validation \
@nativescript-community/arraybuffers \
@nativescript-community/gesturehandler \
@nativescript-community/perms \
@nativescript-community/sqlite \
@nativescript-community/text \
@nativescript-community/typeorm \
@nativescript-community/ui-collectionview \
@nativescript-community/ui-document-picker \
@nativescript-community/ui-drawer \
@nativescript-community/ui-image \
@nativescript-community/ui-label \
@nativescript-community/ui-material-bottom-navigation \
@nativescript-community/ui-material-bottomsheet \
@nativescript-community/ui-material-core \
@nativescript-community/ui-material-core-tabs \
@nativescript-community/ui-material-ripple \
@nativescript-community/ui-material-tabs \
@nativescript-community/ui-pager \
"

cd ..

for PKG in `echo $PKGS`
do
  npm why $PKG
done
