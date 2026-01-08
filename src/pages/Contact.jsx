import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span>US</span></p>
        </div>
        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img className='w-full md:max-w-[660px] py-2' src={assets.telecare_logo} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-4xl text-gray-600 '> OUR OFFICE</p>
          <p className='text-gray-500 text-2xl'> Enugu State,Nigeria</p>
          <p className='text-gray-500 text-2xl'>+234-123-456-8910 <br />telecare@gmail.com</p>
          <button></button>
        </div>
      </div>
    </div>
  )
}

export default Contact 