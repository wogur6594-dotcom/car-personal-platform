import { AUTH_ROLES } from "../utils/authRole";

//common
import IndexPage from "../pages/home/IndexPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ForbiddenPage from "../pages/auth/ForbiddenPage";
import NotFoundPage from "../pages/auth/NotFoundPage";
import MyPage from "../pages/member/MyPage";

import UsedCarListPage from "../pages/car/UsedCarListPage";
import UsedCarDetailPage from "../pages/car/UsedCarDetailPage";
import UsedCarRegisterPage from "../pages/car/UsedCarRegisterPage";
import MyUsedCarPage from "../pages/car/MyUsedCarPage";



import GasStationPage from "../pages/map/GasStationPage";
import RepairShopPage from "../pages/map/RepairShopPage";
import RepairShopDetailPage from "../pages/map/RepairShopDetailPage";

//company
import CompanyDetailPage from "../pages/company/CompanyDetailPage";

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

//message
import MessageNewPage from "../pages/message/MessageNewPage";

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
    path: "/messages/new",
    element: <MessageNewPage />,
  },
  {
    path: "/boards/:boardId",
    element: <BoardDetailPage />,
  },
];

export const PROTECTED_ROUTES = [
  {
    path: "/mypage",
    element: <MyPage />,
    roles: [AUTH_ROLES.MEMBER, AUTH_ROLES.DEALER, AUTH_ROLES.ADMIN],
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
];

export const NOT_FOUND_ROUTE = {
  path: "*",
  element: <NotFoundPage />,
};