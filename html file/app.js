// Replace these with your Firebase project's config from the Firebase console!
const firebaseConfig = {
  apiKey: "AIzaSyBn-6_fM25GhTa_WvKA3HDjkpBqmDRuXFE",
  authDomain: "fir-task-manager-36ab7.firebaseapp.com",
  projectId: "fir-task-manager-36ab7",
  storageBucket: "fir-task-manager-36ab7.firebasestorage.app",
  messagingSenderId: "1093775456864",
  appId: "1:1093775456864:web:7c4babe31990b3071a6105"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = firebase.auth();
const db = firebase.firestore();

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const userStatus = document.getElementById('user-status');
const signOutBtn = document.getElementById('sign-out');

let currentUser = null;

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(doc => {
    const li = document.createElement('li');
    li.textContent = doc.data().text;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.classList.add('delete-task');
    delBtn.onclick = () => deleteTask(doc.id);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  db.collection('tasks').doc(id).delete();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    alert('Enter a task');
    return;
  }
  db.collection('tasks').add({ text, uid: currentUser.uid });
  taskInput.value = '';
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
signOutBtn.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    userStatus.textContent = Logged in as ${user.email};
    signOutBtn.style.display = 'block';
    db.collection('tasks').where('uid', '==', user.uid)
      .onSnapshot(snapshot => renderTasks(snapshot.docs));
  } else {
    userStatus.textContent = 'Not logged in. Sign in with Google below.';
    signOutBtn.style.display = 'none';
    taskList.innerHTML = '';
    // Use Google sign-in Popup
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(console.error);
  }
});
