import { useEffect, useState } from "react";

function CatFacts() {
    const [facts, setFacts] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect (() => {
        const controller = new AbortController()
        const signal = controller.signal

        fetch ("https://catfact.ninja/fact?limit=5", { signal })
            .then (response => {
                if (!response.ok) throw new Error(`${response.status}`)
                return response.json()
            })
            .then (data => {
                console.log("Fetched cat facts: ", data)
                setFacts(data)
            })
            .catch (error => {
                if (error.name == "AbortError") {
                    console.log("Fetch aborted")
                    console.log(error.message)
                } else {
                    console.log("Fetch error")
                    setError(error.message)
                }
            })
        
        return (() => {
            controller.abort()
        })
    }, [])

    if (error) return <div>Error: {error}</div>
    if (!facts) return <div>Loading facts...</div>

    // extract the facts from facts to display on page
    let theFact = ''
    for (const fact in facts) {
        console.log(facts[fact])
        theFact = facts[fact]
        break
    }

    return (
        <div>
            <h2 style={{ color: "blue" }}>Random Cat Facts</h2>
            <p>{theFact}</p>
        </div>
    )
}

export default CatFacts