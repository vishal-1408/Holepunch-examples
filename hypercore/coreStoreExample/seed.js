import Corestore from 'corestore'
import Hyperswarm from 'hyperswarm'

const store = new Corestore('./seed-store')
const swarm = new Hyperswarm()

// Setup corestore replication ---> on connection replicate the store
swarm.on('connection', (connection) => store.replicate(connection))

// Load a core by name or by a key
const blocks = store.get({ name: 'blocks-core', valueEncoding: 'json'})
const languages = store.get({name: 'languages-core', valueEncoding: 'utf-8'})

// Make sure the length and other properties of hypercore are initialised
await blocks.ready()
await languages.ready()

// Join the Hypercore discoveryKey (a hash of it's public key)
swarm.join(blocks.discoveryKey)

let i=0
// Append the data to blocks hypercore
while (blocks.length < 15000) {
    await blocks.append(JSON.stringify({block:i}))
    i++
  }

// Append the data to the languages hypercore
i = 0
const languagesArray= [
'C Language',
'C++ Language',
'Java',
'Javascipt',
'Rust',
'Scala',
'Python',
'Go Languages',
'Kotlin'
]
while(languages.length< languagesArray.length){
  await languages.append(JSON.stringify({languge: languagesArray[i]}))
  i++
} 

console.log('blocks public key is:', blocks.key.toString('hex'))
console.log('languages public key is : ', languages.key.toString('hex'))