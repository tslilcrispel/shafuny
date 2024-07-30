import Papa from 'papaparse'
import { useState } from 'react'
import './App.css'
import Comparator from "./components/Comparator.jsx"
import { createItemId } from "./utils.js"
import Navbar from "./components/Navbar/Navbar.jsx";

const dict = {
    header1: 'ba',
    header2: 'ba2',
    header3: 'ba3'
}

function App() {
  const [csvData, setCsvData] = useState(null)
  const [tableData, setTableData] = useState(null)

    const dataArrayToIdObj = (arr) => {
      return arr.reduce((acc, row, index) => {
          const [part1, part2, amount] = row
          if (index !== 0) {
              const newID = createItemId(part1, part2)
              acc[newID] = amount
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
                    cells[1].textContent.split('-')[0].trim().split('(')[0].trim(),
                    cells[3].textContent.split(' ')[0],
                    cells[6].textContent
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
            <div className='inputs-wrapper'>
                <div>
                    <div>
                        Tbody text here
                    </div>
                    <textarea onChange={handleTbody}/>
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
                    <div className='results-wrapper'>
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
