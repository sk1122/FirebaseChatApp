import Link from "next/link"

import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import Firebase from "../utils/firebase.utils"
// import { useAppContext } from "../pages/_context"

const navigation = [
  { name: 'Yo', href: '/yo', current: true }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
	const [account, setAccount] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	
	// const { newError } = useAppContext()

	useEffect(() => {
		setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
		setAccount(JSON.parse(localStorage.getItem('account')))
	}, [])

	useEffect(() => {
		localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated))
		localStorage.setItem('account', JSON.stringify(account))
	}, [account, isAuthenticated])

	const firebase = new Firebase()
	const login = () => {
		firebase.signIn(account, setAccount, setIsAuthenticated)
	}

	const logout = () => {
		firebase.signOutGoogle(account, setAccount, setIsAuthenticated)
	}

	return (
		<Disclosure as="nav" className="w-full bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 border border-opacity-0">
			{({ open }) => (
				<>
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="relative flex items-center justify-between h-16">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
						<span className="sr-only">Open main menu</span>
						{open ? (
							<XIcon className="block h-6 w-6" aria-hidden="true" />
						) : (
							<MenuIcon className="block h-6 w-6" aria-hidden="true" />
						)}
						</Disclosure.Button>
					</div>
					<div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex-shrink-0 flex items-center">
							<Link href='/'>
								<h1 className="font-inter text-black px-3 rounded-md text-xl font-semibold">Chat App</h1>
							</Link>
						</div>
					</div>
					<div className="flex">
						<div className="hidden sm:block sm:ml-6 sm:mr-6">
							<div className="flex space-x-4">
								{navigation.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										aria-current={item.current ? 'page' : undefined}
									>
										<a 
											className={classNames(
											item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white',
											'px-3 py-2 rounded-md text-sm font-medium'
										)}>
											{item.name}
										</a>
									</Link>
								))}
							</div>
						</div>
						{isAuthenticated ? <div></div> : <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-400" onClick={login}>Login with Google</div>}
					</div>
					{isAuthenticated ? 
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<button
							type="button"
							className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
							>
							<span className="sr-only">View notifications</span>
							<BellIcon className="h-6 w-6" aria-hidden="true" />
							</button> 

							{/* Profile dropdown */}
							<Menu as="div" className="ml-3 relative">
							<div>
								<Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
								<span className="sr-only">Open user menu</span>
								{console.log(account)}
								<img
									className="h-8 w-8 rounded-full"
									src={account["photoURL"]}
									alt=""
								/>
								</Menu.Button>
							</div>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
								<Menu.Item>
									{({ active }) => (
									<Link
										href="/profile"
									>
										<a
											className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
										>
											Your Profile
										</a>
									</Link>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
									<a
										href="#"
										className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
									>
										Settings
									</a>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
									<a
										href="#"
										className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
										onClick={logout}
									>
										Sign out
									</a>
									)}
								</Menu.Item>
								</Menu.Items>
							</Transition>
							</Menu>
						</div>
					: <div></div>}
					</div>
				</div>

				<Disclosure.Panel className="sm:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1">
					{navigation.map((item) => (
						<Disclosure.Button
						key={item.name}
						as="a"
						href={item.href}
						className={classNames(
							item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
							'block px-3 py-2 rounded-md text-base font-medium'
						)}
						aria-current={item.current ? 'page' : undefined}
						>
						{item.name}
						</Disclosure.Button>
					))}
					</div>
				</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}