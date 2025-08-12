import os
import requests
from typing import Dict, Any

NTS_API_BASE_URL = "https://api.odcloud.kr/api/nts-businessman/v1"

def verify_business_registration(
    business_no: str,
    start_date: str,  # YYYYMMDD format
    representative_name: str,
    api_key: str
) -> Dict[str, Any]:
    """
    국세청 사업자등록정보 진위확인 API를 호출하여 사업자등록번호의 유효성을 검증합니다.

    Args:
        business_no (str): 사업자등록번호 (10자리 숫자, '-' 없이).
        start_date (str): 개업일자 (YYYYMMDD 형식).
        representative_name (str): 대표자 성명.
        api_key (str): 국세청 API 서비스 키.

    Returns:
        Dict[str, Any]: API 응답의 'data' 필드 (첫 번째 항목) 또는 오류 정보.
                        'valid' 필드가 '01'이면 유효, '02'이면 유효하지 않음.

    Raises:
        ValueError: 필수 입력값이 누락되었거나 형식이 올바르지 않을 경우.
        requests.exceptions.RequestException: API 호출 중 네트워크 또는 HTTP 오류 발생 시.
        Exception: API 응답 처리 중 예상치 못한 오류 발생 시.
    """
    if not business_no or not start_date or not representative_name or not api_key:
        raise ValueError("사업자등록번호, 개업일자, 대표자 성명, API 키는 필수입니다.")

    # 사업자등록번호 유효성 검사 (간단한 길이 및 숫자 확인)
    if not (business_no.isdigit() and len(business_no) == 10):
        raise ValueError("사업자등록번호는 10자리의 숫자여야 합니다.")
    # 개업일자 유효성 검사 (YYYYMMDD 형식 확인)
    if not (start_date.isdigit() and len(start_date) == 8):
        raise ValueError("개업일자는 YYYYMMDD 형식의 8자리 숫자여야 합니다.")

    endpoint = f"{NTS_API_BASE_URL}/validate"
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # API 요청 본문 구성
    # Swagger 문서에 따르면 'businesses' 배열 안에 BusinessDescription 객체가 들어감
    request_body = {
        "businesses": [
            {
                "b_no": business_no,
                "start_dt": start_date,
                "p_nm": representative_name
            }
        ]
    }

    params = {
        "serviceKey": api_key
    }

    try:
        response = requests.post(endpoint, headers=headers, json=request_body, params=params)
        response.raise_for_status()  # HTTP 오류 발생 시 예외 발생
        
        response_data = response.json()
        
        # API 응답 구조 확인
        if response_data.get('status_code') == 'OK' and response_data.get('data'):
            # 'data' 필드는 배열이며, 요청한 사업자 수만큼 결과가 반환됨. 첫 번째 결과 사용.
            return response_data['data'][0]
        else:
            # API 자체에서 오류 응답을 보냈거나, 'data' 필드가 없는 경우
            error_msg = response_data.get('message', '알 수 없는 API 응답 오류')
            raise Exception(f"API 응답 오류: {error_msg} (Status: {response_data.get('status_code')})")

    except requests.exceptions.RequestException as e:
        raise requests.exceptions.RequestException(f"API 호출 중 네트워크 또는 HTTP 오류 발생: {e}")
    except Exception as e:
        raise Exception(f"API 응답 처리 중 오류 발생: {e}")


# 예시 사용법 (실제 앱에서는 환경 변수에서 API 키를 가져옴)
if __name__ == "__main__":
    # 실제 API 키와 유효한 사업자 정보로 대체해야 합니다.
    # NTS_API_KEY = os.getenv("NTS_API_KEY") 
    NTS_API_KEY = "aQyKm0n6s3i6dvZ8OXeUy0V/ic+hQ+Of6WYQXryfAQ7/TwV8hEkB4XAhoQZjnb0BrCL9FUNLU8dOkUZnLDaodg==" # 예시

    if NTS_API_KEY:
        try:
            # 유효한 사업자등록번호, 개업일자, 대표자 성명으로 대체
            # 테스트를 위해 실제 존재하는 사업자 정보를 사용해야 합니다.
            test_business_no = "1234567890" # 예시
            test_start_date = "20000101" # 예시
            test_representative_name = "홍길동" # 예시

            print(f"사업자등록번호 {test_business_no} 진위확인 중...")
            result = verify_business_registration(test_business_no, test_start_date, test_representative_name, NTS_API_KEY)
            
            if result.get('valid') == '01':
                print(f"✅ 사업자등록번호 {test_business_no} 유효합니다. (결과: {result})")
            elif result.get('valid') == '02':
                print(f"❌ 사업자등록번호 {test_business_no} 유효하지 않습니다. (메시지: {result.get('valid_msg')})")
            else:
                print(f"⚠️ 예상치 못한 검증 결과: {result}")

        except ValueError as e:
            print(f"입력 오류: {e}")
        except requests.exceptions.RequestException as e:
            print(f"API 호출 오류: {e}")
        except Exception as e:
            print(f"처리 중 오류: {e}")
    else:
        print("NTS_API_KEY 환경 변수가 설정되지 않았습니다.")
