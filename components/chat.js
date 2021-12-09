import useState from 'react-usestateref'
import { useEffect } from 'react'
import Firebase from '../utils/firebase.utils'
import { MD5 } from '../utils/MD5'
import { getDatabase, ref, onValue } from "firebase/database";

export default function Chat({ chatId }) {
	const firebase = new Firebase()
	const [account, setAccount, accountRef] = useState([])
	const [isAuthenticated, setIsAuthenticated, isAuthenticatedRef] = useState(false)

	const [user, setUser, userRef] = useState({})
	const [msgValue, setMsgValue, msgValueRef] = useState('')
	const [msgs, setMsgs, msgsRef] = useState([])

	const findUser = async (user) => {
		const emailList = await firebase.getUser(user)
		await emailList.map(async value => {
			console.log(value)
			const v = await value
			console.log(v)
			if(v) {
				console.log(v)
				if(v[1].uid === user) {
					// console.log(v)
					setUser(v)
					// console.log(userRef.current, "dsadsasfa")
					return v
				}
			} 
		})
	}

	useEffect(() => {
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
	}, [])

	useEffect(() => {
		(async function() {
			await setTimeout(() => {}, 10000)
			setUser({})
			setAccount(JSON.parse(localStorage.getItem('account')))
			setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))

			if(isAuthenticatedRef.current) {
				const data = await firebase.getChatRoom(chatId)
				// setUser(data)
				console.log(data, accountRef.current.uid, chatId)
				if(data.user1 === accountRef.current.uid) {
					var other_user = findUser(data.user2)
				} else {
					var other_user = findUser(data.user1)
				}
				console.log(userRef.current, "ew")
			}
		})();
		
	}, [])

	useEffect(() => {
		// console.log(userRef.current[1]["photoURL"])
		// if(typeof userRef.current[1] !== 'undefined')console.log(userRef.current[1].displayName)
		// console.log(userRef.current, "ewqejqenqwljkqwnejk")

	}, [user])

	// useEffect(() => {
	// 	(async () => {
	// 		const msgs = await firebase.getMsgs(msgs)
	// 		console.log(msgs)
	// 	})()
	// })

	useEffect(() => {
		const db = getDatabase();
		const dbRef = ref(db, 'messages/' + chatId);
		onValue(dbRef, (snapshot) => {
			let data = snapshot.val();
			if(!data) data = {}
			data = Object.entries(data).sort((a,b) => new Date(a[1].date_time) - new Date(b[1].date_time))
			setMsgs(data);
		});
	}, [])

	const addMsg = async () => {
		// const chatId = MD5(accountRef.current.uid + userRef.current.uid)
		await firebase.addMsg(chatId, msgValueRef.current, accountRef.current.uid)
		firebase.checkIfOnline(accountRef.current["uid"])
	}

	const ConditionalWrapper = ({ value, condition }) => {
		// console.log(new Date(value.date_time), value.date_time)
		return condition ? (
			<div className="chat-message">
				<div className="flex items-end justify-end">
					<div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
					<div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{value.msg}</span></div>
					<span className='font-sm'>{new Date(value.date_time).toString()}</span>
					</div>
					<img src={accountRef.current.photoURL} alt="My profile" className="w-6 h-6 rounded-full order-2" />
				</div>
			</div>
		) : (
			<div className="chat-message">
				<div className="flex items-end">
					<div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
					<div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{value.msg}</span></div>
					<span className='font-sm'>{new Date(value.date_time).toString()}</span>
					</div>
					<img src={userRef.current[1] && userRef.current[1].photoURL} alt="My profile" className="w-6 h-6 rounded-full order-1" />
				</div>
			</div>
		)
	}

	return (
		<div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
			<div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
				<div className="flex items-center space-x-4">
					<img src={userRef.current[1] && userRef.current[1].photoURL} alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
					<div className="flex flex-col leading-tight">
						<div className="text-2xl mt-1 flex items-center">
							<span className="text-gray-700 mr-3">{typeof userRef.current[1] !== 'undefined' && user[1].displayName}</span>
							<span className="text-green-500">
								<svg width="10" height="10">
									<circle cx="5" cy="5" r="5" fill="currentColor"></circle>
								</svg>
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</button>
					<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
					</button>
					<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
						</svg>
					</button>
				</div>
			</div>
			<div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
				{isAuthenticated && msgs.map((value) => {
					return (
						<ConditionalWrapper value={value[1]} condition={value[1].user === accountRef.current.uid}>
							
						</ConditionalWrapper>
					)
				})}
					
				
				
			</div>
			<div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
				<div className="relative flex">
					<span className="absolute inset-y-0 flex items-center">
						<button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
						</svg>
						</button>
					</span>
					<input value={msgValue} onInput={(e) => setMsgValue(e.target.value)} type="text" placeholder="Write Something" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3" />
					<div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
						<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
							</svg>
						</button>
						<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
						</button>
						<button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</button>
						<button onClick={addMsg} type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transform rotate-90">
								<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}