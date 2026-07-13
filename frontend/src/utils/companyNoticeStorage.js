const COMPANY_NOTICE_KEY = "companyNotices";

export const COMPANY_NOTICE_CATEGORIES = {
  NOTICE: "NOTICE",
  NEWS: "NEWS",
};

export const COMPANY_NOTICE_CATEGORY_LABELS = {
  NOTICE: "공지사항",
  NEWS: "회사 소식",
};

function createSeedNotices() {
  return [
    {
      id: 1,
      companyId: 10,
      category: COMPANY_NOTICE_CATEGORIES.NOTICE,
      title: "오토케어모터스 영업시간 안내",
      content:
        "오토케어모터스 영업시간을 안내드립니다.\n\n평일 오전 9시부터 오후 6시까지 운영하며, 방문 상담 전 연락을 부탁드립니다.",
      writerId: 10,
      writerName: "오토케어모터스",
      isPinned: true,
      viewCount: 32,
      createdAt: "2026-07-10T09:00:00.000Z",
      updatedAt: "2026-07-10T09:00:00.000Z",
    },
    {
      id: 2,
      companyId: 10,
      category: COMPANY_NOTICE_CATEGORIES.NEWS,
      title: "7월 신규 차량 입고 안내",
      content:
        "7월 신규 중고차 매물이 입고되었습니다.\n\n차량 상세 정보는 판매 차량 목록에서 확인할 수 있습니다.",
      writerId: 10,
      writerName: "오토케어모터스",
      isPinned: false,
      viewCount: 18,
      createdAt: "2026-07-12T14:30:00.000Z",
      updatedAt: "2026-07-12T14:30:00.000Z",
    },
  ];
}

function saveCompanyNotices(notices) {
  localStorage.setItem(COMPANY_NOTICE_KEY, JSON.stringify(notices));

  window.dispatchEvent(
    new CustomEvent("companyNoticeChange", {
      detail: notices,
    })
  );
}

function normalizeNotice(notice) {
  return {
    id: Number(notice.id),
    companyId: Number(notice.companyId),
    category:
      notice.category || COMPANY_NOTICE_CATEGORIES.NOTICE,
    title: notice.title || "",
    content: notice.content || "",
    writerId: Number(notice.writerId),
    writerName: notice.writerName || "기업회원",
    isPinned: Boolean(notice.isPinned),
    viewCount: Number(notice.viewCount || 0),
    createdAt:
      notice.createdAt || new Date().toISOString(),
    updatedAt:
      notice.updatedAt || notice.createdAt || new Date().toISOString(),
  };
}

export function getCompanyNotices() {
  const savedNotices = localStorage.getItem(COMPANY_NOTICE_KEY);

  if (!savedNotices) {
    const seedNotices = createSeedNotices();

    saveCompanyNotices(seedNotices);

    return seedNotices;
  }

  try {
    const parsedNotices = JSON.parse(savedNotices);

    if (!Array.isArray(parsedNotices)) {
      throw new Error("회사 게시글 데이터가 배열이 아닙니다.");
    }

    return parsedNotices.map(normalizeNotice);
  } catch (error) {
    console.error("회사 게시글 데이터 파싱 오류:", error);

    const seedNotices = createSeedNotices();

    saveCompanyNotices(seedNotices);

    return seedNotices;
  }
}

export function getCompanyNoticesByCompanyId(companyId) {
  return getCompanyNotices()
    .filter(
      (notice) =>
        Number(notice.companyId) === Number(companyId)
    )
    .sort((firstNotice, secondNotice) => {
      if (firstNotice.isPinned !== secondNotice.isPinned) {
        return firstNotice.isPinned ? -1 : 1;
      }

      return (
        new Date(secondNotice.createdAt).getTime() -
        new Date(firstNotice.createdAt).getTime()
      );
    });
}

export function getCompanyNoticeById(noticeId) {
  return getCompanyNotices().find(
    (notice) => Number(notice.id) === Number(noticeId)
  );
}

export function createCompanyNotice(noticeData) {
  const notices = getCompanyNotices();

  const nextId =
    notices.length > 0
      ? Math.max(
          ...notices.map((notice) => Number(notice.id))
        ) + 1
      : 1;

  const now = new Date().toISOString();

  const newNotice = normalizeNotice({
    id: nextId,
    companyId: noticeData.companyId,
    category: noticeData.category,
    title: noticeData.title.trim(),
    content: noticeData.content.trim(),
    writerId: noticeData.writerId,
    writerName: noticeData.writerName,
    isPinned: noticeData.isPinned,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  const nextNotices = [...notices, newNotice];

  saveCompanyNotices(nextNotices);

  return newNotice;
}

export function updateCompanyNotice(noticeId, noticeData) {
  let updatedNotice = null;

  const nextNotices = getCompanyNotices().map((notice) => {
    if (Number(notice.id) !== Number(noticeId)) {
      return notice;
    }

    updatedNotice = normalizeNotice({
      ...notice,
      category: noticeData.category,
      title: noticeData.title.trim(),
      content: noticeData.content.trim(),
      isPinned: noticeData.isPinned,
      updatedAt: new Date().toISOString(),
    });

    return updatedNotice;
  });

  saveCompanyNotices(nextNotices);

  return updatedNotice;
}

export function deleteCompanyNotice(noticeId) {
  const notices = getCompanyNotices();

  const targetNotice = notices.find(
    (notice) => Number(notice.id) === Number(noticeId)
  );

  if (!targetNotice) {
    return false;
  }

  const nextNotices = notices.filter(
    (notice) => Number(notice.id) !== Number(noticeId)
  );

  saveCompanyNotices(nextNotices);

  return true;
}

export function increaseCompanyNoticeViewCount(noticeId) {
  let updatedNotice = null;

  const nextNotices = getCompanyNotices().map((notice) => {
    if (Number(notice.id) !== Number(noticeId)) {
      return notice;
    }

    updatedNotice = {
      ...notice,
      viewCount: Number(notice.viewCount || 0) + 1,
    };

    return updatedNotice;
  });

  saveCompanyNotices(nextNotices);

  return updatedNotice;
}

export function toggleCompanyNoticePinned(noticeId) {
  let updatedNotice = null;

  const nextNotices = getCompanyNotices().map((notice) => {
    if (Number(notice.id) !== Number(noticeId)) {
      return notice;
    }

    updatedNotice = {
      ...notice,
      isPinned: !notice.isPinned,
      updatedAt: new Date().toISOString(),
    };

    return updatedNotice;
  });

  saveCompanyNotices(nextNotices);

  return updatedNotice;
}