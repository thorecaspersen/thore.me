// Real facts from Thore's LinkedIn (2026-10-11): roles, companies, dates, places, education, stacks.

export const profile = {
  name: 'Thore Caspersen',
  handle: 'thore',
  title: 'Senior Developer',
  tag: 'Frontend · Backend · Cloud · AI',
  statement: ['I love building software for production', 'Full stack, full ownership, powered by AI'],
  proYears: '15+',
  now: 'Currently working at Novo',
  subtitle: 'Full-stack · Cloud · AI',
  tagline: 'I build interfaces that feel impossible, and the cloud they run on.',
  bio: 'Senior developer who loves building software for production: full stack, full ownership, powered by AI. 15+ years on the web, from freelance sites to a launched SaaS as lead developer, and six years on a regulated clinical-trial platform at Novo. A team player who shares knowledge and solves business problems in an agile workflow, so the team reaches its deadlines and goals. Self-explanatory clean code and automated tests keep quality high, even under GxP. Always learning new technology, and obsessed with Claude Code and agentic workflows.',
  location: 'Copenhagen, Denmark',
  email: 'hello@thore.me',
  github: 'https://github.com/thorecaspersen',
  linkedin: 'https://www.linkedin.com/in/thorecaspersen',
  site: 'https://thore.me',
  cvPdf: '/thore-caspersen-cv.pdf',
  // The contact form posts here; FormBold mails it on to an inbox that never appears on the site.
  formbold: 'https://formbold.com/s/oyBqa',
  photo: '/thore.jpg',
  startYear: 2015,
  codingSince: 2009,
}

export const impact = [
  { value: '6 yrs', label: 'building on Azure, C#/.NET and React', where: 'Novo' },
  { value: '6 mo', label: 'from first commit to a launched, secure SaaS as lead developer', where: 'Databoard', note: 'Back in 2017, before AI coding tools.' },
  { value: '8', label: 'webshops in 8 languages, with weekly Nike and Adidas launches', where: 'Unisport' },
]

// From Thore's LinkedIn: the size guide was "shown under all boots". Used instead of the 8-webshops fact on the front page.
export const sizeGuide = { n: 100, unit: '%', label: 'Of football boots measured, through a size guide I built end to end.', note: 'So customers could pick the right size online.', where: 'Unisport' }

// Thore's own claims (2026-10-14), shown on the tech specs and "how I ship" slides.
export const techSpecs = {
  lede: 'The idea first, the tool second.',
  pairs: [['Azure Functions', 'AWS Lambda'], ['Service Bus', 'SQS'], ['C#', 'Python'], ['React', 'Vue'], ['MSSQL', 'PostgreSQL'], ['xUnit', 'Jest'], ['Bicep', 'Terraform']],
  close: 'I know the idea underneath, so I work in whatever stack the team uses. A new tool is a detail, not a restart.',
  areas: [
    { area: 'Frontend', main: 'TypeScript & React', years: 8, also: 'Also built projects with Angular and Vue.js.' },
    { area: 'Backend', main: 'C#/.NET', years: 8, also: 'Also Python and Node.js, in earlier roles and today.' },
    { area: 'Cloud', main: 'Azure', years: 8, also: 'Also AWS, in earlier roles and today.' },
    { area: 'Databases', main: 'MSSQL', years: 8, also: 'Also PostgreSQL, in earlier roles and today.' },
    { area: 'Testing', main: 'Unit, integration, end-to-end', years: 10, also: 'Hands-on with xUnit, Jest and Playwright, among others.' },
  ],
}

export const delivery = [
  {
    title: 'What ties it together',
    points: [
      'Agile delivery: iterations and planning in GitHub, Jira or Azure DevOps.',
      'A Git workflow that fits the team, not the other way round: how we branch, merge and release.',
      'Small pull requests, reviewed with AI and checked by automated tests, so a whole team can change the same solution without stepping on each other.',
      'Tests the team agrees on, not one developer\'s habit: unit tests for the logic, integration tests where parts meet, end-to-end tests with Playwright for what users really do.',
      'The rules written down once: coding conventions, a shared definition of done, and what each environment is for, from DEV to PROD.',
      'CI/CD that does more than build and deploy: approval gates, automated tests in the pipeline, and infrastructure as code with Bicep.',
    ],
  },
  {
    title: 'Built for regulated industries',
    tag: 'GxP',
    points: [
      'Six years shipping software in pharma, under GxP.',
      'Validation, traceability and change control are part of the work, not bolted on at the end.',
      'Governance and compliance built into the process: documented changes, clear approvals and a pipeline an auditor can follow.',
    ],
  },
]

