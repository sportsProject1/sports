import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8090', // API의 기본 URL
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") // 로컬스토리지에서 토큰 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리 또는 응답 전처리
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refreshToken");

        // 401 에러가 발생하고 리프레시 토큰이 있을 때만 갱신 시도
        if (error.response && error.response.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;  // 무한 루프 방지

            try {
                // 리프레시 토큰으로 새로운 액세스 토큰 요청
                const response = await axios.post('http://localhost:8090/refresh',
                    { refreshToken : refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                // 새 토큰을 로컬 스토리지에 저장
                const newToken = response.data.accessToken;
                localStorage.setItem("token", newToken);

                // 갱신된 토큰으로 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                // 갱신 실패 시 콘솔 출력 및 실패 처리
                console.log("리프레시 실패", err);
                // 필요 시 로컬 스토리지의 토큰 삭제
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                // 로그아웃 처리 등의 추가 로직을 여기에 추가할 수 있음
            }
        }

        return Promise.reject(error);
    }
);

const apiNoToken = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
})

export { api,apiNoToken};
