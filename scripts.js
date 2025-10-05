import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7ogSW6DXC_Ei_mkUoVaPZeSu6oaaDIVI",
  authDomain: "diddevdo.firebaseapp.com",
  projectId: "diddevdo",
  storageBucket: "diddevdo.firebasestorage.app",
  messagingSenderId: "243109659975",
  appId: "1:243109659975:web:e5d7f7f27d0c1253263862",
  measurementId: "G-ZDVC2H7PV3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => window.location = 'profile.html')
    .catch(error => alert(error.message));
}

function logIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location = 'profile.html')
    .catch(error => alert(error.message));
}

function logOut() {
  signOut(auth).then(() => window.location = 'login.html');
}

function uploadVideo() {
  const file = document.getElementById('videoFile').files[0];
  const title = document.getElementById('title').value;
  const user = auth.currentUser;
  if(file && user) {
    const storageRef = ref(storage, `videos/${file.name}`);
    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(storageRef).then(url => {
        addDoc(collection(db, "videos"), {
          title: title,
          url: url,
          userId: user.uid,
          timestamp: serverTimestamp()
        });
        alert("Video uploaded!");
        document.getElementById('title').value = '';
        document.getElementById('videoFile').value = '';
      });
    });
  }
}

function loadVideos() {
  const q = query(collection(db, "videos"), orderBy("timestamp", "desc"));
  onSnapshot(q, snapshot => {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const video = doc.data();
      container.innerHTML += `
        <div class="video-card">
          <video controls src="${video.url}"></video>
          <h3>${video.title}</h3>
        </div>
      `;
    });
  });
}

onAuthStateChanged(auth, user => {
  if(user && document.getElementById('userEmail')) {
    document.getElementById('userEmail').innerText = user.email;
  }
});
