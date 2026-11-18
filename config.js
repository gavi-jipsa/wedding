/* =========================================================
   청첩장 설정 — 이 파일만 고치면 대부분의 내용이 바뀝니다.
   ========================================================= */
window.WEDDING = {
  groom: { name: "김재현" },
  bride: { name: "이지현" },

  // 결혼식 일시 (한국 시간)
  date: "2027-02-27T13:30:00+09:00",

  // 처음 손그림 표지가 보이는 시간(초) — 누르면 바로 넘어감
  coverSeconds: 3.2,
  // 첫 장 큰 사진 — 세로형 권장 (3:4)
  heroPhoto: "assets/img/main.jpg",
  // 첫 장 이름 사이 기호: "sketch" 손그림 하트 / "heart" 하트 / "ring" 반지 / "flower" 꽃 / "amp" & / "infinity" 무한
  nameMark: "sketch",
  // 첫 장 사진 위 두 줄 문구
  heroKicker: "다섯 번의 봄을 지나",          // 2021년 11월 1일부터 함께한 봄: 22·23·24·25·26년
  heroLine: "여섯 번째 봄의 시작에서",

  // 초대 인사말 (줄바꿈은 \n)
  greeting:
    "서로 다른 길을 걸어온 두 사람이\n이제 같은 곳을 바라보며\n함께 걸어가려 합니다.\n\n" +
    "늘 곁에서 아껴주신 고마운 분들을 모시고\n사랑의 약속을 하려 하오니\n\n" +
    "귀한 걸음 하시어\n따뜻한 마음으로 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.",

  parents: {
    groom: { father: "김영태", mother: "장서우", relation: "차남" },
    bride: { father: "이상화", mother: "오은경", relation: "장녀" }
  },

  venue: {
    name: "더컨벤션 송파문정",
    hall: "그랜드볼룸",
    floor: "12층",                              // TODO: 층수 확인 필요
    address: "서울 송파구 송파대로 155",
    building: "NH송파농협 11–13층",
    tel: "02-6418-5000",
    lat: 37.4840,                                // 날씨 조회용 좌표
    lng: 127.1232,
    kakaoMap: "https://map.kakao.com/link/search/더컨벤션 송파문정",
    naverMap: "https://map.naver.com/p/search/더컨벤션 송파문정",
    transport: [
      { label: "지하철", text: "8호선 문정역 3번 출구 · 도보 5분" },
      { label: "버스", text: "‘문정법조타운·건영아파트’ 정류장 하차",
        lines: [
          ["간선", "302, 303, 333, 345, 360"],
          ["지선", "3322, 3420"]
        ],
        note: "그 외 노선은 지도 앱에서 확인해 주세요" },
      { label: "자가용", text: "내비게이션 ‘송파대로 155’ 또는 ‘더컨벤션 송파문정’\n건물 내 주차장 이용" }
    ]
  },
  thanksPhoto: "assets/img/thanks.jpg",   // 맨 아래 '감사합니다' 위 작은 사진
  mapImage: "assets/img/map.png", // 예식장 공식 약도 이미지를 넣으면 이걸 사용 (없으면 그려둔 약도 표시)

  // 갤러리 — 첫 번째가 메인 샷. 파일만 넣으면 됩니다 (10~12장)
  gallery: [
    "assets/img/gallery-01.jpg", "assets/img/gallery-02.jpg", "assets/img/gallery-03.jpg",
    "assets/img/gallery-04.jpg", "assets/img/gallery-05.jpg", "assets/img/gallery-06.jpg",
    "assets/img/gallery-07.jpg", "assets/img/gallery-08.jpg", "assets/img/gallery-09.jpg",
    "assets/img/gallery-10.jpg", "assets/img/gallery-11.jpg", "assets/img/gallery-12.jpg"
  ],

  // 마음 전하실 곳
  accounts: {
    groom: [
      { role: "신랑", name: "김재현", tel: "010-0000-0000", bank: "국민은행", account: "000000-00-000000" },
      { role: "아버지", name: "김영태", tel: "010-0000-0000", bank: "신한은행", account: "110-000-000000" },
      { role: "어머니", name: "장서우", tel: "010-0000-0000", bank: "우리은행", account: "1002-000-000000" }
    ],
    bride: [
      { role: "신부", name: "이지현", tel: "010-0000-0000", bank: "카카오뱅크", account: "3333-00-0000000" },
      { role: "아버지", name: "이상화", tel: "010-0000-0000", bank: "농협", account: "000-0000-0000-00" },
      { role: "어머니", name: "오은경", tel: "010-0000-0000", bank: "하나은행", account: "000-000000-00000" }
    ]
  },

  // (선택) 하객이 찍은 사진을 올려주는 구글 포토 공유앨범 링크 — 비워두면 그 섹션이 안 보입니다
  googlePhotosUrl: "",

  // (선택) 카카오톡 공유 카드 — jsKey를 비워두면 버튼이 안 보이고 '주소 복사'만 남습니다
  kakao: {
    jsKey: "",
    shareImage: "assets/img/share-800x1200.jpg", // 세로형 800×1200
    title: "김재현 ♥ 이지현 결혼합니다",
    description: "2027년 2월 27일 토요일 오후 1시 30분\n더컨벤션 송파문정 그랜드볼룸",
    snapButtonPath: "#photoshare"               // '게스트스냅' 버튼이 열 위치
  }
};
