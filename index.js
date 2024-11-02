const form = document.querySelector('.form')
const loginForm = document.getElementById('login-form')
const postForm = document.getElementById('post-form')
const container = document.getElementById('container')

const signupMessage = document.createElement('div')
const loginMessage = document.createElement('div')
const title = document.querySelector('.signup__title')
const text = document.querySelector('.text')

const emailValidMessage = document.createElement('span')
const passValidMessage = document.createElement('span')

const changebtn = document.getElementById('loginLink')
const logoutBtn = document.getElementById('logout-button')

// Проверка. Была ли авторизация раньше
document.addEventListener('DOMContentLoaded', () => {
  const existingUsers = localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users'))
    : []
  const emailValue = localStorage.getItem('users')
    ? localStorage.getItem('loggedInUser')
    : []
  const userExist = existingUsers.some(user => user.email === emailValue)
  if (userExist) {
    form.style.display = 'none'
    loginForm.style.display = 'none'
    text.style.display = 'none'

    postForm.style.display = 'block'
    container.style.display = 'flex'
    logoutBtn.style.display = 'unset'
    renderTasks()
  }
})
// Регистрация
form.addEventListener('submit', e => {
  e.preventDefault()
  const emailValue = e.target['email'].value
  const passwordValue = e.target['password'].value

  const existingUsers = localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users'))
    : []
  const userExist = existingUsers.some(user => user.email === emailValue)

  const chekEmailValid = chekEmailValidation(e.target['email'])
  const chekPassValid = chekPasswordValidation(e.target['password'])

  if (userExist) {
    showMassage('User exists', 'red')
  } else if (chekEmailValid && chekPassValid) {
    // Добавляем нового пользователя в массив и сохраняем в Local Storage
    const newUser = {
      email: emailValue,
      password: passwordValue,
      userTasks: [],
    }
    existingUsers.push(newUser)
    localStorage.setItem('users', JSON.stringify(existingUsers))

    e.target.reset()
    showMassage('You have registered successfully!', 'green')

    form.style.display = 'none'
    loginForm.style.display = 'flex'
    title.textContent = 'You have registered'
    title.style.fontSize = '24px'
  } else {
    showMassage('Incorrect value(s)', 'red')
  }
})
// переход на вход
changebtn.addEventListener('click', () => {
  form.style.display = 'none'
  loginForm.style.display = 'flex'
  title.textContent = 'Sign in'
})
// Авторизация
loginForm.addEventListener('submit', e => {
  e.preventDefault()
  const emailValue = e.target['loginEmail'].value
  const passwordValue = e.target['loginPassword'].value

  const existingUsers = localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users'))
    : []

  const user = existingUsers.find(user => user.email === emailValue)
  if (user && user.password === passwordValue) {
    localStorage.setItem('loggedInUser', emailValue)

    text.style.display = 'none'
    loginForm.style.display = 'none'
    logoutBtn.style.display = 'unset'
    postForm.style.display = 'block'
    container.style.display = 'flex'
    renderTasks()
    title.textContent = 'You are logged in'
  } else {
    showMassageLogin('Invalid email or password', 'red')
  }
})
// Logout
logoutBtn.addEventListener('click', () => {
  form.style.display = 'flex'
  text.style.display = 'unset'
  postForm.style.display = 'none'
  container.style.display = 'none'
  logoutBtn.style.display = 'none'
  localStorage.removeItem('loggedInUser')
})
// добавление таскс
postForm.addEventListener('submit', e => {
  e.preventDefault()
  let todos = JSON.parse(localStorage.getItem('users')) || []
  const loggedEmail = localStorage.getItem('loggedInUser')

  const titleValue = e.target['title'].value
  const descripValue = e.target['description'].value
  const newTask = { title: titleValue, description: descripValue }

  const userIndex = todos.findIndex(user => user.email === loggedEmail)
  if (userIndex !== -1) {
    todos[userIndex].userTasks.push(newTask)
    localStorage.setItem('users', JSON.stringify(todos))
    container.style.display = 'flex'
    renderTasks()
    e.target.reset()
  }
})

function renderTasks() {
  container.innerHTML = ''
  let todos = JSON.parse(localStorage.getItem('users')) || []
  const loggedEmail = localStorage.getItem('loggedInUser')
  const loggedUser = todos.find(user => user.email === loggedEmail)

  if (loggedUser) {
    loggedUser.userTasks.forEach(task => {
      const list = document.createElement('dl')
      const listTitle = document.createElement('dt')
      const listDescription = document.createElement('dd')

      listTitle.innerText = task.title
      listDescription.innerText = task.description
      list.append(listTitle, listDescription)
      container.append(list)
    })
  }
}
// Вывод сообщения в конце формы
function showMassage(string, color) {
  signupMessage.innerText = string
  signupMessage.style.color = color
  form.insertAdjacentElement('beforeend', signupMessage)
}

// Вывод сообщения об авторизации
function showMassageLogin(string, color) {
  loginMessage.innerText = string
  loginMessage.style.color = color
  loginForm.insertAdjacentElement('beforeend', loginMessage)
}

// Валидация EMAIL
function chekEmailValidation(email) {
  emailValidMessage.innerText = ''
  emailValidMessage.style.color = 'red'
  email.insertAdjacentElement('afterend', emailValidMessage)
  const re = /^(?=.*[A-Za-z])(?=.*@)[A-Za-z0-9@]+$/
  if (email.value.length < 5) {
    emailValidMessage.innerText = 'Должно быть минимум 5 символов'
  } else if (!email.value.includes('@')) {
    emailValidMessage.innerText = 'Должен быть символ "@"'
  } else if (!email.value.match(re)) {
    emailValidMessage.innerText =
      'Имя должно содержать только латинские буквы и цифры, и хотя бы одну букву'
  } else {
    return true
  }
}

// Валидация PASSWORD
function chekPasswordValidation(password) {
  passValidMessage.innerText = ''
  passValidMessage.style.color = 'red'
  password.insertAdjacentElement('afterend', passValidMessage)
  if (password.value.length > 26) {
    passValidMessage.innerText = 'Должен быть не больше 26 символов'
  } else if (password.value.length < 8) {
    passValidMessage.innerText = 'Должен быть минимум 8 символов'
  } else {
    return true
  }
}
