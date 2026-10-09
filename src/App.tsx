import { HashRouter, Route, Routes } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import BookPage from "@/pages/BookPage";
import EditorPage from "@/pages/EditorPage";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import ReaderPage from "@/pages/ReaderPage";

export function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/livro/o-idiota" element={<BookPage />} />
          <Route path="/livro/o-idiota/ler/:chapterId" element={<ReaderPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
