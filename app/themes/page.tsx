import { PageWrapper } from "@/components/page-wrapper"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function ThemesPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Theme Studio</h1>
        <p className="text-muted-foreground">Change how the app looks with magical themes!</p>
      </div>
      <ThemeSwitcher />
    </PageWrapper>
  )
}
