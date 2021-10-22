
P2P_PORT_BASE=5001
HTTP_PORT_BASE=3001


for i in 0 1 2 3
do 
  P2P_PORT=$(expr $P2P_PORT_BASE + $i)
  HTTP_PORT=$(expr $HTTP_PORT_BASE + $i)
  echo "Starting on ${HTTP_PORT} ${P2P_PORT}"
  docker run \
    -p $HTTP_PORT:$HTTP_PORT \
    -p $P2P_PORT:$P2P_PORT \
    -e HTTP_PORT=$HTTP_PORT \
    -e P2P_PORT=$P2P_PORT \
    -e LOCALHOST='host.docker.internal' \
    --name blocks-${P2P_PORT} \
    nilsweber/blocks 
done
