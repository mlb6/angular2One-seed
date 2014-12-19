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

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

karma start test/karma.conf.js --sauce &
#./node_modules/.bin/protractor protractor.travis.conf.js &
wait %1
