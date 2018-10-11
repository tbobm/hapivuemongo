import axios from 'axios';

export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.auth || !store.state.auth.token) {
    store.commit('update', null);
    return redirect('/login')
  }

  axios.post(`http://localhost:8000/token`, {token: store.state.auth.token})
    .then((res) => {
      if (!res.data || res.data.error){
        store.commit('update', null);
        return redirect('/login')
      }
      store.commit('update', res.data);
    })
}
