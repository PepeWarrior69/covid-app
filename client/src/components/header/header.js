import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './header.scss'

const Header = ({ path, tableSearchHandler, selectedPeriodFromHandler, selectedPeriodToHandler }) => {

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
                        className="form-control mr-sm-2" 
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
            <div className="period">
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

    return (
        <div>
            {renderPeriodSelection()}
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
                </div>
            </div>
        </div>
    )
}

export default Header