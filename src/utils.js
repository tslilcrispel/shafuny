const ID_SEPARATOR = '<<>>'

const DICTIONARY = {
    'i.r.r.': 'IRR',
    'red team-cyber posture': 'red team',
    'governance &strategy': 'governance & strategy',
    'xdr': 'Velocity license',
    'income travel expenses 400255': 'travel',
    'professional services': 'cloud'
}

export const createItemId = (part1 = '', part2 = '') => {
    const part1AfterDict = DICTIONARY[part1.toLowerCase()] || part1
    const part2AfterDict = DICTIONARY[part2.toLowerCase()] || part2
    return `${part1AfterDict.toLowerCase()}${ID_SEPARATOR}${part2AfterDict.toLowerCase()}`
}

export const destructID = (id) => {
    const [part1, part2] = id.split(ID_SEPARATOR)
    return { part1, part2 }
}
