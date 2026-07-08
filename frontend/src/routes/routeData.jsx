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

import MyCarManagePage from "../pages/maintenance/MyCarManagePage";
import MyCarRegisterPage from "../pages/maintenance/MyCarRegisterPage";
import MaintenanceHistoryPage from "../pages/maintenance/MaintenanceHistoryPage";

import BoardListPage from "../pages/board/BoardListPage";
import BoardDetailPage from "../pages/board/BoardDetailPage";
import BoardWritePage from "../pages/board/BoardWritePage";
import BoardEditPage from "../pages/board/BoardEditPage";

export const PUBLIC_ROUTES = [
  { id: 1, path: "/", element: <IndexPage /> },
  { id: 2, path: "/login", element: <LoginPage /> },
  { id: 3, path: "/signup", element: <SignUpPage /> },
  { id: 4, path: "/forbidden", element: <ForbiddenPage /> },
  { id: 5, path: "/cars", element: <UsedCarListPage /> },
  { id: 6, path: "/cars/:id", element: <UsedCarDetailPage /> },
  { id: 7, path: "/gas-stations", element: <GasStationPage /> },
  { id: 8, path: "/repair-shops", element: <RepairShopPage /> },
  { id: 9, path: "/repair-shops/:id", element: <RepairShopDetailPage /> },
  { id: 10, path: "/maintenance", element: <MyCarManagePage /> },
  { id: 11, path: "/boards", element: <BoardListPage /> },
  { id: 12, path: "/boards/:id", element: <BoardDetailPage /> },
];

export const PROTECTED_ROUTES = [
  { id: 1, path: "/mypage", element: <MyPage /> },
  { id: 2, path: "/cars/register", element: <UsedCarRegisterPage /> },
  { id: 3, path: "/my-cars", element: <MyUsedCarPage /> },
  { id: 4, path: "/maintenance/register", element: <MyCarRegisterPage /> },
  { id: 5, path: "/maintenance/history", element: <MaintenanceHistoryPage /> },
  { id: 6, path: "/boards/write", element: <BoardWritePage /> },
  { id: 7, path: "/boards/:id/edit", element: <BoardEditPage /> },
];

export const NOT_FOUND_ROUTE = {
  path: "*",
  element: <NotFoundPage />,
};
