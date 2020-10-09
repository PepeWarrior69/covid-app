import React from 'react'
import { Link } from 'react-router-dom'

import './header.scss'

const replaceClass = (e) => {
    const tabs = document.querySelectorAll('.nav-link')
    tabs.forEach((item) => {
        item.classList.remove('active')
    })
    e.target.classList.add('active')
}

const Header = ({ path, tableSearchHandler }) => {
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

    return (
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
            <div className="d-block">
                {renderSearch()}
            </div>
        </div>
    )
}

export default Header