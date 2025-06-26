import api from '../utils/axios.instance.js'

export async function checkUser () {
    const res = await api.get('/auth/profile');
    return res.data;
}