import React, { useCallback, useEffect, useState } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import Table from '../table'
import Header from '../header'
import Diagram from '../diagram'
import Spinner from '../spinner'

import './app.scss'

const App = ({ history }) => {
    const [ row, setRow ] = useState({
        country: '',
        cases: 0,
        deaths: 0,
        casesPerTousand: 0,
        deathsPerTousand: 0
    })
    const [ monthStats, setMonthStats ] = useState({
        name: '',
        cases: 0,
        deaths: 0
    })
    const [ tableContent, setTableContent ] = useState([])
    const [ diagramContent, setDiagramContent ] = useState([])
    const [ searchInputValue, setSearchInputValue ] = useState('')
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

    const parsedDataHandler = (place, cases, deaths, casesPerTousand, deathsPerTousand) => {
        setRow({
            country: place,
            cases,
            deaths,
            casesPerTousand,
            deathsPerTousand
        })
    }

    const parseDataForTable = useCallback((data) => {
        let currentCountry = ''
        let counter = 0
        let deaths = 0
        let cases = 0
        let casesPerTousand = 0
        
        for (let i = 0; i < data.length; i++) {
            if (currentCountry === data[i].countriesAndTerritories && counter === 14) continue // skip old data
            if (currentCountry !== data[i].countriesAndTerritories) { // reset counter and current country
                currentCountry = data[i].countriesAndTerritories
                counter = 0
            }
            
            if (counter === 0) {
                casesPerTousand = data[i]['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] / 100 // calculate cases per 1000
                cases = Math.round(casesPerTousand / 1000 * data[i].popData2019) // calculate cases (14 days)
            }
            counter++
            deaths += data[i].deaths
            
            if (counter === 14) {
                parsedDataHandler(currentCountry, cases, deaths, casesPerTousand.toFixed(3), (deaths / data[i].popData2019 * 1000).toFixed(3)) // 3 simbols after dot
                deaths = 0
                continue
            }
        }
    }, [])

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
                    parseDataForTable(data)
                    return data
                })
                .then((data) => {
                    parseDataForDiagram(data)
                })
        }
        fetchData()
    }, [ request, parseDataForTable, parseDataForDiagram ])
    // if loading then return spinner
    if (loading) {
        return (
            <Spinner/>
        )
    }

    const tableSearchHandler = (e) => {
        setSearchInputValue(e.target.value)
    }

    // default redirect to /table
    return (
        <div className="app container-fluid text-center">
            <div className="nav nav-tabs" id="covidTab" role="tablist">
                <Header path={history.location.pathname} tableSearchHandler={tableSearchHandler}/>
            </div>
            {history.location.pathname === '/' ? <Redirect to="/table"/>: false} 
            <Switch>
                <Route 
                    path="/table" 
                    render={() => 
                        <Table 
                            tableContent={tableContent} 
                            searchInputValue={searchInputValue} 
                        />}/>
                <Route 
                    path="/diagram" 
                    render={() => 
                        <Diagram 
                            diagramContent={diagramContent}
                        />}/>
            </Switch>
        </div>
    )
}

export default withRouter(App) // need history for redirect