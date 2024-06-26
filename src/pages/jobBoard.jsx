import React, { useState, useEffect } from 'react';
import { API_PATH } from '../hook/config';
import { RotatingLines } from 'react-loader-spinner';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchMessage, setSearchMessage] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATH}/jobs?keyword=${keyword}&location=${location}`);
            const data = await response.json();
            setJobs(data.jobs);
            setLoading(false);
            if (data.jobs.length === 0) {
                setSearchMessage('Search results not found.');
            } else {
                setSearchMessage('');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4 text-center">Job Board</h1>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter job keyword"
                    className="border p-2 mr-2 rounded"
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter job location"
                    className="border p-2 mr-2 rounded"
                />
                <button
                    onClick={fetchJobs}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Search
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <RotatingLines
                        strokeColor="blue"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                </div>
            ) : (
                <>
                    {searchMessage && <p className="text-red-500 text-center mb-4">{searchMessage}</p>}
                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobs.map((job, index) => (
                                <div key={job._id} className="bg-white p-4 rounded flex flex-col justify-around shadow-md">
                                    <div>
                                        <h2 className="text-xl font-bold">{job.title}</h2>
                                        <a href={job.companyURL} className="text-sky-500 hover:text-sky-700">{job.companyName}</a>
                                    </div>
                                    <div className='flex justify-between flex-row'>
                                        <div>
                                            <p className="text-gray-700">{job.jobLocation}</p>
                                            <p className="text-gray-700">{job.jobDuration}</p>
                                        </div>
                                        <span>
                                            <button className='bg-sky-500 p-2 rounded-md text-white'>
                                                <a href={job.jobURL} className="text-white">View Job</a>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-red-500 text-center">No jobs found matching your search criteria.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default JobList;
