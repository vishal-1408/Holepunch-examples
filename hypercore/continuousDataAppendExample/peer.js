
import Hypercore from 'hypercore'
import Hyperswarm from 'hyperswarm'

// HostedCore public key: e6f340a003b0cdd5d3ad45bac08dbd7a32d595b48f926933cba4d6934f64082d
const core = new Hypercore('./data-append-peer', Buffer.from('public key goes here', 'hex'),{
    valueEncoding: 'json'
})

const swarm = new Hyperswarm()

// Setup corestore replication ---> on connection replicate the store
swarm.on('connection', (connection) => core.replicate(connection))

// wait until the the length, keys and other properties of core are initialized
await core.ready()
// console.log("core is ready")

// Join a topic
swarm.join(core.discoveryKey)

console.log("joined it ", core.discoveryKey.toString('hex'))

// wait for the swarm to connect to any pending peers
await swarm.flush() 

// get the latest length of the core
await core.update()

console.log('Core length is:', core.length)

setInterval(async ()=>{
    try{
        console.log("inside")
        const data = await core.get(core.length-1)
        console.log(core.length, JSON.parse(data))
    }catch(e){
        // Error arises when the seed truncates but the length of the core in peer not yet updated.
        // Error: snapshot not found.. (as data won't be there for the given length)
        console.log(e)
        await core.update()
    }
},5000)