import {useCallback, useEffect} from 'react'
import {destructID} from "../utils.js";
function Comparator({ csvData, tableData }) {

    const diffObjCreator = useCallback(() => {
        const finalData = []
        Object.entries(tableData).forEach(([id, amount]) => {
            const { part1, part2 } = destructID(id)
            const newObjForData = { part1, part2, tableAmount: amount, csvAmount: '' }
            if (csvData[id]) {
                newObjForData.csvAmount = csvData[id]
            }
            finalData.push(newObjForData)
        })
        Object.entries(csvData).forEach(([id, amount]) => {
            if (!tableData[id]) {
                const { part1, part2 } = destructID(id)
                const newObjForData = { part1, part2, tableAmount: '', csvAmount: amount }
                finalData.push(newObjForData)
            }
        })
        console.log(finalData)
    }, [csvData, tableData])

    useEffect(() => {
        diffObjCreator()
    }, [diffObjCreator])

    return (
        <div>
            yay
        </div>
    )
}

export default Comparator