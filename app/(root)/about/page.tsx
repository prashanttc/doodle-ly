import React from 'react'

const page = () => {
  return (
    <div className='bg-black w-full min-h-screen flex items-center justify-center flex-col gap-20'>
        <h1 className='text-white font-bold text-3xl'>About Scribble-to-Image Generation
        </h1>
      <p className='text-center text-white text-md xl:text-xl'>
      Scribble-to-Image Generation is an AI-powered app that transforms your simple sketches into stunning, detailed images. It works by first analyzing your scribble using the Qwen Model, which converts it into a descriptive text prompt. This prompt is then passed to the Flux Dev Model, which generates a high-quality image matching your original sketch. With an intuitive drawing interface and customizable options, the app makes it easy to bring your creative ideas to life quickly and efficiently. Whether you are an artist or just doodling for fun, Scribble-to-Image Generation bridges the gap between imagination and visual reality.
      </p>
    </div>
  )
}

export default page
