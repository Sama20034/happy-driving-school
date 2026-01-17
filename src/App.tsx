import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import MyBookings from "./pages/MyBookings";
import CoursesPage from "./pages/Courses";
import WhyUsPage from "./pages/WhyUs";
import About from "./pages/About";
import Services from "./pages/Services";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import PendingApproval from "./pages/PendingApproval";
import CaptainDashboard from "./pages/CaptainDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";
import Chat from "./pages/Chat";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import Countries from "./pages/admin/Countries";
import Governorates from "./pages/admin/Governorates";
import Branches from "./pages/admin/Branches";
import Courses from "./pages/admin/Courses";
import Captains from "./pages/admin/Captains";
import CaptainAvailability from "./pages/admin/CaptainAvailability";
import StoreCategories from "./pages/admin/StoreCategories";
import StoreProducts from "./pages/admin/StoreProducts";
import StoreOrders from "./pages/admin/StoreOrders";
import DiscountCodes from "./pages/admin/DiscountCodes";
import UserApprovals from "./pages/admin/UserApprovals";
import SocialSidebar from "./components/layout/SocialSidebar";
import InstallPrompt from "./components/pwa/InstallPrompt";
import ScrollToTop from "./components/ScrollToTop";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Sonner />
          <SocialSidebar />
          <InstallPrompt />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/captain-dashboard" element={<CaptainDashboard />} />
            <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
            <Route path="/chat/:bookingId" element={<Chat />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="discount-codes" element={<DiscountCodes />} />
              <Route path="countries" element={<Countries />} />
              <Route path="governorates" element={<Governorates />} />
              <Route path="branches" element={<Branches />} />
              <Route path="courses" element={<Courses />} />
              <Route path="captains" element={<Captains />} />
              <Route path="availability" element={<CaptainAvailability />} />
              <Route path="store-categories" element={<StoreCategories />} />
              <Route path="store-products" element={<StoreProducts />} />
              <Route path="store-orders" element={<StoreOrders />} />
              <Route path="user-approvals" element={<UserApprovals />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
