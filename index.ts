import express, { NextFunction, Response } from 'express'
import puppeteer from 'puppeteer'
import parsePage from './parsePage'

import DOMParser from 'dom-parser'
import pjPoller, { pollPJs } from './pjPoller'
import PJ from './pj'
import Telnetter from './telnet'
var btoa = require('btoa')
const app = express()
const port = 3002

const start = 101
const end = 192
const ipRange = '192.168.10.'

app.listen(port, () => {
  //console.log(`Server Started`)
  
 })

app.get('/',(req,res)=>{
  res.send('Hello World From Panasonic Server')

})
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

const pjs = new pjPoller();
let time = Date.now()
/*
console.log('Starting Poller')
pjs.start().then(()=>{
  console.log('PJS Built!', (Date.now()-time)/1000+'s')
 
 setInterval(f,60000)
})
*/
let netter = new Telnetter()
const f=()=>{
  //console.log('Polling ', Date())
  let time = Date.now()
  pjs.pollAllPJs().then(()=>{
    console.log('PJs Rereshed', (Date.now()-time)/1000+'s')
  })
}

app.get('/api*',async (req,res)=>{
  //console.log(req.url)
 // console.log(req.query)
  let q = req.query
  if(q.status){
   // console.log('Requested Status')
    res.status(200).json(pjs.getStatus())
    return
  }
  if(q.pj){
    
    let pj = q.pj
    
    if(pj=='all'){
      console.log('Requested All',Date())
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
  if(q.poll){
    //console.log('Polling')
    let pjID = parseInt(q.poll.toString())
    
    if(!pjs || isNaN(pjID) || !pjs.getPJ(pjID)){
      res.status(404).json('PJ NOT FOUNT')
      return
    }
    res.status(200).json(await pjs.pollPJ(pjID))
  }
  
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
  console.log('Rig Status')
  res.status(200).json(pjs.getStatus())
  
})

