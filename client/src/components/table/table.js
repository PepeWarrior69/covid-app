import React, { useState, useEffect } from 'react'

import './table.scss'

const Table = ({ tableContent, searchInputValue }) => {
    const [ content, setContent ] = useState([...tableContent])
    // states for arrows
    const [ sortByCases, setSortByCases ] = useState(false)
    const [ sortByAlphabetState, setSortByAlphabetState ] = useState(false)
    const [ sortByDeaths, setSortByDeaths ] = useState(false)
    const [ sortByCasesPerTousand, setSortByCasesPerTousand ] = useState(false)
    const [ sortByDeathsPerTousand, setSortByDeathsPerTousand ] = useState(false)
    // search
    const [ searchValue, setSearchValue ] = useState(searchInputValue)

    useEffect(() => {
        setContent([...tableContent])
    }, [tableContent])

    useEffect(() => {
        setSearchValue(searchInputValue)
    }, [searchInputValue])

    const tableContentHandler = () => {
        const tableFiltredData = getTableContent() 
        return tableFiltredData.map(( element ) => {
            return (
                <tr key={element.country}>
                    <td>{element.country}</td>
                    <td>{element.cases}</td>
                    <td>{element.deaths}</td>
                    <td>{element.casesPerTousand}</td>
                    <td>{element.deathsPerTousand}</td>
                </tr>
            )
        })
    }
    // filter
    const getTableContent = () => {
        return content.filter((item) => {
            if ( item.country.toLowerCase().indexOf( searchValue.toLowerCase() ) > -1 ) {
                return item
            }
            return false
        })
    }
    // arrows
    const setArrowUp = (arrow) => {
        arrow.classList.remove('right')
        arrow.classList.add('up')
    }

    const setArrowDown = (arrow) => {
        arrow.classList.remove('right')
        arrow.classList.add('down')
    }

    const setArrowsDefault = (arrows) => {
        arrows.forEach((item) => {
            item.classList.remove('down')
            item.classList.remove('up')
            item.classList.add('right')
        })
    }
   
    const getArrows = (target) => {
        const arrows = document.querySelectorAll('.arrow')
        let targetElement
        
        for (let i = 0; i < arrows.length; i++) {
            if (target === arrows[i]) {
                targetElement = arrows[i]
            } else if (target === arrows[i].parentElement) {
                targetElement = arrows[i]
            } else {
                continue
            }
        }
        return targetElement
    }

    const sortByAlphabet = (e) => {
        let targetArrow = getArrows(e.target)
        const arrows = document.querySelectorAll('.arrow')
        let array = content.slice()
        setArrowsDefault(arrows)
        setSortByCases(false)
        setSortByDeaths(false)
        setSortByDeathsPerTousand(false)
        setSortByCasesPerTousand(false)
        setSortByAlphabetState(!sortByAlphabetState)

        if (sortByAlphabetState) {
            setArrowUp(targetArrow)
        } else {
            setArrowDown(targetArrow)
        }

        let sortedArray = array.sort((a, b) => {
            let nameA = a.country.toLowerCase()
            let nameB = b.country.toLowerCase()

            if (nameA < nameB) return -1 //сортируем строки по возрастанию
            if (nameA > nameB) return 1
            return 0 // Никакой сортировки
        })

        if (!sortByAlphabetState) {
            sortedArray.reverse()
        }

        setContent([...sortedArray])
    }
    
    const sortByCasesHandler = (e) => {
        let targetArrow = getArrows(e.target)
        const arrows = document.querySelectorAll('.arrow')
        let array = content.slice()
        setArrowsDefault(arrows)
        setSortByAlphabetState(true)
        setSortByDeaths(false)
        setSortByDeathsPerTousand(false)
        setSortByCasesPerTousand(false)

        if (sortByCases) {
            setArrowDown(targetArrow)
        } else {
            setArrowUp(targetArrow)
        }

        let sortedArray =  array.sort(( a, b ) => {
            if (sortByCases) {
                setSortByCases(false)
                return a.cases - b.cases
            } else {
                setSortByCases(true)
                return b.cases - a.cases
            }
        })

        setContent([...sortedArray])
    }

    const sortByDeathsHandler = (e) => {
        let targetArrow = getArrows(e.target)
        const arrows = document.querySelectorAll('.arrow')
        let array = content.slice()
        setArrowsDefault(arrows)
        setSortByAlphabetState(true)
        setSortByCases(false)
        setSortByDeathsPerTousand(false)
        setSortByCasesPerTousand(false)

        if (sortByDeaths) {
            setArrowDown(targetArrow)
        } else {
            setArrowUp(targetArrow)
        }

        let sortedArray =  array.sort(( a, b ) => {
            if (sortByDeaths) {
                setSortByDeaths(false)
                return a.deaths - b.deaths
            } else {
                setSortByDeaths(true)
                return b.deaths - a.deaths
            }
        })

        setContent([...sortedArray])
    }
    
    const sortByCasesPerTousandHandler = (e) => {
        let targetArrow = getArrows(e.target)
        const arrows = document.querySelectorAll('.arrow')
        let array = content.slice()
        setArrowsDefault(arrows)
        setSortByAlphabetState(true)
        setSortByCases(false)
        setSortByDeaths(false)
        setSortByDeathsPerTousand(false)

        if (sortByCasesPerTousand) {
            setArrowDown(targetArrow)
        } else {
            setArrowUp(targetArrow)
        }

        let sortedArray =  array.sort(( a, b ) => {
            if (sortByCasesPerTousand) {
                setSortByCasesPerTousand(false)
                return a.casesPerTousand - b.casesPerTousand
            } else {
                setSortByCasesPerTousand(true)
                return b.casesPerTousand - a.casesPerTousand
            }
        })

        setContent([...sortedArray])
    }

    const sortByDeathsPerTousandHandler = (e) => {
        let targetArrow = getArrows(e.target)
        const arrows = document.querySelectorAll('.arrow')
        let array = content.slice()
        setArrowsDefault(arrows)
        setSortByAlphabetState(true)
        setSortByCases(false)
        setSortByCasesPerTousand(false)
        setSortByDeaths(false)

        if (sortByDeathsPerTousand) {
            setArrowDown(targetArrow)
        } else {
            setArrowUp(targetArrow)
        }

        let sortedArray =  array.sort(( a, b ) => {
            if (sortByDeathsPerTousand) {
                setSortByDeathsPerTousand(false)
                return a.deathsPerTousand - b.deathsPerTousand
            } else {
                setSortByDeathsPerTousand(true)
                return b.deathsPerTousand - a.deathsPerTousand
            }
        })

        setContent([...sortedArray])
    }

    return (
        <div className="tab-panel" id="home" role="tabpanel" aria-labelledby="home-tab">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col" className="table__col" onClick={sortByAlphabet}>Страна 
                            <i className="arrow up"></i>
                        </th>
                        <th scope="col" className="table__col" onClick={sortByCasesHandler}>Количество случаев
                            <i className="arrow right"></i>
                        </th>
                        <th scope="col" className="table__col" onClick={sortByDeathsHandler}>Количество смертей
                            <i className="arrow right"></i>
                        </th>
                        <th scope="col" className="table__col" onClick={sortByCasesPerTousandHandler}>Количество случаев на 1000 жителей 
                            <i className="arrow right"></i>
                        </th>
                        <th scope="col" className="table__col" onClick={sortByDeathsPerTousandHandler}>Количество смертей на 1000 жителей 
                            <i className="arrow right"></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableContentHandler()}
                    
                </tbody>
            </table>
        </div>
    )
}

export default Table