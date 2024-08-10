import store from "./store.js";

import Login from "../pages/Login.js";
import Home from "../pages/Home.js";
import Profile from "../pages/Profile.js";
import Logout from "../pages/Logout.js";
import Signup from "../pages/Signup.js";
import DashboardLibrarian from "../pages/DashboardLibrarian.js";
import DashboardUser from "../pages/DashboardUser.js";
import AddSection from "../pages/add_section.js"; 
import AddBook from "../pages/add_books.js";  
import FAQ from "../pages/FAQ.js";
import ViewRequest from "../pages/view_requests.js";
import BorrowedBooks from "../pages/borrowed_books.js";
import EditSection from "../pages/edit-section.js";
import DeleteSection from "../pages/delete-section.js";
import ViewSection from "../pages/view-section.js";
import EditBook from "../pages/edit_book.js";
import ForgotPassword from "../pages/forgot_password.js";
import ResetPassword from "../pages/reset_password.js"; 
import RatingsAndReviews from "../pages/ratingsandreviews.js";
import UserDashboard from "../pages/UserStats.js";
import LibrarianDashboard from "../pages/LibrarianDashboard.js";
import DownloadBook from '../pages/download_book.js';
const routes = [
  { path: "/", component: Home },
  { path: "/user-login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/profile", component: Profile },
  { path: "/signup", component: Signup },
  { path: "/lib-dashboard", component: DashboardLibrarian, meta: { requiresLogin: true, role: "librarian" } },
  { path: "/user-dashboard", component: DashboardUser, meta: { requiresLogin: true, role: "user" } },
  {path: "/add-section", component: AddSection, meta: { requiresLogin: true, role: "librarian" }},
  {path: "/add-book", component: AddBook, meta: { requiresLogin: true, role: "librarian" }},
  {path: "/faq", component: FAQ,meta: { requiresLogin: true, role: "user" }},
  {path: "/view-requests", component: ViewRequest, meta: { requiresLogin: true, role: "librarian" }},
  {path: "/borrowed_books", component: BorrowedBooks, meta: { requiresLogin: true, role: "user" }},
  {path: '/add-book/:sectionId?',name: 'AddBooks',component: AddBook,meta: { requiresLogin: true, role: "librarian" }},
  {path: '/edit-section/:sectionId',name: 'EditSection',component: EditSection,meta: { requiresLogin: true, role: "librarian" }},
  {path: '/delete-section/:sectionId',name: 'DeleteSection',component: DeleteSection,meta: { requiresLogin: true, role: "librarian" }},
  {path: '/view-section/:sectionId',name: 'ViewSection',component: ViewSection,meta: { requiresLogin: true, role: "librarian" }},
  {path: '/edit-book/:bookId',name: 'EditBook',component: EditBook,meta: { requiresLogin: true, role: "librarian" }},
  {path: "/forgot-password", component: ForgotPassword},
  {path: "/reset-password", component: ResetPassword},
  {path: "/rate-and-review/:bookId",name: 'RateAndReview', component: RatingsAndReviews,meta: { requiresLogin: true, role: "user" }},
  {path: "/dashboard-user",name:UserDashboard, component: UserDashboard,meta: { requiresLogin: true, role: "user" }},
  {path: "/librarian-dashboard",name:LibrarianDashboard, component: LibrarianDashboard,meta: { requiresLogin: true, role: "librarian" }},
  {path: '/download-book/:bookId',name: 'DownloadBook', component: DownloadBook}
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)) {
    if (!store.state.loggedIn) {
      next({ path: "/user-login" });
    } else if (to.meta.role && to.meta.role !== store.state.role) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
