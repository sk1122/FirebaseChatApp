import * as firebase from "firebase/app";
import { getDatabase, ref, set, get, child, onValue, onDisconnect, orderByChild } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { MD5 } from "./MD5";

export default class Firebase {
	constructor() {
		const firebaseConfig = {
			apiKey: process.env.NEXT_PUBLIC_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
			projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
			storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
			messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
			appId: process.env.NEXT_PUBLIC_APP_ID,
			measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
			databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
			// apiKey: "AIzaSyAa0p6sLIBvRGsCDGKwwykUAoNllGPZAyo",
			// authDomain: "chat-app-595d1.firebaseapp.com",
			// projectId: "chat-app-595d1",
			// storageBucket: "chat-app-595d1.appspot.com",
			// messagingSenderId: "16967078319",
			// appId: "1:16967078319:web:bd6190a202e681bb9d5f5a",
			// measurementId: "G-Z23Q7JR0SP",
			// databaseURL: "https://chat-app-595d1-default-rtdb.asia-southeast1.firebasedatabase.app/"
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
			date_time: date_time,
			is_sent: true,
			is_delivered: false,
			is_seen: false
		})
	}

	async setAllMsgDelivered(uid) {
		console.log("321321")
		ref(this.db, 'chatRooms/').orderByChild('user1').equalTo(uid).on("value", (snap) => {
			console.log(snap.val(), ' ', uid)
		})
		ref(this.db, 'chatRooms/').orderByChild('user2').equalTo(uid).on("value", (snap) => {
			console.log(snap.val(), " ", uid)
		})
	}

	async checkIfOnline(uid) {
		if(!uid) return
		console.log(uid)
		const connectedRef = ref(this.db, ".info/connected");

		const valueSnapshot = await get(child(this.dbRef, `users/${uid}`))
		const {online, ...data} = valueSnapshot.exists() ? valueSnapshot.val() : {};

		onValue(connectedRef, async (snap) => {
			if (snap.val() == false) {
				return;
			};
			onDisconnect(ref(this.db, `/users/${uid}`)).set({online: false, ...data})
				.then(async () => {
					await set(ref(this.db, `/users/${uid}`), { online: true, ...data })
				})
		});
	}

	async get_from_database(route) {
		const valueSnapshot = await get(child(this.dbRef, route))
		const data = valueSnapshot.exists() ? valueSnapshot.val() : {};
		return data
	}

	async update_sent(route, send_data) {
		const valueSnapshot = await get(child(this.dbRef, route))
		const { is_sent, is_delivered, data} = valueSnapshot.exists() ? valueSnapshot.val() : {};
		print(data, "jhjhjhjhj")
		await set(ref(this.db, route), {
			...send_data,
			...data
		})
	}
}