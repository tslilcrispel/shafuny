import {useCallback, useEffect, useState} from 'react'
import { destructID } from "../utils.js"
import {AgGridReact} from "ag-grid-react"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
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
        setDiffResult(finalData)
    }, [csvData, tableData])

    useEffect(() => {
        diffObjCreator()
    }, [diffObjCreator])

    const diffCellRenderer = ({ value }) => {
        const classes = `diff-cell ${value}`
        return (
            <div className={classes}>
                {value}
            </div>
        )
    }

    const numberValueGetter = ({ column, data }) => {
        if (data[column.colId] === '') {
            return null
        }
        return Number(data[column.colId])
    }

    const colsDefs = [
        {
            field: 'part1'
        },
        {
            field: 'part2'
        },
        {
            field: 'tableAmount',
            cellDataType: 'number',
            valueGetter: numberValueGetter
        },
        {
            field: 'csvAmount',
            cellDataType: 'number',
            valueGetter: numberValueGetter
        },
        {
            field: 'diff',
            cellRenderer: diffCellRenderer
        }
    ]

    return (
        <div className='comparator-wrapper ag-theme-quartz'>
            <AgGridReact
                rowData={diffResult}
                columnDefs={colsDefs}
                gridOptions={{
                    domLayout: 'autoHeight',
                    animateRows: false,
                    autoSizeStrategy: 'SizeColumnsToFitGridStrategy '
                }}
            />
        </div>
    )
}

export default Comparator