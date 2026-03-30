import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ArtworkProvider } from "./contexts/ArtworkContext";
import { RoleGuard } from "./components/auth/RoleGuard";

// --- Public Pages ---
import Home from "./pages/Home";
import StandardWorld from "./pages/StandardWorld";
import LocalWorld from "./pages/LocalWorld";
import ArtworkDetail from "./pages/ArtworkDetail";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import ArtistsDirectory from "./pages/ArtistsDirectory";
import ContentHub from "./pages/ContentHub";
import Mockups from "./pages/Mockups";
import OpenFree from "./pages/OpenFree";
import OriginalsHub from "./pages/OriginalsHub";
import CreatorWorks from "./pages/CreatorWorks";
import PlatformFlow from "./pages/PlatformFlow";

// --- Auth Pages ---
import SignIn from "./pages/auth/SignIn";

// --- Artist Portal ---
import ArtistDashboard from "./pages/artist/Dashboard";
import ArtistWorks from "./pages/artist/Works";
import ArtistWorkDetail from "./pages/artist/WorkDetail";
import ArtistUpload from "./pages/artist/Upload";

// --- Admin Portal ---
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArtworks from "./pages/admin/Artworks";
import AdminArtworkReview from "./pages/admin/ArtworkReview";
import AdminArtists from "./pages/admin/Artists";
import AdminInquiries from "./pages/admin/Inquiries";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/open" component={OpenFree} />
      <Route path="/originals" component={OriginalsHub} />
      <Route path="/creators" component={CreatorWorks} />
      <Route path="/platform" component={PlatformFlow} />
      <Route path="/content" component={ContentHub} />
      <Route path="/spaces" component={Solutions} />
      <Route path="/mockups" component={Mockups} />
      <Route path="/login" component={SignIn} />
      <Route path="/explore" component={Explore} />
      <Route path="/standard" component={StandardWorld} />
      <Route path="/local" component={LocalWorld} />
      <Route path="/artwork/:id" component={ArtworkDetail} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/artists" component={ArtistsDirectory} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      {/* Auth */}
      <Route path="/auth/signin" component={SignIn} />

      {/* Artist Portal (role: artist, admin) */}
      <Route path="/artist/dashboard">
        <RoleGuard roles={["artist", "admin"]}>
          <ArtistDashboard />
        </RoleGuard>
      </Route>
      <Route path="/artist/works">
        <RoleGuard roles={["artist", "admin"]}>
          <ArtistWorks />
        </RoleGuard>
      </Route>
      <Route path="/artist/works/:id">
        <RoleGuard roles={["artist", "admin"]}>
          <ArtistWorkDetail />
        </RoleGuard>
      </Route>
      <Route path="/artist/upload">
        <RoleGuard roles={["artist", "admin"]}>
          <ArtistUpload />
        </RoleGuard>
      </Route>

      {/* Admin Portal (role: admin) */}
      <Route path="/admin/dashboard">
        <RoleGuard roles={["admin"]}>
          <AdminDashboard />
        </RoleGuard>
      </Route>
      <Route path="/admin/artworks">
        <RoleGuard roles={["admin"]}>
          <AdminArtworks />
        </RoleGuard>
      </Route>
      <Route path="/admin/artworks/:id">
        <RoleGuard roles={["admin"]}>
          <AdminArtworkReview />
        </RoleGuard>
      </Route>
      <Route path="/admin/artists">
        <RoleGuard roles={["admin"]}>
          <AdminArtists />
        </RoleGuard>
      </Route>
      <Route path="/admin/inquiries">
        <RoleGuard roles={["admin"]}>
          <AdminInquiries />
        </RoleGuard>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <ArtworkProvider>
            <MarketplaceProvider>
              <TooltipProvider>
              <Toaster />
              <Router />
              </TooltipProvider>
            </MarketplaceProvider>
          </ArtworkProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
