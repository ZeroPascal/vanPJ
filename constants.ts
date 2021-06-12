

export const pjWorldStart = 101
export const pjWorldEnd = 198
export const pjWorldOmit: number[] = []

export const pjWorld =()=>{
    let world =[]
    for( let i = pjWorldStart; i<=pjWorldEnd; i++){
        if(!pjWorldOmit.includes(i))
            world.push(i)
    }
    return world
}

export const ipTop = '192.168.10.'

export const header ={ Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' }

export enum ControlCommands{
    POWER_OFF= 'POWER_OFF',
    POWER_ON= 'POWER_ON',
    SHUTTER_CLOSED = 'SHUTTER_CLOSED',
    SHUTTER_OPEN = 'SHUTTER_OPEN',
    EDGE_BLENDING_OFF = 'EDGE_BLENDING_OFF',
    EDGE_BLENDING_ON = 'EDGE_BLENDING_ON',
    EDGE_BLENDING_MARKERS_ON = 'EDGE_BLENDING_MARKERS_ON',
    EDGE_BLENDING_MARKERS_OFF = 'EDGE_BLENDING_MARKERS_OFF',
    TEST_PATTERN_OFF = 'TEST_PATTERN_OFF',
    TEST_PATTERN_WHITE = 'TEST_PATTERN_WHITE',
    TEST_PATTERN_BLACK = 'TEST_PATTERN_BLACK',
    TEST_PATTERN_FOCUS_RED = 'TEST_PATTERN_FOCUS_RED',
    MENU = 'MENU'

}
export enum ioCommands{
    REQUEST_UPDATE = 'REQUEST_UPDATE',
    REQUESTING_UPDATE = 'REQUESTING_UPDATE',
    EMITTING_PJS = 'EMITTING_PJS',
    EMITTING_STATUS = 'EMITTING_STATUS'
}
export interface RigStatus{
    online: boolean,
    power: boolean,
    shutter: boolean,
    blend: boolean,
    blendMarker: boolean,
    testPattren: boolean
}

export type ControlKeys = keyof typeof ControlCommands