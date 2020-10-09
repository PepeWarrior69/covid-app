import { useState, useCallback } from 'react'

export const useHttp = () => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)

    const request = useCallback( async (url, method = "GET", body = null, headers = {}, proxyurl = '') => {
        setLoading(true)
        try {
            const response = await fetch(proxyurl + url, {
                method,
                body,
                headers
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message)
            }

            setLoading(false)

            return data
        } catch (err) {
            setLoading(false)
            setError(err.message)
            throw err
        }
    }, [])

    const clearError = useCallback(() => setError(null), []) 

    return { loading, request, error, clearError }
}