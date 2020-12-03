import React from 'react'
import { Link } from 'react-router-dom'

export default function AddMore() {
  return (
    <div>
      <Link to='/comp-entry'>Enter Company   </Link>
      <Link to='/dept-entry'>Enter Department    </Link>
      <Link to='/emp-entry'>Enter Employee    </Link>
    </div>
  )
}