export const beyond = [
  {
    title: 'Product',
    points: [
      { title: 'User-driven', text: 'At Novo I use Pendo to see how people really use the product. Real usage, not guesses, decides what we build next.' },
      { title: 'Stakeholder alignment', text: 'Code is cheap now, owning it is not. I align the business on what is worth owning: the cost to run, maintain, secure and support it.' },
      { title: 'Across departments', text: 'I build projects that span several departments at Novo, with one plan everyone can follow.' },
    ],
  },
  {
    title: 'Engineering',
    points: [
      { title: 'Architecture decisions', text: 'Big decisions written down, so the team knows the why.' },
      { title: 'Tech debt', text: 'Made visible and paid down in small slices, next to features.' },
      { title: 'Incidents', text: "Fix first, then a blameless review so it doesn't happen twice." },
      { title: 'Cloud cost', text: 'Cost as a design input, with alerts before the bill arrives.' },
    ],
  },
  {
    title: 'People',
    points: [
      { title: 'Mentoring', text: 'Reviews and pairing that grow people. Juniors become seniors.' },
      { title: 'Docs and onboarding', text: 'Knowledge lives in the repo, not in one head. New people ship in week one.' },
      { title: 'Hiring', text: 'Interviews and tech tests that find good team players.' },
    ],
  },
]

// Verbatim from Thore's Novo feedback.
// Every quote is an unbroken stretch of the original, with no edits. Each person has agreed to be quoted.
const voice = (name, title, ...quotes) => ({ name, title, quotes })
export const testimonials = [
  voice(
    'Christoffer Krogslund',
    'Product Owner, Novo',
    'I have enjoyed working with Thore, during the time I have been a PO for nnexus team I have seen Thore grow and gradually take more responsibility and leading parts of our development. Your proactivity is really appreciated, and I see the will to work towards making developing products in Novo better across organizational barriers. I want to say, as I have said to you face to face - I can really feel that you have stepped into a more leading role this last year, and it really suits you!',
    "I really enjoy working with Thore, he really cares about both the product we are developing and the people in the team. It's a pleasure.",
  ),
  voice(
    'Bartek Wietrak',
    'Technical Lead, Novo',
    'Your self-drive is far above what is normally expected even from a senior developer. The entire Playwright automation effort is the perfect example: you took ownership, built momentum, spread knowledge (those quirky, funny presentations really helped to fortify the knowledge), and delivered something that has become a department-wide asset.',
    "The recent environment workflow definition is another great case – you spotted the pain, pulled the right people together, drove the discussion, documented it, and made everyone's life better.",
  ),
  voice('Emma Eng', 'VP, GD&AI Development, Novo', 'I see you as a team player and really I like that you consider the team dynamics for example how the team can learn more and not just produce more short term. You also look out for your colleagues and truly care about their well-being.'),
  voice('Deepna Shankar', 'Advanced IT Quality Professional, Novo', 'Thore demonstrates initiative by addressing issues proactively and has a comprehensive understanding of compliance.'),
]

