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

    const getCleanNumber = (value = '') => {
        const valueWithNoPsik = value.split(',').join('')
        return Number(removeDecimalPointIfNotNeeded(valueWithNoPsik))
    }

    const diffObjCreator = useCallback(() => {
        const finalData = []
        Object.entries(tableData).forEach(([id, amount]) => {
            const { part1, part2 } = destructID(id)
            const newObjForData = { part1, part2, tableAmount: amount, csvAmount: '', diff: DIFF_VALUES.PART }
            if (csvData[id]) {
                newObjForData.csvAmount = csvData[id]
                newObjForData.diff = getCleanNumber(newObjForData.tableAmount) === getCleanNumber(newObjForData.csvAmount) ? DIFF_VALUES.SAME : DIFF_VALUES.DIFF
                console.log(newObjForData)
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

    const removeDecimalPointIfNotNeeded = (numb) => {
        const [fullNumber, afterDecimal] = numb.split('.')
        if (Number(afterDecimal) === 0) {
            return fullNumber
        }
        return numb
    }

    const numberValueGetter = ({ column, data }) => {
        const value = data[column.colId]
        if (!value && value !== 0) {
            return null
        }
        return getCleanNumber(value)
    }

    const numberCellRenderer = (params) => {
        const valueAsNumber = parseFloat(params.value)
        if (isNaN(valueAsNumber)) {
            const {colId} = params.column
            const realValue = params.data[colId]
            return realValue
        }
        return valueAsNumber.toLocaleString()
    }

    const colsDefs = [
        {
            field: 'part1',
            checkboxSelection: true
        },
        {
            field: 'part2'
        },
        {
            field: 'tableAmount',
            cellDataType: 'number',
            valueGetter: numberValueGetter,
            cellRenderer: numberCellRenderer
        },
        {
            field: 'csvAmount',
            cellDataType: 'number',
            valueGetter: numberValueGetter,
            cellRenderer: numberCellRenderer
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
                    rowSelection: 'multiple',
                    suppressRowClickSelection: true,
                    autoSizeStrategy: 'SizeColumnsToFitGridStrategy',
                    defaultColDef: {
                      filter: true,
                      floatingFilter: true
                    }
                }}
            />
        </div>
    )
}

export default Comparator
