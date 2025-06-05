import {useNavigate} from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate()
  const publicBlog = () => {
    navigate('/public_blog')
  }
  const login = () => {
    navigate('/signin')
  }

  return (
    <div className="page pt-[10vh] sm:px-16 px-4 duration-500">
      <div>
        <h1 className="text-4xl sm:text-5xl sm:mt-30 mt-10">Publish Your Passoin, In Your Way.</h1>
        <p className='hero-p text-md w-[50%] mt-4'>Share your story with the world. Create a beautiful, personalized blog that fits your brand. Grow your audience with built-in marketing tools, or transform your passion into revenue by gating access with a paywall.</p>
        <p className='hero-p text-md w-[50%] mt-8'>Create a unique and beautiful blog easily.</p>
        <div className="blob w-100"></div>
        <div className="blob1 w-40"></div>
        <div className="mt-6 flex gap-4">
          <button className="border-1 px-2 py-1 cursor-pointer hover:bg-blue-500 hover:text-white duration-500" onClick={publicBlog}>Read Public Blog</button>
          <button className="border-1 px-2 py-1 bg-blue-600 text-white cursor-pointer hover:bg-blue-700 duration-500" onClick={login}>Get started</button>
        </div>
      </div>
      <div className="h-[200vh]"></div>
    </div>
  );
}
