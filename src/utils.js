const ID_SEPARATOR = '<<>>'

const DICTIONARY = {
    'I.R.R.': 'IRR'
}

export const createItemId = (part1, part2) => {
    const part1AfterDict = DICTIONARY[part1] || part1
    const part2AfterDict = DICTIONARY[part2] || part2
    return `${part1AfterDict}${ID_SEPARATOR}${part2AfterDict}`
}

export const destructID = (id) => {
    const [part1, part2] = id.split(ID_SEPARATOR)
    return { part1, part2 }
}
