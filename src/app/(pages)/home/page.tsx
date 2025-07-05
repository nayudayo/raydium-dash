import Navbar from "@/components/home/Navbar";
import PageContent from "@/components/home/PageContent";

const menuItems = [
  {
    link: "/dex-volume",
    text: "DEX Volume",
    image: "/placeholder-image.jpg"
  },
  {
    link: "/tvl",
    text: "Total Value Locked",
    image: "/placeholder-image.jpg"
  },
  {
    link: "/aggregator-market-share",
    text: "Aggregator Market Share",
    image: "/placeholder-image.jpg"
  },
  {
    link: "/fees",
    text: "Protocol Fees",
    image: "/placeholder-image.jpg"
  },
  {
    link: "/revenue",
    text: "Protocol Revenue",
    image: "/placeholder-image.jpg"
  }
];

export default function HomePage() {
  return (
    <div className="w-full h-screen bg-black">
      <Navbar items={menuItems} />
      <PageContent />
    </div>
  );
}
