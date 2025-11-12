import LeftHero from "@/components/hero-init";
import RightLogin from "@/components/login";


export default function Home() {
  return (
    <div className="h-screen w-full flex bg-background">
      <LeftHero />
      <RightLogin />
    </div>
  );
}