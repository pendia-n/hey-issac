import type { Overview } from "../ui/business-overview";

interface DemoBusiness {
  name: string;
  website: string;
  profile: Omit<Overview, "checkedAt">;
}

interface DemoRoom {
  id: string;
  label: string;
  category: "tailor" | "farmer";
  business: DemoBusiness;
  competitors: DemoBusiness[];
  checkedAt: number;
  findings: {
    title: string;
    summary: string;
    implication: string;
    date: string;
    upcoming?: boolean;
    sourceUrl: string;
  }[];
}

const checkedAt = Date.parse("2026-11-08T19:31:51Z");

export const demoRooms: DemoRoom[] = [
  {
    id: "tailor",
    label: "Tailor",
    category: "tailor",
    checkedAt,
    business: {
      name: "Victoria's Secret",
      website: "https://www.victoriassecret.com/",
      profile: {
        summary: "A specialty retailer selling bras, underwear, lingerie, sleepwear and beauty products. This room follows its US intimates business.",
        audience: "Shoppers buying women's intimates, sleepwear and beauty products.",
        businessModel: "Retail sales through its stores and online shop.",
        sourceUrl: "https://www.victoriassecretandco.com/our-company/about-us/",
      },
    },
    competitors: [
      {
        name: "Aerie",
        website: "https://www.ae.com/us/en/c/aerie/cat4840006",
        profile: {
          summary: "American Eagle Outfitters' intimates and apparel brand. Its range includes bras, underwear, loungewear, activewear and swimwear.",
          audience: "Shoppers looking for everyday intimates and casual apparel.",
          businessModel: "Specialty retail through Aerie stores and online sales.",
          overlap: "Both brands sell bras and underwear directly to US shoppers.",
          sourceUrl: "https://www.ae.com/us/en/c/aerie/cat4840006",
        },
      },
      {
        name: "ThirdLove",
        website: "https://www.thirdlove.com/",
        profile: {
          summary: "An intimates brand offering bras, underwear, sleepwear and loungewear. It offers a range of bra sizes and online help with fit.",
          audience: "Shoppers looking for everyday bras and underwear with sizing and fit guidance.",
          businessModel: "Direct sales through its online store.",
          overlap: "Both brands sell everyday bras and underwear to US shoppers. ThirdLove also makes fit guidance part of its offer.",
          sourceUrl: "https://www.thirdlove.com/",
        },
      },
    ],
    findings: [
      {
        title: "Victoria's Secret previews its Angels Among Us series",
        summary: "The brand released a trailer for a YouTube series following aspiring models ahead of its fashion show.",
        implication: "A series can give a campaign several occasions to reach its audience before the main event.",
        date: "2026-09-01",
        sourceUrl: "https://www.victoriassecretandco.com/news-releases/news-release-details/victorias-secret-unveils-exclusive-trailer-angels-among-us",
      },
      {
        title: "Victoria's Secret launches a strapless collection campaign",
        summary: "The brand announced its Season of Strapless campaign and collection featuring WNBA player Angel Reese.",
        implication: "A launch can focus attention on one specific product need, with the partnership drawing attention to that offer.",
        date: "2026-04-07",
        sourceUrl: "https://www.victoriassecretandco.com/news-releases/news-release-details/victorias-secret-and-two-time-wnba-all-star-angel-reese-launch",
      },
    ],
  },
  {
    id: "farmer",
    label: "Farmer",
    category: "farmer",
    checkedAt,
    business: {
      name: "White Oak Pastures",
      website: "https://whiteoakpastures.com/",
      profile: {
        summary: "A family farm in Bluffton, Georgia, that raises and sells grass-fed ground beef alongside other meats and farm products.",
        audience: "Households ordering meat online and customers shopping at the farm's general store or partner retailers.",
        businessModel: "Sells through its online shop and general store, with distribution through grocery retailers.",
        sourceUrl: "https://whiteoakpastures.com/pages/faqs",
      },
    },
    competitors: [
      {
        name: "US Wellness Meats",
        website: "https://grasslandbeef.com/",
        profile: {
          summary: "An online meat retailer selling grass-fed beef, including ground beef, as well as bison, lamb, pork, poultry and seafood.",
          audience: "Households buying grass-fed and pasture-raised meat for delivery.",
          businessModel: "Direct online orders for home delivery, with a wholesale program for businesses.",
          overlap: "Both offer grass-fed ground beef and other cuts to households buying meat online.",
          sourceUrl: "https://grasslandbeef.com/",
        },
      },
      {
        name: "Thousand Hills Lifetime Grazed",
        website: "https://thousandhillslifetimegrazed.com/",
        profile: {
          summary: "A grass-fed beef brand selling ground beef, steaks, roasts, snacks and other beef products.",
          audience: "Shoppers looking for grass-fed beef online or through retail stockists.",
          businessModel: "Sources from partner farms and sells through its online shop and retail stockists.",
          overlap: "Both compete for shoppers choosing grass-fed ground beef online and in grocery stores.",
          sourceUrl: "https://thousandhillslifetimegrazed.com/",
        },
      },
    ],
    findings: [
      {
        title: "White Oak Pastures lists a backyard butchery workshop",
        summary: "The farm's event calendar lists a November 13–14 workshop with Farmstead Meatsmith.",
        implication: "An educational event gives customers a reason to visit the farm in addition to shopping online.",
        date: "2026-11-13",
        upcoming: true,
        sourceUrl: "https://whiteoakpastures.com/pages/wop-education-events",
      },
      {
        title: "White Oak Pastures marks ten years of its general store",
        summary: "The farm published a retrospective about its Bluffton general store and its role in the local community.",
        implication: "For a farm with an online shop, a physical store can also be part of the business story customers remember.",
        date: "2026-10-15",
        sourceUrl: "https://blog.whiteoakpastures.com/blog/general-store-10-year-anniversary",
      },
    ],
  },
];
