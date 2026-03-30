import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AboutPage from "./pages/AboutPage";
import AdminArtistsPage from "./pages/AdminArtistsPage";
import AdminArtworksPage from "./pages/AdminArtworksPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminInquiriesPage from "./pages/AdminInquiriesPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ArtistDashboardPage from "./pages/ArtistDashboardPage";
import ArtistUploadPage from "./pages/ArtistUploadPage";
import ArtistWorksPage from "./pages/ArtistWorksPage";
import ContactPage from "./pages/ContactPage";
import CreatorWorksPage from "./pages/CreatorWorksPage";
import Home from "./pages/Home";
import LocalWorld from "./pages/LocalWorld";
import LoginPage from "./pages/LoginPage";
import OpenPage from "./pages/OpenPage";
import OriginalsPage from "./pages/OriginalsPage";
import PlatformPage from "./pages/PlatformPage";
import SolutionsPage from "./pages/SolutionsPage";
import StandardWorld from "./pages/StandardWorld";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/open" component={OpenPage} />
      <Route path="/originals" component={OriginalsPage} />
      <Route path="/creator-works" component={CreatorWorksPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/platform" component={PlatformPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/sign-in" component={LoginPage} />
      <Route path="/standard" component={StandardWorld} />
      <Route path="/local" component={LocalWorld} />
      <Route path="/artwork/:id" component={ArtworkDetail} />

      <Route path="/portal/artist" component={ArtistDashboardPage} />
      <Route path="/portal/artist/works" component={ArtistWorksPage} />
      <Route path="/portal/artist/upload" component={ArtistUploadPage} />

      <Route path="/portal/admin" component={AdminDashboardPage} />
      <Route path="/portal/admin/artworks" component={AdminArtworksPage} />
      <Route path="/portal/admin/artists" component={AdminArtistsPage} />
      <Route path="/portal/admin/inquiries" component={AdminInquiriesPage} />

      <Route path="/content" component={OpenPage} />
      <Route path="/mockups" component={SolutionsPage} />
      <Route path="/spaces" component={SolutionsPage} />
      <Route path="/process" component={PlatformPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <MarketplaceProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </MarketplaceProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
