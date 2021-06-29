
/*
export const pjWorldStart = 101
export const pjWorldEnd = 198
export const pjWorldOmit: number[] = []
*/

import Projector from "./Projector"


export enum PROJECTOR_MAKES {
    PANASONIC = 'PANASONIC'
}

export type Group = {name: string, group: number[]}
export type Groups = Record<number, Group>
export type PROJECTOR_MAKE = keyof typeof PROJECTOR_MAKES

export enum ConfigHeaders{
    LOCATION = 'LOCATION',
    LAST_UPDATED = 'LAST_UPDATED',
    POLLING = 'POLLING',
    POLLING_INTERVAL = 'POLLING_INTERVAL',
    PATCH = 'PATCH'
    
}
export type Patch = Record<string,Projector>
export interface Config {
    Patch: Patch,
    Location: string,
    LastUpdated: string,
    Polling: boolean,
    Polling_Interval: number,
    Groups: Groups,
    SchemaVersion: number
}


export type ConfigKeys = keyof typeof ConfigHeaders
export const defaultConfig: Config = {
    Patch: {},
    Location: '',
    LastUpdated: Date(),
    Polling: false,
    Polling_Interval: 60000,
    Groups: {},
    SchemaVersion: 1
}


export const header = { Authorization: 'Basic YWRtaW4xOnBhbmFzb25pYw==' }

export enum ControlCommands {
    POWER_OFF = 'POWER_OFF',
    POWER_ON = 'POWER_ON',
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
    MENU = 'MENU',
    MENU_DOWN_KEY = 'MENU_DOWN_KEY',
    MENU_UP_KEY = 'MENU_UP_KEY',
    MENU_RIGHT_KEY = 'MENU_RIGHT_KEY',
    MENU_LEFT_KEY = 'MENU_LEFT_KEY',
    MENU_DEFAULT_KEY = 'MENU_DEFAULT_KEY',
    MENU_ENTER_KEY = 'MENU_ENTER_KEY',
    EDGE_BLENDING_UPPER_ON = 'EDGE_BLENDING_UPPER_ON',
    EDGE_BLENDING_UPPER_OFF = 'EDGE_BLENDING_UPPER_OFF',
    EDGE_BLENDING_LOWER_OFF = 'EDGE_BLENDING_LOWER_OFF',
    EDGE_BLENDING_LOWER_ON = 'EDGE_BLENDING_LOWER_ON',
    EDGE_BLENDING_RIGHT_OFF = 'EDGE_BLENDING_RIGHT_OFF',
    EDGE_BLENDING_RIGHT_ON = 'EDGE_BLENDING_RIGHT_ON',
    EDGE_BLENDING_LEFT_OFF = 'EDGE_BLENDING_LEFT_OFF',
    EDGE_BLENDING_LEFT_ON = 'EDGE_BLENDING_LEFT_ON',
    OSD_POSITION_UPPER_LEFT = 'OSD_POSITION_UPPER_LEFT',
    OSD_POSITION_CENTER_LEFT = 'OSD_POSITION_CENTER_LEFT',
    OSD_POSITION_LOWER_LEFT = 'OSD_POSITION_LOWER_LEFT',
    OSD_POSITION_TOP_CENTER = 'OSD_POSITION_TOP_CENTER',
    OSD_POSITION_CENTER = 'OSD_POSITION_CENTER',
    OSD_POSITION_LOWER_CENTER = 'OSD_POSITION_LOWER_CENTER',
    OSD_POSITION_UPPER_RIGHT = 'OSD_POSITION_UPPER_RIGHT',
    OSD_POSITION_CENTER_RIGHT = 'OSD_POSITION_CENTER_RIGHT',
    OSD_POSITION_LOWER_RIGHT = 'OSD_POSITION_LOWER_RIGHT',
    PROJECTOR_NAME = 'PROJECTOR_NAME'
}

export type PJ_OBJ = {
    id: number,
    power: string,
    name: string,
    shutter: string,
    online: string,
    lastSeen: number,
    lampStatus: string,
    edgeBlending: string,
    edgeBlendingMarker: string,
    edgeBlendingUpper: string,
    edgeBlendingLower: string,
    edgeBlendingRight: string,
    edgeBlendingLeft: string,
    testPattren: string,
    hmdiSignalLevel : string,
    hdmiResolution: string,
    osdPostion: string,
    inputSignalName_Main: string,
    error: string

}
export enum ioCommands {
    REQUEST_UPDATE = 'REQUEST_UPDATE',
    REQUESTING_UPDATE = 'REQUESTING_UPDATE',
    EMITTING_PJS = 'EMITTING_PJS',
    EMITTING_STATUS = 'EMITTING_STATUS',
    REQUEST_CONFIG = 'REQUEST_CONFIG',
    EMITTING_CONFIG = 'EMITTING_CONFIG',
    REQUESTING_CONFIG = 'REQUESTING_CONFIG', 
    EMITTING_PATCH = 'EMITTING_PATCH',
    EMITTING_POLLING_PROGRESS = 'EMITTING_POLLING_PROGRESS'
}
export interface RigStatus {
    online: boolean,
    power: boolean,
    shutter: boolean,
    blend: boolean,
    blendMarker: boolean,
    testPattren: boolean,
    lampStatus: boolean,
    hdmiInput:boolean,
    signalName: boolean
}

export type ControlKeys = keyof typeof ControlCommands