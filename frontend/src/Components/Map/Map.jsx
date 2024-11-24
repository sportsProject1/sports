import React, { useEffect, useState } from 'react';

const Map = ({ latitude, longitude, onChange }) => {
  const [map, setMap] = useState(null); // 지도 객체 상태
  const [marker, setMarker] = useState(null); // 마커 객체 상태

  useEffect(() => {
    const mapScript = document.createElement('script');
    const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;

    // 카카오맵 API 스크립트를 비동기로 로드
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;

    // 문서의 head에 스크립트 추가
    document.head.appendChild(mapScript);

    // 카카오맵 API 로드 후 실행할 함수
    const onLoadKakaoMap = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map'); // 지도를 표시할 DOM 요소
          const mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude), // 주어진 위도, 경도 좌표로 지도 중심 설정
            level: 3, // 지도 확대 레벨
          };

          // 지도 생성
          const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(mapInstance); // 지도 객체 저장

          // 마커가 이미 존재하면 제거
          if (marker) {
            marker.setMap(null);
          }

          // 새로운 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude); // 마커 위치
          const newMarker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          // 마커 지도에 표시
          newMarker.setMap(mapInstance);
          setMarker(newMarker); // 새로운 마커 객체 상태에 저장

          // 마커 클릭 시 위치 변경 처리
          window.kakao.maps.event.addListener(mapInstance, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng; // 클릭된 위치의 위도, 경도
            const lat = latlng.getLat();
            const lng = latlng.getLng();

            // 부모 컴포넌트로 위치 정보 전달
            console.log('클릭된 위치:', lat, lng);
            if (onChange) onChange(lat, lng); // 부모 컴포넌트에 새로운 위치 전달
          });
        });
      }
    };

    // 스크립트 로드 완료 후 onLoadKakaoMap 실행
    mapScript.addEventListener('load', onLoadKakaoMap);

    // clean up 함수 (컴포넌트 언마운트 시)
    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
    };
  }, [latitude, longitude]); // 위도와 경도가 변경될 때마다 지도 재초기화

  return <div id="map" style={{ width: '50%', height: '300px' }}></div>;
};

export default Map;