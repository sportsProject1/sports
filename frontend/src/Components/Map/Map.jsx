import React, { useEffect, useState } from 'react';

const Map = ({ latitude, longitude, onChange }) => {
  const [map, setMap] = useState(null); // 지도 객체 상태
  const [marker, setMarker] = useState(null); // 마커 객체 상태
  const [address, setAddress] = useState(""); // 주소 입력 상태
  const [kakaoLoaded, setKakaoLoaded] = useState(false); // 카카오맵 API 로드 상태
  const [addressSuggestions, setAddressSuggestions] = useState([]); // 자동완성 주소 목록

  useEffect(() => {
    const mapScript = document.createElement('script');
    const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;

    // 카카오맵 API 스크립트를 비동기로 로드
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;

    // 문서의 head에 스크립트 추가
    document.head.appendChild(mapScript);

    // 카카오맵 API 로드 후 실행할 함수
    const onLoadKakaoMap = () => {
      if (window.kakao) {
        setKakaoLoaded(true); // 카카오맵 API 로드 상태 변경

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
            marker.setMap(null); // 기존 마커 제거
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
            if (onChange) onChange(lat, lng); // 부모 컴포넌트에 새로운 위치 전달
          });
        });
      } else {
        console.error("카카오맵 API 로드 실패");
      }
    };

    // 스크립트 로드 완료 후 onLoadKakaoMap 실행
    mapScript.addEventListener('load', onLoadKakaoMap);

    // clean up 함수 (컴포넌트 언마운트 시)
    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
    };
  }, [latitude, longitude]); // 위도와 경도가 변경될 때마다 지도 재초기화

  // 주소 검색 함수
  const handleSearch = (address) => {
    if (!kakaoLoaded) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("카카오맵 서비스가 로드되지 않았습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표를 변환
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;

        // 새로운 위치로 지도와 마커 업데이트
        const newLatLng = new window.kakao.maps.LatLng(lat, lng);
        map.setCenter(newLatLng); // 지도 중심 변경

        // 기존 마커 제거 후 새로운 마커 표시
        if (marker) {
          marker.setMap(null); // 기존 마커 제거
        }
        const newMarker = new window.kakao.maps.Marker({
          position: newLatLng,
        });
        newMarker.setMap(map);

        setMarker(newMarker); // 새로운 마커 객체 상태에 저장

        // 부모 컴포넌트로 새 위치 전달
        if (onChange) onChange(lat, lng);
      } else {
        console.error("주소를 찾을 수 없습니다.");
        alert("주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.");
      }
    });
  };

  // 자동완성 기능 (주소 입력시 자동으로 주소 추천)
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (window.kakao) {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(e.target.value, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setAddressSuggestions(data); // 주소 자동완성 결과 업데이트
        } else {
          setAddressSuggestions([]); // 검색 결과 없을 경우
        }
      });
    }
  };

  // 자동완성 주소 선택 시
  const handleSuggestionClick = (suggestion) => {
    const selectedPlace = suggestion.place_name; // 자동완성된 장소 선택

    // 해당 장소의 좌표를 바로 얻을 수 있도록 places.search를 사용
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(selectedPlace, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0]; // 검색된 첫 번째 장소
        const address = place.address_name; // 장소의 정확한 주소
        setAddress(address); // 주소 입력란에 자동완성된 주소 설정
        setAddressSuggestions([]); // 자동완성 목록 비우기

        // 해당 주소로 재검색
        handleSearch(address);
      } else {
        console.error("장소 정보를 가져올 수 없습니다.");
      }
    });
  };

  // 엔터키로 검색하기
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && addressSuggestions.length > 0) {
      // 자동완성 목록에서 첫 번째 항목 선택
      handleSuggestionClick(addressSuggestions[0]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange} // 주소 입력 상태 관리
        onKeyDown={handleKeyDown} // 엔터키 처리
        placeholder="주소를 입력하세요"
      />
      <button onClick={() => handleSearch(address)}>검색</button>

      {/* 자동완성 주소 리스트 */}
      {addressSuggestions.length > 0 && (
        <ul>
          {addressSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}

      <div id="map" style={{ width: '50%', height: '400px' }}></div>
    </div>
  );
};

export default Map;