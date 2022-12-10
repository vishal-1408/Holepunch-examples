
  import Hypercore from 'hypercore'
  import Hyperbee from 'hyperbee'
  import Hyperswarm from 'hyperswarm'
  import once from "events"

  // Create a Hypercore instance 
  // use: 70cfbb8e21deb947840f3b5fa14f03fff235042f0ea34b758cb632a9d2555fd9 publickey to replicate our hosted hypercore
  
  const core = new Hypercore('./hyperbee-peer', Buffer.from('paste the public key of other peer','hex'), {
    valueEncoding: 'utf-8'
  })

  // wait till key and other properties of core are initialized
  await core.ready()

  // Create a Hyperswarm instance
  const swarm = new Hyperswarm()

  // replicate the Hypercore instance on connection with any peers
  swarm.on('connection',(connection)=>{core.replicate(connection)})

  // join a topic
  swarm.join(core.discoveryKey)

  // wait till all the pending peer connections are processed
  await swarm.flush()

  // create a Hyperbee instance
  const db = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
  })
  // wait till key and other properties of Hyperbee instance are initialized
  await db.ready()

  //get the value of a key from the instance
  const value = await db.get('key1')
  console.log(value)