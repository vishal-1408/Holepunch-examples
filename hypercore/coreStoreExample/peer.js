import Corestore from 'corestore'
import Hyperswarm from 'hyperswarm'

const store = new Corestore('./peer-store')
const swarm = new Hyperswarm()

// Setup corestore replication ---> on connection replicate the store
swarm.on('connection', (connection) => store.replicate(connection))

// Use the public key: 70122affb31de79a900971acdf928939660fd0179a14591902eb1fa561b2c78f for blocks hypercore to be replicated with our hosted blocks hypercore
// Use the public key: e4578d828a3a35cdd52f23364ac94dc5ae11b0e85ec98584b590e5d21c26d060 for languages hypercore to be replicated with our hosted languages hypercoreb
const blocks = store.get({ key: Buffer.from('public key goes here', 'hex'), valueEncoding: 'json'})
const languages = store.get({key:  Buffer.from('public key goes here', 'hex'), valueEncoding: 'utf-8'})


// Ensure the length is loaded
await blocks.ready()
await languages.ready()

// Join the Hypercore discoveryKey (a hash of it's public key) topic 
swarm.join(blocks.discoveryKey)

// Ensure we have all the connections
await swarm.flush()

// Ensure we have the latest length
await blocks.update()
await languages.update()

// Print the length (should print 10000)
console.log('blocks core length is: ', blocks.length)
console.log('languages core length is: ',languages.length)

const language1 = await languages.get(0)
const block1 = await blocks.get(0)

console.log('starting block data of blocks core is : ', block1)
console.log('starting block data of languages core is : ', language1)