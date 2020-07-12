import Vue from 'vue'
import { LoaderPlugin } from 'vue-google-login'
import axios from 'axios'
import router from './router'

Vue.use(LoaderPlugin, {
  client_id:
    '691323965407-j0d8hin5iv5jpphq22nkg098a60l0e2g.apps.googleusercontent.com'
})

const isSignedIn = () => {
  return Vue.GoogleAuth.then(auth2 => auth2.isSignedIn.get())
}

const accessServer = () => {
  return Vue.GoogleAuth.then(auth2 => {
    const googleUser = auth2.currentUser.get()
    const authData = googleUser.getAuthResponse()
    return authData.id_token
  })
}

const getCommon = url => {
  return accessServer().then(data => {
    return axios
      .get(url, {
        headers: { 'X-id-token': data }
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
  })
}

const getNotes = () => {
  return getCommon('/notes')
}

const getNote = id => {
  return getCommon('/note/' + id)
}

const saveNote = note => {
  let method = null
  if (note.id === 0) {
    method = 'post'
  } else {
    method = 'put'
  }
  accessServer().then(data => {
    axios({
      url: '/save',
      method,
      headers: {
        'X-id-token': data,
        'Content-type': 'application/json'
      },
      data: JSON.stringify(note)
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
  })
}

const delNoteServer = id => {
  return accessServer().then(data => {
    return axios
      .delete('/delete/' + id, {
        headers: { 'X-id-token': data }
      })
      .then(res => res.data)
      .catch(err => {
        router.push({
          name: 'error',
          params: { error: err }
        })
      })
  })
}

const delFolderServer = obj => {
  return accessServer().then(data => {
    return axios
      .delete('/delete', {
        headers: {
          'X-id-token': data,
          'Content-type': 'application/json'
        },
        data: JSON.stringify(obj)
      })
      .then(res => res.data)
      .catch(err => {
        router.push({
          name: 'error',
          params: { error: err }
        })
      })
  })
}

export {
  isSignedIn,
  getNotes,
  getNote,
  saveNote,
  delNoteServer,
  delFolderServer
}
