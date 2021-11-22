import { AttributeKeys, ControlKeys } from "../constants";
import { hexFunction } from "./Panasonic/panasonicControlCommands";

export type CMDBlock= {
    hexCommand: string,
    response: response,
    range? : range,
    dropEqual?:boolean,
    fixedSize?: number,
    query: query,
    attribute: AttributeKeys

}


export type BlockOptions={
    range? : range,
    dropEqual?:boolean,
    fixedSize?: number,
    query: query
}

export type response = Record<string,string>
export type responses = Record<blockKey, response>
export type blockKey = keyof typeof AttributeKeys
export type query = string | undefined;
export type queries = Record<blockKey,string>
export interface range {
    min: number,
    max: number,
    default: number
}

export type CommandLibray= Record<ControlKeys,CMDBlock>

