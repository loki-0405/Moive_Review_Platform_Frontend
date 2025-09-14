import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieListing from "./pages/MovieListing";
import MovieDetail from "./pages/MovieDetail";
import UserProfile from "./pages/UserProfile";
import ReviewSubmission from "./pages/ReviewSubmission";
import Watchlist from "./pages/Watchlist";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthContext"; // 👈 Import AuthProvider
import Login from "./pages/Login"; // 👈 Add login/register pages
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./components/Logout";
import AddMovie from "./pages/AddMovie";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />

            <Route
              path="/movies"
              element={
                <PrivateRoute>
                  <MovieListing />
                </PrivateRoute>
              }
            />
            <Route
              path="/addnewmoive"
              element={
                <PrivateRoute>
                  <AddMovie />
                </PrivateRoute>
              }
            />

            <Route
              path="/movie/:id"
              element={
                <PrivateRoute>
                  <MovieDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/review/new"
              element={
                <PrivateRoute>
                  <ReviewSubmission />
                </PrivateRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <PrivateRoute>
                  <Watchlist />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
