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
saucePid=$!
#./node_modules/.bin/protractor protractor.travis.conf.js &

while [ ! -f /tmp/waiting.debug ]; do
  echo "waiting for $saucePid"
  ps -efl | grep gulp
  sleep 5
done
wait %1
touch /tmp/waiting.debug
gulp publish-coverage