// Thore's three stories (2026-10-15): teased on the story slide, told in full on /experience/<id>/.
// `id` matches experience[]. Databoard and Planday are from his CV; Novo is his pick: the 2021–22 rebuild on Veeva Vault.
export const stories = [
  {
    id: 'databoard',
    arc: 'Start-up',
    title: 'Zero to production in six months.',
    teaser: 'Two developers, one investor deadline. By November our screens were live on Chilean TV.',
    beats: [
      { label: 'The situation', text: 'Databoard had just raised money to build the next generation of its info-screens, and the investment came with a six-month milestone: a new customer should get their own screen running online within 15 minutes. They brought me in as lead developer to build the platform, with one frontend developer next to me.' },
      { label: 'A true startup', text: "Databoard was genuinely early-stage: two founders and three full-time employees, building a product and a company from nothing, at the same time. There was no ops team, no platform team, no one to hand a hard problem to whatever needed doing, from the architecture down to the AWS bill, I did it. That's what a real startup teaches that a bigger company can't: how to move fast without a safety net, own a problem end to end, and stay close enough to the business to feel every decision in the numbers." },
      { label: 'A stack for the team', text: 'My teammate was a frontend developer whose strength was JavaScript, so I chose a stack that played to it. With this much to deliver in six months, the best language mattered less than putting every pair of hands to work. Node.js runs JavaScript on the server, and MongoDB stores JSON-like documents that any JavaScript developer can read. Both are strong choices in their own right, but more importantly, they kept the whole stack familiar to my teammate, so we could both work on every part of it.' },
      { label: 'Built for 15 minutes', text: 'Every screen has its own live websocket channel, so it changes the moment its content does. The editor works on a draft, so nothing on the wall changes until you press Send to screen. And I built the setup around a code: plug the player into any screen, type the code it shows into the editor, and the two stay paired through power cuts and reboots.' },
      { label: 'How I ran it', text: 'I owned the backend and the cloud, and helped out on the frontend wherever it was needed. Every deploy went out blue-green on AWS: a new release went live on a test domain first, and only moved to production once it checked out. Passwords hashed, secrets encrypted in the repo, staff tools locked to the office network. I planned the sprints and estimates with the CEO, the CTO and the clients. The investor clock was real, and near the end so were the evenings and weekends.' },
      {
        label: 'The result',
        text: "An alpha in front of the board in week 9, and the platform on AWS in week 12. In November 2017 our screens were live on Chilean national TV on election night. By spring 2018 about 50 licences were sold, to customers in Denmark, Chile and Pakistan, and Databoard was on NEC's stand at a major AV trade fair.",
        images: [
          {
            src: '/proof/databoard-chile-tv.webp',
            alt: "Databoard's December 2017 tweet thanking customers, partners and investors, quoting a tweet from Chilean journalist Nicolas Copano showing his TV studio live on election night with a Databoard screen on set.",
            caption: 'Databoard, December 2017: on TV during the Chile election.',
          },
          {
            src: '/proof/databoard-nec-stand.webp',
            alt: 'Databoard on a screen at a trade-fair stand, 6 February 2018, showing a live dashboard of sales, support, win and loss numbers, with a developer working at a laptop in the foreground wearing a Databoard t-shirt.',
            caption: 'Databoard on the NEC stand, February 2018.',
          },
        ],
      },
      { label: 'Speaking up', text: 'Speed had built up technical debt, and every new module took longer. In February 2018 I wrote the business case for a refactoring period, in business terms: not prettier code, but the next modules faster and with fewer bugs. An outside technical review that March rated the team capable and my time estimate realistic.' },
    ],
  },
  {
    id: 'planday',
    arc: 'Scale-up',
    title: 'Rebuilding a live SaaS, one piece at a time.',
    teaser: 'Carved services out of the legacy and built the first new React frontends.',
    beats: [
      { label: 'The situation', text: "Planday's employee-scheduling SaaS ran on a legacy C#/.NET monolith, and the company had started moving it to .NET Core microservices and standalone React frontends. The product had to keep working for its customers the whole way." },
      { label: 'My part', text: 'My part was carving domain-specific services out of the monolith into new .NET Core services on Azure, built with domain-driven design, while the legacy kept serving customers underneath. On the frontend I was one of the first to ship a feature outside the old monolith frontend, in the new React, TypeScript and Redux stack, and co-built the shared React component library every new app drew from.' },
      {
        label: 'The scale',
        text: 'By 2020, before Planday was acquired by Xero, the company had grown to close to 190 people: engineering alone about 42 developers across 8 teams, each with its own scrum master, designer, PM, tech lead and QA, shipping to 359,000 users across more than 7,100 customer portals, from offices in Copenhagen, London, Oslo, Hamburg and Los Angeles.',
        link: { href: 'https://www.planday.com', label: 'Read more at planday.com' },
      },
      {
        label: 'Shipped',
        text: 'Three features, end to end. Salaried employees (winter 2018 to spring 2019): admins set a monthly salary and choose how its cost spreads across the schedule, by scheduled hours, by contracted hours, or across fixed business days. Schedule statistic (summer 2019), an Excel export across every portal in a network, one tab per portal plus a combined one, which I built alone. Contracted hours (winter 2019 to spring 2020): flags when an employee drifts from their contracted hours and routes the difference to payroll or their overtime balance, by hand or automatically.',
      },
      {
        label: 'Agile at scale',
        text: "While I was there, Planday also moved its engineering org onto agile at scale: Scrum teams, fixed iterations, and Big Room Planning days that lined up all 8 teams' roadmaps across a quarter. Working inside that structure meant estimating, committing and delivering alongside tech leads and PMs outside my own team, not just within it.",
      },
      { label: 'The bar', text: 'The new apps were built with quality in mind from the start: strict pull-request approval, linting and test-coverage gates, with unit tests a growing habit on the team. I reviewed code daily, on my own team and others, and that was also where I improved parts of the legacy system I touched along the way.' },
      { label: 'The result', text: "Three features shipped end to end, one of them, Schedule statistic, entirely on my own. Being early to ship outside the legacy frontend earned a raise within eight months. By the time I left, I'd gone from a React specialist to someone equally at home in .NET Core, domain-driven design and C#." },
    ],
  },
  {
    id: 'novo',
    arc: 'Enterprise',
    title: 'Swapped the source of truth under a live pharma system.',
    teaser: "nnexus manages clinical trial staff's access to the systems a clinical trial can run on. We rebuilt it around Veeva Vault.",
    beats: [
      { label: 'The situation', text: "nnexus is Novo's custom single sign-on solution for clinical trials, and it connects to more than 20 of the systems a clinical trial can run on. The monitors who oversee each clinical trial use it to manage access for the people on that clinical trial, doctors and nurses among many other roles, system by system. I joined the nnexus team in 2020." },
      { label: 'Three integrations deep', text: "nnexus sits in the middle of three kinds of integration. Clinical trial data comes in from Novo's clinical systems. Sign-in runs through an external single sign-on provider. And access goes out to the internal and external systems each clinical trial uses. When we integrate a new system, or an integration needs support or a new feature, I work directly with its vendor. They come in every shape, from SOAP to REST APIs, and each one is planned with security, monitoring and an upgrade strategy from day one. All of it runs under GxP, where who can see what is a compliance question before it is a feature." },
      { label: 'The move', text: "Over 2021 and 2022, the ground moved. nnexus took its clinical trial data from an old internal system, and Novo moved that data to a new Veeva Vault platform. So we rebuilt nnexus around the new platform's business logic, while monitors kept granting access every day, with a cut-over plan and a way back if the new platform failed us. The hard part was never the plumbing. It was the rules. Get one wrong and a user loses access mid-trial, or keeps it after leaving the clinical trial." },
      { label: 'My part', text: 'Three of us developers built the foundation and most of the new nnexus, with external consultants helping along the way. I worked on several parts of it. The importer pulls in the Veeva data and reshapes it. The core service runs from the React frontend to the SOAP link and Microsoft Entra ID. When the 2 consultants left, I took over from them and did the heavy lifting of the knowledge transfer, so months of their work stayed with the team instead of walking out the door.' },
      { label: 'What GxP asks for', text: "GxP is the family of good-practice rules for pharma, and for clinical trials the one that matters most is GCP: ICH E6(R3) and the EMA's guideline on computerised systems and electronic data in clinical trials. For software, 21 CFR Part 11 and EU Annex 11 turn that into concrete demands. The system is validated for its intended use. Access is limited to authorised people. Every change to a record leaves a secure, time-stamped audit trail. And the data stays attributable, accurate and available (ALCOA+). nnexus sits right on that line: a grant or removal of access is itself a record an inspector can ask about. Who did it, when, and under which role. That is why the regular review of external users, which I took the lead on, matters as much as any feature." },
      { label: 'Shipping under GxP', text: "In pharma, nothing reaches production on trust. nnexus runs in five environments, and I know what can and can't be done in each. Validation is risk-based, in the spirit of GAMP 5 and Computer Software Assurance: effort goes where a failure could touch patient safety or data integrity, and the evidence traces from requirement to test to release, so an auditor can follow any change. The infrastructure is code, in Bicep and YAML pipelines, so every environment is reproducible and every deployment leaves a record. I also got our Playwright test automation off the ground: it runs in the pipeline." },
      { label: 'Inside the quality system', text: "A validated system is only as good as the process around it, and I work inside that process: change control for every release, supplier assessment for each vendor we integrate, deviation and incident handling, periodic review to show the system is still in its validated state, and training before anyone touches production. I bring QA in early and think about compliance, security and GDPR up front, not after an auditor asks, because a decision settled at the start is far cheaper than one reopened in an inspection." },
      { label: 'Beyond the code', text: "I joined with scrum experience the team didn't have yet: I introduced story points and helped us into PI planning as R&D IT moved to agile release trains. Since then I've become the team's go-to for the frontend: the only one from our team helping build Novo's new UI framework and pushing it to cover our React components, and the one who took the lead on the new user review, the regular check that each external user still needs their access. I mentored our intern for a year, keep the docs that get new people up to speed, and help colleagues in India through support cases, from network issues to business logic." },
      { label: 'The result', text: "nnexus has run on Veeva Vault data ever since, and six years in I work on every level of it, from the React frontend to the pipelines that ship it. In my 2021 review, stakeholders praised the integration and the user review app I took over. A system manager on the team credits my approach with catching and fixing issues early, keeping nnexus running with minimal disruptions. And when something breaks, I'm one of the people who volunteer to fix it." },
    ],
  },
]

