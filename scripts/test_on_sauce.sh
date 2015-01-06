#! /bin/bash
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

function killServer {
  kill $serverPid
}

gulp build

gulp serve:prod:only &
serverPid=$!
trap killServer EXIT

gulp test-sauce &

gulp protractor-sauce &

wait %1 # test-sauce
gulp publish-coverage

wait %2 # protractor
exit 0
