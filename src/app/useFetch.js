import { useState, useEffect } from "react";

const useFetch = (url, body=null, method="GET") => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        fetch(url, { 
            signal : abortCont.signal,
            method : method,
            body : body
        }).then(
            res => {
                if (res.status !== 200){
                    throw Error("Could not fetch the data")
                }
                return res.json();
            }
        ).then(
            data => {
                console.log(data)
                setData(data);
                setIsPending(false);
                setError(null);
            }
        ).catch(err => {
            if (err.name === "AbortError"){
                console.log("Fetch Aborted");
            }
            else{
                setError(err.message);
                setIsPending(false);
            }
        })

        return () => abortCont.abort();
    }, [url])
    return { data, isPending, error }
}

export default useFetch