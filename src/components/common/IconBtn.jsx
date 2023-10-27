import React from 'react'

const IconBtn = ({ text, onClick, children, disabled, outline = false, customClasses, type }) => {

  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`flex items-center ${outline ? 'border border-yellow-50 bg-transparent' : 'bg-yellow-50'}
    cursor-pointer gap-x-2 rounded-md font-semibold text-richblack-900 ${customClasses}
    py-[8px] px-[20px]
    text-lg`}
    >
      {
        children ? (
          <>
          <span className={`${outline && 'text-yellow-50'} text-base`}>{text}</span>
            {children}
          </>) : (<span className='text-base'>{text}</span>)
      }
    </button>
  )
}

export default IconBtn