import React from 'react'
import { IoSearch } from 'react-icons/io5'
const SearchBar = () => {
  return (
    <div className='searchBar position-relative d-flex align-items-center'>
        <IoSearch className='mr-2' />
        <input type='text' placeholder='Search Here...'/>      
    </div>
  )
}

export default SearchBar
