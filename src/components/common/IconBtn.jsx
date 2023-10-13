import React from 'react'

const IconBtn = ({ text, onClick, children, disabled, outline = false, customClasses, type }) => {

  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`flex items-center ${outline ? 'border border-yellow-50 bg-transparent' : 'bg-yellow-50'}
    cursor-pointer gap-x-2 rounded-md font-semibold text-richblack-900 ${customClasses}
    px-3 py-1 md:px-4 md:py-2 lg:px-5 lg:py-2
    text-sm md:text-base lg:text-lg`}
    >
      {
        children ? (
          <>
          <span className={`${outline && 'text-yellow-50'} text-xs md:text-sm lg:text-base`}>{text}</span>
            {children}
          </>) : (<span className='text-xs md:text-sm lg:text-base'>{text}</span>)
      }
    </button>
  )
}

export default IconBtn