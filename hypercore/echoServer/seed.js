import Hyperswarm from 'hyperswarm'
import  crypto from 'crypto'

const swarm = new Hyperswarm()

swarm.on('connection', (encryptedSocket) => {
    console.log('New connection from', encryptedSocket.remotePublicKey.toString('hex'))
  
    encryptedSocket.write('Echo server: Hey! I am an echo server. I will echo back whatever you send to me!!')
  
    encryptedSocket.on('data', function (data) {
      encryptedSocket.write('Echo server: '+data.toString())
    })
    encryptedSocket.on('error', function (err) {
      console.log('Remote peer errored:', err)
    })
    encryptedSocket.on('close', function () {
      console.log('Remote peer fully left')
    })

    process.stdin.pipe(encryptedSocket)
  })

  console.log("joining")
  const topic = crypto.createHash('sha256').update('hypercore-protocol-examples').digest()
  swarm.join(topic)