import React, { useCallback, useEffect, useState } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import Table from '../table'
import Header from '../header'
import Diagram from '../diagram'
import Spinner from '../spinner'

import './app.scss'

let fetchedData = [] // save fetched Data

const App = ({ history }) => {
    const [ row, setRow ] = useState({
        country: '',
        cases: 0,
        deaths: 0,
        casesPerTousand: 0,
        deathsPerTousand: 0,
        casesAllTime: 0,
        deathsAllTime:0
    })
    const [ monthStats, setMonthStats ] = useState({
        name: '',
        cases: 0,
        deaths: 0
    })
    const [ tableContent, setTableContent ] = useState([])
    const [ diagramContent, setDiagramContent ] = useState([])
    const [ searchInputValue, setSearchInputValue ] = useState('')
    const [ dateF, setDateF ] = useState('')
    const [ dateT, setDateT ] = useState('')

    const [ sortingColumn, setSortingColumn ] = useState('Выберите поле...')
    const [ sortingColumnFrom, setSortingColumnFrom ] = useState(0)
    const [ sortingColumnTo, setSortingColumnTo ] = useState(10000000)

    const { loading, request, error, clearError } = useHttp()
    
    // show http errors if they are there
    useEffect(() => {
        if (error) {
            alert(`Ошибка: ${error}`)
            clearError()
        }
    }, [ error, clearError ])
    // push parsed data to state when row change
    useEffect(() => {
        if (row.country !== '') {
            setTableContent((prevState) => {
                let array = prevState.slice()
                array.push(row)
                return [
                    ...array
                ]
            })
        }
    }, [row])

    useEffect(() => {
        if (monthStats.name !== '') {
            setDiagramContent((prevState) => {
                let array = prevState.slice()
                array.push(monthStats)
                return [
                    ...array
                ]
            })
        }
    }, [monthStats])

    const parsedDataHandler = (place, cases, deaths, casesPerTousand, deathsPerTousand, casesAllTime, deathsAllTime) => {
        setRow({
            country: place,
            cases,
            deaths,
            casesPerTousand,
            deathsPerTousand,
            casesAllTime,
            deathsAllTime
        })
    }


    const parseDataForTable = useCallback(() => {
        const dateFormat = (date = new Date()) => { // make correct date format to compare dates
            let array = date.split('/')
            return `${array[1]}/${array[0]}/${array[2]}`
        }

        setTableContent([])  // reset state
        setDiagramContent([])

        let currentCountry = ''
        let dateFrom = new Date(dateFormat(dateF))
        let dateTo = new Date(dateFormat(dateT))
    
        let deaths = 0
        let cases = 0
        let allTimeDeaths = 0
        let allTimeCases = 0
        let casesPerTousand = 0
        let deathsPerTousand = 0
        for (let i = 0; i < fetchedData.length; i++) {
            if (currentCountry !== fetchedData[i].countriesAndTerritories || currentCountry === 'Zimbabwe' & fetchedData[i].dateRep === '21/03/2020') { // save data to state
                if (currentCountry !== '') {
                    casesPerTousand = (cases / fetchedData[i - 1].popData2019 * 1000).toFixed(3)
                    deathsPerTousand = (deaths / fetchedData[i - 1].popData2019 * 1000).toFixed(3)
                    parsedDataHandler(currentCountry, cases, deaths, casesPerTousand, deathsPerTousand, allTimeCases, allTimeDeaths) // 3 simbols after dot
                }
               
                currentCountry = fetchedData[i].countriesAndTerritories
                deaths = 0
                cases = 0
                casesPerTousand = 0
                deathsPerTousand = 0
                allTimeDeaths = 0
                allTimeCases = 0
            }
            let dateRep = new Date(dateFormat(fetchedData[i].dateRep))

            if (dateRep >= dateFrom & dateRep <= dateTo) {
                deaths += fetchedData[i].deaths
                cases += fetchedData[i].cases
            }
            allTimeDeaths += fetchedData[i].deaths
            allTimeCases += fetchedData[i].cases
        }
    }, [dateF, dateT])

    const formattedDate = (d = new Date()) => { // get date format like which we got from server
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());
      
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${day}/${month}/${year}`;
    }

    const parseDataForDiagram = useCallback((data) => {
        let year = 2019
        let casesPerMonth = 0
        let deathsPerMonth = 0
        let stop = false
        let monthNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] // months numbers
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const todaysDate = formattedDate() // dd/mm/yyyy

        for (let i = 11; i < 12; i++) {
            if (stop) {
                break
            }
            for (let k = 0; k < data.length; k++) {
                if (data[k].month === monthNumbers[i] & data[k].year === `${year}`) {
                    casesPerMonth += data[k].cases
                    deathsPerMonth += data[k].deaths
                    if (data[k].dateRep === todaysDate & data[k].countriesAndTerritories === 'Zimbabwe') { // stop if we already parse all data which we got
                        stop = true
                        break
                    }
                }
            }
            // calculate data per month and set this to state
            setMonthStats({
                name: `${months[monthNumbers[i] - 1]}, ${year}`,
                cases: casesPerMonth,
                deaths: deathsPerMonth
            })
            // reset data
            casesPerMonth = 0
            deathsPerMonth = 0

            if (i === 11) {
                year++
                i = -1
            }
        }
    }, [])

    // fetch data when component did mount
    useEffect(() => {
        const fetchData = () => {
            request('https://opendata.ecdc.europa.eu/covid19/casedistribution/json/', //url
             'GET', // method
             null, // body
             {}, // headers
             "https://cors-anywhere.herokuapp.com/") // proxy (the easiest way to get data without error ( cors )!!! )
                .then((response) => {
                    const data = response.records
                    fetchedData = data
                    parseDataForTable()
                    return data
                })
                .then((data) => {
                    parseDataForDiagram(data)
                    return data
                })
        }
        fetchData()
    }, [ request, parseDataForTable, parseDataForDiagram ])

    const tableSearchHandler = (e) => {
        setSearchInputValue(e.target.value)
    }

    const selectedPeriodFromHandler = (from) => {
        setDateF(from)
    }

    const selectedPeriodToHandler = (to) => {
        setDateT(to)
    }

    const updateSortingByColumn = (value) => {
        setSortingColumn(value)
    }
    const updateSortingValueFrom = (value) => {
        setSortingColumnFrom(parseInt(value))
    }
    const updateSortingValueTo = (value) => {
        setSortingColumnTo(parseInt(value))
    }
    
    // default redirect to /table
    return (
        <div className="app container-fluid text-center">
            <div className="nav nav-tabs" id="covidTab" role="tablist">
                <Header 
                    path={history.location.pathname} 
                    tableSearchHandler={tableSearchHandler} 
                    selectedPeriodFromHandler={selectedPeriodFromHandler}
                    selectedPeriodToHandler={selectedPeriodToHandler}
                    updateSortingByColumn={updateSortingByColumn}
                    updateSortingValueFrom={updateSortingValueFrom}
                    updateSortingValueTo={updateSortingValueTo}/>
            </div>
            {history.location.pathname === '/' ? <Redirect to="/table"/>: false} 
            { // if loading then return spinner
            loading ? <Spinner/> : 
            (<Switch>
                <Route 
                    path="/table" 
                    render={() => 
                        <Table 
                            tableContent={tableContent} 
                            searchInputValue={searchInputValue} 
                            sortingColumn={sortingColumn}
                            sortingColumnFrom={sortingColumnFrom}
                            sortingColumnTo={sortingColumnTo}
                        />}/>
                <Route 
                    path="/diagram" 
                    render={() => 
                        <Diagram 
                            diagramContent={diagramContent}
                        />}/>
            </Switch>) }
            
        </div>
    )
}

export default withRouter(App) // need history for redirect