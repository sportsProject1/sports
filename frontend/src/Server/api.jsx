import axios from 'axios';

// 기본 axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, // API의 기본 URL .env 파일에 정의
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

// 요청 인터셉터: 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) // 요청 에러 처리
);

// 응답 인터셉터: 에러 처리 및 토큰 갱신
api.interceptors.response.use(
    (response) => response, // 정상적인 응답을 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 401 에러가 발생하고 리프레시 토큰이 있을 때만 갱신 시도
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    // 리프레시 토큰으로 새로운 액세스 토큰 요청
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/refresh`,
                        { refreshToken: refreshToken },
                        { headers: { 'Content-Type': 'application/json' } }
                    );

                    const newToken = response.data.accessToken;
                    localStorage.setItem("token", newToken); // 새 토큰을 로컬 스토리지에 저장

                    // 원래 요청의 Authorization 헤더 업데이트
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // 갱신된 토큰으로 원래 요청 재시도
                    return api(originalRequest);
                }
            } catch (err) {
                // 리프레시 토큰 갱신 실패 시 처리
                console.error("리프레시 토큰 갱신 실패:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
            }
        }

        return Promise.reject(error); // 다른 에러는 그대로 반환
    }
);

// 인증이 필요 없는 요청을 위한 axios 인스턴스 생성
const apiNoToken = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

export { api, apiNoToken };
