import express, { NextFunction, Response } from 'express'
import puppeteer from 'puppeteer'
import parsePage from './parsePage'

import DOMParser from 'dom-parser'
import pjPoller, { pollPJs } from './pjPoller'
import PJ from './pj'
var btoa = require('btoa')
const app = express()
const port = 3002

const start = 101
const end = 192
const ipRange = '192.168.10.'
/*
let dif = end - start +1
while(dif>0){
  let ip = (dif+start)
  app.use(ipRange+ip, express.static('FakePJS/'+ip))
  dif --
}
if(dif === 0){
  console.log('Range Made')
  app.listen(port, () => {
    console.log(`Server Started`)
    
    
   })
}
*/
/*
app.use('/192.168.10.101' ,express.static('FakePJS/101'))
app.use('/192.168.10.102' ,express.static('FakePJS/102'))
app.use('/192.168.10.103' ,express.static('FakePJS/103'))
app.use('/192.168.10.104' ,express.static('FakePJS/104'))
app.use('/192.168.10.105' ,express.static('FakePJS/105'))
//app.use('/192.168.10.101' ,express.static('FakePJS/101'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

*/
app.listen(port, () => {
  console.log(`Server Started`)
  
 })

/*
app.get('/192.168.10.101/cgi-bin*',(req ,res)=>{
  console.log(req.rawHeaders)
  console.log('192.168.10.101 Proj_CTL Requested')
  //res.sendFile('Projector control window.html', {root: './FakePJS/'})
 // res.sendFile('title.html', {root:'./FakePJS/Projector control window_files'})
})

*/

app.get('/',(req,res)=>{
  res.send('Hello World From Panasonic Server')

})
/*
app.get('/192.168.10.101*',(req,res)=>{
  console.log('sending')
  res.send({
    id:101,
    ip: '192.168.10.101',
    power: true,
    shutter: true,
    status: 'OK'
  })
})
*/
app.get('/screenshot', async (req, res) => {
  try{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' })
 // await page.goto('http://localhost:3001/192.168.10.101'); // URL is given by the "user" (your client-side application)
 await page.goto('http://192.168.10.160');
 // await page.authenticate({'username':'admin1', 'password': 'panasonic'});
  const screenshotBuffer = await page.screenshot();

  // Respond with the image
  res.writeHead(200, {
      'Content-Type': 'image/png',
      //@ts-ignore
      'Content-Length': screenshotBuffer.length
  });
  res.end(screenshotBuffer);

  await browser.close();
}catch(e){
  res.status(404)
  res.send()
}
})

const dumpTree=(frame: puppeteer.Frame, indent = ' ')=>{
  console.log(indent + frame.url());
  for (const child of frame.childFrames()) {
    dumpTree(child, indent + '  ');
  }
}

const findStatus=(frame: puppeteer.Frame, indent =' '):puppeteer.Frame | undefined=>{
 // console.log(indent+frame.name());
  if(frame.name() === 'mainFrame'){
    console.log('Found frame')
    return frame
  }
   
  for(const child of frame.childFrames()){
      let r = findStatus(child, indent+' ')
      if(r){
        return r
      }
  }
  return undefined
}
/*
let pjs: Record<number, PJ> ={}
pjPoller().then(res=>{
  pjs = res
})
*/
const pjs = new pjPoller();
let time = Date.now()
console.log('Starting Poller')
pjs.start().then(()=>{
  console.log('PJS Built!', (Date.now()-time)/1000+'s')
 
 setInterval(f,30000)
})

const f=()=>{
  //console.log('Polling ', Date())
  let time = Date.now()
  pjs.pollAllPJs().then(()=>{
    console.log('PJs Rereshed', (Date.now()-time)/1000+'s')
  })
}

app.get('/api*',(req,res)=>{
  //console.log(req.url)
 // console.log(req.query)
  let q = req.query
  if(q.status){
    res.status(200).json(pjs.getStatus())
    return
  }
  if(q.pj){
    
    let pj = q.pj
    
    if(pj=='all'){
      console.log('Requested All')
      res.status(200).json(pjs.getPJs())
      return
    }
    let pjID = parseInt(q.pj.toString())
    if(!pjs || isNaN(pjID) || !pjs.getPJ(pjID)){
      res.status(404).json('PJ NOT FOUND')
      return
    } 
    
      // pj = pjs.getPJ(pjID)
      res.status(200).json(pjs.getPJ(pjID))
    }
  if(q.status){

  }
   //console.log(res)
  
})
app.get('/192.168.10.*', (req, res) => {
  console.log(req.url)
  let url = 'http:/'+req.url
  let pj = pjs.getPJ(parseInt(req.url.slice(-3)))
  if(pj){
    console.log(pj)
    res.status(200).json(pj)
  }else{
    res.status(404).json('PJ NOT FOUND')
    
  }
})

app.get('/rigStatus', (req, res)=>{
  let rigGood = true
  let bad: number[] = []
  Object.values(pjs).forEach(pj=>{
    if(!pj.online){
      rigGood = false
      bad.push(pj.id)
    }
  })
  if(rigGood){
    res.send('Rig is Good')
  } else{
    res.json(bad)
  }
})

