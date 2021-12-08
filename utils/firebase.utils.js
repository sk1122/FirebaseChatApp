import * as firebase from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

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

	async getUser(email) {
		const valueSnapshot = await get(child(this.dbRef, `users/`))
		const data = valueSnapshot.exists() ? valueSnapshot.val() : {};
		return Object.entries(data).map(async (value) => {
			if(value[1]["email"] === email) {
				return value[0]
			}
		})
		// console.log(promises)
		// await Promise.all(promises).then((value) => {
		// 		return value
		// 	}
		// );
	}
}