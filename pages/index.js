import Head from 'next/head'
import { useEffect } from 'react'

import Navbar from '../components/navbar'
import Form from '../components/form'
import { useAppContext } from './_context'

export default function Home() {
  let { error, newError } = useAppContext()
  
  useEffect(() => {
    console.log(error, "Dsa")
  }, [error])
  
  return (
    <>
      <Head>
        <title>Chat App</title>
      </Head>
      <div className='flex flex-col justify-center items-center'>
        <Navbar />
        <Form />
      </div>
    </>
  )
}
