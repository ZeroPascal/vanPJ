

export const pjWorldStart = 101
export const pjWorldEnd = 110
export const pjWorldOmit = [109,122]

export const pjWorld =()=>{
    let world =[]
    for( let i = pjWorldStart; i<=pjWorldEnd; i++){
        if(!pjWorldOmit.includes(i))
            world.push(i)
    }
    return world
}

export const ipTop = '192.168.10.'