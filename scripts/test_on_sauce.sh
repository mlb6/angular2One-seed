#! /bin/bash
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

function killServer {
  kill $serverPid
}

gulp build-dev

#gulp serve &
#serverPid=$!
#trap killServer EXIT

gulp test-sauce &

#protractor protractor.travis.conf.js &

wait %1 # test-sauce
gulp publish-coverage

#wait %2 # protractor
exit 0
