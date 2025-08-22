// 전역 타입 정의
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

// 카카오맵 관련 타입 정의
export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

export interface KakaoGeocoderResult {
  address: {
    address_name: string;
    zone_no: string;
  };
  road_address?: {
    address_name: string;
  };
}

export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface KakaoMarkerOptions {
  position: KakaoLatLng;
}

export interface KakaoMapEvent {
  latLng: KakaoLatLng;
}

// 설문 폼 관련 타입
export interface SurveyFormValues {
  storeName: string;
  regionKeyword: string;
  address: string;
  priceRange: string;
  category: string;
  hours: string;
  intro: string;
  refLink?: string;
  serviceKeywords?: string;
  target?: string;
  instagram?: string;
  promotion?: string;
}

// 타입 가드 함수들
export const isKakaoLatLng = (value: unknown): value is KakaoLatLng => {
  return typeof value === 'object' && 
         value !== null && 
         typeof (value as KakaoLatLng).getLat === 'function' &&
         typeof (value as KakaoLatLng).getLng === 'function';
};

export const isKakaoMap = (value: unknown): value is KakaoMap => {
  return typeof value === 'object' && 
         value !== null && 
         typeof (value as KakaoMap).setCenter === 'function';
};

export const isKakaoMarker = (value: unknown): value is KakaoMarker => {
  return typeof value === 'object' && 
         value !== null && 
         typeof (value as KakaoMarker).setMap === 'function';
};

export const isKakaoGeocoderResult = (value: unknown): value is KakaoGeocoderResult => {
  return typeof value === 'object' && 
         value !== null && 
         typeof (value as KakaoGeocoderResult).address === 'object';
};

// 에러 타입 정의
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && 
         error !== null && 
         typeof (error as ApiError).message === 'string';
};

// 파일 업로드 관련 타입
export interface UploadedFile {
  rel?: string;
  key?: string;
  url?: string;
  filename?: string;
  content_type?: string;
  size?: number;
  backend?: string;
}

export type UploadReturn = UploadedFile[] | { ok?: boolean; files: UploadedFile[] };

export const isUploadedFile = (value: unknown): value is UploadedFile => {
  return typeof value === 'object' && value !== null;
};

export const isUploadReturn = (value: unknown): value is UploadReturn => {
  return Array.isArray(value) || 
         (typeof value === 'object' && value !== null && 'files' in value);
};
