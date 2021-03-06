import Head from 'next/head'
import { useEffect } from 'react'
// import { useAppContext } from './_context'
import useState from "react-usestateref"

import Navbar from '../components/navbar'
import Form from '../components/form'
import Firebase from '../utils/firebase.utils'
import { getDatabase, ref, onValue, get, child, set, onChildAdded } from "firebase/database";
import { MD5, sortAlphabets } from '../utils/MD5'

export default function Home() {
  	// let { error, newError } = useAppContext()
	const firebase = new Firebase()
	const [account, setAccount, accountRef] = useState([])
	const [isAuthenticated, setIsAuthenticated, isAuthenticatedRef] = useState(false)
	const [user, setUser, userRef] = useState({})

	const [users, setUsers, usersRef] = useState([])

	useEffect(() => {
		(async () => {
			const data = await firebase.get_from_database('users/')
			console.log(Object.values(data))
			if(data) {
				setUsers(Object.values(data))
			}
		})()
	}, [])
	

	const msgRead = () => {
			if(true) {
				const db = getDatabase();
				const dbRef = ref(db);
				get(child(dbRef, 'messages/')).then((snapshot) => {
					Object.entries(snapshot.val()).forEach(async function(firstChild) {
						// console.log(child.key)
			if(true) {
				Object.entries(firstChild[1]).forEach(async (child) => {
				if(typeof child[1] == 'object') {
					const { is_delivered, ...data } = child[1] 
					if(accountRef.current && data.user !== accountRef.current.uid) {
						await set(ref(db, 'messages/' + firstChild[0] + '/' + child[0]), {
							is_delivered: true,
							...data
						})
					}
				}
				})
			}
			});
					
				}).catch((error) => {
					console.error(error);
				});
				
			}
		}

	useEffect(() => {
		const db = getDatabase();
		const dbRef = ref(db, 'messages/');
		onChildAdded(dbRef, (snapshot) => {
			msgRead()
		});
	}, [])

	// useEffect(() => {
	// 	console.log(error, "Dsa")
	// }, [error])

	useEffect(() => {
		(async () => {
			await setTimeout(() => {}, 10000)
			setUser({})
			setAccount(JSON.parse(localStorage.getItem('account')))
			setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
			try {
				firebase.checkIfOnline(accountRef.current["uid"])
			} catch(e) {
				console.log(e)
			}
		})();
	}, [])

	async function submit(uid) {
		const chatId = MD5(sortAlphabets(accountRef.current.uid + uid))
		await firebase.addMsg(chatId, 'yo', accountRef.current.uid)
		alert('sent')
	}
	
	return (
		<>
		<Head>
			<title>Chat App</title>
		</Head>
		<div className='flex flex-col justify-center items-center'>
			<Navbar />
			<Form />
			<div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-10 m-10">
				{users.map((value) => (
					<div className="flex flex-col justify-center items-center cursor-pointer" key={value.uid} onClick={() => submit(value.uid)}>
						<img className="w-10" src={value.photoURL} alt="Sunset in the mountains" />
						<div className="px-6 py-4">
							<div className="font-bold text-xl mb-2">{value.displayName}</div>
							<p className="text-gray-700 text-base">
								{value.email}
							</p>
						</div>
						<div className="px-6 pt-4 pb-2">
							<span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{value.online ? "Online" : "Offline"}</span>
						</div>
					</div>
				))}
				
			</div>
		</div>
		</>
	)
}
