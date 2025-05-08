import Hero from "@/components/sections/hero";

import React from 'react'
import Services from "./components/sections/services";
import Contact from "./components/sections/contact";

const page = () => {
  return (
    <>
    <div className="">
      <Hero />
      <Services />
      <Contact />
    </div>
    </>
  )
}

export default page
