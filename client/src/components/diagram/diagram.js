import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import './diagram.scss'

const Diagram = ({ diagramContent }) => {
    const [data, setData ] = useState([ ...diagramContent ])

    useEffect(() => { 
        let array = diagramContent.slice()
        setData([ ...array ])
    }, [ diagramContent ])

    let width = data.length * 146

    const renderLineChart = (
        <LineChart width={width} height={500} data={data} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
            <Legend width={200} wrapperStyle={{ top: 40, left: '50%', backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '30px' }}/>
            <Line type="monotone" dataKey="cases" stroke="#FF4500" />
            <Line type="monotone" dataKey="deaths" stroke="#FF0000" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
        </LineChart>
    )
    
    return (
        <div className="diagram">
            {renderLineChart}
        </div>
    )
}

export default Diagram