import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [favouriteBooks,setfavouriteBooks] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() =>{
    const fetch = async()=>{
      const response = await axios.get(
        "http://localhost:3000/api/v1/get-favourite-books",
        {headers}

      );
      setfavouriteBooks(response.data.data);
    };
    fetch();
  },[favouriteBooks] );
  return (
    <>
     {favouriteBooks && favouriteBooks.length ===0 && (
        <div className='text-5xl font-semibold text-zinc-500 flex items-center justify-center flex-col w-full h-[100%]'>No Favourite Books</div>
      )}
    <div className='grid grid-cols-3 gap-4'>
       {favouriteBooks &&
       favouriteBooks.map((items,i)=>(
        <div key={i}>
        <BookCard data={items} favourite={true}/>
        </div>
       )) }
    </div>
    </>
    
  )
}

export default Favourites;
