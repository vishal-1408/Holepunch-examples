/*
    This example seeds the hyperdrive with some popular named gifs and replicates it on connnection with any peer
*/

import  Hyperdrive from 'hyperdrive'
import Axios from 'axios'
import fs from 'fs'
import Hyperswarm from 'hyperswarm'
import net from 'net'
import Corestore from 'corestore'

// create a corestore instance
const corestore = new Corestore('./seed-drive')

const swarm = new Hyperswarm()

swarm.on('connection',(connection)=>corestore.replicate(connection))
// create a Hyperdrive instance
const  drive = new Hyperdrive(corestore) // content will be stored in this folder

// initializes the key and other properties of drive
await drive.ready()

console.log('hello')

// Join the topic
swarm.join(drive.discoveryKey)

console.log('PublicKey of the drive is: '+drive.key.toString())

// an array of URLs of different GIFs to be seeded into the drive
const data = [{
    pathInDrive: '/images/hello.gif',
    url: 'https://media.tenor.com/mhLPO2VldCkAAAAM/0001.gif',
  },
  {
    pathInDrive: '/images/soHungry.gif',
    url: 'https://media.tenor.com/Z3enIiLUnzgAAAAM/hangy-hungry.gif'
  },
  {
    pathInDrive: '/images/letsDoIt.gif',
    url: 'https://i.gifer.com/g1eF.gif'
  },
  {
    pathInDrive: '/images/tryMe.gif',
    url: 'https://i.pinimg.com/originals/22/97/63/229763d7869f8c6227248aff0df4a1d2.gif'
  },
  {
    pathInDrive: '/images/letsGoShopping.gif',
    url: 'https://y.yarn.co/359c6414-5017-414c-8566-5f2243a1ee02_text.gif'
  },
  {
    pathInDrive: '/images/holePunchMan.gif',
    url: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FwOfFLUsmIfwVeziNLfS7%2Fuploads%2F3DUUaohh8F3fX5luAdIg%2FWhatsApp%20Video%202022-12-10%20at%2010.42.09%20AM.gif?alt=media&token=4907b0c8-c730-4eb9-b9f7-f3c1050409f7'
  },
]

// pipes the resposne stream to the writable stream of the file in drive
const pipeDataIntoDrive = async (response, pathInDrive) =>{
  // create a writeStream for a file in the drive with the given 
  const stream = await drive.createWriteStream(pathInDrive)

  // pipe the readable response data into the writeable stream of the file in drive
  response.data.pipe(stream)

  // wait for the pipe process to finish
  await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
  })
}

// gets the data stream of contents present in URL location
const getDataFromURL = async (url) =>{
  const response = await Axios({
    url:url,
    method: 'GET',
    responseType: 'stream'
    })
  return response
}

// seed data items into the hyperdrive
for(let i=0;i<data.length;i++){
  const responseStream = await getDataFromURL(data[i].url)
  console.log(i)
  await pipeDataIntoDrive(responseStream, data[i].pathInDrive)
}
       
console.log("seeding the files done successfully!", drive.key.toString('hex'))