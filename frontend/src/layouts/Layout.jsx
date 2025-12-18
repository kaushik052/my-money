import React, { Component } from 'react'
import Header from '../components/Header.jsx';
import Menu from '../components/Menu.jsx';
import Footer from '../components/Footer.jsx';

const Layout = ({ children }) => {
    return (
      <div class="wrapper">
        <Header/>
        <Menu/>
        <main>{children}</main>
        <Footer/>
      </div>
    )
}
export default Layout;