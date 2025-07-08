//fotter.js

import React from 'react';

import '../style/Footer.css';

export default function Footer() {
  return (
    <footer id='footer' className='footer'>
      <p>
       Built with React  💚 by
        <a
          href='https://github.com/rifkiandriyanto'
          target='_blank'
          rel='noopener noreferrer'
        >
          {' '}
          Raju Kumar{' '}
        </a>
        <br />
      </p>
    </footer>
  );
}
