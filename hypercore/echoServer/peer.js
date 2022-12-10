import Hyperswarm from 'hyperswarm'
import  crypto from 'crypto'

const swarm = new Hyperswarm()

// the callback is fired whenever a new peer joins the same topic
swarm.on('connection', (socket) => {

    console.log('New connection from', socket.remotePublicKey.toString('hex'))
    
    // the callback is fired when data has been written by a peer
    socket.on('data', function (data) {
            console.log(data.toString())
    })

    socket.on('error', function (err) {
      console.log('Remote peer errored:', err)
    })

    socket.on('close', function () {
      console.log('Remote peer fully left')
    })

    process.stdin.pipe(socket)

  })

  // Use topic: hypercore-protocol-examples for connecting to our hosted peer
  const topic = crypto.createHash('sha256').update('Topic goes here').digest()
  swarm.join(topic)

  await swarm.flush()
  console.log('flushed')