// Shown on the story slide and at the top of each story page.
export const storiesPreAi = 'Built before AI coding assistants were part of the job.'

export const sellingPoints = [
  {
    id: 'team', short: 'Reliable', title: 'I care about the product',
    text: 'I keep an eye on the whole project and jump in wherever a colleague needs a hand, including evening releases and weekend issues.',
  },
  {
    id: 'users', short: 'Built for users', title: 'Software lives for its users',
    text: 'Users come first in everything I build. Production is the real test, so I ship features as small as possible and grow the product together with the people who use it.',
  },
  {
    id: 'ai', short: 'AI first', title: 'AI changes the speed limit',
    text: "AI is the biggest speed-up our industry has seen. With real understanding and the right guardrails, it's a game changer.",
  },
]

export const leadership = [
  { title: 'Motivation beats control', text: 'People go the extra mile when they believe in the project. I build that by giving room and real responsibility, never by micromanaging.', proof: { co: 'Novo', text: 'Mentored our student assistant for 12 months: found her good tasks and showed her how we work.' } },
  { title: 'Clear why, shared how', text: 'We agree on the why and the what together. The team owns the how.', proof: { co: 'Databoard', text: 'Pitched a refactoring period in business terms: faster modules, fewer bugs.' } },
  { title: 'Quality by default', text: 'Reviews, tests and CI from day one, so speed never costs trust.', proof: { co: 'Planday', text: 'Strict PR approval, linting and test-coverage gates.' } },
  { title: 'Clear the path, share the credit', text: 'My job is to remove blockers and make the team\'s work visible.', proof: { co: 'Novo', text: 'Took over from 2 consultants and carried the handover, so the work stayed in-house.' } },
]

