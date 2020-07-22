import axios from 'axios'
import router from './router'

const CLIENT_ID =
  '691323965407-05s3r90hqiee3b7brkrr06h4162t0siq.apps.googleusercontent.com'

const isSignedIn = () => {
  const token = localStorage.getItem('token')
  return !!token
}

const signCommon = (url, form) => {
  return axios
    .post(url, form, {
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res => {
      if (res.data.msg) {
        return res.data.msg
      }
      const token = res.data.token
      localStorage.setItem('token', token)
      router.push({ name: 'home' })
    })
    .catch(err => err)
}

const signup = form => {
  return signCommon('/signup', form)
}

const signin = form => {
  return signCommon('/signin', form)
}

const passwordResetRequest = form => {
  return axios.post('/reset_password_request', form, {
    headers: {
      'Content-type': 'application/json'
    }
  })
}

const passwordReset = (form, token) => {
  return axios.post('/reset_password/' + token, form, {
    headers: {
      'Content-type': 'application/json'
    }
  })
}

const getCommon = url => {
  const token = localStorage.getItem('token')
  return axios
    .get(url, {
      headers: { 'X-access-token': token }
    })
    .then(res => {
      if (res.data.error) {
        router.push({
          name: 'error',
          params: { error: res.data.error }
        })
      } else {
        return res.data
      }
    })
    .catch(err => {
      router.push({
        name: 'error',
        params: { error: err }
      })
    })
}

const getNotes = () => {
  return getCommon('/notes')
}

const getNote = id => {
  return getCommon('/note/' + id)
}

const saveNote = note => {
  const token = localStorage.getItem('token')
  let method = null
  if (note.id === 0) {
    method = 'post'
  } else {
    method = 'put'
  }
  axios({
    url: '/save',
    method,
    headers: {
      'X-access-token': token,
      'Content-type': 'application/json'
    },
    data: note
  })
    .then(res => {
      if (res.data.error) {
        router.push({
          name: 'error',
          params: { error: res.data.error }
        })
      } else {
        router.push({
          name: 'home',
          params: { msg: 'Note saved.' }
        })
      }
    })
    .catch(err => {
      router.push({
        name: 'error',
        params: { error: err }
      })
    })
}

const delNoteServer = id => {
  const token = localStorage.getItem('token')
  return axios
    .delete('/delete/' + id, {
      headers: { 'X-access-token': token }
    })
    .then(res => res.data)
    .catch(err => {
      router.push({
        name: 'error',
        params: { error: err }
      })
    })
}

const delFolderServer = obj => {
  const token = localStorage.getItem('token')
  return axios
    .delete('/delete', {
      headers: {
        'X-access-token': token,
        'Content-type': 'application/json'
      },
      data: obj
    })
    .then(res => res.data)
    .catch(err => {
      router.push({
        name: 'error',
        params: { error: err }
      })
    })
}

export {
  CLIENT_ID,
  isSignedIn,
  signup,
  signin,
  passwordResetRequest,
  passwordReset,
  getNotes,
  getNote,
  saveNote,
  delNoteServer,
  delFolderServer
}
