// FIle for home page functionality
import React, { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        loadData().then((data) => {
            console.log(data);
        });
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}
const loadData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Data loaded');
        }, 2000);
    });
};

export default Home;