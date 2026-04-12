import type { Platform } from "@/types/database"

export interface SeededCommunity {
  platform: Platform
  platform_type: "reddit" | "founder" | "blog" | "directory"
  name: string
  url: string
  tags: string[]
  vertical: string
  audience_type: string
  members: number
  self_promo_allowed: boolean
  links_allowed: boolean
  quality_score: number   // 1-5
  activity_score: number  // 1-5
  content_type: string
  rules_summary: string
}

// ─────────────────────────────────────────────────────────────────────────────
// REDDIT COMMUNITIES (200+)
// ─────────────────────────────────────────────────────────────────────────────
export const REDDIT_COMMUNITIES: SeededCommunity[] = [
  // ── STARTUP / FOUNDER (bucket 1 — always included) ───────────────────────
  { platform:"reddit", platform_type:"reddit", name:"SideProject", url:"https://reddit.com/r/SideProject/", vertical:"startup", audience_type:"founders", tags:["startup","founder","sideproject","maker","saas","product","launch","indie"], members:350000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Dedicated to sharing side projects. Self-promotion explicitly welcome." },
  { platform:"reddit", platform_type:"reddit", name:"IMadeThis", url:"https://reddit.com/r/IMadeThis/", vertical:"startup", audience_type:"makers", tags:["startup","maker","creator","product","launch","sideproject","build"], members:190000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Share things you made. All creative and technical work welcome." },
  { platform:"reddit", platform_type:"reddit", name:"startups", url:"https://reddit.com/r/startups/", vertical:"startup", audience_type:"founders", tags:["startup","founder","entrepreneur","saas","product","business","launch"], members:2700000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"discussion", rules_summary:"Feedback threads and launch posts allowed. No blatant spam." },
  { platform:"reddit", platform_type:"reddit", name:"entrepreneur", url:"https://reddit.com/r/entrepreneur/", vertical:"startup", audience_type:"entrepreneurs", tags:["startup","founder","entrepreneur","business","smallbusiness","growth","launch"], members:1200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"discussion", rules_summary:"Self-promotion allowed if value added." },
  { platform:"reddit", platform_type:"reddit", name:"SaaS", url:"https://reddit.com/r/SaaS/", vertical:"startup", audience_type:"saas_founders", tags:["startup","saas","software","product","founder","tool","subscription","b2b"], members:95000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"SaaS founders welcome. Share your product." },
  { platform:"reddit", platform_type:"reddit", name:"indiehackers", url:"https://reddit.com/r/indiehackers/", vertical:"startup", audience_type:"indie_hackers", tags:["startup","founder","indiehacker","maker","saas","bootstrapped","revenue","mrr"], members:120000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Share indie projects, milestones, and feedback." },
  { platform:"reddit", platform_type:"reddit", name:"Entrepreneur", url:"https://reddit.com/r/Entrepreneur/", vertical:"startup", audience_type:"entrepreneurs", tags:["startup","entrepreneur","business","founder","smallbusiness","growth"], members:1200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Entrepreneur discussions. Launch posts allowed." },
  { platform:"reddit", platform_type:"reddit", name:"smallbusiness", url:"https://reddit.com/r/smallbusiness/", vertical:"startup", audience_type:"small_business", tags:["startup","smallbusiness","business","entrepreneur","founder","local"], members:400000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Questions and sharing about small businesses." },
  { platform:"reddit", platform_type:"reddit", name:"RoastMyStartup", url:"https://reddit.com/r/RoastMyStartup/", vertical:"startup", audience_type:"founders", tags:["startup","founder","feedback","roast","product","launch","critique"], members:45000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"feedback", rules_summary:"Get your startup roasted. Honest feedback required." },
  { platform:"reddit", platform_type:"reddit", name:"GrowthHacking", url:"https://reddit.com/r/GrowthHacking/", vertical:"startup", audience_type:"growth_marketers", tags:["startup","growth","marketing","acquisition","saas","product","funnel"], members:78000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"discussion", rules_summary:"Growth tools and strategies." },
  { platform:"reddit", platform_type:"reddit", name:"alphaandbetausers", url:"https://reddit.com/r/alphaandbetausers/", vertical:"startup", audience_type:"early_adopters", tags:["startup","beta","alpha","testing","launch","product","feedback"], members:62000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Find beta testers for your product." },
  { platform:"reddit", platform_type:"reddit", name:"Entrepreneur_Feedback", url:"https://reddit.com/r/Entrepreneur_Feedback/", vertical:"startup", audience_type:"founders", tags:["startup","feedback","entrepreneur","product","launch","validate"], members:25000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:3, content_type:"feedback", rules_summary:"Get feedback on your business idea or product." },
  { platform:"reddit", platform_type:"reddit", name:"startupideas", url:"https://reddit.com/r/startupideas/", vertical:"startup", audience_type:"founders", tags:["startup","idea","founder","validate","product","build"], members:110000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Share and validate startup ideas." },
  { platform:"reddit", platform_type:"reddit", name:"microsaas", url:"https://reddit.com/r/microsaas/", vertical:"startup", audience_type:"indie_hackers", tags:["microsaas","saas","indie","founder","bootstrapped","revenue","solo"], members:35000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Micro SaaS founders sharing products." },
  { platform:"reddit", platform_type:"reddit", name:"nocode", url:"https://reddit.com/r/nocode/", vertical:"startup", audience_type:"nocode_makers", tags:["nocode","tool","saas","automation","product","maker","startup","bubble"], members:110000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"No-code tools and projects welcome." },

  // ── TECH / DEV ────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"webdev", url:"https://reddit.com/r/webdev/", vertical:"tech", audience_type:"developers", tags:["tech","webdev","developer","programming","javascript","frontend","backend","tool","saas"], members:920000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Showcase threads allowed. Share what you built." },
  { platform:"reddit", platform_type:"reddit", name:"reactjs", url:"https://reddit.com/r/reactjs/", vertical:"tech", audience_type:"frontend_devs", tags:["tech","react","javascript","frontend","webdev","developer","tool","nextjs"], members:410000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Show your React projects." },
  { platform:"reddit", platform_type:"reddit", name:"Python", url:"https://reddit.com/r/Python/", vertical:"tech", audience_type:"python_devs", tags:["tech","python","programming","developer","automation","ai","tool","script","django","flask"], members:1200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Share Python projects and tools." },
  { platform:"reddit", platform_type:"reddit", name:"learnprogramming", url:"https://reddit.com/r/learnprogramming/", vertical:"tech", audience_type:"learners", tags:["tech","programming","developer","code","learning","education","tool","beginner"], members:3800000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Learning resources and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"javascript", url:"https://reddit.com/r/javascript/", vertical:"tech", audience_type:"js_devs", tags:["javascript","js","frontend","webdev","developer","node","typescript","tool"], members:2000000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"JS projects and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"typescript", url:"https://reddit.com/r/typescript/", vertical:"tech", audience_type:"ts_devs", tags:["typescript","javascript","frontend","developer","tool","saas","react"], members:160000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"TypeScript projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"node", url:"https://reddit.com/r/node/", vertical:"tech", audience_type:"node_devs", tags:["node","javascript","backend","developer","api","tool","server"], members:280000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Node.js projects and tools." },
  { platform:"reddit", platform_type:"reddit", name:"golang", url:"https://reddit.com/r/golang/", vertical:"tech", audience_type:"go_devs", tags:["golang","go","developer","backend","tool","microservices","api"], members:340000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Go projects and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"rust", url:"https://reddit.com/r/rust/", vertical:"tech", audience_type:"rust_devs", tags:["rust","systems","developer","tool","performance","backend"], members:380000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Rust projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"devops", url:"https://reddit.com/r/devops/", vertical:"tech", audience_type:"devops_engineers", tags:["devops","developer","tech","automation","cloud","infrastructure","tool","ci","cd","aws"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"DevOps tools and resources." },
  { platform:"reddit", platform_type:"reddit", name:"aws", url:"https://reddit.com/r/aws/", vertical:"tech", audience_type:"cloud_devs", tags:["aws","cloud","developer","infrastructure","serverless","tool","backend"], members:350000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"AWS tools and resources." },
  { platform:"reddit", platform_type:"reddit", name:"selfhosted", url:"https://reddit.com/r/selfhosted/", vertical:"tech", audience_type:"power_users", tags:["selfhosted","opensource","tool","homelab","server","privacy","developer"], members:410000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Self-hosted tools explicitly welcome." },
  { platform:"reddit", platform_type:"reddit", name:"opensource", url:"https://reddit.com/r/opensource/", vertical:"tech", audience_type:"oss_devs", tags:["opensource","developer","tool","code","github","community","free"], members:180000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Open source projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"flask", url:"https://reddit.com/r/flask/", vertical:"tech", audience_type:"python_devs", tags:["flask","python","web","backend","developer","api","tool"], members:90000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:3, content_type:"launch", rules_summary:"Flask projects and tools." },
  { platform:"reddit", platform_type:"reddit", name:"django", url:"https://reddit.com/r/django/", vertical:"tech", audience_type:"python_devs", tags:["django","python","web","backend","developer","api","tool","saas"], members:130000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Django projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"nextjs", url:"https://reddit.com/r/nextjs/", vertical:"tech", audience_type:"frontend_devs", tags:["nextjs","react","javascript","frontend","developer","saas","tool","vercel"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Next.js projects and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"vuejs", url:"https://reddit.com/r/vuejs/", vertical:"tech", audience_type:"frontend_devs", tags:["vue","javascript","frontend","developer","tool","spa"], members:150000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Vue.js projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"sveltejs", url:"https://reddit.com/r/sveltejs/", vertical:"tech", audience_type:"frontend_devs", tags:["svelte","javascript","frontend","developer","tool","webapp"], members:95000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Svelte projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"ExperiencedDevs", url:"https://reddit.com/r/ExperiencedDevs/", vertical:"tech", audience_type:"senior_devs", tags:["developer","career","senior","engineering","tool","productivity"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Dev tools and discussion for experienced developers." },
  { platform:"reddit", platform_type:"reddit", name:"programming", url:"https://reddit.com/r/programming/", vertical:"tech", audience_type:"developers", tags:["programming","developer","code","tool","tech","computer_science"], members:5500000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Programming projects and tools." },

  // ── AI / ML ───────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"artificial", url:"https://reddit.com/r/artificial/", vertical:"ai", audience_type:"ai_enthusiasts", tags:["ai","ml","machinelearning","tech","automation","tool","saas","product","llm"], members:310000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"AI tools and projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"MachineLearning", url:"https://reddit.com/r/MachineLearning/", vertical:"ai", audience_type:"ml_researchers", tags:["ai","ml","machinelearning","research","tech","developer","model","deeplearning"], members:2400000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Research and tools. Project sharing allowed." },
  { platform:"reddit", platform_type:"reddit", name:"ChatGPT", url:"https://reddit.com/r/ChatGPT/", vertical:"ai", audience_type:"ai_users", tags:["ai","llm","chatgpt","openai","tech","automation","tool","prompt","gpt"], members:5100000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"AI tools and projects." },
  { platform:"reddit", platform_type:"reddit", name:"LocalLLaMA", url:"https://reddit.com/r/LocalLLaMA/", vertical:"ai", audience_type:"ai_devs", tags:["ai","llm","llama","local","model","developer","tech","selfhosted","opensource"], members:190000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Local LLM tools and projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"singularity", url:"https://reddit.com/r/singularity/", vertical:"ai", audience_type:"ai_enthusiasts", tags:["ai","agi","future","tech","automation","tool"], members:1100000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:5, content_type:"discussion", rules_summary:"AI and future tech discussion." },
  { platform:"reddit", platform_type:"reddit", name:"PromptEngineering", url:"https://reddit.com/r/PromptEngineering/", vertical:"ai", audience_type:"ai_users", tags:["ai","prompt","llm","chatgpt","tool","developer","automation"], members:180000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Prompt tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"datascience", url:"https://reddit.com/r/datascience/", vertical:"ai", audience_type:"data_scientists", tags:["datascience","ml","ai","python","developer","tool","analytics","data"], members:1600000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Data science tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"deeplearning", url:"https://reddit.com/r/deeplearning/", vertical:"ai", audience_type:"ml_researchers", tags:["deeplearning","ai","ml","neural","model","research","developer"], members:120000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Deep learning projects and tools." },

  // ── DESIGN ────────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"web_design", url:"https://reddit.com/r/web_design/", vertical:"design", audience_type:"designers", tags:["design","webdesign","ui","ux","frontend","creative","tool","website","figma"], members:890000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Share your designs and tools." },
  { platform:"reddit", platform_type:"reddit", name:"UI_Design", url:"https://reddit.com/r/UI_Design/", vertical:"design", audience_type:"ui_designers", tags:["design","ui","ux","product","app","interface","creative","figma","prototype"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"UI design showcase welcome." },
  { platform:"reddit", platform_type:"reddit", name:"graphic_design", url:"https://reddit.com/r/graphic_design/", vertical:"design", audience_type:"graphic_designers", tags:["design","graphic","visual","creative","art","branding","logo","photoshop"], members:5100000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Share your design work in designated threads." },
  { platform:"reddit", platform_type:"reddit", name:"userexperience", url:"https://reddit.com/r/userexperience/", vertical:"design", audience_type:"ux_designers", tags:["ux","design","research","usability","product","interface","tool","wireframe"], members:220000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"UX tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"logodesign", url:"https://reddit.com/r/logodesign/", vertical:"design", audience_type:"logo_designers", tags:["logo","design","branding","graphic","creative","startup","identity"], members:300000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Logo and brand design work welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Figma", url:"https://reddit.com/r/Figma/", vertical:"design", audience_type:"figma_users", tags:["figma","design","ui","ux","prototype","tool","plugin","product"], members:140000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Figma tools and plugins welcome." },
  { platform:"reddit", platform_type:"reddit", name:"branding", url:"https://reddit.com/r/branding/", vertical:"design", audience_type:"brand_designers", tags:["branding","design","identity","logo","marketing","startup","visual"], members:65000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:3, content_type:"launch", rules_summary:"Branding projects and tools." },

  // ── MARKETING / GROWTH ────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"digital_marketing", url:"https://reddit.com/r/digital_marketing/", vertical:"marketing", audience_type:"marketers", tags:["marketing","growth","seo","ads","social","content","startup","business","tool"], members:430000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Marketing tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"SEO", url:"https://reddit.com/r/SEO/", vertical:"marketing", audience_type:"seo_specialists", tags:["seo","marketing","growth","content","traffic","website","tool","google"], members:410000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"SEO tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"growthhacking", url:"https://reddit.com/r/growthhacking/", vertical:"marketing", audience_type:"growth_hackers", tags:["growth","marketing","startup","saas","acquisition","retention","product","funnel"], members:130000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Share growth tools and strategies." },
  { platform:"reddit", platform_type:"reddit", name:"content_marketing", url:"https://reddit.com/r/content_marketing/", vertical:"marketing", audience_type:"content_marketers", tags:["content","marketing","writing","seo","blog","creator","tool","copywriting"], members:100000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Content tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"emailmarketing", url:"https://reddit.com/r/emailmarketing/", vertical:"marketing", audience_type:"email_marketers", tags:["email","marketing","newsletter","tool","saas","automation","list"], members:75000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Email marketing tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"socialmedia", url:"https://reddit.com/r/socialmedia/", vertical:"marketing", audience_type:"social_media_managers", tags:["social","marketing","content","tool","instagram","twitter","tiktok","growth"], members:280000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Social media tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"copywriting", url:"https://reddit.com/r/copywriting/", vertical:"marketing", audience_type:"copywriters", tags:["copywriting","writing","marketing","content","tool","ai","text","ads"], members:160000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Copywriting tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"PPC", url:"https://reddit.com/r/PPC/", vertical:"marketing", audience_type:"paid_advertisers", tags:["ppc","ads","google","marketing","growth","tool","roi","b2b"], members:140000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Paid advertising tools welcome." },

  // ── PRODUCTIVITY ──────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"productivity", url:"https://reddit.com/r/productivity/", vertical:"productivity", audience_type:"knowledge_workers", tags:["productivity","tool","app","workflow","focus","task","organization","startup","gtd"], members:1300000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Productivity tools and apps welcome with substance." },
  { platform:"reddit", platform_type:"reddit", name:"selfimprovement", url:"https://reddit.com/r/selfimprovement/", vertical:"productivity", audience_type:"self_improvers", tags:["selfimprovement","productivity","habit","health","app","tool","learning","morning"], members:1200000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Self-improvement tools welcome. Link with context." },
  { platform:"reddit", platform_type:"reddit", name:"Notion", url:"https://reddit.com/r/Notion/", vertical:"productivity", audience_type:"notion_users", tags:["productivity","notion","tool","organization","template","workflow","saas","database"], members:380000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Notion tools and templates welcome." },
  { platform:"reddit", platform_type:"reddit", name:"ObsidianMD", url:"https://reddit.com/r/ObsidianMD/", vertical:"productivity", audience_type:"obsidian_users", tags:["obsidian","notes","pkm","productivity","tool","plugin","knowledge","writing"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Obsidian plugins and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"taskade", url:"https://reddit.com/r/taskade/", vertical:"productivity", audience_type:"productivity_users", tags:["productivity","tool","task","collaboration","team","ai"], members:15000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:3, content_type:"launch", rules_summary:"Productivity tool alternatives welcome." },
  { platform:"reddit", platform_type:"reddit", name:"LifeProTips", url:"https://reddit.com/r/LifeProTips/", vertical:"productivity", audience_type:"general", tags:["productivity","tip","tool","life","hack","app","workflow"], members:23000000, self_promo_allowed:true, links_allowed:false, quality_score:3, activity_score:5, content_type:"tip", rules_summary:"Life tips with substance. No direct ads." },

  // ── MUSIC / AUDIO ─────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"WeAreTheMusicMakers", url:"https://reddit.com/r/WeAreTheMusicMakers/", vertical:"music", audience_type:"music_producers", tags:["music","producer","audio","daw","beat","artist","creator","musicproduction","ableton","logic"], members:1500000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Music tools and production projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"audioengineering", url:"https://reddit.com/r/audioengineering/", vertical:"music", audience_type:"audio_engineers", tags:["audio","music","recording","mixing","mastering","sound","tool","plugin","daw"], members:310000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Audio tools and plugins welcome." },
  { platform:"reddit", platform_type:"reddit", name:"edmproduction", url:"https://reddit.com/r/edmproduction/", vertical:"music", audience_type:"edm_producers", tags:["music","edm","producer","electronic","daw","beat","plugin","audio","ableton","synth"], members:300000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"EDM tools and plugins. Feedback welcome." },
  { platform:"reddit", platform_type:"reddit", name:"makinghiphop", url:"https://reddit.com/r/makinghiphop/", vertical:"music", audience_type:"hip_hop_producers", tags:["music","hiphop","rap","beat","producer","audio","creator","fl_studio","sample"], members:185000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Share beats and music tools." },
  { platform:"reddit", platform_type:"reddit", name:"Guitar", url:"https://reddit.com/r/Guitar/", vertical:"music", audience_type:"guitarists", tags:["guitar","music","instrument","player","gear","tool","learning","tab"], members:1200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Guitar tools and apps welcome." },
  { platform:"reddit", platform_type:"reddit", name:"singing", url:"https://reddit.com/r/singing/", vertical:"music", audience_type:"singers", tags:["singing","vocal","music","artist","training","tool","app"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Singing tools and apps." },
  { platform:"reddit", platform_type:"reddit", name:"MusicInTheMaking", url:"https://reddit.com/r/MusicInTheMaking/", vertical:"music", audience_type:"musicians", tags:["music","musician","making","creator","tool","artist","production"], members:35000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Music creation tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"synthesizers", url:"https://reddit.com/r/synthesizers/", vertical:"music", audience_type:"synth_enthusiasts", tags:["synth","music","electronic","hardware","software","plugin","audio","producer"], members:280000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Synth tools and plugins welcome." },

  // ── FITNESS / HEALTH ──────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"bodyweightfitness", url:"https://reddit.com/r/bodyweightfitness/", vertical:"fitness", audience_type:"fitness_enthusiasts", tags:["fitness","health","workout","exercise","training","app","tool","calisthenics"], members:2100000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Fitness apps and tools allowed in weekly threads." },
  { platform:"reddit", platform_type:"reddit", name:"running", url:"https://reddit.com/r/running/", vertical:"fitness", audience_type:"runners", tags:["fitness","running","health","training","marathon","app","tracker","garmin","strava"], members:2000000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Running apps and tools allowed." },
  { platform:"reddit", platform_type:"reddit", name:"loseit", url:"https://reddit.com/r/loseit/", vertical:"fitness", audience_type:"weight_loss", tags:["health","fitness","weightloss","diet","calories","app","tracker","nutrition"], members:3800000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Weight loss tools allowed in designated threads." },
  { platform:"reddit", platform_type:"reddit", name:"nutrition", url:"https://reddit.com/r/nutrition/", vertical:"fitness", audience_type:"health_conscious", tags:["health","nutrition","food","diet","wellness","fitness","app","supplement"], members:500000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Nutrition tools with context." },
  { platform:"reddit", platform_type:"reddit", name:"yoga", url:"https://reddit.com/r/yoga/", vertical:"fitness", audience_type:"yoga_practitioners", tags:["yoga","fitness","wellness","mindfulness","health","app","training"], members:550000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Yoga apps and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"cycling", url:"https://reddit.com/r/cycling/", vertical:"fitness", audience_type:"cyclists", tags:["cycling","fitness","bike","training","health","app","tracker","route"], members:1100000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Cycling apps and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Fitness", url:"https://reddit.com/r/Fitness/", vertical:"fitness", audience_type:"fitness_enthusiasts", tags:["fitness","workout","health","exercise","training","app","supplement","gym"], members:10000000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Fitness tools discussed with substance." },
  { platform:"reddit", platform_type:"reddit", name:"swimming", url:"https://reddit.com/r/swimming/", vertical:"fitness", audience_type:"swimmers", tags:["swimming","fitness","health","training","sport","app","tracker"], members:280000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:4, content_type:"launch", rules_summary:"Swimming apps and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Meditation", url:"https://reddit.com/r/Meditation/", vertical:"fitness", audience_type:"meditators", tags:["meditation","mindfulness","wellness","app","health","focus","calm","stress"], members:500000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Meditation apps and tools welcome." },

  // ── EDUCATION / LEARNING ──────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"languagelearning", url:"https://reddit.com/r/languagelearning/", vertical:"education", audience_type:"language_learners", tags:["education","language","learning","app","tool","study","linguistics","duolingo"], members:1000000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Language learning tools and apps welcome." },
  { platform:"reddit", platform_type:"reddit", name:"edtech", url:"https://reddit.com/r/edtech/", vertical:"education", audience_type:"edtech_founders", tags:["education","edtech","learning","teaching","tool","app","startup","saas","lms"], members:60000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"EdTech tools and products. Sharing welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Teachers", url:"https://reddit.com/r/Teachers/", vertical:"education", audience_type:"teachers", tags:["education","teaching","teacher","school","tool","classroom","app","curriculum"], members:300000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Teaching tools welcome with context." },
  { platform:"reddit", platform_type:"reddit", name:"GetStudying", url:"https://reddit.com/r/GetStudying/", vertical:"education", audience_type:"students", tags:["education","studying","student","tool","app","focus","learning","productivity"], members:450000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Study tools and apps welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Anki", url:"https://reddit.com/r/Anki/", vertical:"education", audience_type:"anki_users", tags:["anki","flashcard","education","tool","plugin","study","learning","memory"], members:120000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Anki tools and addons welcome." },
  { platform:"reddit", platform_type:"reddit", name:"math", url:"https://reddit.com/r/math/", vertical:"education", audience_type:"math_enthusiasts", tags:["math","education","learning","tool","calculator","algorithm","research"], members:1100000, self_promo_allowed:true, links_allowed:true, quality_score:3, activity_score:4, content_type:"discussion", rules_summary:"Math tools with substance." },

  // ── GAMING / GAMEDEV ──────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"gamedev", url:"https://reddit.com/r/gamedev/", vertical:"gaming", audience_type:"game_developers", tags:["gamedev","gaming","game","developer","indie","unity","unreal","tool","godot"], members:620000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Feedback Friday threads for game promotion." },
  { platform:"reddit", platform_type:"reddit", name:"indiegaming", url:"https://reddit.com/r/indiegaming/", vertical:"gaming", audience_type:"indie_gamers", tags:["gaming","indie","game","developer","launch","player","steam","itch"], members:210000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Indie games explicitly welcome." },
  { platform:"reddit", platform_type:"reddit", name:"indiegames", url:"https://reddit.com/r/indiegames/", vertical:"gaming", audience_type:"indie_gamers", tags:["gaming","indie","game","launch","developer","player","steam","itch","pixel"], members:110000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Share your indie game." },
  { platform:"reddit", platform_type:"reddit", name:"Unity3D", url:"https://reddit.com/r/Unity3D/", vertical:"gaming", audience_type:"unity_devs", tags:["unity","gamedev","game","developer","tool","3d","indie","engine"], members:430000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Unity projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"godot", url:"https://reddit.com/r/godot/", vertical:"gaming", audience_type:"godot_devs", tags:["godot","gamedev","game","developer","opensource","engine","indie","tool"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Godot projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"gamedesign", url:"https://reddit.com/r/gamedesign/", vertical:"gaming", audience_type:"game_designers", tags:["gamedesign","game","design","developer","mechanics","ux","indie","tool"], members:140000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Game design tools and discussion." },

  // ── REMOTE WORK / FREELANCE ───────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"digitalnomad", url:"https://reddit.com/r/digitalnomad/", vertical:"remote_work", audience_type:"digital_nomads", tags:["remotework","freelance","travel","digital","nomad","tool","productivity","app","location"], members:600000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Remote work tools allowed." },
  { platform:"reddit", platform_type:"reddit", name:"freelance", url:"https://reddit.com/r/freelance/", vertical:"remote_work", audience_type:"freelancers", tags:["freelance","remotework","business","tool","productivity","client","invoice","contract"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Freelance tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"WorkOnline", url:"https://reddit.com/r/WorkOnline/", vertical:"remote_work", audience_type:"online_workers", tags:["remotework","online","freelance","income","tool","app","platform","gig"], members:500000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Online work tools and platforms welcome." },
  { platform:"reddit", platform_type:"reddit", name:"remotework", url:"https://reddit.com/r/remotework/", vertical:"remote_work", audience_type:"remote_workers", tags:["remotework","remote","tool","productivity","async","team","collaboration","app"], members:280000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Remote work tools welcome." },

  // ── FINANCE / FINTECH ─────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"personalfinance", url:"https://reddit.com/r/personalfinance/", vertical:"finance", audience_type:"consumers", tags:["finance","money","budget","savings","investing","tool","app","fintech","bank"], members:18000000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Finance tools in weekly threads." },
  { platform:"reddit", platform_type:"reddit", name:"financialindependence", url:"https://reddit.com/r/financialindependence/", vertical:"finance", audience_type:"fire_community", tags:["finance","fire","investing","passive","wealth","tool","app","calculator","frugal"], members:1500000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Finance tools welcome with context." },
  { platform:"reddit", platform_type:"reddit", name:"fintech", url:"https://reddit.com/r/fintech/", vertical:"finance", audience_type:"fintech_founders", tags:["fintech","finance","startup","tech","payment","banking","tool","saas","api"], members:90000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Fintech tools and products welcome." },
  { platform:"reddit", platform_type:"reddit", name:"CryptoTechnology", url:"https://reddit.com/r/CryptoTechnology/", vertical:"finance", audience_type:"crypto_devs", tags:["crypto","blockchain","defi","web3","developer","tool","fintech","decentralized"], members:220000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Crypto tech tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"accounting", url:"https://reddit.com/r/accounting/", vertical:"finance", audience_type:"accountants", tags:["accounting","finance","tool","saas","small_business","tax","invoice","bookkeeping"], members:270000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Accounting tools welcome." },

  // ── E-COMMERCE ────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"ecommerce", url:"https://reddit.com/r/ecommerce/", vertical:"ecommerce", audience_type:"ecommerce_sellers", tags:["ecommerce","shop","store","sales","product","business","startup","tool","dropshipping"], members:400000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Ecommerce tools and resources." },
  { platform:"reddit", platform_type:"reddit", name:"shopify", url:"https://reddit.com/r/shopify/", vertical:"ecommerce", audience_type:"shopify_sellers", tags:["shopify","ecommerce","store","product","sales","tool","app","plugin","merchant"], members:230000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Shopify apps and tools welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Etsy", url:"https://reddit.com/r/Etsy/", vertical:"ecommerce", audience_type:"etsy_sellers", tags:["etsy","ecommerce","handmade","craft","seller","shop","creative","tool","product"], members:380000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Etsy tools and seller resources." },
  { platform:"reddit", platform_type:"reddit", name:"AmazonSeller", url:"https://reddit.com/r/AmazonSeller/", vertical:"ecommerce", audience_type:"amazon_sellers", tags:["amazon","ecommerce","fba","seller","product","tool","fulfillment","listing"], members:115000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Amazon selling tools welcome." },

  // ── CREATOR ECONOMY ───────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"Creator_Economy", url:"https://reddit.com/r/Creator_Economy/", vertical:"creator", audience_type:"creators", tags:["creator","content","youtube","tiktok","newsletter","monetize","tool","saas","audience"], members:45000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Creator economy tools and products welcome." },
  { platform:"reddit", platform_type:"reddit", name:"NewTubers", url:"https://reddit.com/r/NewTubers/", vertical:"creator", audience_type:"youtubers", tags:["youtube","creator","video","channel","content","tool","app","growth","editing"], members:380000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"YouTube tools and apps explicitly welcome." },
  { platform:"reddit", platform_type:"reddit", name:"newsletters", url:"https://reddit.com/r/newsletters/", vertical:"creator", audience_type:"newsletter_creators", tags:["newsletter","email","creator","content","writing","tool","platform","audience","substack"], members:30000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Newsletter tools and platforms welcome." },
  { platform:"reddit", platform_type:"reddit", name:"podcasting", url:"https://reddit.com/r/podcasting/", vertical:"creator", audience_type:"podcasters", tags:["podcast","audio","creator","content","tool","hosting","editing","app","microphone"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Podcasting tools and apps welcome." },
  { platform:"reddit", platform_type:"reddit", name:"blogging", url:"https://reddit.com/r/blogging/", vertical:"creator", audience_type:"bloggers", tags:["blog","writing","content","creator","seo","tool","platform","marketing","wordpress"], members:190000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Blogging tools and platforms welcome." },
  { platform:"reddit", platform_type:"reddit", name:"writing", url:"https://reddit.com/r/writing/", vertical:"creator", audience_type:"writers", tags:["writing","creative","author","novel","tool","app","content","blog","fiction"], members:2000000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Writing tools welcome in designated threads." },

  // ── PHOTO / VIDEO ─────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"photography", url:"https://reddit.com/r/photography/", vertical:"design", audience_type:"photographers", tags:["photography","photo","camera","visual","creative","tool","app","editor","lightroom"], members:5000000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Photography tools welcome in Self-Promotion threads." },
  { platform:"reddit", platform_type:"reddit", name:"videography", url:"https://reddit.com/r/videography/", vertical:"design", audience_type:"videographers", tags:["video","film","creator","youtube","editing","tool","app","camera","premiere"], members:380000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Video tools and projects welcome." },
  { platform:"reddit", platform_type:"reddit", name:"editors", url:"https://reddit.com/r/editors/", vertical:"design", audience_type:"video_editors", tags:["video","editing","film","tool","software","creative","youtube","davinci"], members:110000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Editing tools and resources welcome." },

  // ── MENTAL HEALTH / WELLNESS ──────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"mentalhealth", url:"https://reddit.com/r/mentalhealth/", vertical:"health", audience_type:"general", tags:["mentalhealth","wellness","anxiety","mindfulness","app","therapy","tool","mood"], members:800000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:5, content_type:"discussion", rules_summary:"Mental health tools with empathy. No hard promotion." },
  { platform:"reddit", platform_type:"reddit", name:"therapy", url:"https://reddit.com/r/therapy/", vertical:"health", audience_type:"therapy_seekers", tags:["therapy","mentalhealth","wellness","app","online","tool","cbt","mindfulness"], members:200000, self_promo_allowed:true, links_allowed:false, quality_score:4, activity_score:4, content_type:"discussion", rules_summary:"Therapy tools with empathy." },
  { platform:"reddit", platform_type:"reddit", name:"Anxiety", url:"https://reddit.com/r/Anxiety/", vertical:"health", audience_type:"anxiety_sufferers", tags:["anxiety","mentalhealth","wellness","app","tool","therapy","stress","cbt"], members:700000, self_promo_allowed:true, links_allowed:false, quality_score:3, activity_score:5, content_type:"discussion", rules_summary:"Supportive community. Tools with context." },

  // ── LEGAL / HR ────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"LegalAdvice", url:"https://reddit.com/r/LegalAdvice/", vertical:"startup", audience_type:"general", tags:["legal","business","startup","contract","tool","compliance","saas"], members:1900000, self_promo_allowed:false, links_allowed:false, quality_score:2, activity_score:5, content_type:"discussion", rules_summary:"No self-promotion. Information only." },
  { platform:"reddit", platform_type:"reddit", name:"humanresources", url:"https://reddit.com/r/humanresources/", vertical:"startup", audience_type:"hr_professionals", tags:["hr","hiring","tool","saas","recruitment","people","startup","b2b","management"], members:95000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"HR tools and resources welcome." },

  // ── REAL ESTATE / PROPERTY ───────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"realestateinvesting", url:"https://reddit.com/r/realestateinvesting/", vertical:"finance", audience_type:"real_estate_investors", tags:["realestate","investing","property","tool","app","analysis","deal","saas","finance"], members:1200000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Real estate tools and analysis apps welcome." },
  { platform:"reddit", platform_type:"reddit", name:"landlord", url:"https://reddit.com/r/landlord/", vertical:"finance", audience_type:"landlords", tags:["realestate","landlord","property","tool","app","management","tenant","saas"], members:220000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Landlord tools and property management apps." },

  // ── PETS ─────────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"dogs", url:"https://reddit.com/r/dogs/", vertical:"pets", audience_type:"dog_owners", tags:["dogs","pets","animal","owner","care","app","tool","training","health"], members:2700000, self_promo_allowed:true, links_allowed:false, quality_score:3, activity_score:5, content_type:"discussion", rules_summary:"Dog care tools with substance." },
  { platform:"reddit", platform_type:"reddit", name:"cats", url:"https://reddit.com/r/cats/", vertical:"pets", audience_type:"cat_owners", tags:["cats","pets","animal","owner","care","app","tool","health","behavior"], members:5600000, self_promo_allowed:false, links_allowed:false, quality_score:2, activity_score:5, content_type:"community", rules_summary:"No self-promotion. Photos only." },

  // ── EVENTS / PRODUCTION / CREW ───────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"EventProduction", url:"https://reddit.com/r/EventProduction/", vertical:"events", audience_type:"event_producers", tags:["event","production","crew","backstage","av","lighting","sound","staging","venue","live","concert","festival"], members:45000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Event production tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"eventplanning", url:"https://reddit.com/r/eventplanning/", vertical:"events", audience_type:"event_planners", tags:["event","planning","organizer","coordinator","venue","booking","crew","catering","wedding","corporate","tool","app","management"], members:120000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Event planning tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"weddingplanning", url:"https://reddit.com/r/weddingplanning/", vertical:"events", audience_type:"wedding_planners", tags:["wedding","event","planning","venue","photographer","videographer","crew","coordinator","booking","tool"], members:650000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Wedding planning tools and vendor resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"Filmmakers", url:"https://reddit.com/r/Filmmakers/", vertical:"events", audience_type:"filmmakers", tags:["film","filmmaker","video","camera","crew","production","cinematography","lighting","director","set","shoot"], members:680000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:5, content_type:"launch", rules_summary:"Film tools and crew resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"cinematography", url:"https://reddit.com/r/cinematography/", vertical:"events", audience_type:"cinematographers", tags:["cinematography","camera","film","lighting","crew","video","production","dop","director","lens","set"], members:190000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Cinematography tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"lightingdesign", url:"https://reddit.com/r/lightingdesign/", vertical:"events", audience_type:"lighting_designers", tags:["lighting","design","event","production","stage","concert","live","crew","technician","rig","dmx","fixture"], members:28000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Lighting tools and job resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"stagemanagers", url:"https://reddit.com/r/stagemanagers/", vertical:"events", audience_type:"stage_managers", tags:["stage","management","theater","event","crew","production","backstage","callsheet","show","live"], members:22000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Stage management tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"livesound", url:"https://reddit.com/r/livesound/", vertical:"events", audience_type:"sound_engineers", tags:["sound","audio","live","event","production","crew","engineer","pa","mixing","concert","festival"], members:65000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Live sound tools and resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"videoproduction", url:"https://reddit.com/r/videoproduction/", vertical:"events", audience_type:"video_producers", tags:["video","production","camera","crew","filming","editing","corporate","event","shoot","freelance"], members:95000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Video production tools and crew resources welcome." },
  { platform:"reddit", platform_type:"reddit", name:"HireAn8ter", url:"https://reddit.com/r/HireAn8ter/", vertical:"events", audience_type:"filmmakers", tags:["hire","crew","film","video","camera","freelance","production","operator","talent","marketplace"], members:18000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:3, content_type:"launch", rules_summary:"Hire and find film crew. Marketplace posts welcome." },
  { platform:"reddit", platform_type:"reddit", name:"freelance", url:"https://reddit.com/r/freelance/", vertical:"freelance", audience_type:"freelancers", tags:["freelance","hire","marketplace","gig","client","contract","rate","platform","crew","talent","booking","work"], members:200000, self_promo_allowed:true, links_allowed:true, quality_score:5, activity_score:4, content_type:"launch", rules_summary:"Freelance tools and platforms welcome." },
  { platform:"reddit", platform_type:"reddit", name:"WorkOnline", url:"https://reddit.com/r/WorkOnline/", vertical:"freelance", audience_type:"online_workers", tags:["freelance","platform","marketplace","hire","gig","online","tool","app"], members:500000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:4, content_type:"launch", rules_summary:"Online work platforms welcome." },

  // ── FOOD / COOKING ────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"Cooking", url:"https://reddit.com/r/Cooking/", vertical:"food", audience_type:"home_cooks", tags:["cooking","food","recipe","kitchen","tool","app","nutrition","meal"], members:3300000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Cooking tools and apps allowed." },
  { platform:"reddit", platform_type:"reddit", name:"MealPrepSunday", url:"https://reddit.com/r/MealPrepSunday/", vertical:"food", audience_type:"meal_preppers", tags:["food","mealprep","nutrition","cooking","health","app","tool","diet","recipe"], members:1600000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Meal prep tools and apps allowed." },

  // ── TRAVEL ───────────────────────────────────────────────────────────────
  { platform:"reddit", platform_type:"reddit", name:"solotravel", url:"https://reddit.com/r/solotravel/", vertical:"travel", audience_type:"solo_travelers", tags:["travel","solo","app","tool","planning","booking","nomad","adventure"], members:1100000, self_promo_allowed:true, links_allowed:true, quality_score:4, activity_score:5, content_type:"launch", rules_summary:"Travel tools allowed." },
  { platform:"reddit", platform_type:"reddit", name:"travel", url:"https://reddit.com/r/travel/", vertical:"travel", audience_type:"travelers", tags:["travel","trip","planning","app","tool","booking","destination","guide"], members:5000000, self_promo_allowed:true, links_allowed:false, quality_score:3, activity_score:5, content_type:"discussion", rules_summary:"Travel tools with context." },
]

// ─────────────────────────────────────────────────────────────────────────────
// NON-REDDIT PLATFORMS
// ─────────────────────────────────────────────────────────────────────────────
export interface NonRedditPlatform {
  platform: Platform
  platform_type: "founder" | "blog" | "directory"
  name: string
  display_name: string
  url: string
  tags: string[]
  vertical: string
  audience_type: string
  self_promo_allowed: boolean
  links_allowed: boolean
  quality_score: number
  activity_score: number
  content_type: string
  preferred_for: string[]  // verticals/tags that prefer this platform
  description: string
}

export const NON_REDDIT_PLATFORMS: NonRedditPlatform[] = [
  // ── FOUNDER PLATFORMS ─────────────────────────────────────────────────────
  {
    platform: "indie_hackers", platform_type: "founder",
    name: "indie_hackers", display_name: "Indie Hackers",
    url: "https://www.indiehackers.com/post",
    tags: ["startup","founder","indiehacker","saas","bootstrapped","revenue","mrr","product"],
    vertical: "startup", audience_type: "indie_hackers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 5, activity_score: 5, content_type: "founder_story",
    preferred_for: ["startup","saas","product","founder","maker"],
    description: "Indie Hackers is a community of founders sharing revenue, stories, and products.",
  },
  {
    platform: "hacker_news", platform_type: "founder",
    name: "hacker_news", display_name: "Hacker News",
    url: "https://news.ycombinator.com/submit",
    tags: ["startup","tech","developer","founder","engineering","product","saas"],
    vertical: "tech", audience_type: "tech_founders",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 5, activity_score: 5, content_type: "show_hn",
    preferred_for: ["tech","developer","saas","ai","tool","engineering"],
    description: "Hacker News Show HN posts reach a massive audience of tech-savvy founders and developers.",
  },

  // ── BLOG / CONTENT PLATFORMS ──────────────────────────────────────────────
  {
    platform: "devto", platform_type: "blog",
    name: "devto", display_name: "dev.to",
    url: "https://dev.to/new",
    tags: ["developer","tech","webdev","programming","tutorial","tool","saas","engineering","ai"],
    vertical: "tech", audience_type: "developers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 5, activity_score: 5, content_type: "blog_post",
    preferred_for: ["tech","developer","saas","tool","ai","engineering","webdev"],
    description: "dev.to is a massive developer community. Technical launch posts get excellent traction.",
  },
  {
    platform: "hashnode", platform_type: "blog",
    name: "hashnode", display_name: "Hashnode",
    url: "https://hashnode.com/create/story",
    tags: ["developer","tech","webdev","blog","tool","saas","engineering","nextjs","react","api"],
    vertical: "tech", audience_type: "developers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "blog_post",
    preferred_for: ["tech","developer","engineering","webdev","saas","tool"],
    description: "Hashnode is a developer blogging platform. Good for technical launch stories.",
  },
  {
    platform: "medium", platform_type: "blog",
    name: "medium", display_name: "Medium",
    url: "https://medium.com/new-story",
    tags: ["startup","founder","creator","writing","story","product","business","marketing","design"],
    vertical: "startup", audience_type: "general",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "founder_story",
    preferred_for: ["startup","founder","marketing","design","creator","business","product"],
    description: "Medium reaches a broad audience. Good for founder stories and product launches.",
  },

  // ── LAUNCH / DIRECTORY PLATFORMS ─────────────────────────────────────────
  {
    platform: "product_hunt", platform_type: "directory",
    name: "product_hunt", display_name: "Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    tags: ["startup","product","saas","tool","launch","founder","maker","tech","ai"],
    vertical: "startup", audience_type: "early_adopters",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 5, activity_score: 5, content_type: "product_launch",
    preferred_for: ["startup","saas","product","tool","ai","tech","maker"],
    description: "Product Hunt is the #1 place to launch products. Get in front of thousands of early adopters.",
  },
  {
    platform: "betalist", platform_type: "directory",
    name: "betalist", display_name: "BetaList",
    url: "https://betalist.com/submit",
    tags: ["startup","beta","early","product","saas","tool","launch","founder"],
    vertical: "startup", audience_type: "early_adopters",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "product_launch",
    preferred_for: ["startup","saas","product","tool","beta","launch"],
    description: "BetaList features early-stage startups for beta testers and early adopters.",
  },
  {
    platform: "uneed", platform_type: "directory",
    name: "uneed", display_name: "Uneed",
    url: "https://www.uneed.best/submit-a-tool",
    tags: ["startup","product","tool","saas","ai","launch","founder","utility"],
    vertical: "startup", audience_type: "early_adopters",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "product_launch",
    preferred_for: ["tool","saas","ai","utility","startup","product"],
    description: "Uneed is a curated directory of useful tools. Great for utility-focused products.",
  },
  {
    platform: "launching_next", platform_type: "directory",
    name: "launching_next", display_name: "LaunchingNext",
    url: "https://www.launchingnext.com/submit/",
    tags: ["startup","product","saas","tool","launch","early","founder","app"],
    vertical: "startup", audience_type: "early_adopters",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 3, activity_score: 3, content_type: "product_launch",
    preferred_for: ["startup","saas","product","app","tool","launch"],
    description: "LaunchingNext helps you get your startup in front of early adopters.",
  },
  {
    platform: "sideprojectors", platform_type: "directory",
    name: "sideprojectors", display_name: "SideProjectors",
    url: "https://www.sideprojectors.com/",
    tags: ["sideproject","startup","maker","product","tool","saas","indie","founder"],
    vertical: "startup", audience_type: "makers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 3, activity_score: 3, content_type: "product_launch",
    preferred_for: ["sideproject","indie","maker","startup","tool","product"],
    description: "SideProjectors is a marketplace for side projects. Perfect for indie makers.",
  },
  {
    platform: "microlaunch", platform_type: "directory",
    name: "microlaunch", display_name: "MicroLaunch",
    url: "https://microlaunch.net/submit",
    tags: ["microsaas","saas","product","tool","ai","launch","founder","indie","bootstrapped"],
    vertical: "startup", audience_type: "indie_hackers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "product_launch",
    preferred_for: ["microsaas","saas","ai","tool","indie","bootstrapped","product"],
    description: "MicroLaunch specializes in micro-SaaS products. Highly targeted audience.",
  },
  {
    platform: "peerlist", platform_type: "directory",
    name: "peerlist", display_name: "Peerlist",
    url: "https://peerlist.io/",
    tags: ["developer","founder","tech","startup","product","launch","saas","tool","career"],
    vertical: "tech", audience_type: "developers",
    self_promo_allowed: true, links_allowed: true,
    quality_score: 4, activity_score: 4, content_type: "product_launch",
    preferred_for: ["developer","tech","saas","startup","product","tool","engineering"],
    description: "Peerlist is a professional network for builders and developers. Great for technical products.",
  },
]

// Tags that give a strong startup signal and always pull in bucket-1 communities
export const STARTUP_SIGNALS = new Set([
  "startup","founder","saas","entrepreneur","indiehacker","maker","product","tool","bootstrap","launch"
])
