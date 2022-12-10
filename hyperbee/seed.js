
  import Hypercore from 'hypercore'
  import Hyperbee from 'hyperbee'
  import Hyperswarm from 'hyperswarm'

  // Create a Hypercore instance for the Hyperbee
  const core = new Hypercore('./hyperbee-seed', {
    valueEncoding: 'utf-8' // The blocks will be UTF-8 strings.
  })

  // wait till key and other properties of core are initialized
  await core.ready()

  // Create a Hyperswarm instance
  const swarm = new Hyperswarm()

  // replicate the Hypercore instance on connection with any peers
  swarm.on('connection', (connection) => core.replicate(connection))

  // join a topic
  swarm.join(core.discoveryKey) 

  console.log('Publickey of the core: '+ core.key.toString('hex'))

  //  create a Hyperbee instance
  const serverDB = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
  })

  // wait till key and other properties of Hyperbee instance are initialized
  await serverDB.ready()

  // put a key value pair into the instance
  await serverDB.put('key1','value1')
 
  // We will add more data for users to try out this component
