import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";

const UpdateBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });
 const {id} = useParams();
 const navigate =useNavigate();
   const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid : id,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      const { url, title, author, price, desc, language } = Data;
      if (!url || !title || !author || !price || !desc || !language) {
        alert("All fields are required");
        return;
      }

      const response = await axios.put(
        "http://localhost:3000/api/v1/update-book",
        Data,
        { headers }
      );


      setData({
        url: "",
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
      });
        alert(response.data.message);

        navigate(`/view-book-details-id/${id}`)

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
    useEffect(() => {
        const fetchData = async () => {
        
            const response = await axios.get(
                `http://localhost:3000/api/v1/get-book-by-id/${id}`
            );
            setData(response.data.data);
        };
        fetchData();
    }, [id]);


  return (
    <div className="bg-zinc-900 h-full p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Update Book</h1>

      <div className="p-4 bg-zinc-800 rounded">
        {/* Image URL */}
        <div>
          <label className="text-zinc-400">Image</label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="URL of image"
            name="url"
            required
            value={Data.url}
            onChange={change}
          />
        </div>

        {/* Title */}
        <div className="mt-4">
          <label className="text-zinc-400">Title of book</label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Title of book"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>

        {/* Author */}
        <div className="mt-4">
          <label className="text-zinc-400">Author of book</label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Author of book"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>

        {/* Language and Price */}
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label className="text-zinc-400">Language</label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Language of book"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-1/2">
            <label className="text-zinc-400">Price</label>
            <input
              type="number"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Price"
              name="price"
              required
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="text-zinc-400">Description of book</label>
          <textarea
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            rows="5"
            placeholder="Description of book"
            name="desc"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        {/* Submit Button */}
        <button
          className="mt-4 px-6 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
          onClick={submit}
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;