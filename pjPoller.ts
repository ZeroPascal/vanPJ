import puppeteer from "puppeteer";
import { header, ipTop, pjWorld } from "./constants";
import parsePage from "./parsePage";
import PromisePool, { } from '@supercharge/promise-pool'
import PJ from "./pj";
import pj from "./pj";

export function pollPJs(pjs:pjPoller){
  return asyncPollPJs(pjs).then((results)=>{
    return results
  })
  
}
export  async function asyncPollPJs(pjs:pjPoller){
  const {results, errors}= await PromisePool
   .withConcurrency(pjWorld().length)
   .for(Object.values(pjs.pjs))
   .process(async pj=>{
     await pj.pollPage()
   })
   return results
   
}
class poller {
  browser: puppeteer.Browser
  id: number
  page: puppeteer.Page
  uri: string
  pj: PJ
  constructor(browers: puppeteer.Browser, id: number, refreshRate = 1000) {
   // console.log('Building Poller ',id)
    this.browser = browers
    this.id = id
    //Sytem Server
    this.uri = 'http://' + ipTop + this.id
    //localServer
    //this.uri = 'http://localhost:3001/'+ipTop+this.id
    this.pj = new PJ(this.id)
    //this.buildPage()
  }
  async buildPage() {
    try {
      this.page = await this.browser.newPage()
      this.page.setExtraHTTPHeaders(header)
      await this.page.goto(this.uri)
      await this.parseFrame()
    } catch (e) {

    }
  }
  async _buildPage() {
    try {
      this.browser.newPage().then(page => {
        this.page = page
        this.page.setExtraHTTPHeaders(header)
        this.page.goto(this.uri).then(() => {
          this.pollPage().then(()=>{
           // console.log('Polled',this.id)
          })
        })

      })
    } catch (e) {

    }
  }
  _pollPage() {
    //if(!this.id) return
    try {

     // console.log('Polling', this.id)
      this.page.reload().then(() => {
        parsePage(this.page.mainFrame(), this.pj).then(pj => {
          this.pj = pj
          this.pj.online = true
        if (this.pj.online) {
          this.pj.lastSeen = Date.now()
        }
        })
        
      })
    } catch (e) {

    }
  }
  get PJ() {
    return this.pj
  }
async parseFrame(){
  this.pj = await parsePage(this.page.mainFrame(), this.pj)
    this.pj.online = true
    if (this.pj.online) {
      this.pj.lastSeen = Date.now()
    }
}
async pollPage(){
  if(!this.page) return
  //console.log('Polling',this.id)
  try {

   // console.log('Reloading' ,this.id)
    await this.page.reload()
   // console.log('Parsing',this.id)
    await this.parseFrame()
  } catch (e) {

  }
}
}

export default class pjPoller {
  browser: puppeteer.Browser
  pjs: Record<number, poller>
  constructor() {
   // console.log(pjWorld())
    this.pjs = {}
    // console.log('PJ Poller Started!')
    //console.log(pjWorld())
    /*
    puppeteer.launch().then(browser => {
      this.browser = browser
      this.buildAllPJS()
     // setInterval(this.pollAllPJS,3000)
    }
    )
    */




    //await browser.close();

    //return pjs
  }
  async start(){
    this.browser = await puppeteer.launch();
    await this.buildAllPJS()
  }
  closeBrowser() {
    this.browser.close()
  }
  async buildAllPJS(){
    /*
    await pjWorld().forEach(async pjID=>{
      console.log('Building Poller',pjID)
      this.pjs[pjID] =new poller(this.browser, pjID)
      this.pjs[pjID].buildPage().then(()=>{
        console.log('Poller Built',pjID)
      })
    })
    */
   const {results, errors}= await PromisePool
   .withConcurrency(pjWorld().length)
   .for(pjWorld())
   .process(async pjID=>{
     this.pjs[pjID] = new poller(this.browser,pjID)
     await this.pjs[pjID].buildPage()
   })
/*
   for await(const pjID of pjWorld()){
    console.log('Building Poller',pjID)
    this.pjs[pjID]= new poller(this.browser, pjID)
    await this.pjs[pjID].buildPage()
    console.log('Poller Built',pjID)
   }
   */
  }
  async _pollAllPJs() {
    console.log('Polling All PJs')
    try{
   Object.values(this.pjs).forEach(pj=>{
  
     pj.pollPage()
   })
  }catch(e){
    console.error(e)
  }
  }
  async __pollAllPJs() {
    const { results, errors } = await PromisePool
      .for(pjWorld())
      .process(async pjID => {
        console.log(pjID)
        const page = await this.browser.newPage();
        await page.setExtraHTTPHeaders({ Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' })
        //await page.goto('http://localhost:3001/192.168.10.101'); // URL is given by the "user" (your client-side application)
        await page.goto('http:///192.168.10.' + pjID);
        let pj = new PJ(pjID)
        pj = await parsePage(page.mainFrame(), pj)
        pj.online = true
        if (pj.online) {
          pj.lastSeen = Date.now()
        }
        //  this.pjs[pjID] = pj
        return pj
      })
    //console.log(pjs)
  }
  getPJs(){
    let pjs:Record<number, PJ> ={}
    Object.values(this.pjs).forEach(p=>{
      pjs[p.id] = p.PJ
      
    })
    return pjs
  }
  async pollAllPJs() {
    const { results, errors } = await PromisePool
      .for(Object.values(this.pjs))
      .process(async pj => {
        await pj.pollPage()
      })
    //console.log(pjs)
  }

  getPJ(pjID: number) {
    return this.pjs[pjID].PJ
  }
  getStatus(){
    let s = {
      online: false,
      power: false,
      shutter: false
    }
    Object.values(this.pjs).forEach(pj=>{
      let p = pj.PJ
      if(!p.online){
        s.online = false
      }
      if(!p.power){
        s.power = false
      }
      if(!p.shutter){
        s.shutter = false
      }
    })
    return s
  }
}



/*
export default async function pjPoller(){


  console.log('PJ Poller Started!')
  //console.log(pjWorld())
  const browser = await puppeteer.launch();
  let pjs: Record<number, pj> = {}

  const {results, errors}= await PromisePool
    .for(pjWorld())
    .process(async pjID =>{
      console.log(pjID)
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' })
      //await page.goto('http://localhost:3001/192.168.10.101'); // URL is given by the "user" (your client-side application)
      await page.goto('http:///192.168.10.' + pjID);
      let pj = new PJ(pjID)
      pj = await parsePage(page.mainFrame(), pj)
      pj.online = true
      if (pj.online) {
        pj.lastSeen = Date.now()
      }
      pjs[pjID]= pj
      return pj
    })
  console.log(pjs)
  /*
  for (let i = 0 ; i<pjWorld().length; i++) {

    let pjID = pjWorld()[i]
    console.log('PJ ',pjID)
    let pj = new PJ(pjID)
    try {

      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' })
      //await page.goto('http://localhost:3001/192.168.10.101'); // URL is given by the "user" (your client-side application)
      await page.goto('http:///192.168.10.' + pjID);
      // await page.authenticate({'username':'admin1', 'password': 'panasonic'});
      //dumpTree(page.mainFrame())
      // console.log('Finding Satus')
      pj = await parsePage(page.mainFrame(), pj)
      pj.online = true
      if (pj.online) {
        pj.lastSeen = Date.now()
      }
      //console.log(pj)




    } catch (e) {
      console.error(e)
      pj.online = false
      pj.error = e
    }
    //console.log('PJ End')
    pjs[pjID] = pj
    //console.groupCollapsed()
    console.log()

  }
  */
/*
 await browser.close();

 return pjs
}
*/
