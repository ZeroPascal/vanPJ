import { PROJECTOR_MAKE, PROJECTOR_MAKES } from "../constants";
import { PanasonicCommands } from "./Panasonic/panasonicLibrary";

export default function getLibary(pjType: PROJECTOR_MAKE){
    switch (pjType) {
        case PROJECTOR_MAKES.PANASONIC:
            return PanasonicCommands
            break;
    
        default:
            return undefined
            break;
    }
}