export const aiStory = {
  command: 'claude "what does thore think about AI?"',
  windows: [
    {
      id: 'speed',
      bait: 'The biggest shift in software since the internet.',
      hook: 'Code is no longer the slow part.',
      more: [
        'In 2026, sixteen AI agents wrote a 100,000-line C compiler in about two weeks, and it builds the Linux kernel. Work that used to fill a sprint can now be drafted in an afternoon.',
        'Linus Torvalds wrote in July 2026 that whether AI is useful "is no longer one of those questions. Anybody who doubts that clearly hasn\'t actually used it." And every model release writes better code than the one before.',
        'The best developers no longer stand out by typing faster. A developer who directs AI well now has the reach of a whole team, and that reach grows with every model release. It is the skill I keep sharpening.',
      ],
    },
    {
      id: 'beyond chat',
      bait: 'The magic isn\'t that AI talks like a human.',
      hook: 'It is that software is now fast to build.',
      more: [
        'Computers, servers and the internet could always automate much of a business: move the data, check the rules, send the email, fill in the report. What held it back was the time it took to set up and write the software.',
        'AI removes that bottleneck. A tool that once took weeks of development can be running in days, so processes that were never worth automating suddenly are.',
        'When software gets cheap, companies want much more of it.',
        'That includes the big SaaS subscriptions. Many companies pay every month for large platforms, use a fraction of the features and bend their way of working to fit. A tool built for exactly how they work can now cost less than a few years of licences, and the company owns it. So you only need a developer to design it, connect it to the systems around it and keep it running.',
        'A chat answers one question. Software keeps doing the work every day, and that is where the real value is.',
      ],
    },
    {
      id: 'tokens',
      bait: 'Tokens are a budget. I spend them by design.',
      hook: 'Opus thinks. Sonnet types.',
      more: [
        'I plan with Opus as the architect and let it spin up Sonnet sub-agents to write the code. The expensive model does the thinking and the cheaper one does the typing, so each job gets the right model.',
        'Most AI spend is the model re-reading the conversation, and the cheapest token is a cached one: cached input costs a tenth of the normal price. So I keep the context small. I clear between tasks, compact before 200K tokens and load rules only when they are needed. Before a break, I write a handoff note and start fresh instead of paying for a cold re-read.',
        'It adds up quickly. In one developer\'s logs, returning to sessions after the cache had expired cost $47, where a warm cache would have cost $1.',
      ],
      source: { label: 'optimaizr, one developer\'s Claude Code logs', href: 'https://github.com/blendbunjaku/optimaizr' },
    },
    {
      id: 'ai-assisted engineering',
      bait: 'AI builds what you ask for.',
      hook: 'Knowing what to ask for is the job.',
      more: [
        'Knowing to ask for security, accessibility, backups, monitoring and tests is the job. AI doesn\'t know your business either, so I learn it. That is the difference between vibe coding and AI-assisted engineering.',
        'People don\'t just pay for a product; they pay for someone who takes responsibility. I own the result in production, and when something goes wrong, I\'m the one who answers for it. So I make sure I understand everything that ships.',
        'The engineering has moved to review and verification. When code arrives this fast, automated tests matter more than ever: every release runs end-to-end tests of the whole product, so we stay in control of what ships, whoever or whatever wrote the code.',
        'Security is part of the same discipline. AI tools get only the access they need, secrets stay out of prompts, and a new AI tool is cleared for security and compliance before the team relies on it.',
      ],
    },
    {
      id: 'people',
      bait: 'The AI tool is the easy part.',
      hook: 'People are the project.',
      more: [
        "BCG's rule of thumb for AI puts 10% of the effort in the algorithms, 20% in the technology and 70% in people and processes.",
        'So I talk, show and teach, and I share what works in show-and-tells so the skill spreads beyond me. Without the people on the journey, a company pays for AI and never collects the gain.',
      ],
    },
  ],
  // The globe window: links from Copenhagen to the AI API and the cloud regions it runs beside.
  globe: [
    { name: 'copenhagen', lat: 55.68, lon: 12.57 },
    { name: 'anthropic api', lat: 37.77, lon: -122.42, label: true },
    { name: 'west europe', lat: 52.37, lon: 4.9 },
    { name: 'north europe', lat: 53.35, lon: -6.26 },
    { name: 'sweden central', lat: 60.67, lon: 17.14 },
    { name: 'east us', lat: 37.43, lon: -78.66 },
    { name: 'southeast asia', lat: 1.35, lon: 103.82 },
    { name: 'brazil south', lat: -23.55, lon: -46.63 },
    { name: 'australia east', lat: -33.87, lon: 151.21 },
  ],
}

