import HeroSection        from "@/components/sections/HeroSection";
import StatsSection        from "@/components/sections/StatsSection";
import FeaturedCourses     from "@/components/sections/FeaturedCourses";
import HotSellingCourses   from "@/components/sections/HotSellingCourses";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SocialMediaSection  from "@/components/sections/SocialMediaSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <HotSellingCourses />
      <FeaturedCourses />
      <TestimonialsSection />
      <SocialMediaSection />
    </main>
  );
}
