import Head from 'next/head'
import { useEffect } from 'react'

import Navbar from '../../components/navbar'
import Chat from '../../components/chat'
import Firebase from '../../utils/firebase.utils'
import { useRouter } from "next/router";

export const getServerSideProps = async ({params}) => {
    const id = params.id;
    return {
       props: { id }
    }
 }

export default function ChatRoom({ id }) {
	console.log(id)
	
	useEffect(() => {
		(async function() {
			const firebase = new Firebase()
			const data = await firebase.getChatRoom(id)
		})();
		// firebase.createChatRoom(id, '', '')
	}, [])

	return (
		<>
			<Head>
				<title>Chat App</title>
			</Head>
			<div>
				<Navbar />
				<Chat />
			</div>
    	</>
  	)
}
