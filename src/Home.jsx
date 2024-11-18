// FIle for home page functionality
import React, { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        const fetchData = async () => {
            const data = await loadData();
            console.log(data);
        };
        fetchData();

    }, []);

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}
const loadData = () => {
    return new Promise((resolve, reject) => {
        curl('https://jsonplaceholder.typicode.com/posts', (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};

export default Home;