import { useState, useEffect } from "react"
import Firebase from "../utils/firebase.utils"
import { MD5 } from "../utils/MD5"
import { useAppContext } from "../pages/_context"

export default function Form() {
	const { newError } = useAppContext()
	
	const firebase = new Firebase()
	const [email, setEmail] = useState('')
	const [user1, setUser1] = useState('')

	const [account, setAccount] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		console.log("12")
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
		console.log(account, isAuthenticated)
	}, [])
	
	const submit = async () => {
		const emailList = await firebase.getUser(user1)
		await emailList.map(async value => {
			const v = await value
			if(v !== undefined) {
				console.log(v)
				setEmail(v)
			}
		})
	}

	useEffect(() => {
		// account wtf
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
		console.log(email, (JSON.parse(localStorage.getItem('account'))))
		if(email.length > 0) {
			console.log(account)
			const chatId = MD5(email + account)
			console.log(chatId, email, account["uid"])
			firebase.get_or_create(chatId, email, account["uid"])
		} else {
			console.log(1)
		}
	}, [email])
	
	return (
		<form className="w-1/3 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div className="w-full px-3 mb-6 md:mb-0">
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
					User Email
				</label>
				<input value={user1} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onInput={(e) => setUser1(e.target.value)} id="email" type="text" placeholder="Recipient Email" />
			</div>
			<div className="flex items-center justify-center mt-5">
				<button onClick={submit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
					Join
				</button>
			</div>
		</form>
	)
}