export const experience = [
  {
    id: 'novo',
    logo: '/logos/novo.png',
    company: 'Novo',
    role: 'Senior Software Developer',
    from: '2020-09',
    to: null,
    place: 'Søborg, Copenhagen',
    summary: 'Senior full-stack developer on Azure and AWS: C#/.NET, MSSQL, Python, React and TypeScript, shipped through CI/CD.',
    highlights: [
      'Helped rebuild nnexus, single sign-on for clinical-trial staff, around Veeva Vault',
      'Integrations in any shape, from SOAP to REST, under GxP',
    ],
    stack: ['React.js', 'Vue.js', 'C#/.NET', 'Python', 'MSSQL', 'REST', 'SOAP', 'Veeva Vault', 'Microsoft Entra ID', 'Azure', 'Bicep', 'AWS', 'CI/CD', 'Azure DevOps', 'GitHub', 'Playwright', 'Pendo', 'GxP'],
  },
  {
    id: 'planday',
    logo: '/logos/planday.png',
    company: 'Planday',
    role: 'Software Developer',
    from: '2018-08',
    to: '2020-08',
    place: 'Copenhagen',
    summary: 'A workforce collaboration platform for managers and hourly workers. Helped move a legacy backend to microservices and built the first new standalone frontends.',
    highlights: [
      'Extracted parts of a legacy backend into new microservices',
      'Built the first independent frontend applications on the new platform',
      'Co-built and expanded the shared React component library',
      'Code reviews and quality by default: strict PR approval, linting and test-coverage gates',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'C#/.NET', 'MSSQL', 'Azure', 'Microservices', 'Domain-driven design', 'CI/CD', 'Jira'],
  },
  {
    id: 'databoard',
    logo: '/logos/databoard.png',
    company: 'Databoard',
    role: 'Lead Developer',
    from: '2017-05',
    to: '2018-08',
    place: 'Copenhagen',
    summary: 'Built a real-time SaaS info-screen system from scratch as software architect, and took it to production within six months.',
    highlights: [
      'Chose the stack and architecture: REST API plus websockets for real-time screens',
      'Runs on any screen through Raspberry Pi; ran AWS with EC2, ELB, S3 and CloudFront',
      'CI/CD with blue-green deployments',
    ],
    stack: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'WebSockets', 'AWS', 'Raspberry Pi', 'CI/CD'],
  },
  {
    id: 'unisport',
    logo: '/logos/unisport.png',
    company: 'Unisport',
    role: 'Full-stack Developer',
    from: '2015-10',
    to: '2017-04',
    place: 'Copenhagen',
    summary: 'Promoted from frontend to full-stack after eight months. Built webshop features end to end, from spec and estimate to backend and React.',
    highlights: [
      'Built a custom boot size guide: database design, staff CMS, REST API and React UI',
      'Shipped weekly product-launch campaign sites with Nike and Adidas',
      'Translation system for 8 languages and a webpack-to-S3 deploy pipeline',
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'React', 'Redux', 'Webpack', 'AWS', 'S3'],
  },
  {
    id: 'avnerds',
    logo: '/logos/av-nerds.png',
    company: 'AV-Nerds.dk',
    role: 'Full-stack Developer',
    from: '2015-04',
    to: '2015-09',
    place: 'Copenhagen',
    summary: 'Built a knowledge-based recommendation engine that designs complete meeting-room AV setups.',
    highlights: [
      'WooCommerce module with a custom recommendation algorithm',
      'Simple UI that turns room measurements into three complete solutions',
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'MySQL', 'WordPress'],
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Web Developer',
    from: '2009',
    to: '2015',
    place: 'Copenhagen',
    summary: 'Websites for small businesses in hand-written HTML, CSS and JavaScript, plus custom WordPress themes.',
    highlights: [
      'Vanilla HTML, CSS and JavaScript, no frameworks',
      'Custom WordPress templating in PHP, jQuery and CSS',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'jQuery', 'WordPress'],
  },
]

