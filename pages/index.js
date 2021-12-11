import Head from 'next/head'
import { useEffect } from 'react'
import { useAppContext } from './_context'
import useState from "react-usestateref"

import Navbar from '../components/navbar'
import Form from '../components/form'
import Online from '../components/Online'
import Firebase from '../utils/firebase.utils'
import { getDatabase, ref, onValue, get, child, set, onChildAdded } from "firebase/database";

export default function Home() {
  let { error, newError } = useAppContext()
  const firebase = new Firebase()
	const [account, setAccount, accountRef] = useState([])
	const [isAuthenticated, setIsAuthenticated, isAuthenticatedRef] = useState(false)
	const [user, setUser, userRef] = useState({})
  
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

  useEffect(() => {
    console.log(error, "Dsa")
  }, [error])

  useEffect(() => {
    (async () => {
      await setTimeout(() => {}, 10000)
      setUser({})
      setAccount(JSON.parse(localStorage.getItem('account')))
      setIsAuthenticated(JSON.parse(localStorage.getItem('isAuthenticated')))
      try {
        firebase.checkIfOnline(accountRef.current["uid"])
      } catch(e) {
        return
      }
    })()
  }, [])
  
  return (
    <>
      <Head>
        <title>Chat App</title>
      </Head>
      <div className='flex flex-col justify-center items-center'>
        <Navbar />
        <Form />
        <Online />
      </div>
    </>
  )
}
