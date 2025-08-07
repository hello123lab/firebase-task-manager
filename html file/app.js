// Replace these with your Firebase project's config from the Firebase console!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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