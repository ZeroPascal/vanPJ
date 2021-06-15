
import net from 'net'
import md5 from 'md5'
import { functions } from './ControlCommands'
import {config} from './index'
interface tel_parmas {
    host: string,
    port: number

}


async function timeout() {
    return new Promise(res => {
        setTimeout(res, 100)
    })
}

async function querySocket(socket: net.Socket, request: string, auth = '') {
  
    try {
       if(socket.writable)
        socket.write(auth + request + '\r', (error) => {
            if (error) {
                throw error
            }
        })
    } catch (e) {
        console.log('QuerySocket Error', e)
    }
    await timeout()

}
export const netConnect = async (pjID: number, request: string): Promise<string> => {
    //console.log('NetConnect',pjID)
    return new Promise((res, err) => {
        try {
            let socket = net.connect(config.Projector_Port, config.IP_Top + pjID)
            socket.setTimeout(1500)
            socket.on('timeout', () => {
                // console.log('Socket Timeout')
                socket.end()
                err('Socket Timed Out. Query: ' + request)
            })
            socket.on('connect', (res: string) => {
                // console.log('Socket Connected',pjID)
            })

            socket.on('data', async (response: any) => {
                // console.log(response)
                let data: string = response.toString()
                //console.log(data)
                let a = data.split(' ')

                if (a.length > 1) {
                    if (a[0] === 'NTCONTROL') {
                        if (a.length > 1) {
                            let hash = ''
                            if (parseInt(a[1]) === 1) {
                                // console.log('Auth Challnege')
                                let challenge = a[2].slice(0, 8)
                                hash = md5(config.TCP_Auth + challenge)
                            }
                            try {
                              //  console.log(request)
                                await querySocket(socket, request, hash)

                            } catch (e) {
                                err(e)
                            }

                        }
                    }
                } else {
                     //console.log(pjID,data)
                    if(data==='ERR1\r'){
                        console.log('ERR1')
                        err(new Error('Undefined Control Command '+request))
                    }
                    res(data)
                }
            })
            socket.on('error',(error)=>{
               // console.log('Socket got ERROR!')
                err(new Error('Socket '+error.message))
            })
            socket.on('end', ()=>{
                
                err('Socket Eneded Without Answer: '+request)
            })
            socket.on('close', (res) => {
                err('Socket Closed Without Answer: ' + request)
            })
        } catch (e) {
            console.log('NetConnect Error: ', e)
            err(e)
        }
    })


}
export async function getStatus(pjID: number) {
    console.log('PJ', pjID)
    Object.values(functions).forEach(async value => {
        try {
            //   console.log('Checking',value.query)
            let res = await netConnect(pjID, value.query) as string
            //console.log(res)

            if (Object.keys(value.response).includes(res))
                console.log(value.name + ":", value.response[res])
            //return value.response[res]
        } catch (e) {
            console.log(e)
        }
    })

}

