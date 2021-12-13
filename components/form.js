import { useEffect } from "react"
import useState from 'react-usestateref'
import Firebase from "../utils/firebase.utils"
import { MD5, sortAlphabets } from "../utils/MD5"
// import { useAppContext } from "../pages/_context"
import Router from 'next/router'

export default function Form() {
	// const { newError } = useAppContext()
	
	const firebase = new Firebase()
	const [email, setEmail] = useState('')
	const [user1, setUser1] = useState('')

	const [account, setAccount, accountRef] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		console.log("12")
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
		console.log(account, isAuthenticated)
	}, [])
	
	const submit = async () => {
		const emailList = await firebase.getUser(user1)
		console.log(await emailList)
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

		if(email.length > 0) {
			console.log(email[0])
			const chatId = MD5(sortAlphabets(email[0] + accountRef.current["uid"]))
			firebase.get_or_create(chatId, email[0], accountRef.current["uid"])
			Router.push('/chats/' + chatId)
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