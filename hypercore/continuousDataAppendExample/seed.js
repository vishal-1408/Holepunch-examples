import Hypercore from 'hypercore'
import Hyperswarm from 'hyperswarm'

// cr
const core = new Hypercore('./data-append-seed',{
    valueEncoding: 'json'
})

// create a swarm instance
const swarm = new Hyperswarm()

swarm.on('connection', (connection) => {
    console.log("connection established with: ", connection.remotePublicKey)

    // Setup corestore replication ---> on connection replicate the store
    core.replicate(connection)
})

// wait until the the length, keys and other properties of core are initialized
await core.ready()

console.log('Core public key is:', core.key.toString('hex'))

// Join a topic
swarm.join(core.discoveryKey)

// Reducing the core length to 0 everytime seed file is run
await core.truncate(0,core.length)

// Function to stop the execution by X milliseconds
const waitFor = async(milliseconds)=>{
    await new Promise((resovle, rejct)=>{
        setTimeout(()=>{
            resovle(1)
        },milliseconds)
    })
}

let i=0
while(true){
    await core.append(JSON.stringify({blockNum: i}))
    console.log(i)
    i++
    if(core.length>100){
        i=0
        await core.truncate(0,core.length)
    }
    await waitFor(10000)
}

