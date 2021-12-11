import useState from "react-usestateref"
import { useEffect } from "react/cjs/react.development"
import Firebase from "../utils/firebase.utils"
import { MD5, sortAlphabets } from "../utils/MD5"
import Router from "next/router"

export default function Online() {
	const firebase = new Firebase()
	const [users, setUsers, usersRef] = useState([])
	const [account, setAccount, accountRef] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		(async () => {
			const data = await firebase.get_from_database('users/')
			console.log(Object.values(data))
			if(data) {
				setUsers(Object.values(data))
			}
		})()
	}, [])
	
	const submit = async (userUID) => {
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
		if(userUID === accountRef.current["uid"]) {
			console.log("Ewwww")
			return
		}
		const chatId = MD5(sortAlphabets(userUID + accountRef.current["uid"]))
		firebase.get_or_create(chatId, userUID, accountRef.current["uid"])
		Router.push('/chats/' + chatId)
	}

	return (
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
	)
}