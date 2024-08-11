import Papa from 'papaparse'
import { useState } from 'react'
import './App.css'
import Comparator from "./components/Comparator.jsx"
import {createItemId, EXTRA_LINE_ADDON} from "./utils.js"
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
  const [csvData, setCsvData] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [multipleTable, setMultipleTable] = useState(false)

    const multipleTableHandle = (e) => {
        setMultipleTable(e.target.checked)
    }

    const dataArrayToIdObj = (arr) => {
      return arr.reduce((acc, row, index) => {
          const [part1, part2, amount] = row
          if (index !== 0) {
              const newID = createItemId(part1, part2)
              if (acc[newID]) {
                  acc[`${newID}${EXTRA_LINE_ADDON}${index}`] = amount
              } else {
                  acc[newID] = amount
              }
          }
          return acc
      }, {})
    }

    const readCSV = (e) => {
        const reader = new FileReader()
        reader.addEventListener('load', function(e) {
            let fileContents = e.target.result
            const csvData = Papa.parse(fileContents, { transform: (val) => val?.trim() })
            const finalIdsData = dataArrayToIdObj(csvData.data)
            setCsvData(finalIdsData)
        })
        const fileObj = e.target.files[0]
        reader.readAsText(fileObj)
    }

    const handleTbody = (e) => {
        const tbodyString = e.target.value
        const tempElement = document.createElement('tbody')
        tempElement.innerHTML = tbodyString
        const rows = tempElement.querySelectorAll('tr')
        const rowsAsArrays = []
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td')
            if (cells.length) {
                const rowData = [
                    cells?.[multipleTable ? 2 : 1]?.textContent.split('-')[0].trim().split('(')[0].trim(),
                    cells?.[multipleTable ? 4 : 3]?.textContent.split(' ')[0].trim(),
                    cells?.[multipleTable ? 7 : 6]?.textContent
                ]
                rowsAsArrays.push(rowData)
            }
        })
        const finalIdsData = dataArrayToIdObj(rowsAsArrays)
        setTableData(finalIdsData)
    }


  return (
    <>
        <Navbar />
        <div className='app'>
            <div className='inputs-wrapper card'>
                <div className='tbody-wrapper'>
                    <div>
                        Tbody text here
                    </div>
                    <textarea onChange={handleTbody}/>
                    <div>
                        <input type='checkbox' onChange={multipleTableHandle} value={multipleTable}/>
                        Multiple Tables
                    </div>
                </div>
                <div>
                    <div>
                    CSV file Here
                    </div>
                    <input onChange={readCSV} type='file' accept='.csv'/>
                </div>
            </div>
            {
                csvData && tableData ? (
                    <div className='results-wrapper card'>
                        <Comparator
                            csvData={csvData}
                            tableData={tableData}
                        />
                    </div>
                ) : null
            }
        </div>
    </>
  )
}

export default App
