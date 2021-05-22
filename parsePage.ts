import  puppeteer  from "puppeteer";
import DOMParser from 'dom-parser'
import  PJ  from "./pj";

export default async function parsePage(mainFrame: puppeteer.Frame, pj:  PJ){
    let frame = findStatus(mainFrame)
    let content = await frame.content()
    let parser = new DOMParser()
    pj = praseClasses( parser.parseFromString(content), pj)
   console.log('PJ Parsed')
    return pj
}

function praseClasses(doc: DOMParser.Dom, pj: PJ){
    let header = ''
    let isHeader = true
    
    doc.getElementsByClassName("monitor_table_property").forEach(element=>{
       
        if(isHeader){
            /*
                header = element.textContent.slice(12)
            if(header.indexOf('&')>0){
                header =header.slice(header.indexOf('&'))
            }
            */
          let h = element.textContent.split('&nbsp;').filter(s => s!=='&nbsp;' && s!=='')
          if(h.length>0){
              header = h[0]
          }
         
        }else{
         //   console.log('Header ',header)
            let inner = element.innerHTML
            
            switch(header){
                case 'POWER':
                    pj.power = handlePower(inner)
                case 'SHUTTER':
                    pj.shutter =handleShutter(inner)
                    break;
            }

            header = ''
        }
        isHeader = !isHeader
      })
      return pj
}

function handlePower(s: string){
    return s.indexOf('fffff')<80
}
function handleShutter(s: string){
    //console.log(s)
    return s.indexOf('fffff')>80
}

const dumpTree=(frame: puppeteer.Frame, indent = ' ')=>{
  //  console.log(indent + frame.url());
    for (const child of frame.childFrames()) {
      dumpTree(child, indent + '  ');
    }
  }
  
  const findStatus=(frame: puppeteer.Frame, indent =' '):puppeteer.Frame | undefined=>{
   // console.log(indent+frame.name());
    if(frame.name() === 'mainFrame'){
  //    console.log('Found frame')
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