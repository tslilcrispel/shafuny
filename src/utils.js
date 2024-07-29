const ID_SEPARATOR = '<<>>'

export const createItemId = (part1, part2) => {
    return `${part1}${ID_SEPARATOR}${part2}`
}

export const destructID = (id) => {
    const [part1, part2] = id.split(ID_SEPARATOR)
    return { part1, part2 }
}
