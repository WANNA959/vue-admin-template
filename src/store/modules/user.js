import { logout, getInfo, register, authToken, resetpass, forget } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, remember } = userInfo
    return new Promise((resolve, reject) => {
      authToken({ username: username.trim(), password: password, code: code, rememberme: remember }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.accessToken)
        commit('SET_NAME', data.user.username)
        commit('SET_AVATAR', data.user.headerUrl)
        commit('SET_ID', data.user.id)
        setToken(data.accessToken)
        resolve(response)
        console.log('resolve')
      }).catch(error => {
        reject(error)
      })
    })
  },

  authToken({ commit }, data) {
    return new Promise((resolve, reject) => {
      authToken(data).then(response => {
        console.log(response.token)
        console.log(response)
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      console.log(userInfo)
      register(userInfo).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // commit('SET_TOKEN', data.accessToken)
        commit('SET_NAME', data.user.username)
        commit('SET_AVATAR', data.user.headerUrl)
        commit('SET_ID', data.user.id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  forget({ commit }, data) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      forget(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetpass({ commit }, data) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      resetpass(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(response => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    console.log('in resetToken')
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

