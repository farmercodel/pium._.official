import { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

interface AddressSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
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

const AddressSelector = ({ value, onChange, required = false }: AddressSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<KakaoMap | null>(null);
  const marker = useRef<KakaoMarker | null>(null);

  // 카카오맵 로드 상태 확인 (스크립트가 이미 로드되어 있음)
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao.maps && 
          window.kakao.maps.LatLng && window.kakao.maps.Map &&
          window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
        console.log('카카오맵 및 서비스 준비 완료');
        setIsMapLoaded(true);
      } else {
        console.log('카카오맵 아직 준비되지 않음, 1초 후 재시도');
        setTimeout(checkKakaoMap, 1000);
      }
    };

    checkKakaoMap();
  }, []);

  // 지도 초기화
  const initMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.log('지도 초기화 조건 미충족');
      return;
    }

    try {
      const options: KakaoMapOptions = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
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
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="지도에서 위치를 선택하세요"
          className="flex-1 p-2 px-4 border-2 border-gray-300 rounded-md placeholder-gray-400"
          readOnly
          required={required}
        />
        <Button 
          variant="secondary" 
          onClick={() => setIsOpen(true)}
          className="whitespace-nowrap"
          disabled={!isMapLoaded}
        >
          지도에서 선택
        </Button>
        {value && (
          <Button 
            variant="secondary" 
            onClick={handleClear}
            className="whitespace-nowrap"
          >
            초기화
          </Button>
        )}
      </div>

      {/* 지도 팝업 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
            
            {/* 지도 */}
            <div 
              ref={mapRef} 
              className="w-full h-96 mb-4 border border-gray-300 rounded-md"
            />
            
            {/* 선택된 주소 정보 */}
            {selectedAddress && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">선택된 주소:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>도로명:</strong> {selectedAddress.roadAddress}</p>
                  <p><strong>지번:</strong> {selectedAddress.jibunAddress}</p>
                  <p><strong>우편번호:</strong> {selectedAddress.zoneCode}</p>
                  <p><strong>좌표:</strong> {selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}</p>
                </div>
              </div>
            )}
            
            {/* 버튼 */}
            <div className="flex justify-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setIsOpen(false)}
              >
                취소
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddressSelect}
                disabled={!selectedAddress}
              >
                주소 선택
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;