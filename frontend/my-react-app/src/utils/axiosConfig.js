import axios from "axios";

const MyAxios = axios.create({
	baseURL: "http://172.20.10.8:8082/",
});

MyAxios.interceptors.request.use((request) => {
	const token = localStorage.getItem("token");
	// console.log("token envoyer", token);
	if (token) {
		request.headers.Authorization = `Bearer ${token}`;
	}
//   console.log('====================================');
//   console.log(token);
//   console.log('====================================');
	return request;
});

MyAxios.interceptors.response.use(
	(response) => {
		if (response.data.token) {
			console.log("Token received:", response.data.token);
			localStorage.setItem("token", response.data.token);
		}
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
		}
		return Promise.reject(error);
	}
);

export default MyAxios;