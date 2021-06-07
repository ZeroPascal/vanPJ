interface responce{
    callbacks: Record<string, string |boolean>
}
interface control {
    name: string,
    command: string
}
interface query{
    name: string
    control: control[],
    query: string,
    response: Record<string,string | boolean> 
}

const getControl=(name:string, command: string)=>{
    return {name, command}
}
export const queires: Record<string,query>={
    power: {
        name: 'Power',
        control: [getControl('Power On', '00PON\r'),getControl('Power Off', '00POF\r')],
        query: '00QPW\r',
        response:{
            '00001\r' : true,
            '00000\r' : false
        }
    },
    shutter:{
        name: 'Shutter',
        control: [getControl('Shutter Open','00OSH:1\r'),getControl('Shutter Closed','00OSH:0\r')],
        query: '00QSH\r',
        response:{
             '000\r' : false,
              '001\r' : true
        }
    },
    edge_blending:{
        name: 'Edge Blending',
        control: [getControl('Off','00VXX:EDBI0=+00000\r'),getControl('On','VXX:EDBI0=+00001\r'),getControl('User','VXX:EDBI0=+00002\r')],
        query: '00QVX:EDBI0\r',
        response:{
            '00EDBI0=+00000\r' : 'Off',
            '00EDBI0=+00001\r' : 'On',
            '00EDBI0=+00002\r' : 'User'
        }
    },
    edge_blending_markers:{
        name: 'Edge Blending Markers',
        control: [getControl('Marker On', '00VGM:1\r'),getControl('Marker Off','00VGM:0\r')],
        query: '00QGM',
        response:{
            '000\r': 'Off',
            '001\r' : 'On'
        }
    },
    lamp_control_status:{
        name: 'Lamp Control Status',
        control: [],
        query: '00Q$S\r',
        response:{
            '000\r': 'Lamp Off',
            '001\r': 'In Turning On',
            '002\r': 'Lamp On',
            '003\r': 'Lamp Cooling'
        }
    }
}