export const education = [
  {
    id: 'ek',
    logo: '/logos/kea.png',
    school: 'KEA, Københavns Erhvervsakademi',
    degree: 'AP, Computer Science',
    from: '2011',
    to: '2014',
    note: 'Java and Android app development.',
  },
  {
    id: 'htx',
    logo: '/logos/tec.png',
    school: 'HTX Frederiksberg',
    degree: 'High school, Math & IT',
    from: '2005',
    to: '2009',
    note: 'Math and IT. Programming class with C++.',
  },
]

// Levels are estimates for the visuals; confirm before shipping.
export const skills = {
  Frontend: [
    ['React', 0.95], ['TypeScript', 0.9], ['JavaScript', 0.95], ['Redux', 0.85],
    ['styled-components', 0.8], ['Webpack', 0.8],
  ],
  Backend: [
    ['C#/.NET', 0.88], ['MSSQL', 0.82], ['Node.js', 0.75], ['REST / WebSockets', 0.88],
    ['Python / Django', 0.7], ['PostgreSQL', 0.75], ['MongoDB', 0.7],
  ],
  'Cloud & DevOps': [
    ['Azure', 0.85], ['AWS', 0.72], ['CI/CD', 0.85], ['Docker', 0.8], ['Blue-green deploys', 0.7],
    ['Git workflows', 0.9], ['Linux', 0.7],
  ],
  AI: [
    ['Claude Code', 0.95], ['Agentic workflows', 0.85], ['Anthropic API', 0.7],
  ],
}

export const stats = {
  years: new Date().getFullYear() - profile.startYear,
  codingYears: new Date().getFullYear() - profile.codingSince,
  companies: experience.filter((e) => e.id !== 'freelance').length,
}

export const fmtMonth = (ym) => {
  if (!ym) return 'Present'
  const [y, m] = ym.split('-')
  return m ? `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1]} ${y}` : y
}

export const yearsBetween = (from, to) => {
  const f = new Date(from + '-01')
  const t = to ? new Date(to + '-01') : new Date()
  return Math.max(0, (t - f) / (365.25 * 24 * 3600 * 1000))
}
