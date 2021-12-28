import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


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


  // dodanie i usuwanie podświetleń - admin
  if (borrowMenu != null && manageMenu != null) {
  
    if (window.innerWidth > 960 && scrollPos < 700) {
      listMenu.classList.add('highlight');
      borrowMenu.classList.remove('highlight');
      return;
    } 
    else if (window.innerWidth > 960 && scrollPos < 2000) {
      listMenu.classList.remove('highlight');
      borrowMenu.classList.add('highlight');
      manageMenu.classList.remove('highlight');
      return;
    } 
    else if (window.innerWidth > 960 && scrollPos < 3500) {
      borrowMenu.classList.remove('highlight');
      manageMenu.classList.add('highlight');
      return;
    }

    if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
      elem.classList.remove('highlight');
    }
  }

  // dodanie i usuwanie podświetleń - urzytkownik
  else if (borrowMenu != null && manageMenu == null) {
  
    if (window.innerWidth > 960 && scrollPos < 700) {
      listMenu.classList.add('highlight');
      borrowMenu.classList.remove('highlight');
      return;
    } 
    else if (window.innerWidth > 960 && scrollPos < 2000) {
      listMenu.classList.remove('highlight');
      borrowMenu.classList.add('highlight');
      return;
    } 

    if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
      elem.classList.remove('highlight');
    }
  }

  // dodanie i usuwanie podświetleń - brak logowania
  else if (borrowMenu == null && manageMenu == null) {
  
    if (window.innerWidth > 960 && scrollPos < 700) {
      listMenu.classList.add('highlight');
      return;
    }  

    if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
      elem.classList.remove('highlight');
    }
  }
};

// podświetlanie na stronie
window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);
