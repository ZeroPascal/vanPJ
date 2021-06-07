
const Telnet = require('telnet-client')
const tcpClient = require('tcp-client')
import net from 'net'
import btoa from 'btoa'
import atob from 'atob'
import md5 from 'md5'
import { queires } from './queryParams'
//const {encode, decode} =require('hex-encode-decode')
/*
interface tel_parmas{
    host: string,
    port: number,
    username?: string,
    password?: string
}
*/
interface tel_parmas {
    host: string,
    port: number

}

const decode = (s: string) => {
    return decodeURIComponent(s.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
}
const username = '47046C7B4721'
const password = '56016F735A7F511550'
//const authString = username+":"+password+":"//+'23181e1e'
const authString = 'admin1:panasonic:'//+'23181e1e'

const client = tcpClient.createClient({
    ip: '192.168.10.102',
    port: 1024, //4352
    timeout: 10000
}
)

async function querySocket(socket: net.Socket, request: string, auth = '') {
    return new Promise((res, err) => {
        socket.write(auth + request + '\r', (error) => {
            if (error) {
                err(error)
            }
        })
        setTimeout(res, 500)
    })


}
const netConnect = async (pjID:number, request: string) => {
   // console.log('Socketing')

    //console.log(socket)
    //socket.setEncoding()
    return new Promise((res, err) => {
        try {

            let socket = net.connect(1024, '192.168.10.'+pjID)
            socket.on('connect', (res: string) => {
               // console.log('Socket Connected')
            })

            socket.on('data', async (response: any) => {
               // console.log(response)
                let data: string = response.toString()
                //console.log(data)
                let a = data.split(' ')

                if (a.length > 2) {
                    if (a[0] === 'NTCONTROL') {
                        if (a.length > 2) {
                            let challenge = a[2].slice(0, 8)
                            let hash = md5(authString + challenge)
                            try {
                                //console.log(request)
                                await querySocket(socket, request, hash)
                            } catch (e) {
                                err(e)
                            }

                        }
                    } 
                }else{
                   
                    res(data)
                }

                
            })

            socket.on('close', (res) => {
                   
                //console.log('Socket Closed')
                err('Socket Closed')
            })
        } catch (e) {
            err(e)
        }


    })


}
async function getStatus(pjID: number) {
   console.log('PJ',pjID)
    Object.values(queires).forEach(async value=>{
        try{
         //   console.log('Checking',value.query)
        let res = await netConnect(pjID, value.query) as string
        //console.log(res)
       
        if(Object.keys(value.response).includes(res))
            console.log(value.name+":", value.response[res])
        }catch(e){
            console.log(e)
        }
    })
    
    
   // console.log('Status',await netConnect('00QPW'))
    //await netConnect('00QSH')
   
}
export default class Telnetter {
    net: typeof Telnet
    parmas: tel_parmas
    //net: typeof tcpClient
    constructor() {
        this.net = new Telnet()
        // let c = '2'
        // console.log(md5('admin1:panasonic:')+c+"00QPW")
        this.parmas = {
            host: '192.168.10.102',
            port: 1024 //4352



        }
        //this.request('QPW')
        getStatus(190)
        // this.tel('QPW')
        /*
        try{

            console.log('Connecting....')
            client.request('00QPW',(err: any,res: any)=>{
                console.log(err)
                console.table(res)
                let a = res.split(' ')
                console.log(a)
                if(a.length>2){
                let challenge = a[2].slice(0,8)
                let hash = md5(authString+challenge)
               
                console.log(hash,hash.length)
               // console.log(hash === 'dbdd2dabd3d4d68c5dd970ec0c29fa64')
               // console.log(challenge, challenge.length,hash, hash.length)
                let request = '00QPW'
                console.log(hash+request)
                client.request(hash+request,(err:any,res:string)=>{
                    console.log(res)
                })
                }
            })
        
        
    }catch(e){
        console.log('Failed',e)
    }
    */

    }

    async request(req: string, auth = '') {
        console.group('Requesting', req, auth ? 'With Auth ' + auth : '')
        try {
            client.request(auth + "00" + req, (err: string, res: string) => {
                if (err) {
                    throw new Error(err)
                }
                let a = res.split(' ')
                console.log('Responce', a)
                if (a[0] === 'NTCONTROL' && !auth) {
                    if (a.length > 2) {
                        let challenge = a[2].slice(0, 8)
                        let hash = md5(authString + challenge)

                        console.log(hash, hash.length)
                        console.log()
                        this.request(req, hash)
                    }
                }
            })
            console.groupCollapsed()

        } catch (e) {
            console.log(e)

        }
    }
    async tel(req: string, auth = '') {
        this.net.on('ready', () => {
            console.log('Connection Ready')
        })
        try {
            /*this.tel(auth+'00'+req).then(res=>{
                console.log(res)
            })
            */
            this.net.connect(this.parmas)

        } catch (e) {
            console.log(e)
        }
    }
}