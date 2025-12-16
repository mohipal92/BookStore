import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";

const ViewBookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/get-book-by-id/${id}`
                );
                setData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: id,
    };

    const handleFavourite = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/add-book-to-favourite`,
                {},
                { headers }
            );
            alert(response.data.message);
        } catch (error) {
            alert("Failed to add to favourites: " + error.message);
        }
    };

    const handleCart = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/add-to-cart`,
                {},
                { headers }
            );
            alert(response.data.message);
        } catch (error) {
            alert("Failed to add to cart: " + error.message);
        }
    };
//
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-8">Error: {error.message}</div>;
    }
 //
    const deleteBook = async() =>{
       const response = await axios.delete("http://localhost:3000/api/v1/delete-book",
        {headers}
    );
    alert(response.data.message);
    navigate("/all-books");
    }

    return (
        <>
            {data && (
                <div className='px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8 items-start'>
                    <div className='w-full lg:w-3/6'>
                        <div className='flex lg:flex-row flex-col justify-around bg-zinc-800 p-12 rounded'>
                            <img src={data.url} alt="/" className='h-[50vh] md:h-[60vh] lg:h-[70vh] rounded' />
                            {isLoggedIn === true && role === "user" && (
                                <div className='flex flex-col lg:flex-col md:flex-row items-center justify-between lg:justify-start mt-4'>
                                    <button
                                        className='bg-white my-3 mx-3 rounded lg:rounded-full text-3xl p-2 text-red-500 flex items-center justify-center'
                                        onClick={handleFavourite}
                                    >
                                        <FaHeart /> <span className='ms-4 lg:hidden'>Favourites</span>
                                    </button>
                                    <button
                                        className='text-white mt-8 md:mt-0 mx-3 rounded lg:rounded-full my-3 text-3xl p-2 bg-blue-500 flex items-center justify-center'
                                        onClick={handleCart}
                                    >
                                        <FaShoppingCart /> <span className='ms-4 lg:hidden'>Add to Cart</span>
                                    </button>
                                </div>
                            )}
                            {isLoggedIn === true && role === "admin" && (
                                <div className='flex flex-col md:flex-row items-center justify-between lg:justify-start mt-4'>
                                    <Link to={`/updateBook/${id}`}
                                     className='bg-white mt-8 md:mt-0 my-3 mx-3 rounded lg:rounded-full text-3xl p-2 text-blue-500'>
                                        <FaEdit /> <span className='ms-4 lg:hidden'>Edit</span>
                                    </Link>
                                    <button className="text-red-500 mx-3 rounded lg:rounded-full my-3 text-3xl p-2 bg-white flex items-center justify-center"
                                     onClick={deleteBook}>
                                        <MdDeleteOutline />
                                         <span className='ms-4 lg:hidden'>Delete Book</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='p-4 w-full lg:w-3/6'>
                        <h1 className='text-4xl font-semibold text-zinc-300'>{data.title}</h1>
                        <p className='mt-1 text-zinc-400'>{data.author}</p>
                        <p className='mt-4 text-zinc-500 text-xl'>{data.desc}</p>
                        <p className='flex mt-4 text-zinc-400 items-center justify-start text-xl'>
                            <GrLanguage className="me-3" /> {data.language}
                        </p>
                        <p className='mt-4 text-zinc-100 text-3xl font-semibold'>
                            Price: RS {data.price}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewBookDetails;
