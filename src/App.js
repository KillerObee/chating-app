import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyDC3tC28UEqpPq4TPLJ8F8qIrKgifOhOnw",
  authDomain: "chating-app-d85b4.firebaseapp.com",
  projectId: "chating-app-d85b4",
  storageBucket: "chating-app-d85b4.appspot.com",
  messagingSenderId: "349955803239",
  appId: "1:349955803239:web:c6dbcce83f7ef885a6acc2",
  measurementId: "G-6XXLBL31W1"
});

const auth = firebase.auth();

/*
const auth = getAuth();

window.recaptchaVerifier = new RecaptchaVerifier('connexion-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  }
}, auth);

const appVerifier = window.recaptchaVerifier;

signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS envoyé. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      // Error; SMS not envoyé
      // ...
    });

    const code = getCodeFromUserInput();
confirmationResult.confirm(code).then((result) => {
  // User signed in successfully.
  const user = result.user;
  // ...
}).catch((error) => {
  // User couldn't sign in (bad verification code?)
  // ...
});

*/

const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Chat App MKSABLAMB</h1>
        <Deconnexion />
      </header>

      <section>
        {user ? <ChatRoom /> : <Connexion />}
      </section>

    </div>
  );
}

function Connexion() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="connexion" onClick={signInWithGoogle}>Connectez-vous Avec Google</button>
      <p>Soyez gentils, sinon vous pouvez vous faire banir!</p>
    </>
  )

}

function Deconnexion() {
  return auth.currentUser && (
    <button className="deconnexion" onClick={() => auth.Deconnexion()}>Deconnexion</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('CreeLe').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const envoiMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      CreeLe: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={envoiMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Dites Bonjour!" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'envoye' : 'recu';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;