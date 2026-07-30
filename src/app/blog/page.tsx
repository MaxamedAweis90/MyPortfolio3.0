import React from 'react'
import BlurText from '../components/BlurText'

const page = () => {
  return (
	<>
		<div className="flex justify-center items-center text-center w-full bg-surface border-b border-borderSubtle md:py-32 py-24 shadow-xl">
        
        <BlurText
  text="My Blogs"
  delay={600}
  animateBy="words"
  direction="top"
  className="text-5xl md:mt-0 mt-10 font-extrabold text-primaryText"
/>

      </div>
	</>
  )
}

export default page
