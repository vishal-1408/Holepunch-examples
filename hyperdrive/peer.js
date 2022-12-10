import  Hyperdrive from 'hyperdrive'
import Axios from 'axios'
import fs from 'fs'
import Hyperswarm from 'hyperswarm'
import net from 'net'
import Corestore from 'corestore'
import toArray from 'stream-to-array'

// create a corestore instance
const corestore = new Corestore('./peer-drive')

const swarm = new Hyperswarm()

swarm.on('connection',(connection)=>{
  console.log('connected yess')
  corestore.replicate(connection)
})
// create a Hyperdrive instance
// use 498d0ff08835a4bb5fab28ae3079ec60f5128fd852f0b07acab2974d1211f0ad publickey to replicate our hyperdrive
const drive = new Hyperdrive(corestore,Buffer.from('paste the public key of seed file','hex')) // content will be stored in this folder

// initializes the key and other properties of drive
await drive.ready()

// Join the topic
swarm.join(drive.discoveryKey)

// wait for the pending peer connections
await swarm.flush()

// data is a readable stream containing the names of all dirs and files present in images folder of the drive
const data = await drive.readdir('/images')

// converting the readable stream to an array using the method provided by stream-to-array npm package
const files = await new Promise((resolve, reject)=>{
  toArray(data, function (err, arr) {
    console.log(arr)
    resolve(arr)
  })
})

// downloads the data from the hyperdrive into the host filesystem
const downloadData = async (filepathInDrive, filepathInHost) =>{
  const readStream = await drive.createReadStream(filepathInDrive)
  const writer = fs.createWriteStream(filepathInHost)
  readStream.pipe(writer)

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

// downloads the data items from the hyperdrive
for(let i=0;i<files.length;i++){
  console.log(files[i])
  await downloadData('/images/'+files[i], './downloads/'+files[i])
}
  
console.log("done")




