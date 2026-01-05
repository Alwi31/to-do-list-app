import { Sparkles, Rocket } from "lucide-react";

/**
 * ============================================
 * COMPONENT: Header - Gen Z Vibes! ✨
 * ============================================
 *
 * Komponen header dengan style Gen Z yang vibrant
 * Gradient text, emojis, dan vibe belajar yang fun!
 */
export function Header() {
  return (
    <header className="text-center mb-8">
      {/*
        Logo/Icon + Title dengan gradient
        
        Gen Z vibes: Colorful, bold, fun!
      */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent 
                        flex items-center justify-center shadow-lg animate-pulse-glow"
        >
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          To-Do-List Harian ✨
        </h1>
      </div>

      {/*
        Tagline yang inspiring untuk Gen Z learners
        
        Casual, relatable, memotivasi!
      */}
      <p className="text-muted-foreground text-lg">
        Level up produktivitasmu! 🚀
        <span className="hidden sm:inline"> Belajar sambil ngerjain task</span>
      </p>

      {/* Badge motivasi */}
      <div
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 
                      rounded-full bg-secondary text-secondary-foreground
                      text-sm font-medium"
      >
        <Sparkles className="w-4 h-4" />
        <span>No Kecot, Let's Go Konsisten!! 💪</span>
      </div>
    </header>
  );
}
