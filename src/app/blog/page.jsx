import React from 'react'
import BlurText from '../components/BlurText'

const page = () => {
  return (
	<>
		<div className="flex justify-center items-center text-center w-full bg-amber-100 md:py-32 py-24">
        
        <BlurText
  text="My Blogs"
  delay={600}
  animateBy="words"
  direction="top"
  className="text-5xl md:mt-0 mt-10 font-extrabold text-black"
/>

      </div>
	</>
  )
}

export default page
