import { IngredientAnalysis } from '@/components/ingredient-analysis';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function Home() {
  return (
    <div className="flex h-dvh w-full bg-gradient-to-br from-background to-blue-950/20">
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 h-dvh">
            <IngredientAnalysis />
        </main>
      </SidebarInset>
    </div>
  );
}
