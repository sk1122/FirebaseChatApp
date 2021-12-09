import * as firebase from "firebase/app";
import { getDatabase, ref, set, get, child, serverTimestamp } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { MD5 } from "./MD5";

export default class Firebase {
	constructor() {
		const firebaseConfig = {
			apiKey: "AIzaSyAa0p6sLIBvRGsCDGKwwykUAoNllGPZAyo",
			authDomain: "chat-app-595d1.firebaseapp.com",
			projectId: "chat-app-595d1",
			storageBucket: "chat-app-595d1.appspot.com",
			messagingSenderId: "16967078319",
			appId: "1:16967078319:web:bd6190a202e681bb9d5f5a",
			measurementId: "G-Z23Q7JR0SP",
			databaseURL: "https://chat-app-595d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
		};
	
		// Initialize Firebase
		this.app = firebase.initializeApp(firebaseConfig);
		// const analytics = getAnalytics(app);
		this.db = getDatabase(this.app)
		this.dbRef = ref(this.db)
	}
	
	signIn = async (setAccount, setIsAuthenticated, newError) => {
		const provider = new GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		
		const auth = getAuth();
		signInWithPopup(auth, provider)
		.then(async (result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;

				const user = result.user;
				const valueSnapshot = await get(child(this.dbRef, `users/${user.uid}`))
				const userValue = valueSnapshot.exists() ? valueSnapshot.val() : {};
				const {providerData, stsTokenManager, ...userData} = JSON.parse(JSON.stringify(user))
				await set(ref(this.db, `users/${user.uid}`), userData)
				// console.log(userData)
				setAccount(user)
				setIsAuthenticated(true)
			}).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				const email = error.email;
				console.log(errorCode, errorMessage, email)
				const credential = GoogleAuthProvider.credentialFromError(error);
				
				setAccount("")
				setIsAuthenticated(false)
				newError(JSON.stringify(error))
			});
	}
	
	signOutGoogle = (setAccount, setIsAuthenticated, newError) => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				setAccount({})
				setIsAuthenticated(false)
			}).catch((error) => {
				newError(JSON.stringify(error))
			});
	}

	createChatRoom(chatId, user1, user2) {
		set(ref(this.db, 'chatRooms/' + chatId), {
			user1: user1,
			user2: user2
		});
	}
	
	async getChatRoom(chatId) {
		const valueSnapshot = await get(child(this.dbRef, `chatRooms/${chatId}`))
		const data = valueSnapshot.exists() ? valueSnapshot.val() : {};
		return data
	}

	get_or_create = async (chatId, user1, user2) => {
		const valueSnapshot = await get(child(this.dbRef, `chatRooms/${chatId}`))
		const chatValue = valueSnapshot.exists() ? valueSnapshot.val() : {};
		await set(ref(this.db, `chatRooms/${chatId}`), {
			user1: user1,
			user2: user2
		})
		
	}

	async getUser(uid) {
		console.log(uid)
		const valueSnapshot = await get(child(this.dbRef, `users/`))
		const data = valueSnapshot.exists() ? valueSnapshot.val() : {};
		return Object.entries(data).map(async (value) => {
			console.log(value[1].uid)
			if(value[1].uid === uid) return value
		})
	}

	async getMsgs(chatId) {
		const valueSnapshot = await get(child(this.dbRef, `messages/${chatId}`))
		const data = valueSnapshot.exists() ? valueSnapshot.val() : {};
		return data
	}

	async addMsg(chatId, msg, user) {
		const date_time = new Date().toISOString()
		const hash = MD5(date_time + user + msg)
		const valueSnapshot = await get(child(this.dbRef, `messages/${chatId}`))
		const chatValue = valueSnapshot.exists() ? valueSnapshot.val() : {};
		await set(ref(this.db, `messages/${chatId}/${hash}`), {
			user: user,
			msg: msg,
			date_time: date_time
		})
	}

	async checkIfOnline(uid) {
		// Create a reference to this user's specific status node.
		// This is where we will store data about being online/offline.
		var userStatusDatabaseRef = ref(this.db, '/status/' + uid);

		// We'll create two constants which we will write to 
		// the Realtime database when this device is offline
		// or online.
		var isOfflineForDatabase = {
			state: 'offline',
			last_changed: serverTimestamp(),
		};

		var isOnlineForDatabase = {
			state: 'online',
			last_changed: serverTimestamp(),
		};

		// Create a reference to the special '.info/connected' path in 
		// Realtime Database. This path returns `true` when connected
		// and `false` when disconnected.
		ref(this.db, '.info/connected').on('value', function(snapshot) {
			// If we're not currently connected, don't do anything.
			console.log(snapshot.val())
			if (snapshot.val() == false) {
				return;
			};
			console.log(snapshot.val())
			// If we are currently connected, then use the 'onDisconnect()' 
			// method to add a set which will only trigger once this 
			// client has disconnected by closing the app, 
			// losing internet, or any other means.
			userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
				// The promise returned from .onDisconnect().set() will
				// resolve as soon as the server acknowledges the onDisconnect() 
				// request, NOT once we've actually disconnected:
				// https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

				// We can now safely set ourselves as 'online' knowing that the
				// server will mark us as offline once we lose connection.
				userStatusDatabaseRef.set(isOnlineForDatabase);
			});
		});
	}
}