import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth.js';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home';
import AllBooks from './pages/AllBooks.jsx';
import LogIn from './pages/LogIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails.jsx';
import Favourites from './components/Profile/Favourites.jsx';
import UserOrderHistory from './components/Profile/UserOrderHistory.jsx';
import Setting from './components/Profile/Setting.jsx';
import AllOrder from './pages/AllOrder.jsx';
import AddBook from './pages/AddBook.jsx';
import UpdateBook from './pages/UpdateBook.jsx';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />}>
           {role === "user" ? (<Route index element={<Favourites />}/>
           ):(<Route index element={<AllOrder/>} />)}
           {role === "admin" && <Route path="/profile/add-book" element={<AddBook/>} />}
          <Route path="/profile/orderHistory" element={<UserOrderHistory />} />
          <Route path="/profile/settings" element={<Setting />} />
        </Route>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/updateBook/:id" element={<UpdateBook />} />
        <Route path="/view-book-details-id/:id" element={<ViewBookDetails />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
