import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './header.scss'

const Header = ({ path, // props
    tableSearchHandler, 
    selectedPeriodFromHandler, 
    selectedPeriodToHandler, 
    updateSortingByColumn, // setState
    updateSortingValueFrom, 
    updateSortingValueTo,
    resetFilter 
    }) => {

    const dateFormat = (date) => {
        let array = date.split('-')
        return `${array[2]}/${array[1]}/${array[0]}`
    }

    const date = (d = new Date()) => {
        let month = String(d.getMonth() + 1)
        let day = String(d.getDate())
        const year = String(d.getFullYear())
      
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return`${year}-${month}-${day}`
    }

    const [ dateFrom, setDateFrom ] = useState('2019-12-31')
    const [ dateTo, setDateTo ] = useState(date())

    useEffect(() => {
        selectedPeriodFromHandler(dateFormat(dateFrom))
    }, [dateFrom, selectedPeriodFromHandler])

    useEffect(() => {
        selectedPeriodToHandler(dateFormat(dateTo))
    }, [dateTo, selectedPeriodToHandler])

    const replaceClass = (e) => {
        const tabs = document.querySelectorAll('.nav-link')
        tabs.forEach((item) => {
            item.classList.remove('active')
        })
        e.target.classList.add('active')
    }

    const renderSearch = () => {
        if (path === '/table') {
            return (
                <form className="form-inline my-2 my-lg-0">
                    <input 
                        className="form-control mr-sm-2 mb-2 ml-5" 
                        id="search"
                        type="search" 
                        placeholder="Find country" 
                        aria-label="Search" 
                        onChange={tableSearchHandler}/>
                </form>
            )
        }

        return false
    }

    const renderPeriodSelection = () => {
        return (
            <div className="period d-flex justify-content-start">
                <label htmlFor="from">Период от</label>
                <input 
                    type="date" 
                    id="from" 
                    name="from" 
                    defaultValue={dateFrom} 
                    min="2019-12-31"
                    max={dateTo}
                    onChange={(e) => {
                        setDateFrom(e.target.value)
                    }}/>
                <label htmlFor="to">до</label>
                <input 
                    type="date" 
                    id="to" 
                    name="to" 
                    defaultValue={dateTo} 
                    max={date()}
                    min={dateFrom}
                    onChange={(e) => {
                        setDateTo(e.target.value)
                    }}/>
            </div>
        )
    }

    const renderFilterByColumn = () => {
        let colNames = ['Количество случаев', 
        'Количество смертей', 
        'Количество случаев всего', 
        'Количество смертей всего', 
        'Количество случаев на 1000 жителей', 
        'Количество смертей на 1000 жителей']

        if (path === '/table') {
            return (
                <div className="input-group mb-1">
                    <div className="input-group-prepend">
                        <label className="input-group-text mb-1" htmlFor="colSelecter">Сортировка</label>
                    </div>
                    <select className="custom-select" id="colSelecter" onChange={(e) => updateSortingByColumn(e.target.value)}>
                        <option defaultValue>Выберите поле...</option>
                        { colNames.map((column) => {
                            return <option key={column} value={column}>{column}</option>
                        }) }
                    </select>
                    <div className="d-flex"> 
                        <div className="input-group mb-1 ml-4">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">От</span>
                            </div>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="colValueFrom"
                                aria-label="Sizing example input" 
                                aria-describedby="inputGroup-sizing-sm" 
                                onChange={(e) => updateSortingValueFrom(e.target.value)}/>
                        </div>
                        <div className="input-group mb-1 ml-4">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">До</span>
                            </div>
                            <input 
                                type="number" 
                                className="form-control"
                                id="colValueTo"
                                aria-label="Sizing example input" 
                                aria-describedby="inputGroup-sizing-sm" 
                                onChange={(e) => updateSortingValueTo(e.target.value)}/>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const renderResetButton = () => {
        const resetDate = () => {
            setDateFrom('2019-12-31')
            setDateTo(date())
        }
        if (path === '/table') {
            return(
                <button 
                    type="button" 
                    className="btn btn-warning ml-5"
                    onClick={() => {
                        resetDate()
                        resetFilter()
                        document.querySelector('#from').value = '2019-12-31'
                        document.querySelector('#to').value = date()
                    }}
                    >Сбросить фильтр
                    </button>
            )
        }
        return false
    }

    return (
        <div>
            <div className="d-flex mb-2">
                {renderPeriodSelection()}
                {renderResetButton()}
            </div>
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex">
                    <Link 
                        className="nav-link active" 
                        to="/table" 
                        onClick={(e) => replaceClass(e)} >
                            Таблица
                    </Link>
                    <Link 
                        className="nav-link" 
                        to="/diagram" 
                        onClick={(e) => replaceClass(e)}
                        >График
                    </Link>
                </div>
                <div className="d-flex">
                    {renderSearch()}
                    {renderFilterByColumn()}
                </div>
            </div>
        </div>
    )
}

export default Header