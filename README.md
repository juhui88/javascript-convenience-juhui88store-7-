# javascript-convenience-store-precourse

# javascript-convenience-store-precourse

### 1. 결제 시스템 기능

- 최종 결제 금액 계산
  - 사용자가 입력한 상품의 가격과 수량을 기반으로 총 구매액을 산출
  - 프로모션 및 멤버십 할인을 반영하여 최종 결제 금액을 계산.
- 구매 내역 출력
  - 구매 상품, 프로모션으로 증정된 상품, 총구매액, 할인금액 등을 포함한 영수증을 출력
- 추가 구매 선택
  - 영수증 출력 후, 추가 구매를 진행할지 여부를 확인하고 사용자가 선택한 대로 처리

### 2. 재고 관리 기능

- 재고 확인 및 업데이트
  - 각 상품의 재고를 확인하여 구매 가능 여부를 결정
  - 결제 시 해당 상품의 재고에서 구매 수량만큼 차감하여 최신 재고 상태를 유지

### 3. 프로모션 할인 기능

- 프로모션 적용 조건
  - 오늘 날짜가 프로모션 기간에 포함된 경우에만 프로모션 할인 적용.
- 프로모션 방식
  - N개 구매 시 1개 무료 증정 형태(1+1, 2+1 등)로 프로모션 진행.
- 프로모션 우선 처리
  - 프로모션 재고가 있는 경우 이를 우선적으로 사용하고, 부족할 경우 일반 재고를 사용
- 추가 안내
  - 고객이 프로모션 혜택을 받기 위해 필요한 수량을 추가로 구매하도록 안내
- 일부 정가 결제
  - 프로모션 재고 부족 시, 일부 수량을 정가로 결제할지 여부를 고객에게 안내하고 확인

### 4. 멤버십 할인 기능

- 할인 적용 조건
  - 멤버십 회원은 프로모션 미적용 금액에 대해 30% 할인을 받을 수 있으며, 최대 할인 한도는 8,000원.
- 할인 후 결제
  - 프로모션 적용 후 남은 금액에 대해 멤버십 할인을 적용하고 최종 결제 금액을 계산

### 5. 영수증 출력 기능

- 영수증 내용
  - 구매 상품명, 수량, 금액, 증정 상품 목록, 총구매액, 행사할인, 멤버십할인, 최종 결제 금액(내실돈) 정보를 포함
- 정렬 및 가독성 개선
  - 항목을 정렬하여 고객이 금액과 수량을 쉽게 확인할 수 있도록 영수증을 구성

### 6. 입출력 및 오류 처리 기능

- 상품 및 행사 목록 입력
  - 파일을 통해 초기 상품 및 행사 목록을 불러옴
- 사용자 입력 처리
  - 구매할 상품과 수량, 추가 프로모션 혜택 수량, 정가 결제 여부, 멤버십 할인 여부, 추가 구매 여부 등을 입력받음
- 오류 메시지 출력
  - 구매할 상품과 수량 형식이 올바르지 않은 경우: `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`
  - 존재하지 않는 상품을 입력한 경우: `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`
  - 구매 수량이 재고 수량을 초과한 경우: `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`
  - 기타 잘못된 입력의 경우: `[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.`