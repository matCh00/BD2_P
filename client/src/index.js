import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import borrowVisibility from './App.js'


ReactDOM.render(

    <
    App / > ,

    document.getElementById('root')
);


const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

// podświetlanie elementów na pasku gdy scrollujemy
const highlightMenu = () => {
  const elem = document.querySelector('.highlight');
  const listMenu = document.querySelector('#list-page');
  const borrowMenu = document.querySelector('#borrow-page');
  const manageMenu = document.querySelector('#manage-page');
  let scrollPos = window.scrollY;


  // dodanie i usuwanie podświetleń
  if (window.innerWidth > 960 && scrollPos < 600) {
    listMenu.classList.add('highlight');
    borrowMenu.classList.remove('highlight');
    return;
  } 
  else if (window.innerWidth > 960 && scrollPos < 1400) {
    borrowMenu.classList.add('highlight');
    listMenu.classList.remove('highlight');
    manageMenu.classList.remove('highlight');
    return;
  } 
  else if (window.innerWidth > 960 && scrollPos < 2345) {
    manageMenu.classList.add('highlight');
    borrowMenu.classList.remove('highlight');
    return;
  }

  if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
    elem.classList.remove('highlight');
  }
};

// podświetlanie źle działa z ukrywaniem sekcji na stronie
/*
window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);
*/