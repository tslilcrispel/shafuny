import {useCallback, useEffect, useState} from 'react'
import {destructID, EXTRA_LINE_ADDON} from "../utils.js"
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
    const [csvTotal, setCsvTotal] = useState(0)
    const [tableTotal, setTableTotal] = useState(0)

    const getCleanNumber = (value = '') => {
        const valueWithNoPsik = value.split(',').join('')
        return Number(removeDecimalPointIfNotNeeded(valueWithNoPsik))
    }

    const sumNumbersInTable = (num1, num2) => {
        const num2Clean = getCleanNumber(num2)
        if (isNaN(num2Clean)) {
            return num1
        }
        return num1 + num2Clean
    }

    const diffObjCreator = useCallback(() => {
        const finalData = []
        let totalCsv = 0
        let totalTable = 0
        Object.entries(tableData).forEach(([id, amount]) => {
            const { part1, part2 } = destructID(id)
            const newObjForData = { part1, part2, tableAmount: amount, csvAmount: '', diff: DIFF_VALUES.PART }
            totalTable = sumNumbersInTable(totalTable, amount)
            if (csvData[id]) {
                newObjForData.csvAmount = csvData[id]
                totalCsv = sumNumbersInTable(totalCsv, csvData[id])
                newObjForData.diff = getCleanNumber(newObjForData.tableAmount) === getCleanNumber(newObjForData.csvAmount) ? DIFF_VALUES.SAME : DIFF_VALUES.DIFF
                if (newObjForData.diff === DIFF_VALUES.DIFF) {
                    newObjForData.diffValue = getCleanNumber(newObjForData.tableAmount) - getCleanNumber(newObjForData.csvAmount)
                }
                console.log(newObjForData)
            }
            finalData.push(newObjForData)
        })
        Object.entries(csvData).forEach(([id, amount]) => {
            if (!tableData[id]) {
                const { part1, part2 } = destructID(id)
                totalCsv = sumNumbersInTable(totalCsv, csvData[id])
                const newObjForData = { part1, part2, tableAmount: '', csvAmount: amount, diff: DIFF_VALUES.PART }
                finalData.push(newObjForData)
            }
        })
        setCsvTotal(totalCsv)
        setTableTotal(totalTable)
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
            field: 'part2',
            cellRenderer: (params) => {
                return params.value.split(EXTRA_LINE_ADDON)[0]
            }
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
        },
        {
            field: 'diffValue',
            cellRenderer: numberCellRenderer
        }
    ]

    return (
        <div className='comparator-wrapper ag-theme-quartz'>
            <div className='totals-wrapper'>
                <div className='specific-total'>
                    Total Table:
                    <span>
                        {tableTotal.toLocaleString()}
                    </span>
                </div>
                <div className='specific-total'>
                    Total Csv:
                    <span>
                        {csvTotal.toLocaleString()}
                    </span>
                </div>
                <div className='specific-total'>
                  Total diff:
                  <span>
                        {(tableTotal - csvTotal).toLocaleString()}
                  </span>
                </div>
          </div>
          <AgGridReact
            rowData={diffResult}
            columnDefs={colsDefs}
            gridOptions={{
              domLayout: 'autoHeight',
              animateRows: false,
              rowSelection: 'multiple',
              suppressRowClickSelection: true,
              autoSizeStrategy: 'SizeColumnsToFitGridStrategy',
              onFirstDataRendered: (params) => {
                  const nodesToSelect = []
                  params.api.forEachNode((node) => {
                      if (node?.data?.diff === DIFF_VALUES.SAME) {
                          nodesToSelect.push(node)
                      }
                  });
                  params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
              },
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
