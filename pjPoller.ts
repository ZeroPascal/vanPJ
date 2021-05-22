import puppeteer from "puppeteer";
import { pjWorld } from "./constants";
import parsePage from "./parsePage";
import PJ from "./pj";
import pj from "./pj";

export default async function pjPoller() {
  console.log('PJ Poller Started!')
  //console.log(pjWorld())
  const browser = await puppeteer.launch();
  let pjs: Record<number, pj> = {}
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
  await browser.close();
  return pjs
}