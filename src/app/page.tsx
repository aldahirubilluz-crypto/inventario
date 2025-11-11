import LeftHero from "@/components/hero-init";
import RightLogin from "@/components/login";


export default function Home() {
  return (
    <div className="h-screen w-full  flex bg-linear-to-br from-slate-50 to-slate-100">
      <LeftHero />
      <RightLogin />
    </div>
  );
}