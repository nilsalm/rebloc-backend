#!/bin/sh
P2P_PORT_BASE=5001
HTTP_PORT_BASE=3001
PEERS=

echo "Killing all previous docker containers"
docker kill $(docker ps -q)
echo "Removing all previous docker containers"
docker rm $(docker ps -a -q)

last=2
if [[ $# -gt 0 ]]
then 
  last=$1
fi

for i in $(seq 0 $last)
do

  P2P_PORT=$(expr $P2P_PORT_BASE + $i)
  HTTP_PORT=$(expr $HTTP_PORT_BASE + $i)
  echo "Starting on ${HTTP_PORT} ${P2P_PORT} with peer ${PEERS}"

  docker run \
    -p $HTTP_PORT:$HTTP_PORT \
    -p $P2P_PORT:$P2P_PORT \
    -e HTTP_PORT=$HTTP_PORT \
    -e P2P_PORT=$P2P_PORT \
    -e LOCALHOST='host.docker.internal' \
    -e PEERS=$PEERS \
    --name blocks-${P2P_PORT} \
    -d \
    nilsweber/blocks

  last_peer="ws://host.docker.internal:${P2P_PORT}"
  if [ $i == 0 ]; then
    PEERS=$last_peer
  else
    PEERS="${PEERS},${last_peer}"
  fi

done
