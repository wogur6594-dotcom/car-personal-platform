import { AUTH_ROLES } from "../utils/authRole";

//common
import IndexPage from "../pages/home/IndexPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ForbiddenPage from "../pages/auth/ForbiddenPage";
import NotFoundPage from "../pages/auth/NotFoundPage";
import MyPage from "../pages/member/MyPage";

//car
import UsedCarListPage from "../pages/car/UsedCarListPage";
import UsedCarDetailPage from "../pages/car/UsedCarDetailPage";
import UsedCarRegisterPage from "../pages/car/UsedCarRegisterPage";
import MyUsedCarPage from "../pages/car/MyUsedCarPage";
import UsedCarEditPage from "../pages/car/UsedCarEditPage";
import FavoriteCarPage from "../pages/car/FavoriteCarPage";


import GasStationPage from "../pages/map/GasStationPage";
import RepairShopPage from "../pages/map/RepairShopPage";
import RepairShopDetailPage from "../pages/map/RepairShopDetailPage";

//company
import CompanyDetailPage from "../pages/company/CompanyDetailPage";
import CompanyDashboardPage from "../pages/company/CompanyDashboardPage";
import CompanyDealerManagePage from "../pages/company/CompanyDealerManagePage";
import CompanyDealerCreatePage from "../pages/company/CompanyDealerCreatePage";
import CompanyNoticeManagePage from "../pages/company/CompanyNoticeManagePage";
import CompanyNoticeDetailPage from "../pages/company/CompanyNoticeDetailPage";
import CompanyNoticeCreatePage from "../pages/company/CompanyNoticeCreatePage";
import CompanyNoticeEditPage from "../pages/company/CompanyNoticeEditPage";
import CompanyProfileEditPage from "../pages/company/CompanyProfileEditPage";
import CompanyDealerEditPage from "../pages/company/CompanyDealerEditPage";

import MyCarManagePage from "../pages/maintenance/MyCarManagePage";
import MyCarRegisterPage from "../pages/maintenance/MyCarRegisterPage";
import MaintenanceHistoryPage from "../pages/maintenance/MaintenanceHistoryPage";

//board
import BoardListPage from "../pages/board/BoardListPage";
import BoardDetailPage from "../pages/board/BoardDetailPage";
import BoardWritePage from "../pages/board/BoardWritePage";
import BoardEditPage from "../pages/board/BoardEditPage";

//dealer
import DealerDetailPage from "../pages/dealer/DealerDetailPage";
import DealerProfileEditPage from "../pages/dealer/DealerProfileEditPage";

//message
import MessageNewPage from "../pages/message/MessageNewPage";

//admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminChurnPage from "../pages/admin/AdminChurnPage";
import AdminMemberManagePage from "../pages/admin/AdminMemberManagePage";
import AdminCarManagePage from "../pages/admin/AdminCarManagePage";
import AdminReportManagePage from "../pages/admin/AdminReportManagePage";
import AdminStatisticsPage from "../pages/admin/AdminStatisticsPage";
import AdminCompanyManagePage from "../pages/admin/AdminCompanyManagePage";


export const PUBLIC_ROUTES = [
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "/cars",
    element: <UsedCarListPage />,
  },
  {
    path: "/cars/:carId",
    element: <UsedCarDetailPage />,
  },
  {
    path: "/dealers/:dealerId",
    element: <DealerDetailPage />,
  },
  {
    path: "/companies/:companyId",
    element: <CompanyDetailPage />,
  },
  {
    path: "/companies/:companyId/notices",
    element: <CompanyNoticeManagePage />,
  },
  {
    path: "/gas-stations",
    element: <GasStationPage />,
  },
  {
    path: "/repair-shops",
    element: <RepairShopPage />,
  },
  {
    path: "/repair-shops/:placeId",
    element: <RepairShopDetailPage />,
  },
  {
    path: "/boards",
    element: <BoardListPage />,
  },
  {
    path: "/boards/:boardId",
    element: <BoardDetailPage />,
  },
  {
    path: "/companies/:companyId/notices/:noticeId",
    element: <CompanyNoticeDetailPage />,
  },
];

export const PROTECTED_ROUTES = [
  {
    path: "/dealer/profile",
    element: <DealerProfileEditPage />,
    roles: [AUTH_ROLES.DEALER],
  },
  {
    path: "/mypage",
    element: <MyPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/member/cars",
    element: <MyUsedCarPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/cars/register",
    element: <UsedCarRegisterPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/cars/:carId/edit",
    element: <UsedCarEditPage />,
    roles: [
      AUTH_ROLES.MEMBER,
      AUTH_ROLES.DEALER,
    ],
  },
  {
    path: "/maintenance",
    element: <MyCarManagePage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/maintenance/register",
    element: <MyCarRegisterPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/maintenance/history/:carId",
    element: <MaintenanceHistoryPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER],
  },
  {
    path: "/boards/write",
    element: <BoardWritePage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER, AUTH_ROLES.ADMIN],
  },
  {
    path: "/boards/edit/:boardId",
    element: <BoardEditPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER, AUTH_ROLES.ADMIN],
  },
  {
    path: "/company/dashboard",
    element: <CompanyDashboardPage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/companies/:companyId/edit",
    element: <CompanyProfileEditPage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/companies/:companyId/notices/create",
    element: <CompanyNoticeCreatePage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/companies/:companyId/notices/:noticeId/edit",
    element: <CompanyNoticeEditPage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/company/dealers",
    element: <CompanyDealerManagePage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/company/dealers/create",
    element: <CompanyDealerCreatePage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/company/dealers/:dealerId/edit",
    element: <CompanyDealerEditPage />,
    roles: [AUTH_ROLES.COMPANY],
  },
  {
    path: "/messages/new",
    element: <MessageNewPage />,
    roles: [
      AUTH_ROLES.MEMBER,
      AUTH_ROLES.DEALER,
    ],
  },
  {
    path: "/member/favorites",
    element: <FavoriteCarPage />,
    roles: [
      AUTH_ROLES.MEMBER,
    ],
  },
];


export const ADMIN_ROUTES = [
  { index: true, element: <AdminDashboardPage /> },
  { path: "churn", element: <AdminChurnPage /> },
  { path: "members", element: <AdminMemberManagePage /> },
  { path: "companies", element: <AdminCompanyManagePage /> },
  { path: "cars", element: <AdminCarManagePage /> },
  { path: "reports", element: <AdminReportManagePage /> },
  { path: "statistics", element: <AdminStatisticsPage /> },
];

export const NOT_FOUND_ROUTE = {
  path: "*",
  element: <NotFoundPage />,
};