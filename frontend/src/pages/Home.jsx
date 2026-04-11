import React from 'react'

const Home = () => {
  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src='/assets/logo1.png' alt='Logo' />
        <h4 className='mainLable'>Paste your invitation RoomID </h4>
        <div className='inputGroup'>
          <input type='text' className='inputBox' placeholder='RoomId' />
          <input type='text' className='inputBox' placeholder='UserName' />
          <button className='btn joinbtn'>Join</button>
          <span className='createInfo'>
            {' '}
            If you don't have any invite then create{' '}
            <a href='' className='createNewBtn'>
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Build for fun ✌️ by
          <a href='https://github.com/Infinity0075'>By Anant Pathak</a>
        </h4>
      </footer>
    </div>
  )
}

export default Home
