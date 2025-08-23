import { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

interface AddressSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  id?: string;
  name?: string;
}

interface AddressData {
  address: string;
  roadAddress: string;
  jibunAddress: string;
  zoneCode: string;
  lat: number;
  lng: number;
}

// 카카오맵 관련 타입 정의
interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoGeocoderResult {
  address: {
    address_name: string;
    zone_no: string;
  };
  road_address?: {
    address_name: string;
  };
}

// 장소 검색 결과 타입
interface KakaoPlaceResult {
  x: string; // 경도
  y: string; // 위도
  place_name: string;
  address_name: string;
  road_address_name?: string;
}

// 전역 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        event: {
          addListener: (target: KakaoMap, type: string, handler: (event: KakaoMapEvent) => void) => void;
        };
        services: {
          Status: {
            OK: string;
          };
          Geocoder: new () => {
            coord2Address: (lng: number, lat: number, callback: (result: KakaoGeocoderResult[], status: string) => void) => void;
          };
          Places: new () => {
            keywordSearch: (keyword: string, callback: (results: KakaoPlaceResult[], status: string) => void) => void;
          };
        };
      };
    };
  }
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
}

interface KakaoMapEvent {
  latLng: KakaoLatLng;
}

const AddressSelector = ({ value, onChange, required = false, id, name }: AddressSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<KakaoMap | null>(null);
  const marker = useRef<KakaoMarker | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 카카오맵 로드 상태 확인 (스크립트가 이미 로드되어 있음)
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao.maps && 
          window.kakao.maps.LatLng && window.kakao.maps.Map &&
          window.kakao.maps.services && window.kakao.maps.services.Geocoder &&
          window.kakao.maps.services.Places) {
        console.log('카카오맵 및 서비스 준비 완료');
        setIsMapLoaded(true);
      } else {
        console.log('카카오맵 아직 준비되지 않음, 1초 후 재시도');
        setTimeout(checkKakaoMap, 1000);
      }
    };

    checkKakaoMap();
  }, []);

  // Enter 키 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        
        if (isSearchFocused) {
          // 검색창에 포커스가 있으면 검색 실행
          searchPlaces(searchKeyword);
        } else if (selectedAddress) {
          // 주소가 선택된 상태면 주소 선택 실행
          handleAddressSelect();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSearchFocused, selectedAddress, searchKeyword]);

  // 지도 초기화
  const initMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.log('지도 초기화 조건 미충족');
      return;
    }

    try {
      const options: KakaoMapOptions = {
        center: new window.kakao.maps.LatLng(37.468097, 127.039248), // 양재aT센터
        level: 3
      };

      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
      console.log('지도 생성 성공');

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: KakaoMapEvent) => {
        const latlng = mouseEvent.latLng;
        updateMarker(latlng);
        getAddressFromCoords(latlng);
      });
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  };

  // 지도가 열릴 때 초기화
  useEffect(() => {
    if (isOpen && isMapLoaded) {
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMapLoaded]);

  // 키워드로 장소 검색
  const searchPlaces = (keyword: string) => {
    if (!window.kakao || !window.kakao.maps || !mapInstance.current) {
      console.log('검색 조건 미충족');
      setSearchMessage('지도가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!keyword.trim()) {
      console.log('검색어가 비어있음');
      setSearchMessage('검색어를 입력해주세요.');
      return;
    }

    try {
      const places = new window.kakao.maps.services.Places();
      
      places.keywordSearch(keyword, (results: KakaoPlaceResult[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && results.length > 0) {
          console.log('검색 결과:', results);
          
          // 첫 번째 결과로 지도 중심 이동
          const place = results[0];
          const latlng = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
          
          mapInstance.current?.setCenter(latlng);
          updateMarker(latlng);
          getAddressFromCoords(latlng);
          
          // 검색어 초기화 및 성공 메시지
          setSearchKeyword('');
          setSearchMessage('검색 완료! 지도에서 위치를 확인하세요.');
          
          // 3초 후 메시지 제거
          setTimeout(() => setSearchMessage(''), 3000);
        } else {
          console.log('검색 결과 없음');
          setSearchMessage('검색 결과가 없습니다. 다른 키워드로 검색해보세요.');
        }
      });
    } catch (error) {
      console.error('장소 검색 실패:', error);
      setSearchMessage('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 마커 업데이트
  const updateMarker = (latlng: KakaoLatLng) => {
    if (!window.kakao || !mapInstance.current) return;

    try {
      if (marker.current) {
        marker.current.setMap(null);
      }

      const markerOptions: KakaoMarkerOptions = {
        position: latlng
      };

      marker.current = new window.kakao.maps.Marker(markerOptions);
      marker.current.setMap(mapInstance.current);
    } catch (error) {
      console.error('마커 업데이트 실패:', error);
    }
  };

  // 좌표로 주소 가져오기
  const getAddressFromCoords = (latlng: KakaoLatLng) => {
    if (!window.kakao) return;

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: KakaoGeocoderResult[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const addressData: AddressData = {
            address: result[0].address.address_name,
            roadAddress: result[0].road_address?.address_name || result[0].address.address_name,
            jibunAddress: result[0].address.address_name,
            zoneCode: result[0].address.zone_no || '',
            lat: latlng.getLat(),
            lng: latlng.getLng()
          };
          
          setSelectedAddress(addressData);
        }
      });
    } catch (error) {
      console.error('좌표-주소 변환 실패:', error);
    }
  };

  // 주소 선택 완료
  const handleAddressSelect = () => {
    if (selectedAddress) {
      const displayAddress = selectedAddress.roadAddress || selectedAddress.address;
      onChange(displayAddress);
      setIsOpen(false);
      setSelectedAddress(null);
    }
  };

  // 주소 초기화
  const handleClear = () => {
    onChange('');
    setSelectedAddress(null);
    if (marker.current) {
      try {
        marker.current.setMap(null);
      } catch (error) {
        console.error('마커 제거 실패:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 주소 입력 필드 */}
      <div className="flex flex-col lg:flex-row gap-2">
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="지도에서 위치를 선택하세요"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          readOnly
          required={required}
        />
        <div className="mt-2 flex gap-2 lg:flex-shrink-0">
          {/* 지도에서 선택 – 연한(톤 다운) 그라데이션 + h-12 */}
          <Button
            variant="secondary"
            onClick={() => setIsOpen(true)}
            className="flex-1 lg:flex-none whitespace-nowrap inline-flex items-center justify-center gap-2
                      rounded-xl !h-12 !min-h-0 px-5 py-0 leading-none
                      bg-gradient-to-b from-[#cfe89b]/90 via-[#8fd77e]/90 to-[#19c6d3]/90
                      text-white text-sm font-semibold
                      shadow-[0_4px_10px_rgba(16,185,129,0.12)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200
                      disabled:opacity-70 transition-all"
            disabled={!isMapLoaded}
          >
            지도에서 선택
          </Button>

          {/* 초기화 – 글자 더 잘 보이게(!text-*) + h-12 + 아웃라인 */}
          {value && (
            <Button
              variant="warning"
              onClick={handleClear}
              className="flex-1 lg:flex-none whitespace-nowrap inline-flex items-center justify-center gap-2
                        rounded-xl !h-12 !min-h-0 px-4 py-0 leading-none
                        bg-white !text-emerald-700
                        ring-1 ring-emerald-200 hover:bg-emerald-50 active:bg-emerald-100
                        shadow-none transition-colors"
            >
              초기화
            </Button>
          )}
        </div>
      </div>

      {/* 지도 팝업 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">지도에서 위치 선택</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* 검색 입력 필드 */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="장소명, 주소, 건물명으로 검색 (예: 강남역, 코엑스, 서울시청)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-gray-400"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
            <Button 
              onClick={() => searchPlaces(searchKeyword)}
              className="whitespace-nowrap rounded-xl h-10 px-4 py-0 leading-none
                        bg-gradient-to-b from-[#cfe89b]/90 via-[#8fd77e]/90 to-[#19c6d3]/90
                        text-white text-sm font-semibold
                        shadow-[0_3px_8px_rgba(16,185,129,0.15)]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200
                        hover:brightness-105 active:brightness-95 transition-all"
            >
              검색
            </Button>
              </div>
              
              {/* 검색 메시지 표시 */}
              {searchMessage && (
                <div className={`mt-2 p-2 rounded-md text-sm ${
                  searchMessage.includes('완료') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : searchMessage.includes('오류') || searchMessage.includes('실패')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {searchMessage}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                Enter 키를 누르거나 검색 버튼을 클릭하세요
              </p>
            </div>
            
            {/* 지도 */}
            <div 
              ref={mapRef} 
              className="w-full h-96 mb-4 border border-gray-300 rounded-md"
            />
            
            {/* 선택된 주소 정보 */}
            {selectedAddress && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-bold mb-2">선택된 주소</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-bold">도로명:</span> {selectedAddress.roadAddress}</p>
                  <p><span className="font-bold">지번:</span> {selectedAddress.jibunAddress}</p>
                  <p><span className='font-bold'>좌표:</span> {selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}</p>
                </div>
              </div>
            )}
            
            {/* 버튼 */}
            <div className="flex justify-end gap-2">
              {/* 취소: 아웃라인 + 글자 선명 */}
              <Button
                onClick={() => setIsOpen(false)}
                className="rounded-xl h-10 px-4 py-0 leading-none
                          bg-white !text-emerald-700
                          ring-1 ring-emerald-200 hover:bg-emerald-50 active:bg-emerald-100
                          shadow-none transition-colors"
              >
                취소
              </Button>

              {/* 주소 선택: 선택됨일 때만 그라데이션, 아니면 Dimmed */}
              {selectedAddress ? (
                <Button
                  onClick={handleAddressSelect}
                  className="rounded-xl h-10 px-5 py-0 leading-none
                            bg-gradient-to-b from-[#cfe89b]/90 via-[#8fd77e]/90 to-[#19c6d3]/90
                            text-white font-semibold
                            shadow-[0_4px_10px_rgba(16,185,129,0.16)]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200
                            hover:brightness-105 active:brightness-95 transition-all"
                >
                  주소 선택
                </Button>
              ) : (
                <Button
                  className="rounded-xl h-10 px-5 py-0 leading-none
                            bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  주소 선택
                </Button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;