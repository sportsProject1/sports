import { useEffect, useState } from "react";
import { fetchTokenData } from "../Server/ApiService";

function useLikeStatus(targetIds, targetType, targetTypePath) {
    const [likeStatus, setLikeStatus] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                if (targetIds.length > 0) {
                    const response = await fetchTokenData(
                        `/${targetTypePath}/likes/status?targetType=${targetType}&targetIds=${targetIds.join(",")}`
                    );
                    setLikeStatus(response.data); // 서버에서 반환된 좋아요 상태를 저장
                }
            } catch (err) {
                setError(err);
                console.error("좋아요 상태 로딩 중 오류:", err);
            }
        };

        fetchLikeStatus();
    }, [targetIds, targetType, targetTypePath]);

    return { likeStatus, error };
}

export default useLikeStatus;