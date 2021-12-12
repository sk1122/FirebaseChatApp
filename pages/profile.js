import Head from "next/head"
import { useState, useEffect } from "react"

export default function Profile() {
	const [account, setAccount] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
		console.log(account, isAuthenticated)
	}, [])

	return (
		<>
			<Head>
				<title>{isAuthenticated && 
					account["displayName"]
				}</title>
			</Head>

			<div className="flex flex-col justify-center items-center text-3xl">
				{isAuthenticated &&
					<div>
						<img src={account["photoURL"]} alt="" className="rounded-full" />
						<h1>{account["displayName"]}</h1>
						<h1>{account["email"]}</h1>
					</div>
				}
				</div>
		</>
	)
}