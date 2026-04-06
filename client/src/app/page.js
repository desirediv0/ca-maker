import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedCourses from "@/components/sections/FeaturedCourses";
import BestSellingCourses from "@/components/sections/BestSellingCourses";
import TrendingCourses from "@/components/sections/TrendingCourses";
import HotSellingCourses from "@/components/sections/HotSellingCourses";
import NewArrivals from "@/components/sections/NewArrivals";
import CourseSection from "@/components/sections/CourseSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SocialMediaSection from "@/components/sections/SocialMediaSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HotSellingCourses />
      <FeaturedCourses />
      <BestSellingCourses />
      <TrendingCourses />
      <NewArrivals />
      <CourseSection />
      <StatsSection />
      <TestimonialsSection />
      <SocialMediaSection />
    </main>
  );
}
