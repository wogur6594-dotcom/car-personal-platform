export const adminSummary = {
  totalMembers: 12840,
  totalCompanies: 126,
  newMembersToday: 37,
  activeCars: 1842,
  waitingCars: 26,
  reports: 18,
  unreadReports: 7,
  monthlyVisits: 248520,
  visitChangeRate: 12.4,
};

export const churnSummary = {
  highRisk: 42,
  mediumRisk: 118,
  managed: 67,
  recovered: 31,
};

export const weeklyUsage = [
  { label: "월", date: "07.06", visits: 31800, members: 840 },
  { label: "화", date: "07.07", visits: 35200, members: 920 },
  { label: "수", date: "07.08", visits: 33100, members: 890 },
  { label: "목", date: "07.09", visits: 38600, members: 1040 },
  { label: "금", date: "07.10", visits: 41200, members: 1160 },
  { label: "토", date: "07.11", visits: 45300, members: 1320 },
  { label: "일", date: "07.12", visits: 23320, members: 710 },
];

export const monthlyMemberTrend = [
  { label: "2월", members: 9320, companies: 82 },
  { label: "3월", members: 10080, companies: 89 },
  { label: "4월", members: 10860, companies: 97 },
  { label: "5월", members: 11540, companies: 105 },
  { label: "6월", members: 12170, companies: 116 },
  { label: "7월", members: 12840, companies: 126 },
];

export const monthlyCarTrend = [
  { label: "2월", registered: 1120, sold: 438 },
  { label: "3월", registered: 1280, sold: 512 },
  { label: "4월", registered: 1390, sold: 566 },
  { label: "5월", registered: 1510, sold: 621 },
  { label: "6월", registered: 1690, sold: 704 },
  { label: "7월", registered: 1842, sold: 768 },
];

export const recentActivities = [
  { id: 1, type: "신고", text: "허위 매물 신고가 접수되었습니다.", time: "10분 전" },
  { id: 2, type: "회원", text: "신규 회원 12명이 가입했습니다.", time: "32분 전" },
  { id: 3, type: "매물", text: "검수 대기 매물 5건이 등록되었습니다.", time: "1시간 전" },
  { id: 4, type: "이탈", text: "고위험 회원 3명이 새로 감지되었습니다.", time: "2시간 전" },
  { id: 5, type: "운영", text: "공지사항이 정상적으로 게시되었습니다.", time: "3시간 전" },
];

export const churnCustomers = [
  { id: 101, name: "김회원", role: "일반회원", score: 92, level: "고위험", lastLogin: "2026-06-18", reason: "장기 미접속", status: "미관리" },
  { id: 102, name: "이회원", role: "일반회원", score: 86, level: "고위험", lastLogin: "2026-06-24", reason: "찜/조회 급감", status: "쿠폰 지급" },
  { id: 103, name: "박딜러", role: "딜러", score: 78, level: "주의", lastLogin: "2026-07-02", reason: "매물 등록 감소", status: "상담 예정" },
  { id: 104, name: "최회원", role: "일반회원", score: 74, level: "주의", lastLogin: "2026-07-04", reason: "메시지 활동 중단", status: "알림 발송" },
  { id: 105, name: "정딜러", role: "딜러", score: 68, level: "주의", lastLogin: "2026-07-06", reason: "접속 빈도 감소", status: "미관리" },
];

export const companyChurnCustomers = [
  { id: 10, name: "오토케어모터스", score: 91, level: "고위험", lastLogin: "2026-06-20", activeCars: 3, dealerCount: 1, reason: "매물 등록 및 딜러 접속 급감", status: "미관리" },
  { id: 11, name: "서울모터스", score: 82, level: "고위험", lastLogin: "2026-06-28", activeCars: 7, dealerCount: 3, reason: "문의 응답률 하락", status: "상담 예정" },
  { id: 12, name: "한빛오토", score: 73, level: "주의", lastLogin: "2026-07-04", activeCars: 5, dealerCount: 2, reason: "판매 전환율 감소", status: "프로모션 제공" },
  { id: 13, name: "굿카컴퍼니", score: 66, level: "주의", lastLogin: "2026-07-07", activeCars: 12, dealerCount: 4, reason: "관리자 페이지 이용 감소", status: "미관리" },
];

export const adminMembers = [
  { id: 1, name: "김회원", email: "member1@test.com", role: "일반회원", joinedAt: "2026-05-12", status: "정상" },
  { id: 2, name: "이회원", email: "member2@test.com", role: "일반회원", joinedAt: "2026-05-19", status: "정상" },
  { id: 3, name: "박딜러", email: "dealer1@test.com", role: "딜러", joinedAt: "2026-06-03", status: "정상" },
  { id: 4, name: "최회원", email: "member3@test.com", role: "일반회원", joinedAt: "2026-06-21", status: "이용정지" },
  { id: 5, name: "정딜러", email: "dealer2@test.com", role: "딜러", joinedAt: "2026-07-01", status: "검토중" },
];

export const adminCompanies = [
  { id: 10, name: "오토케어모터스", businessNumber: "123-45-67890", dealerCount: 1, activeCars: 3, joinedAt: "2026-03-12", status: "정상" },
  { id: 11, name: "서울모터스", businessNumber: "211-82-34567", dealerCount: 3, activeCars: 7, joinedAt: "2026-04-03", status: "정상" },
  { id: 12, name: "한빛오토", businessNumber: "315-19-48320", dealerCount: 2, activeCars: 5, joinedAt: "2026-05-17", status: "검토중" },
  { id: 13, name: "굿카컴퍼니", businessNumber: "502-31-91822", dealerCount: 4, activeCars: 12, joinedAt: "2026-06-04", status: "이용정지" },
];

export const adminCars = [
  { id: 201, title: "2023 현대 그랜저", seller: "박딜러", price: "3,480만원", createdAt: "2026-07-12", status: "판매중" },
  { id: 202, title: "2022 기아 K8", seller: "정딜러", price: "3,120만원", createdAt: "2026-07-12", status: "검수대기" },
  { id: 203, title: "2021 제네시스 G80", seller: "김회원", price: "4,250만원", createdAt: "2026-07-11", status: "판매중" },
  { id: 204, title: "2020 현대 아반떼", seller: "이회원", price: "1,530만원", createdAt: "2026-07-10", status: "신고접수" },
];

export const adminReports = [
  { id: 301, target: "2020 현대 아반떼", reporter: "신고자1", reason: "허위 정보", createdAt: "2026-07-12", status: "접수" },
  { id: 302, target: "딜러 채팅", reporter: "신고자2", reason: "욕설/비방", createdAt: "2026-07-11", status: "처리중" },
  { id: 303, target: "커뮤니티 게시글", reporter: "신고자3", reason: "광고/도배", createdAt: "2026-07-10", status: "완료" },
];

export const usageByFeature = [
  { name: "중고차 조회", value: 42, count: 104378 },
  { name: "차량관리", value: 23, count: 57160 },
  { name: "주유소/정비소", value: 18, count: 44734 },
  { name: "커뮤니티", value: 11, count: 27337 },
  { name: "메시지", value: 6, count: 14911 },
];
