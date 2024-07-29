import {useCallback, useEffect, useState} from 'react'
import { destructID } from "../utils.js"

import './comparator.less'

const DIFF_VALUES = {
    DIFF: 'diff',
    PART: 'partial',
    SAME: 'same'
}

function Comparator({ csvData, tableData }) {
    const [diffResult, setDiffResult] = useState([])

    const diffObjCreator = useCallback(() => {
        const finalData = []
        Object.entries(tableData).forEach(([id, amount]) => {
            const { part1, part2 } = destructID(id)
            const newObjForData = { part1, part2, tableAmount: amount, csvAmount: '', diff: DIFF_VALUES.PART }
            if (csvData[id]) {
                newObjForData.csvAmount = csvData[id]
                newObjForData.diff = newObjForData.tableAmount === newObjForData.csvAmount ? DIFF_VALUES.SAME : DIFF_VALUES.DIFF
            }
            finalData.push(newObjForData)
        })
        Object.entries(csvData).forEach(([id, amount]) => {
            if (!tableData[id]) {
                const { part1, part2 } = destructID(id)
                const newObjForData = { part1, part2, tableAmount: '', csvAmount: amount, diff: DIFF_VALUES.PART }
                finalData.push(newObjForData)
            }
        })
        console.log(finalData)
        setDiffResult(finalData)
    }, [csvData, tableData])

    useEffect(() => {
        diffObjCreator()
    }, [diffObjCreator])

    const diffResultCards = useCallback(() => {
        return diffResult.map(({ part1, part2, tableAmount, csvAmount, diff }) => {
            const classes = `comparator-row ${diff}`
            return (
                <div className={classes}>
                    <div>
                        {part1}
                    </div>
                    <div>
                        {part2}
                    </div>
                    <div>
                        {tableAmount}
                    </div>
                    <div>
                        {csvAmount}
                    </div>
                </div>
            )
        })
    }, [diffResult])

    return (
        <div className='comparator-wrapper'>
            {diffResultCards()}
        </div>
    )
}

export default Comparator