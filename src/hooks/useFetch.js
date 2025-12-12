import { useState, useEffect, useCallback } from 'react';

export default function useFetch(request) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);

        request()
            .then(result => { setData(result); })
            .catch(err => {
                const message = err?.message || "An error occured";
                setError(message);
            })
            .finally(() => { setLoading(false); })
    }, [request]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

