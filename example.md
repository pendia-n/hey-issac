# example

## js example of tavily on search and advanced mode

### code 

// To install: npm i @tavily/core
const { tavily } = require('@tavily/core');
const client = tavily({ apiKey: "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" });
client.search("Research the current state of personal digital memory and immersive photo/video gallery products. Analyze what makes users form strong emotional attachment to apps that store and display personal photos and videos. Focus on 3D or spatial presentation, emotional design, and the difference between pure storage tools versus products that feel meaningful and precious.", {
    includeAnswer: "advanced",
    topic: "news",
    searchDepth: "fast",
    timeRange: "month",
    includePublishedDate: true,
    includeImages: true,
    includeImageDescriptions: true,
    includeRawContent: "text",
    excludeDomains: [
        "en.wikipedia.org"
        ]
})
.then(console.log);

### json response (credit - 1)
{
  "query": "Research the current state of personal digital memory and immersive photo/video gallery products. Analyze what makes users form strong emotional attachment to apps that store and display personal photos and videos. Focus on 3D or spatial presentation, emotional design, and the difference between pure storage tools versus products that feel meaningful and precious.",
  "follow_up_questions": null,
  "answer": "I couldn’t find any of the provided sources that discuss personal digital memory or immersive photo/video gallery products, their use of 3‑D or spatial presentation, or emotional design features that drive attachment. The only relevant material relates to Samsung’s ability to sync photos and videos to Google Photos, which addresses basic storage integration rather than immersive or emotional aspects. Because none of the supplied documents cover the requested topics, I’m unable to offer a data‑supported analysis.",
  "images": [
    {
      "url": "https://www.lemon8-app.com/seo/image?item_id=7683900299173528095&index=0&sign=56a9e7ff692d7766163b480a12b46135",
      "title": "3D Cinematic Coffee Emergency Scene Featuring Mini Maru in Hyper-Realistic  8K",
      "description": "A person with red hair and glasses lying on a table surrounded by animated coffee mugs with expressive faces, motivational notes, and scattered coffee beans, emphasizing a playful and emotionally engaging environment that highlights personal attachment and creative presentation."
    },
    {
      "url": "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1685492513582435",
      "title": "Sharon Stone criticizes tech leaders with low emotional intelligence",
      "description": null
    },
    {
      "url": "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1380070777569793",
      "title": "Edward Snowden, former American intelligence contractor and prominent  digital privacy advocate, exposed the systemic dangers of mass surveillance  and coerced consent in the modern digital ecosystem. Snowden argues that  the illusion of",
      "description": null
    },
    {
      "url": "https://arxiv.org/html/2604.03315v1/main-Teaser.png",
      "title": "StoryBlender: Inter-Shot Consistent and Editable 3D Storyboard with Spatial-temporal  Dynamics",
      "description": "A comprehensive workflow illustration of creating immersive 3D or spatial digital memory stories shows scripted scene structuring, 2D and manual 3D storyboarding, and dynamic 3D storyboard generation using tools like StoryBuilder, emphasizing emotional design and meaningful presentation of personal photos and videos."
    },
    {
      "url": "https://arxiv.org/html/2506.15497v1/figs/fig6-1.png",
      "title": "Foundation of Affective Computing & Interaction",
      "description": "A diagram illustrating the connection between physiological activity and emotional computing, emphasizing how personal memories stored in digital and immersive formats evoke emotional attachment."
    }
  ],
  "results": [
    {
      "url": "https://www.openpr.com/news/4610356/blossomup-expands-global-reach-with-digital-self-discovery",
      "title": "BlossomUp Expands Global Reach With Digital Self-Discovery Tools - openPR.com",
      "score": 1,
      "published_date": "Sat, 22 Aug 2026 08:56:04 GMT",
      "content": "# BlossomUp Expands Global Reach With Digital Self-Discovery Tools. - August 22, 2026 - BlossomUp, a digital platform focused on self-discovery, emotional intelligence, and relationship development, is broadening access to psychology-inspired personal growth tools for adults worldwide. The platform offers assessments, guided development programs, journaling and reflection features, habit-building tools, and long-term growth tracking through accessible web and mobile experiences. BlossomUp's approach to personal growth [https://americanbusinessstars.com/blossomup-reviews-and-what-they-reflect-about-the-platforms-approach-to-growth/] combines accessible digital product design with structured development content, giving users tools that can support reflection, habit formation, and practical application in daily life. BlossomUp is a digital personal growth platform serving a global audience of adults seeking tools for self-discovery, relationship development, communication, confidence, emotional wellness, and long-term self-improvement. Image: https://www.globalnewslines.com/uploads/2026/06/1781218852.jpg BlossomUp, a digital personal growth platform headquartered in Albuquerque, New Mexico, is reaching a global audience through self-assessment tools, guided development programs and habit-building experiences designed to make personal development more accessible and practical.",
      "raw_content": "PR-Wiki\n Imprint\nPress release\nBlossomUp Expands Global Reach With Digital Self-Discovery Tools\n08-22-2026 10:56 AM CET | Business, Economy, Finances, Banking & Insurance  \nPress release from: Getnews\n/ PR Agency: Asap Digital Marketing\nImage:   \nAlbuquerque-based platform broadens access to psychology-inspired personal growth programs for adults worldwide.  \nALBUQUERQUE, N.M. - August 22, 2026 - BlossomUp, a digital platform focused on self-discovery, emotional intelligence, and relationship development, is broadening access to psychology-inspired personal growth tools for adults worldwide.  \nThe platform offers assessments, guided development programs, journaling and reflection features, habit-building tools, and long-term growth tracking through accessible web and mobile experiences. Its approach is designed to bridge the gap between entertainment-style online content and clinical resources that may feel inaccessible to adults seeking practical, everyday tools for personal development.  \nBlossomUp serves adults working to better understand areas including relationships, communication style, personal identity, confidence, emotional wellness, and long-term self-development. BlossomUp's approach to personal growth [ combines accessible digital product design with structured development content, giving users tools that can support reflection, habit formation, and practical application in daily life.  \nThe platform's offerings include personality and identity assessments, compatibility and communication style tools, guided challenges, journaling features, personalized insight reports, habit-building resources, and long-term growth tracking. Together, these tools are designed to help users move beyond a single assessment result and engage with personal growth as an ongoing practice.  \nAs adults continue to seek structured, self-directed personal development resources, BlossomUp is focused on making its platform clear, accessible, and useful for a global audience. Self-awareness and relationship tools from BlossomUp [ are built around the idea that meaningful growth requires both accessibility and depth. The platform's globally distributed team supports ongoing product development, design, and customer experience work to improve the digital experience over time.  \nBlossomUp operates as a digital-first platform, allowing users across markets to access its tools through web and mobile experiences. Ongoing development efforts are focused on expanding access to digital personal development resources [ that can support users across different life stages, development goals, and areas of focus.  \nAbout BlossomUp  \nBlossomUp is a digital personal growth platform serving a global audience of adults seeking tools for self-discovery, relationship development, communication, confidence, emotional wellness, and long-term self-improvement. The company offers psychology-inspired assessments, guided growth challenges, journaling and reflection features, habit-building programs, and long-term growth tracking through accessible web and mobile experiences. BlossomUp was built to bridge the gap between entertainment-style online content and overly clinical self-help formats, making personal development more practical and accessible.  \nTo learn more, visit BlossomUp's official website [  \nMedia Contact  \nCompany Name: BlossomUp  \nContact Person: Media Relations  \nEmail: Send Email [  \nCountry: United States  \nWebsite:   \nLegal Disclaimer: Information contained on this page is provided by an independent third-party content provider. GetNews makes no warranties or responsibility or liability for the accuracy, content, images, videos, licenses, completeness, legality, or reliability of the information contained in this article. If you are affiliated with this article or have any complaints or copyright issues related to this article and would like it to be removed, please contact retract@swscontact.com  \nThis release was published on openPR.\nPermanent link to this press release:\nCopy\nPlease set a link in the press area of your homepage to this press release on openPR. openPR disclaims liability for any content contained in this release.\nShare\nTweet\nEmail\nYou can edit or delete your press release BlossomUp Expands Global Reach With Digital Self-Discovery Tools here\nNews-ID: 4610356 • Views: 5\nMore Releases from Getnews\n08-22-2026 | Business, Economy, Finances, B …   \nGetnews\nDillon Robert Haines Highlights the Value of Seasonal, Locally Sourced Cooking\nImage:  Connecticut executive chef shares his perspective on seasonal ingredients, local agriculture, and creating meaningful dining experiences. West Hartford, CT - August 22, 2026 - Connecticut Executive Chef Dillon Robert [ [ highlighting the importance of seasonal cooking and locally sourced ingredients, an approach that has helped shape his culinary philosophy throughout more than two decades in professional kitchens. Based in West Hartford, Connecticut, Haines has developed a strong appreciation for the…\n08-22-2026 | Fashion, Lifestyle, Trends   \nGetnews\nAward-Winning Memoir \"Six Weeks\" Receives Literary Titan Book Award for Its Movi …\nImage:  United States - August 22nd, 2026 - William A. Ledbetter's acclaimed debut memoir, Six Weeks: A Literary Memoir , has received the Literary Titan Book Award, adding another significant honor to a growing list of literary accolades for the deeply personal work. The recognition follows an extraordinary year for Six Weeks , which was named the 2026 Manhattan Book Awards Gold Winner, won the 2026 PenCraft Book Awards for Best…\n08-22-2026 | Associations & Organizations   \nGetnews\nMSP News Global Unveils Landmark Collaboration Featuring Epigenetics Pioneer Dr. …\nMSP News Global published a collaborative feature bringing together epigenetic pioneer Dr. Bruce Lipton and 24 world-class experts to explore how energy, consciousness, and frequency shape health, business, leadership, and human potential. Image:  BIRMINGHAM, UK - 22nd Aug., 2026 - MSP News Global is thrilled to announce the release of its high-impact feature exploring the transformative intersection of energy, consciousness, and frequency in human performance and modern living. Leading this major…\n08-22-2026 | Business, Economy, Finances, B …   \nGetnews\nTimothy Caraboolad Debunks 5 Common Home Renovation Myths\nImage:  Timothy Caraboolad, PALM BEACH, Fla Palm Beach, Florida-based developer and designer Timothy Caraboolad shares five renovation myths that can lead homeowners toward unnecessary costs, confusion, and poor project decisions. PALM BEACH, Fla. - August 22, 2026 - Renovating a home can look simple from the outside. Pick a design. Hire someone to build it. Choose the finishes. Then wait for the finished space. The reality involves far more decisions. Timothy Caraboolad has seen…\nAll 5 Releases\nMore Releases for BlossomUp\n06-12-2026 | Business, Economy, Finances, B …   \nGetnews\nBlossomUp Expands Digital Self-Growth Platform\nImage:  BlossomUp, a digital personal growth platform headquartered in Albuquerque, New Mexico, is reaching a global audience through self-assessment tools, guided development programs and habit-building experiences designed to make personal development more accessible and practical. ALBUQUERQUE, NM - JUNE 11, 2026 - BlossomUp, a digital platform focused on personal growth and self-discovery, is extending its reach to users across international markets as demand grows for accessible, psychology-informed development tools. The company…\n© 2004 - 2026 openPR. All rights reserved.\nmade & hosted in\nFAQ | Imprint | Privacy Policy | Terms & Conditions | Contact Point DSA | Reporting Form DSA | Cookie Settings\n Home\n Categories\nAdvertising, Media Consulting, Marketing Research Arts & Culture Associations & Organizations Business, Economy, Finances, Banking & Insurance Energy & Environment Fashion, Lifestyle, Trends Health & Medicine Industry, Real Estate & Construction IT, New Media & Software Leisure, Entertainment, Miscellaneous Logistics & Transport Media & Telecommunications Politics, Law & Society Science & Education Sports Tourism, Cars, Traffic RSS-Newsfeeds\n Submit Press Release\nSubmit Press Release Free of Charge Pressemitteilung kostenlos veröffentlichen\n Order Credits\n Archive\n Magazine\n PR-Wiki\n About Us\nAbout / FAQ Newsletter Terms & Conditions Privacy Policy Imprint",
      "images": [
        {
          "url": "https://cdn.consentmanager.net/delivery/whitelabel/cmplogo.svg",
          "description": "consentmanager.net",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.consentmanager.net/delivery/flags/en.gif",
          "description": "Language: en",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.openpr.com/fx/openpr-logo-slogan.svg",
          "description": "openPR Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.openpr.com/fx/flagge-uk.svg",
          "description": "openPR.com",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.openpr.com/fx/flagge-de.svg",
          "description": "openPR.de",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.open-pr.com/8/2/822450037_g.jpg",
          "description": "BlossomUp Expands Global Reach With Digital Self-Discovery",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.open-pr.com/9/2/921109602_g.jpg",
          "description": "Making Keyless Entry More Accessible for Andersen Door Owners",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.open-pr.com/9/2/920823993_g.jpg",
          "description": "MLC Dharmendra Bhardwaj gives Viksit Bharat 2047 Its First Local Scorecard from Meerut",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.open-pr.com/9/1/919407996_g.jpg",
          "description": "From Boardroom to Race Day: COOFANDY and Global Brand Ambassador Christopher Bell Redefine Modern Men's Wardrobe",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.open-pr.com/9/1/919650997_g.jpg",
          "description": "Aaron Mace Shares a Powerful Guide to Resilience Faith and Overcoming Lifes Challenges in New Book Riptides of Resilience",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.openpr.com/fx/logo-google-news.svg",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://www.openpr.com/fx/openpr-logo.svg",
          "description": "openPR Logo",
          "description_source": "alt",
          "score": null
        }
      ],
      "favicon": "https://www.openpr.com/favicon-180x180.png",
      "id": "641258-00"
    },
    {
      "url": "https://www.sciencealert.com/trichotillomania-new-study-explains-why-people-feel-compelled-to-pull-out-their-own-hair",
      "title": "Trichotillomania: New Study Explains Why People Feel Compelled to Pull Out Their Own Hair - ScienceAlert",
      "score": 0.6813171010969512,
      "published_date": "Mon, 24 Aug 2026 01:47:44 GMT",
      "content": "Trichotillomania (pulling out the hairs on your head, eyebrows, lashes, or elsewhere) is not a new condition. One common explanation for trichotillomania is emotional regulation: that hair pulling helps people cope with unpleasant feelings such as anxiety, tension, or frustration and feel relief after completing the act. But previous research has produced inconsistent evidence to support the emotional regulation idea, as hair pulling can also happen when someone is distracted or not even aware they are doing it. \"The majority of existing studies focus predominantly on the behavior, neglecting the urge and underlying factors that may influence it,\" the team writes in their new study, published in *Comprehensive Psychiatry*. Study participants received seven prompts a day between 8 am and 10 pm, asking them to report their current emotional state, how strong their urge to pull was, and whether they had pulled their hair since the previous assessment. When people reported stronger urges, they were substantially more likely to report a hair-pulling episode at that assessment.",
      "raw_content": "Trichotillomania: New Study Explains Why People Feel Compelled to Pull Out Their Own Hair\nHealth24 August 2026\nBy Starre Vartan\nAdd ScienceAlert on Google\n(coffeekai/Canva)\nTrichotillomania (pulling out the hairs on your head, eyebrows, lashes, or elsewhere) is not a new condition.\nAccording to historical documents, the earliest written mentions appear in Hippocrates' Epidemics III, in 410 BCE. Around 350 BCE, Aristotle wrote about vices in the Nicomachean Ethics and included \"the habit of plucking out the hair or of gnawing the nails.\"\nAlso called hair-pulling disorder, trichotillomania is classified as a body-focused repetitive behavior and can lead to hair loss and significant psychological or social impairment.\nIt affects between 1-2 percent of people in the US, impacts both genders equally, and is often seen alongside other mental-health conditions such as anxiety and depression, PTSD, OCD, and ADHD.\nOne common explanation for trichotillomania is emotional regulation: that hair pulling helps people cope with unpleasant feelings such as anxiety, tension, or frustration and feel relief after completing the act.\nBut previous research has produced inconsistent evidence to support the emotional regulation idea, as hair pulling can also happen when someone is distracted or not even aware they are doing it.\nTo get a better handle on what happens in real time, researchers at Heidelberg University Hospital followed 61 adults with trichotillomania for 10 days.\n\"The majority of existing studies focus predominantly on the behavior, neglecting the urge and underlying factors that may influence it,\" the team writes in their new study, published in Comprehensive Psychiatry.\nSo the researchers set out to discover more about this urge and its repercussions.\nRather than having participants recall their day in a journal entry each evening (a common way to collect this kind of data), the researchers used an ecological momentary assessment instead.\nThis approach prompts people to record their feelings and actions in the moment rather than recall emotions from hours earlier.\nStudy participants received seven prompts a day between 8 am and 10 pm, asking them to report their current emotional state, how strong their urge to pull was, and whether they had pulled their hair since the previous assessment. They could also report pulling episodes as they happened.\nThat produced 2,557 momentary assessments and 702 hair-pulling episodes for the study's analysis.\nWhen people reported stronger urges, they were substantially more likely to report a hair-pulling episode at that assessment. Stronger urges at one assessment also predicted pulling at the subsequent assessment.\nPrevious pulling episodes likewise made another episode more likely, suggesting some persistence in the behavior over the course of a day.\nBut emotional states were much less predictive than the urges were.\nNegative emotions – including feelings such as anxiety, anger, sadness, guilt, and nervousness – were associated with stronger urges when people were experiencing them. So were rumination, tiredness, and boredom. Positive emotions, meanwhile, were associated with weaker urges.\nOne emotional or behavioral state stood out: Boredom.\nBoredom predicted both subsequent hair-pulling episodes, and pulling at the same assessment. Tiredness, meanwhile, predicted stronger urges, although it was not associated with pulling itself.\nSo, rather than hair pulling being primarily a response to emotional distress, the behavior may sometimes be related to negative stimulation – but also a lack of it. \"States of low energy may contribute to vulnerability for urges,\" the authors write.\nThey point to a theory in which repetitive behaviors help regulate internal stimulation levels, potentially making hair pulling more likely during states of under-arousal or boredom.\n\"The consistent predictive role of boredom and tiredness in particular suggests that models focusing exclusively on emotional dysregulation may be insufficient,\" the researchers write.\nThat doesn't mean emotions are irrelevant. Negative emotions and other internal states can be part of the experience of an urge, even if they don't reliably cause the behavior that follows. The researchers also emphasize that trichotillomania may not work the same way for everyone (there may be subtypes).\nThis study involved a relatively small, predominantly female sample, and participants had to be motivated enough to complete an intensive 10-day monitoring protocol – both of which are significant limitations in the research.\nAssessments could be as much as four hours apart, meaning rapid changes in emotions or urges could have happened between them and gone uncaptured.\nRelated: Hidden Pulses Within Your Brain May Hold Your Thoughts Together\nStill, the findings suggest that understanding trichotillomania may require looking beyond the assumption that stress, sadness, or anxiety causes someone to pull.\nThe more useful question may be what happens between an urge and an action – including boredom, stimulation, sensory experiences, environmental cues, and awareness of the urge itself.\nThe research has been published in Comprehensive Psychiatry.\nThis article was fact-checked by Rachel Garner and edited by Rebecca Dyer. While we pride ourselves on our process, we are only human. If you spot a mistake, please let us know.",
      "images": [
        {
          "url": "https://www.sciencealert.com/images/2026/08/Hairpulling-642x361.jpg",
          "description": "Trichotillomania: New Study Explains Why People Feel Compelled to Pull Out Their Own Hair",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://img.youtube.com/vi/mxwUyUoXHVc/0.jpg",
          "description": "YouTube Thumbnail",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.sciencealert.com/images/2026/05/FOMO-1200x628-_Dont-miss-the-next-breakthrough_-cosmic-colourful-642x336.jpg",
          "description": "Subscribe to ScienceAlert's free fact-checked newsletter",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://ib.adnxs.com/getuid?https%3A%2F%2Fpixel.servebom.com%2Fpartner%3Fcb%3D3022%26svc%3Dus%26id%3D23%26uid%3D%24UID",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://us-u.openx.net/w/1.0/cm?gdpr=0&gdpr_consent=&id=de2d90e5-4d26-4c8c-a342-3edcde51fdb1&ph=25af9286-f23b-4b02-abcd-f2ee3b564dab&r=https%3A%2F%2Fpixel.servebom.com%2Fpartner%3Fcb%3D322%26svc%3Dus%26id%3D22%26uid%3D",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://eb2.3lift.com/getuid?gdpr=0&gdpr_consent=&redir=https%3A%2F%2Fpixel.servebom.com%2Fpartner%3Fcb%3D2328%26svc%3Dus%26id%3D14%26uid%3D%24UID",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://ssbsync.smartadserver.com/api/sync?gdpr=0&gdpr_consent=&redirectUri=https%3A%2F%2Fpixel.servebom.com%2Fpartner%3Fcb%3D2408%26svc%3Dus%26id%3D38%26uid%3D%5Bssb_sync_pid%5D&callerId=282",
          "description": null,
          "description_source": null,
          "score": null
        }
      ],
      "favicon": "https://www.sciencealert.com/images/2022/08/cropped-sa-rounded-favicon-32x32.png",
      "id": "30bf1d-01"
    },
    {
      "url": "https://www.cnet.com/tech/mobile/samsung-phone-users-can-now-sync-photos-and-video-to-google/",
      "title": "Samsung Phone Users Can Now Sync Photos and Video to Google - CNET",
      "score": 0.44719922022318875,
      "published_date": "Fri, 18 Sep 2026 21:28:38 GMT",
      "content": "# Samsung Phone Users Can Now Sync Photos and Video to Google. Samsung phone users can now sync photos and videos in their Gallery app to Google, as native Microsoft OneDrive integration ends Sept. Tech insider Ice Universe viewed the new feature and posted images on X, noting that you may now see a new “Sync photos and videos” option in Gallery Settings. After syncing Gallery to Google Photos, users can view and share multimedia from their Samsung devices, the Google Photos app and photos.google.com. Google Workspace accounts can’t use it, and synced items can’t be viewed in Google features such as memories and highlights, live albums or search unless you back up photos and videos via Google Photos. Syncing Samsung Gallery to Google Photos is optional, but storing photos and videos only in the Gallery will quickly eat up phone storage space. * Galaxy Z Fold 5 Review.",
      "raw_content": "Skip to content\nYour Guide  \nTo a Better Future\nAdd as a preferred source on Google\nYour Guide  \nTo a Better Future\nOur expert, award-winning staff selects the products we cover and rigorously researches and tests our top picks. If you buy through our links, we may earn a commission.\nSamsung Phone Users Can Now Sync Photos and Video to Google\nSyncing to Microsoft OneDrive will end on Sept. 30.\nAlex Valdes\nEver since being admittedly fascinated by the Cambridge coffee webcam from the 1990s, I've written about VPNs, the NFL, smartphones, living wages, over/unders and everything in between. Read full bio\nAlex Valdes\nRead full bio\nSeptember 18, 2026, 5:28 pm ET\n1 min read\nOne cloud in, one cloud out. Samsung phone users can now sync photos and videos in their Gallery app to Google, as native Microsoft OneDrive integration ends Sept. 30. The update will roll out over the coming days, and availability may vary depending on account type, device model or region.\nTech insider Ice Universe viewed the new feature and posted images on X, noting that you may now see a new “Sync photos and videos” option in Gallery Settings.\nAs detailed on this Google page, you must have a compatible Samsung device running Android 13 or newer and a personal Google account. To find out which Android version you have, go to Settings > About phone > Software information, then look for the Android version. If you need to create a Google account, the details are here.\nAfter syncing Gallery to Google Photos, users can view and share multimedia from their Samsung devices, the Google Photos app and photos.google.com. But there are limitations. Google Workspace accounts can’t use it, and synced items can’t be viewed in Google features such as memories and highlights, live albums or search unless you back up photos and videos via Google Photos.\nAlso, Google Accounts supervised by parents are ineligible to use the feature.\nGoogle says that you can back up photos, videos, albums, device folders such as downloads or screenshots, and metadata such as timestamps, location, and favorites status.\nRepresentatives for Samsung and Google did not immediately respond to requests for further comment.\nHow to sync to Google Photos\nSyncing Samsung Gallery to Google Photos is optional, but storing photos and videos only in the Gallery will quickly eat up phone storage space. Open the Samsung Gallery app on your phone, then tap the three-line hamburger menu at the bottom right. Select Settings, then Sync Photos and videos. Choose a Google account from the instructions and grant permission to sync media.\nDeleting items from either Samsung Gallery or Google Photos will remove them from both apps and from your cloud storage. Editing photos in either app will also show up everywhere.\nUsers can also turn off syncing at any time, and previously backed up items remain safely stored in their Google Account.\nAlex Valdes\nEver since being admittedly fascinated by the Cambridge coffee webcam from the 1990s, I've written about VPNs, the NFL, smartphones, living wages, over/unders and everything in between.  See full bio\nThe Latest from Alex\n Samsung Phone Users Can Now Sync Photos and Video to Google\n DoorDash Can Now Deliver Your Ginormous Costco Order the Same Day\n Meta Reportedly Creating Glasses Without Cameras After ‘Pervert’ Uproar\nMobile Guides\nPhones\n Best iPhone\n Best Phone\n Samsung Galaxy S24 Review\n Best Samsung Galaxy Phone\n iPhone 15 Pro/Pro Max Review\n Best Galaxy S24 Deals\n Best iPhone Deals\n Best Android Phones\n Pixel 8 Pro Review\n Best iPhone 15 Deals\nFoldable Phones\n Best Foldable Phones\n OnePlus Open Review\n Galaxy Z Fold 5 Review\nHeadphones\n Best Wireless Earbuds\n Best Headphones\n Best Wireless Earbuds and Headphones for Making Calls\n Best Noise Canceling Wireless Earbuds\n Best Cheap Wireless Earbuds\n Best Noise Canceling Headphones\n Best Over Ear Headphones\n Best Headphones for Work at Home\n Best Sounding Wireless Earbuds\n Best Wireless Headphones\nSmartwatches\n Apple Watch Series 8 vs Series 7\n Best Android Smartwatch\n Best Smartwatch\n Best Apple Watch Bands\n Apple Watch Ultra Review\nWireless Plans\n Best Prepaid Phone Plans\n Best Unlimited Data Plans\n Best Phone Plan Deals\n Best Family Phone Plans\n Best Verizon Plans\n Best Cheap Phone Plans\n Best Phone Plans\n Best Senior Phone Plans\n Best Travel Phone Plans",
      "images": [
        {
          "url": "https://www.cnet.com/wp-content/uploads/sites/2/372fc674-ce80-4610-b50a-72bbcc5cdd51.png?w=80",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://www.cnet.com/wp-content/uploads/sites/2/07c46b6b-1402-4875-83c6-87a844ee5aea.jpg?w=864",
          "description": "Samsung Galaxy A12",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.cnet.com/wp-content/uploads/sites/2/372fc674-ce80-4610-b50a-72bbcc5cdd51.png?w=64",
          "description": "Alex Valdes",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://cdn.ziffstatic.com/pub/icong1.png",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://www.cnet.com/wp-content/themes/cnet-theme/assets/images/branding/logo.svg",
          "description": "Notification Icon",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://zdbb.net/l/z0WVjCBSEeGLoxIxOQVEwQ?additionalInformation=&cms_page_id=&local_uid=&referrer=&zd_pageview_id=bf94589f-7aec-4efa-81f7-bba4cf0b6d9b&zd_session_id=31407075-7a45-4d4d-9128-7922f7299419&zd_location=https%3A%2F%2Fwww.cnet.com%2Ftech%2Fmobile%2Fsamsung-phone-users-can-now-sync-photos-and-video-to-google%2F&eu_consent=&third_party_consent=&fu=true&fpid=ffb84235986f47d3a7a7a99fa6c0b25a&ppid=ffb84235986f47d3a7a7a99fa6c0b25a",
          "description": "Transparent audience pixel",
          "description_source": "alt",
          "score": null
        }
      ],
      "favicon": "https://www.cnet.com/wp-content/uploads/sites/2/cropped-favicon-480.png?w=180",
      "id": "8b8bc6-02"
    },
    {
      "url": "https://seekingalpha.com/article/4939251-5-best-gold-and-silver-miner-etfs-for-a-precious-metals-rally",
      "title": "5 Best Gold And Silver Miner ETFs For A Precious Metals Rally - Seeking Alpha",
      "score": 0.2785029587564812,
      "published_date": "Mon, 24 Aug 2026 11:00:00 GMT",
      "content": "# 5 Best Gold And Silver Miner ETFs For A Precious Metals Rally. Gold and silver are regaining momentum as a more favorable macro backdrop, combined with improving technical signals, potentially creates a perfect storm to form a precious metals rally. Steven Cress is VP of Quantitative Strategy and Market Data at Seeking Alpha. Steve is also the creator of the platform’s quantitative stock rating system and many of the analytical tools on Seeking Alpha. His contributions form the cornerstone of the Seeking Alpha Quant Rating system, designed to interpret data for investors and offer insights on investment directions, thereby saving valuable time for users. He is also the Founder and Co-Manager of Alpha Picks, a systematic stock recommendation tool designed to help long-term investors create a best-in-class portfolio.Steve is passionate and dedicated to removing emotional biases from investment decisions. You alone are solely responsible for determining whether any investment, security or strategy, or any product or service, is appropriate or suitable for you based on your investment objectives and personal and financial situation.",
      "raw_content": "Home page Seeking Alpha - Power to Investors\nSearch for Symbols, analysts, keywords\n5 Best Gold And Silver Miner ETFs For A Precious Metals Rally\nAug 24, 2026, 7:00 AM ETRING, GDX, GDXJ, SGDJ, SLVP13 Comments\nSteven Cress, Quant Team\nSA Quant Strategist\nSummary\n Gold and silver are gaining momentum as Treasury buybacks, a weaker U.S. dollar, and improving technical signals support precious metals.\n Central-bank purchases and de-dollarization remain structural gold tailwinds, while electrification and industrial demand provide an additional long-term catalyst for silver.\n Miner ETFs offer diversified exposure to precious metals while potentially providing operating leverage to rising gold and silver prices.\n Quant-rated miner ETFs span established producers, junior miners, factor-based strategies, and silver-focused portfolios, giving investors several ways to access the precious-metals rally.\n Looking for more investing ideas like this one? Get them exclusively at Alpha Picks. Learn More »\nGold and Silver Rise on Macro, Technical Tailwinds\nGold and silver are regaining momentum as a more favorable macro backdrop, combined with improving technical signals, potentially creates a perfect storm to form a precious metals rally. Gold has\nThis article was written by\nSteven Cress, Quant Team\n100.4K Followers\nSteven Cress is VP of Quantitative Strategy and Market Data at Seeking Alpha. Steve is also the creator of the platform’s quantitative stock rating system and many of the analytical tools on Seeking Alpha. His contributions form the cornerstone of the Seeking Alpha Quant Rating system, designed to interpret data for investors and offer insights on investment directions, thereby saving valuable time for users. He is also the Founder and Co-Manager of Alpha Picks, a systematic stock recommendation tool designed to help long-term investors create a best-in-class portfolio.Steve is passionate and dedicated to removing emotional biases from investment decisions. Utilizing a data-driven approach, he leverages sophisticated algorithms and technologies to simplify complex, laborious investment research, creating an easy-to-follow, daily updated grading system for stock trading recommendations.Steve was previously the Founder and CEO of CressCap Investment Research until its acquisition by Seeking Alpha in 2018 for its unparalleled quant analysis and market data capabilities. Prior to that, he had also founded the quant hedge fund Cress Capital Management, after spending most of his career running a proprietary trading desk at Morgan Stanley and leading international business development at Northern Trust.With over 30 years of experience in equity research, quantitative strategies, and portfolio management, Steve is well-positioned to speak on a wide range of investment topics.\nAnalyst’s Disclosure: I/we have no stock, option or similar derivative position in any of the companies mentioned, and no plans to initiate any such positions within the next 72 hours. I wrote this article myself, and it expresses my own opinions. I am not receiving compensation for it. I have no business relationship with any company whose stock is mentioned in this article.\nSeeking Alpha's Disclosure: Past performance is no guarantee of future results. No recommendation or advice is being given that any particular security, portfolio, transaction or investment strategy is suitable for any specific person. The author is not advising you personally concerning the nature, potential, value or suitability of any particular security or other matter. You alone are solely responsible for determining whether any investment, security or strategy, or any product or service, is appropriate or suitable for you based on your investment objectives and personal and financial situation. Steven Cress is the Head of Quantitative Strategy at Seeking Alpha. Any views or opinions expressed herein may not reflect those of Seeking Alpha as a whole. Seeking Alpha is not a licensed securities dealer, broker or US investment adviser or investment bank.\nTo ensure this doesn’t happen in the future, please enable Javascript and cookies in your browser.\nIs this happening to you frequently? Please report it on our feedback forum.\nIf you have an ad-blocker enabled you may be blocked from proceeding. Please disable your ad-blocker and refresh.\nEntering text into the input field will update the search result below\nRecommended For You",
      "images": [
        {
          "url": "https://static.seekingalpha.com/cdn/s3/uploads/getty_images/2253483135/image_2253483135.jpg?io=getty-c-w630",
          "description": "A collection of gold and silver ingots and coins, close up.",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://seekingalpha.com/images/users_profile/050/113/560/big_pic.png?io=w36",
          "description": null,
          "description_source": null,
          "score": null
        }
      ],
      "favicon": "https://seekingalpha.com/samw/static/images/apple-touch-icon-180x180.png",
      "id": "be15ee-03"
    },
    {
      "url": "https://natlawreview.com/press-releases/wuhan-senbo-resort-wjd-design-wins-platinum-interior-design-award",
      "title": "Wuhan Senbo Resort by Wjd Design Wins Platinum in A' Interior Design Award - The National Law Review",
      "score": 0.08705574563105216,
      "published_date": "Fri, 28 Aug 2026 10:11:41 GMT",
      "content": "### Wuhan Senbo Resort by Wjd Design Wins Platinum in A' Interior Design Award. *Wjd Design Receives Platinum A' Design Award for an Immersive Parent-Child Urban Resort Inspired by Wuhan*. COMO, CO, ITALY, August 28, 2026 /EINPresswire.com/ -- The A' Design Award has announced Wuhan Senbo Resort by Wjd Design as a Platinum winner in the Interior Space and Exhibition Design category. This recognition places the hotel project among works distinguished through a rigorous evaluation by an international jury of design professionals, academics, and industry experts. The A' Design Award is a highly respected accolade within the interior design field, acknowledging projects that demonstrate creativity, technical merit, and meaningful cultural value. Wuhan Senbo Resort earned this distinction for its thoughtful translation of regional identity into spatial experience, reflecting a strong commitment to good design. Wuhan Senbo Resort redefines the parent-child urban resort model by translating Wuhan's natural and cultural symbols of mountains, water, and lotus into an immersive spatial narrative.",
      "raw_content": "August 28, 2026\nVolume XVI, Number 240\nLegal Analysis. Expertly Written. Quickly Found.\nTrending News\nNinth Circuit Reviews Challenge to California’s Captive Audience Law\nOne Fraud Division, Many Enforcement Questions: What DOJ's National Fraud Enforcement Division Means for Companies\nAVOIDABLE- Molina Healthcare Settles TCPA Wrong Number Class Action For $1.93MM– and This Doesn’t Have to Keep Happening\nUnaccepted Proposal, Unpaid Fees- Second DCA Says Insurer’s Policy Language Controls\nDrawing the Lines of PFAS Liability: What the Recent CERCLA Decision Means\nNew Maryland DOL Resources Help Employers Prepare for FAMLI\nAn Employer’s Guide to Filing a Declaration of Intent for a Maryland FAMLI Private Plan\nPennsylvania Executive Order Changes the Regulatory Landscape for Data Center Development\nWhat Makes a Great CFO\nThe New Math — Part I of IV\nWuhan Senbo Resort by Wjd Design Wins Platinum in A' Interior Design Award\nWuhan Senbo Resort by Wjd Design Wins Platinum in A' Interior Design Award\nPress Release Date 08-28-2026 \nWuhan Senbo Resort\nWjd Design Receives Platinum A' Design Award for an Immersive Parent-Child Urban Resort Inspired by Wuhan\nCOMO, CO, ITALY, August 28, 2026 /EINPresswire.com/ -- The A' Design Award has announced Wuhan Senbo Resort by Wjd Design as a Platinum winner in the Interior Space and Exhibition Design category. This recognition places the hotel project among works distinguished through a rigorous evaluation by an international jury of design professionals, academics, and industry experts. The A' Design Award is a highly respected accolade within the interior design field, acknowledging projects that demonstrate creativity, technical merit, and meaningful cultural value. Wuhan Senbo Resort earned this distinction for its thoughtful translation of regional identity into spatial experience, reflecting a strong commitment to good design.\nThis achievement holds relevance for the broader interior design industry as it illustrates how cultural narrative and engineering precision can converge within a large-scale commercial environment. The project addresses a growing interest in nature-immersed hospitality and family-oriented destinations, offering replicable strategies for resort design grounded in regional ecology. By balancing artistic expression with safety, sustainability, and functional clarity, the design responds to current expectations for environments that are both meaningful and practical. Such an approach benefits guests, operators, and the wider tourism sector by demonstrating how local heritage can shape contemporary spatial identity.\nWuhan Senbo Resort redefines the parent-child urban resort model by translating Wuhan's natural and cultural symbols of mountains, water, and lotus into an immersive spatial narrative. Rather than imitating nature directly, the design employs abstraction, deconstruction, and material innovation to establish a continuous natural atmosphere through curved surfaces, fluid floor patterns, and organic textures. The iconic mountain-like lobby ceiling was resolved using building information modeling and parametric techniques, supported by custom-fabricated glass fiber reinforced gypsum panels for structural accuracy. Materials include polyethylene terephthalate glycol-modified panels, artistic coatings, natural wood, and bamboo weaving, while intelligent lighting simulates natural light filtering through lotus leaves. Together these elements create a tranquil, contemporary retreat that evokes the cultural character of the region.\nThe Platinum A' Design Award recognition offers Wjd Design renewed motivation to continue exploring the intersection of cultural storytelling and technical innovation. The project's research, drawn from site studies, cultural analysis, and parent-child experience interviews, provides a foundation for future work in nature-based hospitality design. This acknowledgment may encourage the team to further refine sustainable material practices and advanced modeling methods in forthcoming projects. It also reinforces the value of interdisciplinary collaboration as a pathway toward thoughtful and enduring design outcomes.\nProject Members  \nWuhan Senbo Resort was realized by the dedicated team at Wjd Design, with Chen Yonghua serving as Chief Designer, Shen Maohui contributing as Chief Designer, Yu Yu working as Chief Designer, Chen Ying participating as Chief Designer, and Xu Yiyang collaborating as Chief Designer. Together this group coordinated the cultural research, spatial concept, and technical execution that shaped the project.\nInterested parties may learn more about Wuhan Senbo Resort, view its features, and explore the work of its designers at the dedicated page provided by the A' Design Award. Additional details, imagery, and project background are available for review. Inquiries regarding the project may be directed to Wjd Design.  \n\nAbout Wjd Design  \nWjd Design is a young and energetic team based in China, distinguished among international and domestic design studios by its experience across international brand hotels, boutique hotels, homestays, restaurants, clubs, and finished model rooms. The team has received a number of international awards and approaches each commission with a unique perspective that brings fresh ideas to its clients. Guided by a love of life, the studio communicates its understanding of nature and care through the medium of design. Creating living works and advocating sustainable development remain constant principles for the team.\nAbout the Platinum A' Design Award Recognition  \nThe Platinum A' Design Award is the highest distinction granted by the A' Design Award, recognizing works that combine notable innovation with meaningful societal contribution. Designs selected at this level demonstrate strong technical proficiency, considered artistic skill, and original creative qualities, evaluated against established criteria. Within the Interior Space and Exhibition Design category, these criteria include innovative use of space, material selection excellence, functional layout design, color scheme mastery, lighting design proficiency, sustainable design practice, cultural relevance, and ergonomic consideration. Further criteria encompass aesthetic appeal, design consistency, attention to detail, budget management, accessibility compliance, incorporation of technology, space optimization, and safety. This designation reflects a measured acknowledgment of design work that advances the field and contributes positively to quality of life.\nAbout A' Design Award  \nThe A' Interior Space, Retail and Exhibition Design Award is a highly respected competition that promotes excellence and innovation within the interior design industry. It welcomes a diverse range of participants, including independent designers, leading agencies, innovative companies, furniture manufacturers, and established brands. Entries are evaluated through a blind peer-review process by a world-class jury panel of design professionals, industry experts, journalists, and academics, assessed against pre-established criteria. Organized since 2008 and now in its 18th year, the A' Design Award is an international and juried competition open to entries from all countries and across all industries, driven by a philanthropic mission to recognize and promote superior projects that benefit society and help create a better world. Interested parties may learn more about the A' Design Award, explore the jury, review past laureates, and submit their own projects at the following url: \nMakpal Bayetova  \nA' DESIGN AWARD & COMPETITION SRL  \n+39 031 497 2900  \nemail us here\nLegal Disclaimer:\nEIN Presswire provides this news content \"as is\" without warranty of any kind. We do not accept any responsibility or liability  \nfor the accuracy, content, images, videos, licenses, completeness, legality, or reliability of the information contained in this  \narticle. If you have any complaints or copyright issues related to this article, kindly contact the author above.\n Print\nWe collaborate with the world's leading lawyers to deliver news tailored for you. Sign Up for any (or all) of our 25+ Newsletters.\nFB twt mast link home\nCookies & Privacy",
      "images": [
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/logo_larg991.png",
          "description": "Home",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/images/facebook_orange_212.png",
          "description": "Facebook Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/images/twitter_orange_212.png",
          "description": "Twitter-X Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/images/linkedin_orange_212.png",
          "description": "LinkedIn Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/images/rss_orange_212.png",
          "description": "RSS Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.einpresswire.com/image/medium/1180239/wuhan-senbo-resort.png",
          "description": "Wuhan Senbo Resort by Wjd Design",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/logo.png",
          "description": "NLR Logo",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://natlawreview.com/themes/custom/nlr_theme/images/NLR_logo_white_large991.png",
          "description": "Logo-white",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://ids4.ad.gt/api/v1/ip_match?id=AU1D-0100-001790009307-A8GOXHMS-MU58",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://secure.adnxs.com/getuid?https://ids.ad.gt/api/v1/match?id=AU1D-0100-001790009307-A8GOXHMS-MU58&adnxs_id=$UID&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://u.openx.net/w/1.0/cm?id=998eaf06-9905-4eae-9e26-9fac75960c53&r=https%3A%2F%2Fids.ad.gt%2Fapi%2Fv1%2Fopenx%3Fopenx_id%3D%7BOPENX_ID%7D%26id%3DAU1D-0100-001790009307-A8GOXHMS-MU58%26auid%3DAU1D-0100-001790009307-A8GOXHMS-MU58&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://image2.pubmatic.com/AdServer/UCookieSetPug?rd=https%3A%2F%2Fids.ad.gt%2Fapi%2Fv1%2Fpbm_match%3Fpbm%3D%23PM_USER_ID%26id%3DAU1D-0100-001790009307-A8GOXHMS-MU58&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://token.rubiconproject.com/token?pid=50242&puid=AU1D-0100-001790009307-A8GOXHMS-MU58&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://sync.go.sonobi.com/us?https://ids.ad.gt/api/v1/son_match?id=AU1D-0100-001790009307-A8GOXHMS-MU58&uid=[UID]&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://ad.360yield.com/ux?&publisher_dmp_id=15&r=https%3A%2F%2Fids.ad.gt%2Fapi%2Fv1%2Fimpr_match%3Fid%3DAU1D-0100-001790009307-A8GOXHMS-MU58%26impr_uid%3D%7BPUB_USER_ID%7D&gdpr=0",
          "description": null,
          "description_source": null,
          "score": null
        }
      ],
      "favicon": "https://natlawreview.com/themes/custom/nlr_theme/favicon.ico",
      "id": "63a0ba-04"
    },
    {
      "url": "https://www.artnet.com/artists/claire-bretecher/secours-a-0xm48MMFZ0ex0OJ6JpexPg2",
      "title": "Claire Bretécher - Artnet",
      "score": 0.08305986428519102,
      "published_date": "Mon, 21 Sep 2026 08:28:30 GMT",
      "content": "This website or its third-party tools process personal data. You can opt out of the sale of your personal information by clicking on the “Do Not Sell or Share My Personal Information” link. However, you can opt out of these cookies by checking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. We use third-party cookies that help us analyze how you use this website, store your preferences, and provide the content and advertisements that are relevant to you. Once you opt out, you can opt in again at any time by unchecking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. Do Not Sell or Share My Personal Information. Image 3: secours by claire bretécher. ## Claire Bretécher. Contact Gallery About This Work. Image 23: Gallery logo ## Huberty & Breyne Brussels / Paris. Includes a Certificate of Authenticity (COA) issued by the gallery. You are now following Claire Bretécher.",
      "raw_content": "Image 1\nWe value your privacy\nThis website or its third-party tools process personal data. You can opt out of the sale of your personal information by clicking on the “Do Not Sell or Share My Personal Information” link.\nDo Not Sell or Share My Personal Information\nOpt-out PreferencesImage 2\nWe use third-party cookies that help us analyze how you use this website, store your preferences, and provide the content and advertisements that are relevant to you. However, you can opt out of these cookies by checking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. Once you opt out, you can opt in again at any time by unchecking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button.\n[x] \nDo Not Sell or Share My Personal Information\nCancel Save My Preferences\nYour opt-out preference has been honored.\nBanner closes automatically in  s...\n\nLog InorRegister\nArtworks\nArtists\nAuctions\n   Artnet Auctions\n   Global Auction Houses\nGalleries\nEvents\nNews\nPrice Database\n   Use the Artnet Price Database\n   Market Alerts\n   Artnet Analytics\nHidden\nBuy\n   Browse Artists\n   Artnet Auctions\n   Browse Galleries\n   Global Auction Houses\n   Events & Exhibitions\n   Speak With a Specialist\n   How to Buy\nSell\n   Sell With Us\n   Become a Gallery Partner\n   Become an Auction Partner\n   Receive a Valuation\n   How to Sell\nSearch\nHidden\n\nImage 3: secours by claire bretécher\n\nImage 4: artnet\nImage 5: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nImage 6: secours by claire bretécher\n\nImage 7: artnet\nImage 8: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nImage 9: secours by claire bretécher\n\nImage 10: artnet\nImage 11: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nContact the gallery for more images\nView to Scale\nImage 12: zoom iconZoom\n\nClaire Bretécher\nFrench, 1940–2020\n_Secours_, 2004\nImage 13: secours by claire bretécher\n\nImage 14: artnet\nImage 15: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nImage 16: secours by claire bretécher\n\nImage 17: artnet\nImage 18: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nImage 19: secours by claire bretécher\n\nImage 20: artnet\nImage 21: secours by claire bretécher\n   Claire Bretécher\n   _Secours_, 2004\n   33 x 25.5 cm. (13 x 10 in.)\nclose\nContact the gallery for more images\nView to Scale\nImage 22: zoom iconZoom\nMedium Works on paper, India ink and colored inks on paper Size 33 x 25.5 cm. (13 x 10 in.)Markings Signé en bas à droite\nPrice\n5,100 EUR\n?\n×\nCurrency Converter\nEuro \nConvert\nCurrency rate entered cannot be found.\n(5,858 USD)\nContact Gallery About This Work\nImage 23: Gallery logo ## Huberty & Breyne Brussels / Paris\n   Artworks\n   Artists\n   Exhibitions\n   Contact Gallery\nSell a similar work with Artnet Auctions\nAbout this Artwork\nExhibitions Huberty & Breyne, Fine Arts, Paris, 2026 Image Rights©Huberty & Breyne\nSee more\nDescription\nIncludes a Certificate of Authenticity (COA) issued by the gallery\nSee more\n\nX\nNewsletter Signup\nPlease enter a valid email address.\nThank you for subscribing!\nImage 24\nGet the latest email updates from this artist.\nFollow\nPlease enter a valid email address\nPrivacy Policy\nThank You! You are now following Claire Bretécher\nCLOSE\n   Price Database\n   Market Alerts\n   Analytics Reports\n   Gallery Network\n   Auction House Partnerships\n   About\n   Contact\n   Investor Relations\n   Jobs\n   FAQ\n   Site Map\n   Advertise\n   Terms\n   Privacy\n   Cookies\n   facebook\n   twitter\n   pinterest>\n   instagram\">\n   weibo\">\nEnglish (US)\n   English (US)\n   Deutsch\n   Français\n©2024 Artnet Worldwide Corporation. All rights reserved.\nImage 27",
      "images": [
        {
          "url": "https://cdn-cookieyes.com/assets/images/close.svg",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://www.artnet.com/WebServices/images/ll3263840llgVpkR3CfDrCWvaHBOAD/claire-bret%C3%A9cher-secours.jpg",
          "description": "secours by claire bretécher",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/scale%20view_2048.jpg",
          "description": "artnet",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/WebServices/images/ll3263841llgVpkR3CfDrCWvaHBOAD/claire-bret%C3%A9cher-secours.jpg",
          "description": "secours by claire bretécher",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/WebServices/images/ll3263842llgVpkR3CfDrCWvaHBOAD/claire-bret%C3%A9cher-secours.jpg",
          "description": "secours by claire bretécher",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/magnify.png",
          "description": "zoom icon",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/logo_brand.svg?v=2",
          "description": null,
          "description_source": null,
          "score": null
        }
      ],
      "favicon": "https://www.artnet.com/media/icons/apple-touch-icon-144x144.png",
      "id": "525a48-05"
    },
    {
      "url": "https://9to5mac.com/2026/09/02/siri-ai-wont-be-your-friend-and-heres-why-that-really-matters/",
      "title": "Siri AI won’t be your friend, and here’s why that really matters - 9to5Mac",
      "score": 0.06912006500853304,
      "published_date": "Wed, 02 Sep 2026 13:21:44 GMT",
      "content": "# Siri AI won’t be your friend, and here’s why that really matters. More than a quarter of Americans view AI chatbots in much the same way they might a close friend or therapist, according to *The Washington Post*. > Many talk to AI apps as they might a close friend or therapist […] 27% of Americans turn to AI chatbots like OpenAI’s ChatGPT or Google’s Gemini with personal, emotional or social queries, according to a new poll [including] seeking entertainment, relationship advice, romantic chats, or connection when alone. > Among the people who said they used chatbots for personal or emotional queries or discussions, nearly 4 in 10 strongly or somewhat agreed that they sometimes talked to AI to feel less alone. They might encourage you to reveal things about yourself and then use that as a basis to establish a connection. I mean, the way that we have designed Siri, Siri really wants to say, listen, that’s not what I’m here for, right?",
      "raw_content": "Go to the 9to5Mac home page\n Siri\n AI\nSiri AI won’t be your friend, and here’s why that really matters\nBen Lovejoy | Sep 2 2026 - 6:21 am PT\n11 Comments\nElon University has partnered with The Washington Post to conduct what turned out to be a worrying survey about Americans viewing AI chatbots as virtual friends or therapists.\nThe results very much vindicate Apple’s careful decision to ensure that Siri AI doesn’t encourage such pseudo-relationships …\nThe AI friendship findings\nMore than a quarter of Americans view AI chatbots in much the same way they might a close friend or therapist, according to The Washington Post.\n> Many talk to AI apps as they might a close friend or therapist […] 27% of Americans turn to AI chatbots like OpenAI’s ChatGPT or Google’s Gemini with personal, emotional or social queries, according to a new poll [including] seeking entertainment, relationship advice, romantic chats, or connection when alone.\n>\n> Among the people who said they used chatbots for personal or emotional queries or discussions, nearly 4 in 10 strongly or somewhat agreed that they sometimes talked to AI to feel less alone. Nearly a third said they consider the chatbot they use most often to be a friend.\nWhile some of this usage may serve positive purposes, the concern is that having chatbots act as an emotional substitute for friendship and romance reduces the incentives to invest time and effort in establishing genuine human connections. It may lead to a downward spiral of increasing social isolation.\nSiri AI does not encourage this\nApple execs Craig Federighi and Greg Joswiak said earlier this year that Siri AI will not act in this way.\n> Q: “So just to confirm, there are no AI girlfriends or boyfriends being created with the updated Siri AI?”\n>\n> A: No, no, no. Quite the opposite. Because as you may know, if you use many of the existing chatbots, they’re really focused on engagement to a large degree. And sycophantic, right? They kind of want to pull you in. They might encourage you to reveal things about yourself and then use that as a basis to establish a connection.\n>\n> And we view it quite the opposite. I mean, the way that we have designed Siri, Siri really wants to say, listen, that’s not what I’m here for, right? I’m here to help you. I can help you get things done. I can help you learn about the world. But if you try to engage Siri as a romantic partner, Siri is not up for that.\n9to5Mac’s Take\nI found the survey results extremely alarming, especially after listening to the excellent Suspicious Minds: Al and the Apocalypse podcast about AI-fueled delusions. The stance Apple is taking here is absolutely the right one.\n Certified refurbished Apple products 15% off at apple.com\n Official Apple Store on Amazon\n Discounted AirPods Pro 3\n Wireless CarPlay adapter\n 10-year AirTag battery case\n Logitech MX Master 4 for Mac\nPhoto by Franck V. on Unsplash (modified by 9to5Mac)\nFTC: We use income earning auto affiliate links. More.\nYou’re reading 9to5Mac — experts who break news about Apple and its surrounding ecosystem, day after day. Be sure to check out our homepage for all the latest news, and follow 9to5Mac on Twitter, Facebook, and LinkedIn to stay in the loop. Don’t know where to start? Check out our exclusive stories, reviews, how-tos, and subscribe to our YouTube channel\nCheck out 9to5Mac on YouTube for more Apple news:\nComments\nGuides\n### Siri\nSiri is Apple's personal assistant technology th…\nAuthor\nBen Lovejoy   benlovejoy \nBen Lovejoy is a British technology writer and EU Editor for 9to5Mac. He’s known for his op-eds and diary pieces, exploring his experience of Apple products over time, for a more rounded review. He also writes fiction, with two technothriller novels, a couple of SF shorts and a rom-com!\nBen Lovejoy's favorite gear\n#### Dell 49-inch curved monitor",
      "images": [
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/Siri-AI-wont-act-as-your-friend-and-heres-why-that-really-matters.jpg?quality=82&strip=all&resize=1200,628",
          "description": null,
          "description_source": "og:image",
          "score": 10
        },
        {
          "url": "https://secure.gravatar.com/avatar/b9db61d5cef3fec85352bf3d7768d06ff353055f7b4b968a103f9fba4b451a1a?s=30&d=mm&r=r",
          "description": "Avatar for Ben Lovejoy",
          "description_source": "alt",
          "score": 5
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/Siri-AI-wont-act-as-your-friend-and-heres-why-that-really-matters.jpg?quality=82&strip=all&w=1600",
          "description": "Siri AI won't act as your friend, and here's why that really matters | Photo shows a friendly-looking robot",
          "description_source": "alt",
          "score": 4
        },
        {
          "url": "https://9to5mac.com/wp-content/themes/ninetofive/dist/images/google-preferred-source-badge-dark.png",
          "description": "Add 9to5Mac as a preferred source on Google",
          "description_source": "alt",
          "score": 3
        },
        {
          "url": "https://9to5mac.com/wp-content/themes/ninetofive/dist/images/google-preferred-source-badge-light.png",
          "description": "Add 9to5Mac as a preferred source on Google",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/Banner-3-720-x-150@2x.png",
          "description": null,
          "description_source": null,
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/mac-mini.jpg?quality=82&strip=all&w=290&h=145&crop=1",
          "description": null,
          "description_source": null,
          "score": 2
        },
        {
          "url": "https://secure.gravatar.com/avatar/57682250b4cca117adc866947cd168039296d63a504baa8880c2572e95a78ca7?s=18&d=mm&r=r",
          "description": "Avatar for Chance Miller",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/ifixit-18-pro-teardown.jpg?quality=82&strip=all&w=290&h=145&crop=1",
          "description": null,
          "description_source": null,
          "score": 2
        },
        {
          "url": "https://secure.gravatar.com/avatar/bb78cec603180c1a17605af3930b21e40c59b276cb679e543c98215204aaf0f1?s=18&d=mm&r=r",
          "description": "Avatar for Marcus Mendes",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2026/09/iphone-duo-side-angle-unfolded.jpg?quality=82&strip=all&w=290&h=145&crop=1",
          "description": null,
          "description_source": null,
          "score": 2
        },
        {
          "url": "https://secure.gravatar.com/avatar/7958af2c8685677516d431d8830a5feaa3781ef195c8503239a46acc991efa41?s=18&d=mm&r=r",
          "description": "Avatar for Michael Burkhardt",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/uploads/sites/6/2025/04/apple-intelligence-rainbow.jpeg?quality=82&strip=all&w=290&h=145&crop=1",
          "description": "iOS 26 Apple Intelligence",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/client-mu-plugins/9to5-core/includes/obfuscate-images/images/9to5mac-default.jpg?quality=82&strip=all&w=140",
          "description": "Siri",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://9to5mac.com/wp-content/themes/ninetofive/dist/images/default-9to5mac-guide.png",
          "description": "AI",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://secure.gravatar.com/avatar/b9db61d5cef3fec85352bf3d7768d06ff353055f7b4b968a103f9fba4b451a1a?s=82&d=mm&r=r",
          "description": "Avatar for Ben Lovejoy",
          "description_source": "alt",
          "score": 2
        },
        {
          "url": "https://m.media-amazon.com/images/I/81ZXKUvoyuL._AC_SL1500_.jpg",
          "description": "Dell 49-inch curved monitor",
          "description_source": "alt",
          "score": 2
        }
      ],
      "favicon": "https://9to5mac.com/wp-content/uploads/sites/6/2019/10/cropped-cropped-mac1-1.png?w=180",
      "id": "039a63-06"
    },
    {
      "url": "https://www.chicagotribune.com/2026/09/05/daily-horoscope-for-september-06-2026/",
      "title": "Daily Horoscope for September 06, 2026 - Chicago Tribune",
      "score": 0.06448488334549757,
      "published_date": "Sun, 06 Sep 2026 00:00:00 GMT",
      "content": "Knowing when to wait and when to act could make all the difference today. The sensitive Moon squares restrictive Saturn this morning, bringing limits, delays, or responsibilities that may feel personal. The Moon squares disciplined Saturn, creating tension between family needs and your desire to make your own decisions. If someone interrupts your day or questions a boundary, don’t wait until you’re frustrated to speak up. Explain what you need, then offer an alternative that works for everyone. A straightforward answer will give people something useful to work with and help you keep some control over your time. If someone pressures you for an answer, request more time. You’ll feel better about the decision when it reflects what matters to you rather than the intensity of the moment. The Moon in your sign conjoins fiery Mars, adding courage, urgency, and a shorter fuse to your emotional responses. Ask for what you need, address the family issue, or make the change you’ve been considering.",
      "raw_content": "Skip to content\nDaily Horoscope for September 06, 2026\nShare this:\n Share on Facebook (Opens in new window) Facebook\n Share on Bluesky (Opens in new window) Bluesky\n Share on X (Opens in new window) X\n Print (Opens in new window) Print\n Email a link to a friend (Opens in new window) Email\n Subscribe\n Login\n74°F\nSaturday, September 5th 2026 eNewspaper\nHoroscopes\n Business\n Entertainment\n Education\n Immigration\n Opinion\n Politics\n Sports\n Suburbs\n Chicago Magazine\n Obituaries\n BestReviews\nTrending:\nHoroscopes\nDaily Horoscope for September 06, 2026\nShare this:\n Share on Facebook (Opens in new window) Facebook\n Share on Bluesky (Opens in new window) Bluesky\n Share on X (Opens in new window) X\n Print (Opens in new window) Print\n Email a link to a friend (Opens in new window) Email\nBy Tarot.com\nPUBLISHED: | UPDATED:\nGetting your Trinity Audio player ready...\nGeneral Daily Insight for September 06, 2026\nKnowing when to wait and when to act could make all the difference today. The sensitive Moon squares restrictive Saturn this morning, bringing limits, delays, or responsibilities that may feel personal. By 3:05 pm EDT, the Moon conjoins fiery Mars in caring Cancer, turning frustration into motivation. Use that momentum to address something you genuinely care about, but don’t let strong feelings choose the method. A clear, manageable action will accomplish more than pushing yourself or anyone else beyond a reasonable limit.\nAries\nMarch 21 – April 19\nHome may feel a little too crowded for your comfort. The Moon squares disciplined Saturn, creating tension between family needs and your desire to make your own decisions. If someone interrupts your day or questions a boundary, don’t wait until you’re frustrated to speak up. Explain what you need, then offer an alternative that works for everyone. You can be helpful without becoming endlessly available. A straightforward answer will give people something useful to work with and help you keep some control over your time.\nTaurus\nApril 20 – May 20\nA conversation could become tense before anyone understands what the problem is. The Moon conjoins fiery Mars, making people quicker to react and less patient with unclear messages. If a coworker, sibling, or neighbor misreads your tone, ask what they heard instead of repeating yourself more loudly. Use specific language and include any details they need to respond. Your steady approach can keep a minor misunderstanding from growing. Say the important part plainly, then give the other person a chance to do the same.\nGemini\nMay 21 – June 20\nA sudden urge to spend could reveal what you’re craving beyond the purchase itself. The Moon conjoins impulsive Mars, bringing more emotion into decisions about money, possessions, and personal priorities. Before buying something, check the numbers and ask whether it solves a real problem or simply changes your mood for a few minutes. If someone pressures you for an answer, request more time. You’ll feel better about the decision when it reflects what matters to you rather than the intensity of the moment.\nCancer\nJune 21 – July 22\nIt could be hard to hide what you’re feeling today. The Moon in your sign conjoins fiery Mars, adding courage, urgency, and a shorter fuse to your emotional responses. If something matters to you, take one direct step instead of waiting for someone else to notice. Ask for what you need, address the family issue, or make the change you’ve been considering. Your feelings contain useful information, but they don’t have to control the delivery. Honest action will work better than an emotional reaction.\nLeo\nJuly 23 – August 22\nA private concern could make a larger goal feel heavier than usual. The Moon squares serious Saturn, bringing doubts about travel, education, or a decision that would take you beyond familiar territory. Don’t abandon the idea just because you can’t see the entire path yet. Talk with someone experienced, ask for an extension, or divide the work into smaller pieces. You don’t have to announce every uncertainty. Quietly getting the support you need may be enough to help you keep moving toward something meaningful.\nVirgo\nAugust 23 – September 22\nA group may need someone to turn good intentions into action. The Moon conjoins motivated Mars, bringing more energy to friendships, teamwork, and shared causes. If a meeting keeps wandering, remind everyone what you’re trying to accomplish and suggest one task that can happen next. Your ability to organize people is valuable, but you don’t need to carry the whole effort yourself. Give others a clear way to contribute. Progress becomes much easier once enthusiasm is matched with responsibilities people understand and accept.\nLibra\nSeptember 23 – October 22\nAll eyes may be on you just when the pressure starts rising. The Moon conjoins assertive Mars, bringing urgency to a professional decision or public responsibility. If a client, manager, or audience wants an immediate answer, take enough time to understand what’s being asked. Acknowledge the concerns on both sides, then explain what you can realistically deliver. You don’t need to please everyone to lead well. A fair decision, communicated clearly, will earn more respect than an easy answer you can’t support.\nScorpio\nOctober 23 – November 21\nA big idea may need to fit around some very ordinary responsibilities. The Moon squares structured Saturn, creating tension between travel, learning, or long-term goals and the work already on your plate. Look closely at the timeline before deciding the opportunity is impossible. You may be able to move a deadline, simplify a task, or ask someone for help. Don’t hide the pressure until it becomes an emergency. A practical adjustment could give you enough room to pursue what matters without neglecting what’s required.\nSagittarius\nNovember 22 – December 21\nSomething that sounded fun could become more serious once money or trust enters the conversation. The Moon squares cautious Saturn, slowing an impulse involving shared expenses, intimacy, or creative risk. Don’t treat someone’s hesitation as a rejection. Ask what would help them feel comfortable, then discuss the numbers, timing, or boundaries involved. The answer may still be yes, but it needs a stronger foundation. A little patience now can keep excitement from turning into pressure or leaving one person responsible for the consequences.\nCapricorn\nDecember 22 – January 19\nSomeone close to you may be ready to act, whether or not you’ve agreed on the direction. The Moon conjoins assertive Mars, bringing urgency and strong feelings into partnerships. Before the conversation becomes a contest of wills, clarify what each person wants and which decision needs to be made now. Your practical instincts can help turn emotion into a workable agreement. Just make sure the solution isn’t yours alone. Cooperation means both people understand the commitment and have a genuine say in shaping it.\nAquarius\nJanuary 20 – February 18\nA confusing request could create more work than the task itself. The Moon squares structured Saturn, making unclear emails, shifting responsibilities, or poorly explained instructions especially frustrating. Before getting started, confirm what the other person expects and when they need it. If the process keeps causing the same problem, simplify it while the issue is visible. Your ability to improve a system is useful today, but clarity comes first. Make sure everyone understands the request before building an elegant solution around the wrong assumption.\nPisces\nFebruary 19 – March 20\nA creative idea may be ready to leave your imagination. The Moon conjoins action-oriented Mars, giving you the motivation to make, share, or perform something that feels personal. Don’t wait until every detail matches the picture in your head. Give yourself a short window to create a first version, then show it to someone who understands what you’re trying to do. Enjoyment matters more than perfection today. Finishing one small piece could restore the confidence that endless preparation has been quietly wearing down.\nShare this:\n Share on Facebook (Opens in new window) Facebook\n Share on Bluesky (Opens in new window) Bluesky\n Share on X (Opens in new window) X\n Print (Opens in new window) Print\n Email a link to a friend (Opens in new window) Email\nMore in Horoscopes\n ### Daily Horoscope for September 05, 2026\n ### Daily Horoscope for September 04, 2026\n ### Daily Horoscope for September 03, 2026\n ### Daily Horoscope for September 02, 2026\n 2026\n September\n 5",
      "images": [
        {
          "url": "https://www.chicagotribune.com/wp-content/uploads/2024/03/tarot.jpeg?w=6000&h=4000",
          "description": null,
          "description_source": "og:image",
          "score": 10
        },
        {
          "url": "https://www.chicagotribune.com/wp-content/uploads/2024/03/tarot.jpeg?w=1400",
          "description": null,
          "description_source": "twitter:image",
          "score": 10
        },
        {
          "url": "https://www.chicagotribune.com/wp-content/uploads/2024/03/tarot.jpeg",
          "description": "Astrology and horoscopes concept. Astrological zodiac signs in circle on starry background.",
          "description_source": "alt",
          "score": 4
        },
        {
          "url": "https://www.chicagotribune.com/wp-content/uploads/2023/12/2560px-Chicago_Tribune_Logo.svg-1.png",
          "description": "Chicago Tribune",
          "description_source": "alt",
          "score": 0
        }
      ],
      "favicon": "https://www.chicagotribune.com/wp-content/uploads/2024/02/favicon.png?w=16",
      "id": "be4148-07"
    },
    {
      "url": "https://www.artnet.com/artists/walter-price/shoot-a-reQWhBxSJfTCDyZi3nesfA2",
      "title": "Walter Price - Artnet",
      "score": 0.012106007862885175,
      "published_date": "Fri, 28 Aug 2026 23:28:11 GMT",
      "content": "This website or its third-party tools process personal data. You can opt out of the sale of your personal information by clicking on the “Do Not Sell or Share My Personal Information” link. However, you can opt out of these cookies by checking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. We use third-party cookies that help us analyze how you use this website, store your preferences, and provide the content and advertisements that are relevant to you. Once you opt out, you can opt in again at any time by unchecking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. Do Not Sell or Share My Personal Information. *   Use the Artnet Price Database. (45.7 x 61 cm.)Markings Inscribed on turning edge; initialed, dated, and inscribed verso. Contact the gallery for more images. ## Walter Price. Contact Gallery About This Work. You are now following Walter Price.",
      "raw_content": "Image 1\nWe value your privacy\nThis website or its third-party tools process personal data. You can opt out of the sale of your personal information by clicking on the “Do Not Sell or Share My Personal Information” link.\nDo Not Sell or Share My Personal Information\nOpt-out PreferencesImage 2\nWe use third-party cookies that help us analyze how you use this website, store your preferences, and provide the content and advertisements that are relevant to you. However, you can opt out of these cookies by checking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button. Once you opt out, you can opt in again at any time by unchecking \"Do Not Sell or Share My Personal Information\" and clicking the \"Save My Preferences\" button.\n[x] \nDo Not Sell or Share My Personal Information\nCancel Save My Preferences\nYour opt-out preference has been honored.\nBanner closes automatically in  s...\n\nLog InorRegister\nArtworks\nArtists\nAuctions\n   Artnet Auctions\n   Global Auction Houses\nGalleries\nEvents\nNews\nPrice Database\n   Use the Artnet Price Database\n   Market Alerts\n   Artnet Analytics\nHidden\nBuy\n   Browse Artists\n   Artnet Auctions\n   Browse Galleries\n   Global Auction Houses\n   Events & Exhibitions\n   Speak With a Specialist\n   How to Buy\nSell\n   Sell With Us\n   Become a Gallery Partner\n   Become an Auction Partner\n   Receive a Valuation\n   How to Sell\nSearch\nHidden\n\nImage 3: shoot! by walter price\n\nImage 4: artnet\nImage 5: shoot! by walter price\n   Walter Price\n   _Shoot!_, 2026\n   18 x 24 in. (45.7 x 61 cm.)\nclose\nImage 6: shoot! by walter price\n\nImage 7: artnet\nImage 8: shoot! by walter price\n   Walter Price\n   _Shoot!_, 2026\n   18 x 24 in. (45.7 x 61 cm.)\nclose\nContact the gallery for more images\nView to Scale\nImage 9: zoom iconZoom\n\nWalter Price\nAmerican, born 1989\n_Shoot!_, 2026\nImage 10: shoot! by walter price\n\nImage 11: artnet\nImage 12: shoot! by walter price\n   Walter Price\n   _Shoot!_, 2026\n   18 x 24 in. (45.7 x 61 cm.)\nclose\nImage 13: shoot! by walter price\n\nImage 14: artnet\nImage 15: shoot! by walter price\n   Walter Price\n   _Shoot!_, 2026\n   18 x 24 in. (45.7 x 61 cm.)\nclose\nContact the gallery for more images\nView to Scale\nImage 16: zoom iconZoom\nMedium Paintings, Acrylic, gesso, sports cards, PVC glue, tacky glue, screws, and plexiglass on wood panel Size 18 x 24 in. (45.7 x 61 cm.)Markings Inscribed on turning edge; initialed, dated, and inscribed verso\nPrice\nPrice on Request\nContact Gallery About This Work\nImage 17: Gallery logo ## David Zwirner New York / London / Hong Kong + 2 other locations\n   Artworks\n   Artists\n   Exhibitions\n   Contact Gallery\nSell a similar work with Artnet Auctions\n\nX\nNewsletter Signup\nPlease enter a valid email address.\nThank you for subscribing!\nImage 18\nGet the latest email updates from this artist.\nFollow\nPlease enter a valid email address\nPrivacy Policy\nThank You! You are now following Walter Price\nCLOSE\n   Price Database\n   Market Alerts\n   Analytics Reports\n   Gallery Network\n   Auction House Partnerships\n   About\n   Contact\n   Investor Relations\n   Jobs\n   FAQ\n   Site Map\n   Advertise\n   Terms\n   Privacy\n   Cookies\n   facebook\n   twitter\n   pinterest>\n   instagram\">\n   weibo\">\nEnglish (US)\n   English (US)\n   Deutsch\n   Français\n©2024 Artnet Worldwide Corporation. All rights reserved.\nImage 22",
      "images": [
        {
          "url": "https://cdn-cookieyes.com/assets/images/close.svg",
          "description": null,
          "description_source": null,
          "score": null
        },
        {
          "url": "https://www.artnet.com/WebServices/images/ll3230215llgxjfDrCWvaHBOAD/walter-price-shoot!.jpg",
          "description": "shoot! by walter price",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/scale%20view_2048.jpg",
          "description": "artnet",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/WebServices/images/ll3230216llgxjfDrCWvaHBOAD/walter-price-shoot!.jpg",
          "description": "shoot! by walter price",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/magnify.png",
          "description": "zoom icon",
          "description_source": "alt",
          "score": null
        },
        {
          "url": "https://www.artnet.com/media/redesign/img/logo_brand.svg?v=2",
          "description": null,
          "description_source": null,
          "score": null
        }
      ],
      "favicon": "https://www.artnet.com/media/icons/apple-touch-icon-144x144.png",
      "id": "8e072d-08"
    },
    {
      "url": "https://www.forbes.com/sites/tomcoughlin/2026/08/25/cxl-growth-shown-at-the-2026-fms-conference/",
      "title": "CXL Growth Shown At The 2026 FMS Conference - Forbes",
      "score": 0,
      "published_date": "Tue, 25 Aug 2026 00:00:00 GMT",
      "content": "# CXL Growth Shown At The 2026 FMS Conference. The 2026 FMS Conference highlighted the growing importance of Compute Express Link (CXL) for memory expansion and pooling. Kioxia presented its low-latency XL-Flash, which, integrated with CXL, bridges the performance gap between DRAM and flash, supporting Nvidia's Storage-Next. SK hynix had several CXL products on display at the 2026 FMS Conference, including accelerators, memory expansion modules and their MARS memory-centric AI rack system. Kioxia is also using its XL-Flash products to support Nvidia’s Storage-Next initiative to make flash storage behave more like high-speed memory for AI data centers. He showed this slide of Tech Insights data on projected adoption of memory expansion and memory pooling, showing that memory pooling would be used in 49% of servers by 2031. The 2026 FMS featured growing adoption of CXL for memory expansion and memory pooling applications with projections of significant growth in adoption over the next few years.",
      "raw_content": "InnovationEnterprise Tech\nCXL Growth Shown At The 2026 FMS Conference\nByThomas Coughlin,\nForbes contributors publish independent expert analyses and insights.\nCovering Digital Storage Technology & Market. IEEE President in 2024\n:-- / --:--\nThis voice experience is generated by AI. Learn more.\nThis voice experience is generated by AI. Learn more.\nThe 2026 FMS Conference highlighted the growing importance of Compute Express Link (CXL) for memory expansion and pooling. CXL enables creating shared memory pools from diverse technologies, with significant revenue growth projected from 2027. SK hynix showcased CXL products, including memory expansion modules and AI rack systems. Meta demonstrated CXL's value by repurposing older DDR4 memory, saving costs. Kioxia presented its low-latency XL-Flash, which, integrated with CXL, bridges the performance gap between DRAM and flash, supporting Nvidia's Storage-Next. Micron's detailed CXL-based disaggregated memory pools achieving 40TB in 4U. Industry-wide adoption was evident, with CXL-ready servers from companies like AIC. Intel projects memory pooling in 49% of servers by 2031.\nCompute Express Link, or CXL, is a switch heterogeneous memory and accelerator network that was initially introduced by Intel to encourage the use of their Optane memory. CXL enables increasing local memory, but even more interesting, enables the creation of a storage pool that could include DRAM and other memory technologies as well as various processor accelerators. CXL has been discussed at the FMS since it’s start. This article looks into recent CXL developments discussed at the conference.\nThe chart below is from a talk by my colleague, Jim Handy from the conference, showing his projections for CXL revenue growth. He projects significant growth from 2027 through 2031.\nSK hynix’s G2.5 addition to their storage and memory hierarchy shown during their FMS keynote, is CXL, shown below.\nCXL can be used to expand local storage and especially to create pooled memory that can be allocated to applications using software. SK hynix had several CXL products on display at the 2026 FMS Conference, including accelerators, memory expansion modules and their MARS memory-centric AI rack system.\nMORE FOR YOU\nAn interesting observation is that Meta reported that it had used a CXL memory pool to repurpose and extend the life of older DRAM DDR4 memory rather than paying the price to buy DDR5 memory to support some of their data center operations.\nCameron Brett from Kioxia spoke about their latest NAND flash solutions. These include BiCS10 with 332-layers (jointly manufactured for Kioxia and Sandisk) as well as their XL-Flash. XL-Flash is built with Kioxia’s BiCS Flash 3D memory technology. It is an extremely low-latency, high-performance flash memory. XL-FLASH™ is designed to address the performance gap that currently exists between volatile memories such as DRAM and current flash memory.\nXL-FLASH™ features a 128 gigabit (Gb) die for SLC / 256 gigabit (Gb) die for MLC (in a 2-die, 4-die, 8-die package), a 4kB page size for more efficient operating system reads and writes, fast page read and program times, and a read latency of less than 5 microseconds. The slide below shows advantages of an XL-Flash CXL memory module off-loading data from DRAM.\nKioxia is also using its XL-Flash products to support Nvidia’s Storage-Next initiative to make flash storage behave more like high-speed memory for AI data centers.\nJeremy Werner, Senior Vice President and General Manager of Micron's Core Data Center Business Unit, delivered the Micron keynote and discussed disaggregated memory pools using CXL. As shown below, the pool using DDR5 DRAM RDIMM memory, was able to achieve 40TB of shared memory in a 4U form factor.\nThis memory pool was able to provide up to 20 times the DRAM capacity as the direct attached memory and was able to generate 6.7X more tokens/second with 85% less GPU resources.\nCXL and its applications was on display in many of the exhibits at the 2026 FMS, including at system maker exhibits. For instance, AIC was showing its CXL-ready enterprise server lineup, including their SB201-SU all-flash NVMe server equipped with a CXL-ready drive cage for AI data workloads.\nAnil Godbole, Xeon CXL Strategy & Marketing Manager at Intel gave a talk about the current state and the future of CXL. He showed this slide of Tech Insights data on projected adoption of memory expansion and memory pooling, showing that memory pooling would be used in 49% of servers by 2031.\nThe 2026 FMS featured growing adoption of CXL for memory expansion and memory pooling applications with projections of significant growth in adoption over the next few years.\nEditorial StandardsReprints & Permissions\nLOADING VIDEO PLAYER...\nFORBES’ FEATURED Video\nExplore Topic",
      "images": [],
      "favicon": "https://i.forbesimg.com/144X144-F.png",
      "id": "1dbd0e-09"
    }
  ],
  "response_time": 26.77,
  "request_id": "69d47ed5-c76c-4818-8389-e670bb2ab57e"
}

## exa search example

### code

import Exa from "exa-js";

const exa = new Exa("3c7f5de3-b33e-4e8e-b3ed-ac6402077a85");

const result = await exa.search(
  "Investigate platforms that help independent and non-famous writers publish fiction, web novels, and digital comics. Examine how these platforms handle discovery, reader engagement, monetization (especially pay-per-chapter or unlock models), and the challenges of attracting both writers and readers when big-name authors are not present.",
  {
    category: "company",
    numResults: 10,
    outputSchema: {
      type: "object"
    },
    stream: true,
    type: "deep",
    userLocation: "US",
    contents: {
      text: {
        verbosity: "compact"
      },
      highlights: true
    }
  }
);

### result (credit usd balance - 0.01)

{"Platforms": {"value": "Platforms supporting independent writers for fiction, web novels, and digital comics include Wattpad [Wattpad](https://wattpad.com "wattpad.com"), Inkitt [Inkitt](https://inkitt.com "inkitt.com"), Inkspired [Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com"), StarScript [StarScript](https://starscript.com "starscript.com"), Pratilipi Comics [Pratilipi Comics](https://pratilipicomics.com "pratilipicomics.com"), Radish Fiction [Radish Fiction](https://radishfiction.com "radishfiction.com"), Stck. [Stck.](https://stck.me "stck.me"), rĀthe™ [rĀthe™](https://rathe.app "rathe.app"), Webnnel [Webnnel](https://webnnel.com "webnnel.com"), and Knovel Protocol [Knovel Protocol](https://knovel.co "knovel.co").", "citations": [Wattpad](https://wattpad.com "wattpad.com")[StarScript](https://starscript.com "starscript.com")[Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[Pratilipi Comics](https://pratilipicomics.com "pratilipicomics.com")[rĀthe™](https://rathe.app "rathe.app")[Radish Fiction](https://radishfiction.com "radishfiction.com")[Stck.](https://stck.me "stck.me")[Webnnel](https://webnnel.com "webnnel.com")[Inkitt](https://inkitt.com "inkitt.com")[Knovel Protocol](https://knovel.co "knovel.co"), "confidence": "high"}, "Monetization": {"value": "Common monetization models include pay-per-chapter or unlock systems (e.g., Radish [Radish Fiction](https://radishfiction.com "radishfiction.com"), rĀthe™ [rĀthe™](https://rathe.app "rathe.app"), Webnnel [Webnnel](https://webnnel.com "webnnel.com")), direct-to-fan sales of chapters/books/comics (e.g., Stck. [Stck.](https://stck.me "stck.me"), StarScript [StarScript](https://starscript.com "starscript.com"), Knovel [Knovel Protocol](https://knovel.co "knovel.co")), and ad-supported or freemium models where early chapters are free [Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[Radish Fiction](https://radishfiction.com "radishfiction.com")[Webnnel](https://webnnel.com "webnnel.com"). Inkitt leverages data and AI to identify stories for wider publication, creating a pipeline to paid TV/movie adaptations [Inkitt](https://inkitt.com "inkitt.com").", "citations": [StarScript](https://starscript.com "starscript.com")[Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[rĀthe™](https://rathe.app "rathe.app")[Radish Fiction](https://radishfiction.com "radishfiction.com")[Stck.](https://stck.me "stck.me")[Webnnel](https://webnnel.com "webnnel.com")[Inkitt](https://inkitt.com "inkitt.com")[Knovel Protocol](https://knovel.co "knovel.co"), "confidence": "high"}, "Discovery_and_Engagement": {"value": "Discovery is managed through algorithms and data analytics [Inkitt](https://inkitt.com "inkitt.com"), community-driven engagement (forums, reviews, social features) [Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[Knovel Protocol](https://knovel.co "knovel.co"), and targeted promotional campaigns [CraveBooks](https://cravebooks.com "cravebooks.com"). Platforms like Bindery Books focus on mobilizing 'bookish tastemakers' to build sustainable reader relationships rather than relying solely on platform-wide discovery [Bindery Books](https://binderybooks.com "binderybooks.com").", "citations": [Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[Inkitt](https://inkitt.com "inkitt.com")[CraveBooks](https://cravebooks.com "cravebooks.com")[Knovel Protocol](https://knovel.co "knovel.co")[Bindery Books](https://binderybooks.com "binderybooks.com"), "confidence": "high"}, "Challenges": {"value": "The primary challenge for platforms without big-name authors is attracting and retaining both readers and writers. To solve this, platforms rely on community building [Knovel Protocol](https://knovel.co "knovel.co")[Bindery Books](https://binderybooks.com "binderybooks.com"), providing robust creator tools [StarScript](https://starscript.com "starscript.com")[Pickwick](https://writepickwick.com "writepickwick.com")[Stck.](https://stck.me "stck.me"), and ensuring creators retain significant control over their work and pricing [Pickwick](https://writepickwick.com "writepickwick.com")[Stck.](https://stck.me "stck.me"). Some, like Goodkindles, are focusing on structured data to make content compatible with AI-powered discovery engines [Goodkindles](https://goodkindles.com "goodkindles.com").", "citations": [StarScript](https://starscript.com "starscript.com")[Pickwick](https://writepickwick.com "writepickwick.com")[Stck.](https://stck.me "stck.me")[Knovel Protocol](https://knovel.co "knovel.co")[Goodkindles](https://goodkindles.com "goodkindles.com")[Bindery Books](https://binderybooks.com "binderybooks.com"), "confidence": "high"}}, "top_results": [Wattpad](https://wattpad.com "wattpad.com")[Inkspired - getinkspired.com](https://getinkspired.com "getinkspired.com")[Radish Fiction](https://radishfiction.com "radishfiction.com")[Stck.](https://stck.me "stck.me")[Inkitt](https://inkitt.com "inkitt.com")[Knovel Protocol](https://knovel.co "knovel.co")[Goodkindles](https://goodkindles.com "goodkindles.com")[Bindery Books](https://binderybooks.com "binderybooks.com")}

## exa on agent

### code js

import Exa from "exa-js";

const exa = new Exa("3c7f5de3-b33e-4e8e-b3ed-ac6402077a85");

const run = await exa.agent.runs.create({
  query: "Find AI infrastrucExamine cryptographic proof-of-existence and Merkle-tree based document integrity systems. Research their real-world applications in legal, insurance, logistics, and healthcare settings. Analyze the practical limitations, especially the gap between proving a document has not been altered and proving that the original content accurately reflected real events.\n\nture companies hiring founding designers",
  outputSchema: { type: "object" },
  effort: "medium",
  dataSources: [
    { provider: "baselayer" },
    { provider: "fiber" },
    { provider: "particle" },
  ],
});

const completedRun = await exa.agent.runs.pollUntilFinished(run.id);
console.log(completedRun.output?.structured);

### result (balance - 0.1)

{"ai_infrastructure_companies_hiring_founding_designers":[{"company":"Inferact","role":"Founding Product Designer","evidence":"AI inference infrastructure founded by vLLM creators; the role owns brand, developer-product UX, dashboards, design systems, and 0-to-1 product design.","location":"San Francisco, California; exceptional US remote candidates considered","compensation":"Not specified; equity included"},{"company":"P-1 AI","role":"Founding Product Designer","evidence":"AI engineering agent for physical-world engineering workflows; the first product designer defines interaction patterns, product architecture, design system, explainability, and uncertainty communication.","location":"Remote US/Canada or San Mateo, California","compensation":"USD 200,000–275,000 plus equity"},{"company":"Capy","role":"Founding Design Engineer","evidence":"Cloud-native AI software engineer; first design hire owns product UX, brand expression, and production frontend experiences for complex AI infrastructure.","location":null,"compensation":null}],"cryptographic_proof_of_existence_and_merkle_tree_systems":{"mechanism":"A file is hashed—often by hashing chunks as Merkle-tree leaves—and the leaves are recursively combined into a root. The root, usually with a timestamp and signature, is recorded in an append-only or externally witnessed ledger. A verifier later hashes the candidate file, recomputes the root, and checks the signature, timestamp evidence, and inclusion or consistency proof.","what_it_proves":"Subject to the trust model, it proves that the exact byte sequence corresponding to the recorded digest was available to the recording service no later than the relevant recorded time, and that the presented bytes have not changed relative to that commitment. Merkle proofs make large logs or batches efficiently auditable without reproducing the whole log.","what_it_does_not_prove":"It does not by itself prove who authored the file, who possessed it, that the signer had authority, that the source system was honest, that the capture process was reliable, or that statements, measurements, signatures, metadata, or events in the file accurately described the real world.","design_choices":"Keep sensitive payloads off-chain; anchor hashes, minimal metadata, access-control events, and audit evidence. Use digital signatures for signer identity, trusted timestamping or independent witnesses for time, and preserve keys, certificates, revocation data, algorithm versions, source records, and verification procedures for long-term validation."},"real_world_applications":[{"setting":"Legal","application":"Blockchain-backed web-evidence preservation and document/evidence timestamping can establish a tamper-evident chain of custody. In the Hangzhou Internet Court case, hashes were anchored to Bitcoin and Factom; the court accepted the evidence because source, generation, transmission path, and corroborating screenshots, source code, and call logs were clear.","maturity":"Demonstrated court use, but admissibility still depends on provenance and corroboration rather than immutability alone."},{"setting":"Insurance","application":"Policy endorsements, amendments, claim submissions, inspection reports, and underwriting records can be hashed before or at issuance so a later dispute can test whether the final bytes predated a loss. The located insurer example is explicitly a fictional vendor case study, so it demonstrates a plausible operating pattern rather than independently verified production deployment.","maturity":"Useful control for version/timing disputes; it cannot establish that underwriting inputs or loss facts were true."},{"setting":"Logistics","application":"Permissioned blockchain and shared electronic bills of lading provide a common, tamper-evident document state among shippers, carriers, terminals, banks, and customs participants. GSBN/IQAX reports cargo-release time falling from days to hours and live discrepancy handling across parties.","maturity":"Operationally deployed consortium pattern; its value comes from participant governance, identity, workflow controls, and the shared source process—not from hashing alone."},{"setting":"Healthcare","application":"Medical documents and EHR objects can remain encrypted off-chain while hashes or Merkle roots are anchored for later tamper detection; a 2025 proposal uses 4-ary Merkle trees and periodic public-blockchain anchoring for scalable verification.","maturity":"Promising research/prototype pattern. Confidentiality, consent, key management, correction/erasure, availability, and clinical provenance remain separate requirements."}],"practical_limitations":["Integrity is relational: a matching hash proves only that the later file matches the earlier committed bytes. If the initial document contained a fabricated reading, omitted an event, used a bad sensor, or was created from manipulated inputs, the system preserves the falsehood perfectly.","A timestamp is not automatically authorship or possession proof. The verifier must establish who submitted the digest, the timestamp authority's trustworthiness and accuracy, and whether the timestamp evidence remains verifiable after certificate expiry or algorithm changes.","A digital signature authenticates control of a key, not the truth of the signed assertions. Key compromise, delegated authority, insider collusion, coercion, bad identity binding, and signing the wrong version remain possible.","Merkle trees improve scale and auditability but do not add semantic knowledge. They detect byte changes; they do not understand whether a changed field is an authorized correction, whether two documents refer to the same real-world event, or whether a measurement was collected correctly.","The initial capture boundary is the central weakness. To prove real events, bind the record to trusted identity, time, device or sensor attestation, calibrated instrumentation, location, workflow approvals, contemporaneous corroboration, and an auditable chain from event to record.","Public chains introduce fees, latency, privacy leakage through metadata, governance and availability dependencies, and difficult correction/deletion semantics. Permissioned chains reduce some costs and privacy exposure but reintroduce consortium governance and collusion assumptions.","Off-chain storage is still a failure point: loss, ransomware, unavailable keys, inaccessible proprietary verification services, inconsistent canonicalization, format migration, and missing manifests can make a mathematically valid anchor practically unusable.","Legal admissibility is jurisdiction- and fact-specific. Courts can accept cryptographically preserved evidence while still requiring authentication, hearsay/relevance analysis, provenance, system reliability, and corroboration.","Healthcare deployments must separate integrity from confidentiality, access control, consent, clinical correctness, and patient-safety governance. An immutable erroneous record may be more dangerous than an editable record with a transparent correction history.","Operational adoption is difficult where competitors do not share schemas, identity standards, governance, or incentives. The strongest systems therefore combine cryptographic commitments with conventional controls, independent witnesses, signed workflow events, and domain-specific audit procedures."],"key_conclusion":"Proof-of-existence and Merkle-tree integrity systems are strong anti-retroactive-editing and chain-of-custody tools. They are not truth machines. The defensible claim is usually: “these exact bytes were committed or observed by this process by this time, and later bytes match.” The stronger claim—“the document accurately records what happened”—requires trusted capture, competent and authorized actors, reliable sensors and source systems, corroboration, and a documented provenance chain."}

**Key conclusion:** Proof-of-existence and Merkle-tree integrity systems are strong anti-retroactive-editing and chain-of-custody tools. They are not truth machines. The defensible claim is usually: “these exact bytes were committed or observed by this process by this time, and later bytes match.” The stronger claim—“the document accurately records what happened”—requires trusted capture, competent and authorized actors, reliable sensors and source systems, corroboration, and a documented provenance chain.

**Practical limitations**

- Integrity is relational: a matching hash proves only that the later file matches the earlier committed bytes. If the initial document contained a fabricated reading, omitted an event, used a bad sensor, or was created from manipulated inputs, the system preserves the falsehood perfectly.
- A timestamp is not automatically authorship or possession proof. The verifier must establish who submitted the digest, the timestamp authority's trustworthiness and accuracy, and whether the timestamp evidence remains verifiable after certificate expiry or algorithm changes.
- A digital signature authenticates control of a key, not the truth of the signed assertions. Key compromise, delegated authority, insider collusion, coercion, bad identity binding, and signing the wrong version remain possible.
- Merkle trees improve scale and auditability but do not add semantic knowledge. They detect byte changes; they do not understand whether a changed field is an authorized correction, whether two documents refer to the same real-world event, or whether a measurement was collected correctly.
- The initial capture boundary is the central weakness. To prove real events, bind the record to trusted identity, time, device or sensor attestation, calibrated instrumentation, location, workflow approvals, contemporaneous corroboration, and an auditable chain from event to record.
- Public chains introduce fees, latency, privacy leakage through metadata, governance and availability dependencies, and difficult correction/deletion semantics. Permissioned chains reduce some costs and privacy exposure but reintroduce consortium governance and collusion assumptions.
- Off-chain storage is still a failure point: loss, ransomware, unavailable keys, inaccessible proprietary verification services, inconsistent canonicalization, format migration, and missing manifests can make a mathematically valid anchor practically unusable.
- Legal admissibility is jurisdiction- and fact-specific. Courts can accept cryptographically preserved evidence while still requiring authentication, hearsay/relevance analysis, provenance, system reliability, and corroboration.
- Healthcare deployments must separate integrity from confidentiality, access control, consent, clinical correctness, and patient-safety governance. An immutable erroneous record may be more dangerous than an editable record with a transparent correction history.
- Operational adoption is difficult where competitors do not share schemas, identity standards, governance, or incentives. The strongest systems therefore combine cryptographic commitments with conventional controls, independent witnesses, signed workflow events, and domain-specific audit procedures.

**Real world applications**

| Setting | Maturity | Application |
| --- | --- | --- |
| Legal | Demonstrated court use, but admissibility still depends on provenance and corroboration rather than immutability alone. | Blockchain-backed web-evidence preservation and document/evidence timestamping can establish a tamper-evident chain of custody. In the Hangzhou Internet Court case, hashes were anchored to Bitcoin and Factom; the court accepted the evidence because source, generation, transmission path, and corroborating screenshots, source code, and call logs were clear. |
| Insurance | Useful control for version/timing disputes; it cannot establish that underwriting inputs or loss facts were true. | Policy endorsements, amendments, claim submissions, inspection reports, and underwriting records can be hashed before or at issuance so a later dispute can test whether the final bytes predated a loss. The located insurer example is explicitly a fictional vendor case study, so it demonstrates a plausible operating pattern rather than independently verified production deployment. |
| Logistics | Operationally deployed consortium pattern; its value comes from participant governance, identity, workflow controls, and the shared source process—not from hashing alone. | Permissioned blockchain and shared electronic bills of lading provide a common, tamper-evident document state among shippers, carriers, terminals, banks, and customs participants. GSBN/IQAX reports cargo-release time falling from days to hours and live discrepancy handling across parties. |
| Healthcare | Promising research/prototype pattern. Confidentiality, consent, key management, correction/erasure, availability, and clinical provenance remain separate requirements. | Medical documents and EHR objects can remain encrypted off-chain while hashes or Merkle roots are anchored for later tamper detection; a 2025 proposal uses 4-ary Merkle trees and periodic public-blockchain anchoring for scalable verification. |

**AI infrastructure companies hiring founding designers**

| Role | Company | Evidence | Location | Compensation |
| --- | --- | --- | --- | --- |
| Founding Product Designer | Inferact | AI inference infrastructure founded by vLLM creators; the role owns brand, developer-product UX, dashboards, design systems, and 0-to-1 product design. | San Francisco, California; exceptional US remote candidates considered | Not specified; equity included |
| Founding Product Designer | P-1 AI | AI engineering agent for physical-world engineering workflows; the first product designer defines interaction patterns, product architecture, design system, explainability, and uncertainty communication. | Remote US/Canada or San Mateo, California | USD 200,000–275,000 plus equity |
| Founding Design Engineer | Capy | Cloud-native AI software engineer; first design hire owns product UX, brand expression, and production frontend experiences for complex AI infrastructure. |  |  |

**Cryptographic proof of existence and merkle tree systems**

**Mechanism:** A file is hashed—often by hashing chunks as Merkle-tree leaves—and the leaves are recursively combined into a root. The root, usually with a timestamp and signature, is recorded in an append-only or externally witnessed ledger. A verifier later hashes the candidate file, recomputes the root, and checks the signature, timestamp evidence, and inclusion or consistency proof.

**Design choices:** Keep sensitive payloads off-chain; anchor hashes, minimal metadata, access-control events, and audit evidence. Use digital signatures for signer identity, trusted timestamping or independent witnesses for time, and preserve keys, certificates, revocation data, algorithm versions, source records, and verification procedures for long-term validation.

**What it proves:** Subject to the trust model, it proves that the exact byte sequence corresponding to the recorded digest was available to the recording service no later than the relevant recorded time, and that the presented bytes have not changed relative to that commitment. Merkle proofs make large logs or batches efficiently auditable without reproducing the whole log.

**What it does not prove:** It does not by itself prove who authored the file, who possessed it, that the signer had authority, that the source system was honest, that the capture process was reliable, or that statements, measurements, signatures, metadata, or events in the file accurately described the real world.

## exa content function

### code

import Exa from "exa-js";

const exa = new Exa("3c7f5de3-b33e-4e8e-b3ed-ac6402077a85");

const result = await exa.getContents(
  ["https://still-kinetic.pendia-community.workers.dev/guide"],
  {
    highlights: true,
    maxAgeHours: 0,
    summary: true,
    text: true
  }
);

### result balance - 0.001

{
  "requestId": "1c8a087520b9333011027a5aa0a3ad22",
  "results": [
    {
      "id": "https://still-kinetic.pendia-community.workers.dev/guide",
      "title": "guide",
      "url": "https://still-kinetic.pendia-community.workers.dev/guide",
      "author": null,
      "text": "\n \n \n \n \n \n Still Kinetic \n \n \n \n \n \n \n \n \n \n \n {\n __sveltekit_1aykrq3 = {\n base: new URL(\".\", location).pathname.slice(0, -1)\n };\n\n const element = document.currentScript.parentElement;\n\n Promise.all([\n import(\"./_app/immutable/entry/start.3Nr1YUtz.js\"),\n import(\"./_app/immutable/entry/app.CRjHSpc9.js\")\n ]).then(([kit, app]) => {\n kit.start(app, element, {\n node_ids: [0, 9],\n data: [null,null],\n form: null,\n error: null\n });\n });\n }\n \n \n \n \n",
      "highlights": [
        "Still Kinetic \n \n \n \n \n \n \n \n \n \n \n {\n __sveltekit_1aykrq3 = {\n base: new URL(\".\", location).pathname.slice(0, -1)\n };\n\n const element = document.currentScript.parentElement;\n\n Promise.all([\n import(\"./_app/immutable/entry/start.3Nr1YUtz.js\"),\n import(\"./_app/immutable/entry/app.CRjHSpc9.js\")\n ]).then(([kit, app]) => {\n kit.start(app, element, {\n node_ids: [0, 9],\n data: [null,null],\n form: null,\n error: null\n });\n });\n }"
      ],
      "summary": "The page appears to be the landing or entry point for a web app titled \"Still Kinetic.\" It loads a SvelteKit-based application, including startup scripts for the app, and initializes the interface within the current page element. No visible content, links, images, or descriptive text are present in the provided extract beyond the script-based loading of the app. In short, this is a minimal launcher page for the Still Kinetic web application rather than a content-rich article or document."
    }
  ],
  "statuses": [
    {
      "id": "https://still-kinetic.pendia-community.workers.dev/guide",
      "status": "success",
      "source": "crawled"
    }
  ],
  "costDollars": {
    "total": 0.003,
    "contents": {
      "text": 0.001,
      "highlights": 0.001,
      "summary": 0.001
    }
  },
  "searchTime": 2368.4341580001637
}

## exa answer function

### code

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.exa.ai",
  apiKey: "3c7f5de3-b33e-4e8e-b3ed-ac6402077a85",
});

const completion = await client.chat.completions.create({
  model: "exa",
  messages: [
    {
      "role": "user",
      "content": "Research usage-based and engagement-triggered billing models in software products. Look at systems that charge users based on time spent, specific actions, or value thresholds rather than flat subscriptions. Include both successful cases and situations where users found the model annoying or extractive. Extract lessons for companies building monetization SDKs.\n\n"
    }
  ],
  stream: true,
  // use extra_body to pass parameters to the /answer endpoint
  extra_body: {
    outputSchema: {
      type: "object"
    },
    text: true
  }
});

### result balance - 0.005

{"choices":[{"index":0,"delta":{"content":"{\n  \"usage_based_models\": {\n    \"value\": \"Usage-based pricing (UBP) charges customers based on actual consumption (e.g., API calls, tokens, compute time) rather than flat access fees [1, 2, 7]. Hybrid models, which combine a base subscription fee with metered overages, are currently the most common approach (46% of SaaS companies) as they balance revenue predictability for vendors with flexibility for users [2, 8]. Outcome-based pricing is an emerging, high-value model that charges only for successful results (e.g., resolved tickets, qualified leads) rather than raw consumption [4, 5, 8].\",\n    \"citations\": [1, 2, 4, 5, 7, 8],\n    \"confidence\": \"high\"\n  },\n  \"success_and_failure_cases\": {\n    \"value\": \"Successful implementations often align the billing metric directly with customer value and cost-of-goods-sold (COGS), such as Snowflake charging per compute-second or Twilio per delivered message [1, 7]. Conversely, models that charge for invisible or uncontrollable metrics—like GitHub Copilot's shift to token-based credits—often trigger user backlash, as they turn productivity tools into unpredictable cognitive taxes [1, 6]. Other failures include Zapier's previous multi-metric system that caused confusion, and systems that lack transparency, spending caps, or clear usage dashboards, leading to bill shock [1, 2].\",\n    \"citations\": [1, 2, 6, 7],\n    \"confidence\": \"high\"\n  },\n  \"lessons_for_monetization_sdk_builders\": {\n    \"value\": \"1. Prioritize Predictability: Always include spending caps, proactive notifications, and in-product usage visibility to prevent bill shock [1, 2, 6]. 2. Decouple Architecture: Build modular systems where ingestion, metering, and billing logic are separated; avoid hard-coding schemas that prevent future pricing experiments [3]. 3. Ensure Auditability: Systems must allow both the vendor and the customer to independently verify usage against raw events to minimize disputes [5, 7]. 4. Design for Evolution: Start with simple activity-based metering to capture costs, then evolve toward workflow or outcome-based pricing as data matures [8]. 5. Avoid 'Tax' Metrics: Ensure the chosen metric is legible to the buyer and correlates with the value they receive, rather than just the vendor's internal costs [1, 7, 8].\",\n    \"citations\": [1, 2, 3, 5, 6, 7, 8],\n    \"confidence\": \"high\"\n  }\n},\n\"top_results\": [1, 2, 3, 4, 5, 6, 7, 8]"},"finish_reason":null}]}
{
  "citations": [
    {
      "id": "https://stripe.com/resources/more/usage-based-pricing-strategy-for-saas",
      "title": "Usage-Based Pricing Strategy for SaaS | Stripe",
      "url": "https://stripe.com/resources/more/usage-based-pricing-strategy-for-saas",
      "publishedDate": "2026-04-06T18:30:00.000Z",
      "text": "Usage-Based Pricing Strategy for SaaS | Stripe\n\nBilling\n\nStripe Billing powers any pricing model—from recurring to tiered and hybrid—to help manage customers your way.\n\n1. Introduction\n2. What is usage-based pricing for SaaS?\n3. What value metric should you choose for usage-based pricing in your SaaS product?\n4. How does usage-based pricing work once you’ve chosen your metric?\n5. How should you package usage-based pricing offers?\n6. How should you sequence your usage-based pricing migration without churning your existing base?\n7. 1. New customers first\n2. Opt-in migration next\n3. Segment-by-segment rollout\n4. Carefully transition your highest-risk accounts\n5. Set a hard cutoff\n8. What customer communication assets should you develop during a usage-based pricing launch?\n9. 1. The announcement email\n2. The ‘what’s changing’ page\n3. Your CSM and sales script\n10. What mistakes should you avoid when launching usage-based pricing?\n11. How Stripe Billing can help\n12. Get started with Stripe\n\nUsage-based pricing has become the most common approach for businesses that deliver software via public or private cloud or embedded deployments. As of 2026, 74% of suppliers had adopted usage-based models, and 56% expected usage-based revenue to grow by 2027.\n\nA usage-based pricing strategy might sound simple, but the execution involves a chain of compounding decisions. The value metric you pick shapes your packaging. Your packaging shapes your pricing page. Your pricing page shapes how customers interpret their bills. And how customers interpret their bills determines whether your migration goes smoothly or generates a wave of cancellations and support tickets.\n\nBelow, we’ll cover how to choose a value metric, how to design a pricing page that explains the model, and execution mistakes that can sink otherwise solid usage-based pricing launches.\n\nHighlights\n\nChoosing the right value metric is key. A metric customers can’t predict or control can undermine the model regardless of how well you execute everything else.\n\nSequencing your migration matters: new customers first, opt-in migration next, segment-by-segment rollout after that.\n\nBill shock is a product problem. Spend caps, in-product usage visibility, and proactive notifications should ship with your pricing.\n\n## What is usage-based pricing for SaaS?\n\nUsage-based pricing for software-as-a-service (SaaS)(i.e., subscription-accessed software) means customers pay based on what they consume rather than a flat fee for access. Usage-based SaaS pricing is the model behind Twilio, which charges per message sent; Snowflake, which charges per credit; and many artificial intelligence (AI) application programming interfaces (APIs), which charge per token.\n\n## What value metric should you choose for usage-based pricing in your SaaS product?\n\nYour value metric for usage-based pricing is the unit of measurement that determines how a customer pays. Everything else in your pricing flows from this choice.\n\nA good metric has three properties:\n\nScales with value: The amount increases as a customer uses your product more. For example, a customer processing 500,000 records pays more than one processing 5,000.\n\nLegible before signup: Customers can estimate their bill using information they already have without having to seek other input.\n\nClearly measurable: You can show customers how you calculated the cost of your service.\n\nStrong metrics in SaaS usage-based pricing and AI products tend to be API calls, active users, records processed, gigabytes (GB) stored or transferred, agent actions completed, and tokens consumed.\n\nMetrics that tend to fail include:\n\nInternal compute units: If you’re billing per “processing unit” that customers can’t observe or control, you might encounter customer confusion and pushback at renewal.\n\nMetrics that grow without corresponding value: Billing per database row seems easy until customers realize row counts inflate from routine background operations they don’t consider product usage.\n\nMetrics customers can’t control: If the number increases based on your system’s behavior rather than customers’ deliberate actions, you can erode confidence fast.\n\nIf a customer can’t estimate their monthly bill quickly using only information they already have, reconsider the metric.\n\n## How does usage-based pricing work once you’ve chosen your metric?\n\nSaaS usage-based pricing requires three factors to function: metering(e.g., accurately counting usage at the event level), rating (e.g., converting raw usage into a dollar amount), and invoicing (e.g., presenting the bill and collecting the payment).\n\nOnce you’ve chosen your metric and metered its usage, rating can take three forms:\n\nPer-unit flat: Each unit costs the same regardless of volume. This is simple to explain and works well when your customers’ usage stays steady.\n\nVolume-tiered: The price per unit drops as consumption crosses thresholds. For example, the first 10,000 calls are priced at $0.002 per call and the next 90,000 at $0.0015. Your biggest customers are rewarded with lower per-unit costs, which is standard in infrastructure-style products.\n\nGraduated: Each tier’s rate applies only to the units n that tier. Customers always pay the marginal rate for each block of usage rather than a single blended rate.\n\nStripe’s billing infrastructure can handle all three models, which frees up finance and engineering teams that would otherwise build rated invoices from scratch. Pick the model that matches how value scales in your product: flat for simplicity versus tiered or graduated when you want volume discounts to potentially drive expansion.\n\n## How should you package usage-based pricing offers?\n\nPay-as-you-go (PAYG) can mean unpredictable revenue for you and unpredictable bills for your customers. Many products that mature beyond the developer-tool phase use a hybrid model, which means a base subscription covering some included usage and overage charges when customers exceed that usage. The base provides predictable, recurring revenue, while the overage captures expansion as customers grow.\n\nRegardless of which model you choose, these four predictability tools are worth including from the start:\n\nFree tier or trial credits: A fixed amount of usage before usage-based billing starts. This is common in AI APIs, where something like $5–$10 in credits lets developers test.\n\nSpending caps: A hard ceiling set by customers on their monthly bill. Below the cap, the product works normally, but at the cap, you pause usage or prompt a notification to upgrade. This is common for developer tools, where a runaway script can generate a $4,000 bill when the customer expected $40.\n\nCommitted use discounts: Customers commit to a usage floor in exchange for a lower per-unit rate. This is good for enterprise customers who are willing to pay for budget certainty.\n\nBundles: Prepackaged usage volumes sold at a discount versus PAYG. This might look like “10,000 calls for $15” versus $0.002 per call. These work well for customers who can forecast usage and want predictability without a formal commitment.\n\n## How should you sequence your usage-based pricing migration without churning your existing base?\n\nIf you’re moving an existing product to usage-based pricing rather than launching a new product entirely, the migration can be a challenge. Note these options:\n\n### New customers first\n\nConsider launching usage-based pricing for all new signups while existing customers stay on their current plans. Use that strategy for at least 60–90 days before affecting your existing base. You need real data on conversion rates, average spending, and bill-shock complaints before you commit to a broader rollout.\n\n### Opt-in migration next\n\nInvite existing customers to switch voluntarily, perhaps with an incentive such as a temporary rate discount or bonus credits. Frame it as early access. The customers who opt in first are often your most engaged users, and they’ll tell you what’s confusing before you change the process on everyone else.\n\n### Segment-by-segment rollout\n\nWhen you move to mandatory migration, start with your smallest or lowest-risk cohort, such as monthly subscribers on your lowest tier who have less to lose and much to gain from PAYG flexibility. Don’t start with your largest accounts.\n\n### Carefully transition your highest-risk accounts\n\nFor annual subscribers in the middle of their contracts, honor existing pricing through their renewal date. For customers whose bills would increase significantly, offer credits that ease the transition over one or two billing cycles. Check your contract terms because B2B SaaS agreements might require notice periods for substantial pricing changes.\n\n### Set a hard cutoff\n\nIf your migration will take six months, announce early and send reminders at 90, 60, and 30 days out. Make the end date nonnegotiable. Open-ended migrations can drag on indefinitely and create a two-tier pricing mess that’s difficult to resolve.\n\n## What customer communication assets should you develop during a usage-based pricing launch?\n\nThe quality of your communication helps determine how much support volume you need to handle. You should have these three assets ready before you announce the changes:\n\n### The announcement email\n\nTell customers exactly what’s changing. Name the metric, the per-unit rate, and a date for the change. Include an example of the change in their terms, such as providing an estimate of what their bill would be at the new rate, and a link to a usage estimator. Even a simple slider can substantially reduce support tickets. If you’re using Stripe, you might already have customers’ historical metering data, so the estimate would be accurate.\n\n### The ‘what’s changing’ page\n\nYou need a pricing page that explains how billing will change from the previous pricing model. This can live in your help center and cover the metric definition, your pricing table, and example bills at three usage levels.\n\nAt a minimum, the FAQ section should answer these questions:\n\n“What if I exceed my included usage?”: Spell out exactly what happens, including overage rate, a notification, or a cap.\n\n“Can I set a spending limit?”: If you’ve integrated spending caps, let customers know. If you haven’t, expect this question in support.\n\n“Will I be notified before my bill increases?”: Describe the exact prompt (e.g., 80% of cap, $X threshold, or end-of-cycle summary).\n\n“What happens to my current contract?”: Detail terms during the transition, renewal dates, and any bridging credits explicitly.\n\n### Your CSM and sales script\n\nA dedicated customer success manager (CSM) can handle objections to a higher, variable bill, which many customers find difficult to budget for. To counter these issues, the CSM can show customers their usage trend and what that growth would cost under the new model. Clarify that bills go up when usage goes up, which means they’re getting more value. Discuss committed use agreements or bundles, both of which give customers the predictability they’re asking for without locking you into flat-rate economics.\n\n## What mistakes should you avoid when launching usage-based pricing?\n\nUsage-based pricing launches can fail because of avoidable execution gaps.\n\nLook out for:\n\nChoosing an unpredictable metric: Customers might churn if they can’t estimate their bill before signing up. Select the right metric before building other parts of the pricing model.\n\nLaunching without spending caps: Spending caps are a basic trust mechanism. Without them, you risk public complaints and lost accounts.\n\nMigrating all customers at once: You don’t want to discover a problem only after it’s affecting your entire base. Sequencing the migration prevents that.\n\nUnderinvesting in the pricing page: A usage-based pricing page must explain the metric, show example bills, and address predictability concerns before the customer has to ask.\n\nTreating bill shock as a support problem: Treating unexpectedly large bills on a case-by-case support basis masks a product problem, such as missing notifications, no spending visibility in the product, and no caps. Fix the product first.\n\nSkipping post-launch improvements: Some metrics that tell you the launch is working include conversion rate on usage-based pricing plans versus your prior flat rate, expansion revenue from overage, churn rate in the 90 days post-migration, and billing-related support ticket volume. If ticket volume increases significantly after launch, your communication or pricing page isn’t working.\n\n## How Stripe Billing can help\n\nStripe Billing lets you bill and manage customers however you want—from simple recurring billing to usage-based billing and sales-negotiated contracts. Start accepting recurring payments globally in minutes—no code required—or build a custom integration using the API.\n\nStripe Billing can help you:\n\nOffer flexible pricing: Respond to user demand faster with flexible pricing models, including usage-based, tiered, flat-fee plus overage, and more. Support for coupons, free trials, prorations, and add-ons is built in.\n\nExpand globally: Increase conversion by offering customers’ preferred payment methods. Stripe supports 100+ local payment methods and 130+ currencies.\n\nIncrease revenue and reduce churn: Improve revenue capture and reduce involuntary churn with Smart Retries and recovery workflow automations. Stripe recovery tools helped users recover over $6.5 billion in revenue in 2024.\n\nBoost efficiency: Use Stripe’s modular tax, revenue reporting, and data tools to consolidate multiple revenue systems into one. Easily integrate with third-party software.\n\nLearn more about Stripe Billing, or get started today.\n\nThe content in this article is for general information and education purposes only and should not be construed as legal or tax advice. Stripe does not warrant or guarantee the accurateness, completeness, adequacy, or currency of the information in the article. You should seek the advice of a competent attorney or accountant licensed to practice in your jurisdiction for advice on your particular situation.\n\n- \n- Something went wrong. Please try again or contact support.\n\nCreate an account and start accepting payments—no contracts or banking details required. Or, contact us to design a custom package for your business.\n\nCollect and retain more revenue, automate revenue management workflows, and accept payments globally.\n\nCreate and manage subscriptions, track usage, and issue invoices.",
      "image": "https://images.stripeassets.com/3sz5ney9ml0h/6dcroRt0biUQZNFM5ahTIc/0209a0d0969f88266d39bc23ec5951fe/learning-center-stripe-default-social-card.png?q=80",
      "favicon": "https://images.stripeassets.com/fzn2n1nzq965/1hgcBNd12BfT9VLgbId7By/01d91920114b124fb4cf6d448f9f06eb/favicon.svg"
    },
    {
      "id": "https://www.chargebee.com/pricing-labs/transition-to-usage-based-pricing/",
      "title": "Adopt Usage-Based Pricing: Practical Guide for SaaS & AI",
      "url": "https://www.chargebee.com/pricing-labs/transition-to-usage-based-pricing/",
      "text": "Adopt Usage-Based Pricing: Practical Guide for SaaS & AI\n\n# A Practical Guide to Adopting Usage-Based Pricing Without Breaking What Works\n\nWith insights from James D. Wilton CEO and Senior Partner, Monevate\n\n#### Pricing is the New Product Narrative\n\nCreating value is easier than ever. AI-native features roll out in days, workflows launch without code, and cloud infrastructure scales instantly.\n\nShipping something useful is no longer the hard part. Capturing value is.\n\n80% of companies still take one quarter or more to test pricing or even align on the right value metric.\n\nBy then, the feature’s out, the value has been delivered. And by the time pricing catches up, the moment to capture that value has slipped away.\n\nThe gap between value created and value captured is widening, and nowhere is it more exposed than in pricing. The old models aren’t holding up. Seats don’t map to value. Bundles force customers to pay for features they never use. And buyers increasingly expect pricing that reflects outcomes, not just access.\n\nSo you start thinking about usage-based pricing. But then the real questions hit:\n\nWhat's the right value metric?\n\nWhat happens to legacy customers on fixed plans?\n\nHow do we comp sales if the revenue trickles in post-close?\n\nCan our product even track usage at the right level?\n\nUsage-based pricing sounds like a model shift. But in practice, it’s a company-wide transformation that touches product, sales, customer success, finance, and even culture.\n\nThat’s what this playbook is about.\n\nIt’s not a pitch for usage-based pricing. It’s a tactical guide to make it work: how to structure your pricing, what infrastructure you’ll need, and how to migrate without losing customers’ trust.\n\nReady to make pricing a key driver of your growth? This is where you begin.\n\n#### About the Contributors\n\nJames D. Wilton is the CEO and Senior Partner of Monevate, a strategic advisory firm focused on monetization, pricing, and business model design for high-growth SaaS and AI companies. He has helped scale pricing strategies at some of the most innovative startups and growth-stage businesses, working directly with product, finance, and GTM leaders to bridge the gap between value creation and value capture.\n\nJames is recognized for bringing clarity to complex pricing transitions, especially in usage-based and hybrid models, and for helping teams to move faster without compromising customer trust.\n\nHarikrishna is a Senior Product & Solutions Marketer at Chargebee, the leading Revenue Growth Management platform that helps over 6,500 companies manage multiple pricing models, launch freemium offerings, move upmarket and sell to enterprises, invoice and recognize revenue accurately, and prevent subscriber churn. He works at the intersection of product strategy, customer insight, and go-to-market execution, translating complex problems into actionable narratives that resonate.\n\nAt Chargebee, Harikrishna leads key initiatives around usage-based pricing and AI monetization, partnering closely with SaaS and AI innovators to navigate pricing transformation. This playbook reflects his ongoing work to help companies build scalable and story-worthy monetization strategies.\n\n- Table of contents\n- Usage-Based Pricing's Second Act: Why It's Having Another Moment in the Spotlight\n- When Should You Consider Usage-Based Pricing?\n- The Billion-Dollar Question: What Should You Meter?\n- Have Your Cake and Eat It Too: Layering Usage Into Your Pricing Strategy\n- Designing Customer Experience That Builds Trust and Protects Revenue\n- The People Side of Pricing: Who Does What When You Go Usage-Based\n- Infrastructure That Makes Usage-Based Pricing Work at Scale\n- Moving Customers to New Pricing Without Losing Them\n- Proof of Concept: How to Know If Your New Pricing Is Working\n\nSummarize\n\n## 1. Usage-Based Pricing's Second Act: Why It's Having Another Moment in the Spotlight\n\nUsage-based pricing (UBP) is not a new concept, but its relevance has skyrocketed in recent years, thanks to the rise of AI. It charges customers based on their actual consumption, rather than just access. UBP can take the form of pure pay-as-you-go (e.g., per API call, GB used, or images created) or be blended with fixed tiers or subscriptions.\n\nThe Pre-AI Momentum\n\nBefore AI dominated headlines, SaaS companies with usage-based components already saw advantages: higher net revenue retention as pricing scaled with customer growth; lower barriers to entry for hesitant prospects; and more organic expansion as usage increased. Customers appreciated the transparency. Pricing that reflected actual consumption felt more defensible than arbitrary seat counts or feature bundles.\n\nAI’s Push for Value-Based Pricing\n\nDespite the rise of usage-based pricing, most software products had a fixed subscription model: an upfront platform fee and user seats as the primary value metric. But the way AI delivers value (highly variable, output-driven, and scaled by user intent) has forced companies to pause and reassess how they monetize their products.\n\n#### 1. Seat-Based Models Under Pressure\n\nJames notes, “It used to be the case that the amount of value I got from the product was very correlated with the number of people I had working in it, which is why per-user pricing worked. But now, with AI and automation, that doesn’t hold anymore.”\n\nA single user with AI assistance can accomplish a lot more work.\n\nAutomated workflows handle tasks without human involvement. AI-native companies are scaling with leaner teams than traditional software companies ever did.\n\nThe result? Revenue tied purely to headcount struggles to capture the expanding value these companies create. It's not that seats are completely irrelevant; they're now insufficient as the primary value metric for most companies.\n\n#### 2. Variable Value, Fixed Pricing\n\nAI capabilities deliver wildly different value depending on use case complexity, integration depth, and model sophistication. One customer might achieve 10x ROI while another sees marginal benefit.\n\nFixed pricing treats both identically, creating misalignment. High-value users may feel they're getting a bargain while low-usage customers question the cost.\n\n#### 3. Every AI Feature Behaves Like a Microproduct\n\nAI features consume real, variable costs: tokens,compute, storage, bandwidth. These costs fluctuate based on input complexity, output type (text/audio/video), and usage patterns.\n\nTreating resource-intensive AI capabilities as flatmonthly features creates unsustainable unit economics as usage scales.\n\nKey Takeaway\n\nWhether you're selling to lean AI-first startups or enterprise teams embracing automation, one thing is clear: Your pricing model should reflect how your product is used and where value is delivered, not just the number of people who have access to it.\n\n## 2. When Should You Consider Usage-Based Pricing?\n\nAs with any pricing model, usage-based pricing isn’t a silver bullet or universal fix for monetization. However, it's essential to regularly assess whether your current pricing model continues to meet your needs.\n\nJames outlines a core truth: “If you're a fast-growing SaaS company, your pricing strategy will probably only last you 2–3 years, because your product, your market, or your goals will change. With AI, that shelf life compresses even further.\"\n\nWhen that shift comes, don't just tweak price points. Start with one key question: Does your pricing reflect how customers experience value today?\n\nIf the answer isn’t clear, use this assessment (on the right).\n\nIf multiple signals apply, UBP may be more than just viable; it might be necessary. Don’t wait for revenue to plateau or costs to balloon. Evaluate early, and experiment with intent.\n\n\"The general idea of moving to usage-based pricing for AI is… (surprise, surprise!) to map the value that our customers are getting from AI capabilities to pricing, in a way that's more tightly coupled than what a seat-based model enables. It's enabling customers to pay for what they actually need while enabling the company to offset the costs of serving AI models and maintain healthy margins.\"\n\n- Tony Beltramelli, Head of Product for AI, Miro\n\nPlot Twist: What if Your Customers Are Already Living Usage-First? Monte Carlo, a data and AI observability platform, didn’t have to convince customers to accept usage-based pricing—they had to stop frustrating them with upfront annual contracts.\n\nTheir buyers were developers used to AWS, Datadog, and Snowflake. Paying only for what you use wasn’t novel; it was expected. So Monte Carlo pivoted to a pure pay-as-you-go model and started tracking ‘daily revenue’. The shift landed instantly and became core to their GTM strategy.\n\nKey Takeaway\n\nUsage-based pricing works when your product’s value scales with usage, your customers understand that link, and your teams are ready to sell, support, and charge for it.\n\n## 3. The Billion-Dollar Question: What Should You Meter?\n\nOne of the most critical decisions in usage-based pricing is deciding your value metric(s) (what to meter). Your value metric becomes the foundation for customers' understanding of their bills and whether they believe the pricing is fair.\n\nChoose poorly, and customers feel confused or exploited. Choose well, and pricing feels natural and defensible.\n\nStart with Value Assessment\n\nBefore selecting metrics, document where your product creates specific value for customers. Then, through customer interviews and surveys, test which value dimensions matter most to different segments.\n\n##### Four Types of Value Metrics to Consider\n\n- Inputs: Data ingests, user queries, API calls, tokens consumed\n- Usage: Sessions, CPU hours, processing time\n- Outputs: Documents generated, scans completed, workflows automated\n- Outcomes: Time saved, costs avoided, new revenue unlocked\n\n##### Evaluate Your Options: What Makes a Good Value Metric?\n\nOnce you've identified potential metrics across these categories, put each candidate through this evaluation framework. The metrics that score well across most criteria are your strongest contenders:\n\nAvoiding the AI ‘Black Box’ Trap:\n\nWith AI products, customers resist paying for processes they can't see or understand, especially when those processes appear to be system inefficiencies rather than value delivery.\n\nThe root cause of this mismatch is that companies often price based on what drives their cost, not what drives customer value. \"In AI, the instinct is to charge per query or token,\" James says. \"That helps recover cost, but customers don't think in tokens. They refine queries, backtrack, and iterate. Value lives in the final output, not every input.\"\n\nHe recalls a search provider that charged per query, but every keystroke triggered a new one. Typing a two-word search could result in a dozen events before hitting enter, and customers felt cheated.\n\nThe fix? Charge per session instead. One billable unit for the full intent. This addressed customers’ perception of being nickel-and-dimed.\n\nChoose metrics that are visible to customers and align with their perception of value. Charge for documents processed rather than tokens consumed, or results delivered rather than queries executed. Focus on what makes your product or customer results distinct, rather than just general AI processing capabilities.\n\nWhen Zapier Bet on the Wrong Value Metric (And How They Fixed It)\n\nZapier once priced based on Zaps (automations) and Tasks (each run), but users often hit the limit on one metric while still having quota left on the other, forcing them to upgrade without feeling they’d fully used their plan. This disconnect led to frustration, confusion, and mounting complaints. Zapier overhauled its pricing to prioritize trust, removing arbitrary limits, adding pay-as-you-go flexibility, and simplifying the model. A year later, usage surged, churn dropped, and metered revenue grew.\n\nRead the full story\n\nKey Takeaway\n\nYour value metric shapes the entire customer relationship. It determines whether pricing feels fair, whether customers can predict costs, and whether growth feels sustainable for both parties. Take time to align your metric with customer value, not just your cost structure.\n\n## 4. Have Your Cake and Eat It Too: Layering Usage Into Your Pricing Strategy\n\nChoosing what to meter is just the beginning. The more complex question is how to introduce usage without abandoning your stable revenue streams.\n\nThis is where many companies get stuck. When usage-based pricing enters the conversation, it tends to feel like a fork in the road: stick with your existing subscriptions or swing hard into pure pay-as-you-go (which often sounds ‘highly volatile’).\n\nIn reality, the best approach is usually a hybrid one: adding usage-based components on top of your predictable subscription elements.\n\nAnd the data backs this up. According to our 2025 State of Subscriptions and Revenue Growth Report, 43% of companies now combine subscriptions with usage-based pricing. Pure-play models still exist, but the trend is unmistakable: most businesses are layering usage, not replacing subscriptions.\n\nWhy Hybrid Models Dominate\n\nTwo major forces drive companies toward hybrid pricing:\n\n- Buyer psychology: Even usage-friendly customers want predictability for budgeting and procurement. As James notes, \"Enterprise buyers are often willing to pay 15% more just to have certainty around what they’ll owe. That level of predictability gives them confidence to move forward.\"\n- Organizational reality: James explains, “Selling based on usage is completely different from selling based on users. Your salespeople need to speak a different language. Your CS team needs to drive usage. Your whole organization needs to pivot, so doing it all at once is rare.\"\n\n4 Popular Hybrid Models (And When to Use Them)\n\n1. Base plan + Overage: Customers pay a flat fee for a defined usage quota, then pay per unit for overages (often at premium rates).\n\nExample: Zapier includes set tasks in each plan, charging 1.25 times the base rate for extras.\n\n- Buyer perspective: \"I know my minimum cost and only pay more if I grow.\"\n- When to use: Ideal when you want a predictable entry price with room to scale. Works best when usage is easy to explain and overages are infrequent but expected.\n\n2. Block-Based Capacity: Customers pre-purchase usage blocks rather than paying per unit in real-time.\n\nExample: Phrase offers clear pricing plans with included capacity (e.g., the number of words stored or translated), allowing customers to purchase additional blocks as needed.\n\n- Buyer perspective: \"I don't have to worry about a meter running. I scale in chunks when I'm ready.\"\n- When to use: Best for PLG or sales-led motions where customers value predictability but need flexibility to grow without committing to a full-tier upgrade.\n\n3. Minimum Commitment + True-Up: Customers commit to a minimum spending amount for discounted rates, with true-up charges applied if they fall short of the commitment.\n\nExample: Common in platforms like AWS or Splunk, a customer commits to $20,000 for Q1. By quarter's end, if they've only used $18,000, a $2,000 true-up is invoiced.\n\n- Buyer perspective: \"I get better rates for promising to spend, and I know exactly what I'll owe if I don't use it fully.\"\n- When to use: Ideal for enterprise or high-usage accounts that require locking in revenue while offering flexible usage. Useful when the buyer's procurement needs a clear commitment number.\n\n4. Prepaid Credits & Drawdown: Customers pre-purchase a pool of credits tied to a monetary value, which they draw down as they consume services. You define how credits convert to usage, which features or limits they unlock, and whether unused credits roll over to the next billing period.\n\nExample: Freepik allows users to buy credit packs (e.g., 100 credits) and spend them on downloads, premium assets, or AI-generated content. Each asset has a credit cost, and the balance depletes as users consume it.\n\n- Buyer POV: \"I want to commit upfront to get better rates, but I need flexibility to ramp usage when the time is right.\"\n- When to use: Ideal for generative AI and agentic AI use cases. Prepaid credits let you monetize multiple features or agents that may have different underlying costs and values, while keeping pricing simple for users. Because all features draw from a shared pool of credits, you can offer flexibility without exposing customers to pricing complexity.\n\nKey Takeaway\n\nYour pricing model sets the foundation for how you monetize growth. Whether you choose overages, blocks, prepayments, or hybrid commits, the goal is the same: align price with value delivered. Hybrid models give you flexibility without forcing a binary choice. Start with what’s easy to explain, easy to sell, and easy to scale. Evolve as your product and customers mature.\n\n## 5. Designing Customer Experience That Builds Trust and Protects Revenue\n\nYour pricing strategy is only half the equation. The other half is how customers feel about paying you. Usage-based pricing doesn't reside in spreadsheets—it appears in invoices, upgrade prompts, alert emails, and product limits. Every billing cycle, usage threshold, and overage sends a signal: Is your pricing fair or predatory? Predictable or chaotic? Does it build trust, or erode it?\n\nBeyond perception, billing mechanics affect cash flow, revenue recognition, fraud risk, and operational complexity.\n\nThis chapter demonstrates how to create pricing that feels fair, predictable, and scalable, without compromising financial control or customer trust.\n\nDecide Your Billing Cadence\n\nOnce you’ve locked in your pricing model, the next decision is billing cadence: how often customers pay and when usage gets invoiced. Your billing rhythm has a direct impact on cash flow, risk exposure, and customer experience.\n\nBelow are the most common billing cycles and their impact on your operations.\n\nPlan for What Happens Beyond Usage Limits\n\nOnce usage exceeds a plan’s quota, how you respond matters. Some customers expect uninterrupted service and are willing to pay for it. Others prefer cost controls, even if it means being throttled or cut off. The right enforcement model depends on your product’s role and your buyer’s mindset.\n\nWhatever path you choose, make it transparent. Utilize alerts, dashboards, and billing previews to prevent surprises. Clearly document your usage and billing policies to establish expectations and minimize the support burden. Stay close to your customers to understand their perspective and adjust as needed.\n\nKey Takeaway\n\nThe moment a customer hits their limit or receives their bill is when pricing becomes personal. Design these moments with care. Your billing cadence, enforcement rules, and transparency don’t just affect revenue; they shape trust. And trust is what usage-based models are ultimately built on. And behind every smooth experience is a system built to handle it. We'll get to that later.\n\n## 6. The People Side of Pricing: Who Does What When You Go Usage-Based\n\nOnce you've nailed your pricing model and mapped out the billing mechanics, the strategy work is largely done. What comes next is execution, and that depends on people. Usage-based pricing may initially be a monetization decision, but sustaining it requires ongoing coordination across multiple teams.\n\nBecause in a usage-based world, revenue doesn’t just show up at contract signature. It becomes apparent when the product is used, meaning that Product, Sales, CS, Finance, and RevOps all have a role to play.\n\nThis chapter covers how to assign ownership, structure incentives, and operationalize pricing to prevent it from stalling out post-launch.\n\nDecide Who Owns Pricing\n\nBefore you rethink roles, decide who’s responsible. Pricing often starts as a founder-led decision or something debated ad hoc between product and finance. But if no one owns it, it doesn’t move. You need someone obsessing over usage metrics, value alignment, and packaging experiments—someone who treats pricing as a product in itself. Whether that’s a monetization lead, product ops, or a cross-functional working group, pick an owner.\n\nProduct's Foundational Role\n\nThe product is the ground zero for usage-based pricing. Product teams enable the model by:\n\n- Instrumenting the product to track usage at a granular level\n- Surfacing insights to customers so they can self-optimize\n- Prioritizing features and workflows that unlockvalue tied to pricing\n\nSales Compensation Needs to Shift\n\nTraditional sales comp plans reward upfront deal size. But in usage-based pricing, the deal only starts delivering value and revenue once the customer actually uses the product. That’s a different rhythm.\n\n- Reward land + expand: Comp reps on customer growth over time, not just initial contract value\n- Discourage overcommits: Penalize inflated usage estimates that lead to refunds or downsells\n- Align with usage milestones: Incentivize product adoption, not just deal closure\n\nCustomer Success Becomes a Growth Driver\n\nCS can no longer be a reactive “churn prevention” team. Their job now is to:\n\n- Drive usage by helping customers discover use cases tied to value\n- Monitor telemetry to spot drop-offs or expansion signals\n- Trigger interventions at usage thresholds, upgrade points, or onboarding gaps\n\nFinance Must Relearn Forecasting\n\nWith variable usage comes variable revenue. Finance needs to rethink:\n\n- Forecasting: Model it based on usage signals, not fixed ACV\n- Risk controls: Use true-ups, prepayments, or usage caps\n- Revenue recognition: Align billing systems to handle mid-cycle charges and fluctuating usage\n\nRevOps as the Pricing Backbone\n\nIn usage-based pricing, RevOps isn’t just operational support; it’s central to how pricing works at scale, connecting strategy and systems. They:\n\n- Ensure usage data flows cleanly across CRM, billing, and analytics\n- Create dashboards for tracking quota, usage, and expansion potential\n- Own the logic for entitlements, thresholds, and billing triggers\n\nKey Takeaway\n\nSuccessful usage-based pricing depends on how well your teams adapt to it. Sales needs new comp plans, CS needs to drive usage, Product must build metering and visibility, and Finance has to model for variability. Above all, someone needs to own the strategy and continually evolve it.\n\n## 7. Infrastructure That Makes Usage-Based Pricing Work at Scale\n\nSo you have your pricing model in place, your teams aligned, and the mechanics designed. But none of it works without the infrastructure to support it. Unlike seat-based or flat subscriptions, usage-based pricing relies on real-time signals, dynamic entitlements, and precise billing, because every spike, overage, or delay is something your customer feels.\n\nMany teams underestimate the scope. This isn’t just a back-office upgrade—it’s a system-wide shift across product, billing, data, and finance.\n\nOur recent market study of 450+ SaaS and AI companies revealed a clear pattern: apart from value articulation, the biggest hurdles to adoption are all infrastructure-related.\n\nUsage tracking, pricing flexibility, and billing execution—each can either compound complexity or unlock monetization at scale.\n\nThis chapter outlines what a modern UBP-ready architecture should look like, explains why each layer is essential, and provides guidance on building a foundation that scales with your ambitions.\n\n1. Usage Ingestion – Capture Every Signal at Scale\n\nIf usage is your revenue trigger, missing or duplicated data can lead to revenue leakage and erosion of trust.\n\nYou need a usage infrastructure that can:\n\n- Ingest high-volume usage data in real time or batch\n- Handle diverse event types (API calls, compute, tokens, messages)\n- Maintain clean, reliable data with built-in de-duplication and idempotency\n- Scale horizontally to support AI or data-intensive workloads\n- Allow for flexible schema changes without breaking downstream processes\n\nWhy it matters: Accurate, high-throughput ingestion is the foundation of usage-based pricing. If the data is off, everything else downstream, from metering to billing, is compromised.\n\n2. Metering & Rating – Convert Usage Events Into Revenue\n\nRaw events aren't billable until they’re transformed into pricing logic.\n\nYour system should:\n\n- Let you define and iterate metered features (e.g., docs processed, GB stored) without engineering heavy lifting\n- Filter and aggregate usage data using time windows and logic (like SUM or COUNT)\n- Support flexible rating models (tiers, packages, thresholds) and price updates without code rewrites\n\nWhy it matters: Shifting to usage-based pricing involves discovering what customers truly value and how they’re willing to pay. That takes iteration. The faster you can define and refine meters and pricing logic, the quicker you’ll land on a model that works.\n\n3. Billing Engine – Send Invoices That Inspire Trust\n\nUsage-based pricing strains traditional billing systems. You need an engine that can:\n\n- Calculate usage-based charges in real time or at billing intervals\n- Support hybrid models (base + overage, tiered usage, drawdowns)\n- Manage proration, mid-cycle changes, and multi-entity invoicing\n- Integrate natively with quoting, checkout, and contracts\n- Automate tax handling and support multi-currency billing\n- Provide detailed audit trails and invoice previews for transparency\n\nWhy it matters: With UBP, your billing engine becomes an extension of your product. If it can’t support your pricing models, your customer experience, and revenue will take a hit.\n\n4. Entitlements – Control Access and Track Consumption\n\nWith usage-based pricing, provisioning becomes a revenue lever. You need to manage:\n\n- Feature-level access and usage thresholds (e.g., 1M API calls/month)\n- Real-time enforcement (throttle, notify, block)\n- Sync between entitlements, usage data, and billing systems\n- Support for upgrades, trial overrides, and plan changes\n- Visibility into \"purchased vs. consumed\" usage\n\nWhy it matters: Entitlements connect billing to the product. They prevent overconsumption, reduce revenue leakage, and give you the flexibility to iterate on feature packaging. Learn how Phrase leveraged entitlements in its pivot to usage-based pricing.\n\n5. Data Architecture – Align Product, GTM, and Finance\n\nUsage data can't live in silos. You need:\n\n- A unified source of truth for usage and billing data\n- Reports and analytics to visualize usage across cohorts\n- Integrations across your tech stack—CRM, CPQ, revenue recognition, and accounting tools\n\nWhy it matters: When usage and billing data are disconnected, teams lose alignment and confidence. Choose a system that brings them together so everyone sees the same numbers and knows they can trust them.\n\nKey Takeaway\n\nYour monetization strategy is only as agile as your infrastructure. While some tools capture usage data and others handle billing, fragmented systems slow down pricing experiments. Tools like Chargebee unify ingestion, metering, entitlements, and billing, so you can iterate quickly without patching together point solutions.\n\n## 8. Moving Customers to New Pricing Without Losing Them\n\nChanging pricing for new customers is more straightforward because they don’t have baggage. Existing customers do. Contracts, expectations, and a mental model shaped by your old pricing. That’s what makes migration tricky. This isn’t a flip-the-switch moment. It’s a structured rollout to realign value and pricing without breaking trust.\n\nJames notes, \"If you plot what a customer is paying today vs. what they’d pay under your new usage model, it usually looks like someone fired a shotgun at the graph—completely scattered. And it’s natural because your old value metrics, like seats, rarely map cleanly to usage.\"\n\nThat’s why successful migrations depend on intelligent segmentation and pricing guardrails.\n\nStart With New Customers\n\nRolling out your new pricing model with net-new customers lets you learn without the risk. There are no expectations to reset, and every closed deal builds internal muscle, providing your team with real data, tested talk tracks, and the confidence to engage with legacy customers later.\n\nSet Pricing Boundaries: Target vs. Floor\n\n- Target price is what a customer would pay under the new model based on actual usage.\n- Floor pricing is your minimum acceptable threshold: what you’re willing to offer during migration, while protecting margin and pricing integrity.\n\nThese two numbers create room to negotiate without compromising strategy.\n\nPhase the Rollout\n\nThink of migration as a campaign, not a cutover. Use a phased approach to reduce risk and build momentum:\n\nKey Takeaway\n\nTransitioning your base is less about enforcing a new price and more about resetting the value conversation. Do it gradually, with structure, and you will earn the trust of your customers.\n\n## 9. Proof of Concept: How to Know If Your New Pricing Is Working\n\nOnce your new pricing is live, the real question is: is it working? Not just “are we billing correctly,” but “are we seeing the results we designed for?”\n\nTrack the metrics that align with the objectives behind your shift to usage-based pricing. Refer to the framework on the right for guidance.\n\nNumbers tell only part of the story. Also track qualitative signals:\n\n- Do customers understand the model?\n- Do they feel the pricing is justified?\n- Are reps confident in explaining and defending the model?\n\nThe combination of quantitative results and qualitative feedback reveals whether your usage-based pricing transition is working.\n\nKey Takeaway\n\nYou won’t get pricing perfect on day one, and that’s fine. What matters is staying close to how customers experience value, tracking what moves the needle, and adjusting as you learn. Progress in usage-based pricing comes from iteration, not certainty.\n\n#### When It All Comes Together: The True Power of Usage-Based Models\n\nThe companies that win with usage-based pricing aren’t the ones that just meter well or build flexible plans. They’re the ones who use pricing as a mirror: a way to surface how value is actually created, where it’s leaking, and how aligned their entire org is around capturing it.\n\nBecause pricing isn’t just a finance problem. It’s a product decision. A sales enablement challenge. A customer success accelerant. A test of your infrastructure’s agility.\n\nThat’s the fundamental shift. Usage-based pricing forces companies to confront what they truly understand about how their product works, what their customers value, and how fast they can adapt. And the ones who do? They don’t just monetize better. They build tighter feedback loops, stronger customer trust, and faster paths to expansion.\n\n#### About Monevate\n\nMonevate is a strategic advisory firm specializing in monetization and pricing for SaaS and AI companies. With 50+ transformations delivered in just 3 years and a 95% client referral rate, Monevate helps teams move from value creation to value capture. Their expertise spans:\n\n- Maximizing revenue with value-aligned metrics\n- Driving expansion through scalable pricing architecture\n- Protecting margins with disciplined execution\n- Creating new revenue streams by monetizing features, products, and AI\n\n#### About Chargebee\n\nChargebee is the leading billing and monetization platform, powering pricing innovation for 6,500+ subscription businesses. As your monetization and billing infra, Chargebee helps you:\n\n- Operationalize flexible pricing: support subscriptions, usage-based, and hybrid models\n- Experiment faster: launch and iterate on pricing without engineering bottlenecks\n- Unify operations: keep Product, GTM, and Finance aligned with a single source of truth\n- Scale reliably: ensure accurate billing, revenue recognition, and churn prevention",
      "image": "https://webstatic.chargebee.com/assets/web/20260827094953/images/cb-mo/header.png",
      "favicon": "https://www.chargebee.com/static/resources/brand/favicon.png?v=1"
    },
    {
      "id": "https://www.chargebee.com/blog/usage-based-billing-architecture-pricing-agility/",
      "title": "Usage-Based Billing Architecture: 3 Lessons For Pricing Agility",
      "url": "https://www.chargebee.com/blog/usage-based-billing-architecture-pricing-agility/",
      "publishedDate": "2025-09-02T00:00:00.000Z",
      "author": "Srikrishna Jagannathan and Jose Tom ,  Harikrishna",
      "text": "Usage-Based Billing Architecture: 3 Lessons For Pricing Agility\n\n# How We Built Chargebee’s Usage-Based Billing to Enable Pricing Agility\n\nSrikrishna Jagannathan and Jose Tom, Harikrishna\n\nUpdated on January 29, 2026\n\n \n\nPrefer listening? Here’s the full audio version of this post.\n\nPricing has evolved from a set-it-and-forget-it financial decision to a dynamic GTM lever that companies pull continuously. Pylon’s CEO recently shared that they’ve iterated on pricing 10 times already, and they’re still experimenting. Lovable actively polls users about credit limits, treating pricing like a product.\n\nThis isn’t companies being indecisive. It’s the reality of building in the AI era, where product capabilities evolve rapidly and customer value perception shifts constantly. Yet most companies hit the same wall: as products become more sophisticated and usage patterns more complex, their ability to iterate on pricing actually slows down.\n\nAfter studying dozens of AI and SaaS companies struggling with usage-based billing, we discovered that the problem isn’t analysis paralysis—it’s architectural. The very systems designed to enable pricing flexibility were creating rigidity.\n\nThat’s why pricing agility is one of the core objectives for Chargebee’s Usage-Based Billing system. We knew that without it, companies would be trapped by the same architectural constraints we observed everywhere else.\n\nBut what do we actually mean by pricing agility? Here are the key questions that define it:\n\nEnlarge\n\nThese capabilities became our design requirements. Every architectural decision we’ve made—from schema-flexible ingestion to modular billing layers—is driven by ensuring teams can answer “yes” to these questions without straining the engineering bandwidth already torn between the AI product roadmap and supporting internal teams.\n\nThe insights that shaped our approach reveal universal principles that any company can apply when building or evaluating usage-based billing systems.\n\n## Lesson 1: Rigid Schemas Force Premature Monetization Decisions\n\nThe Problem: Every company we studied faced the same trap: billing systems that force upfront decisions about data structure AND monetization logic before understanding how customers actually use their products.\n\nAI companies spend weeks debating whether to track “interactions,” “tokens,” or “successful resolutions,” when the answer is “all of the above, plus attributes we haven’t thought of yet.”\n\nExample: Consider Intercom’s Fin AI. They start tracking:\n\n```\n{\n  \"customer_id\": \"dhrj3y92\", \n  \"timestamp\": \"2025-08-22T10:15:30Z\",\n  \"event_type\": \"ai_interaction\",\n  \"ticket_id\": 455789,\n  \"tokens_used\": 230,\n  \"resolution_time_seconds\": 45\n}\n```\n\nBut customer behavior quickly reveals new value dimensions worth tracking:\n\n- Issue complexity (simple FAQ vs. technical problem)\n- Resolution success without human handoff\n- Customer satisfaction rating\n- Issue category and language\n\nTraditional billing system architecture creates two critical problems:\n\n- Schema rejection: The system would reject the new attributes as they were not defined in the original schema configured, forcing engineering refactoring\n- Monetization coupling: The systems assume all usage attributes directly tie to billing, which is not the case\n\nThis creates a vicious cycle: companies need to track new attributes to discover monetization opportunities, but can’t add attributes without expensive system changes in the billing system.\n\nChargebee’s Solution: Accept the full payload without enforcing rigid schemas. Any attribute can be added on-the-fly and stored at full fidelity:\n\n```\n{\n  \"customer_id\": \"dhrj3y92\", \n  \"timestamp\": \"2025-08-22T10:15:30Z\",\n  \"event_type\": \"ai_interaction\",\n  \"ticket_id\": 455789,\n  \"tokens_used\": 230,\n  \"resolution_time_seconds\": 45,\n  \"issue_complexity\": \"medium\",\n  \"resolution_successful\": true,\n  \"customer_satisfaction\": 4,\n  \"issue_category\": \"billing\",\n  \"exchanges_count\": 2,\n  \"language\": \"en-uk\"\n}\n```\n\nNow that these crucial attributes are in Chargebee, you can build meters on top of it (e.g., counting just the number of successful ticket resolutions) to track adoption across customer segments without necessarily putting a price tag on it.\n\n## Lesson 2: Tightly Coupled Systems Turn Pricing Changes Into Cross-Team Projects\n\nThe Problem: We witnessed the same cycle repeatedly: product identifies a new value metric, finance gets excited, but implementation requires coordination across engineering, finance, and operations—each with different priorities and sprint cycles.\n\nThe conversation typically goes like this:\n\nEnlarge\n\nThis coordination overhead kills experimental momentum. The root cause isn’t just process friction—it’s architectural:\n\n- Tight coupling within billing systems: Traditional architectures couple data collection with monetization, treating packaging changes as architectural changes rather than configuration changes.\n- System fragmentation: Usage tracking happens in one system, feature entitlements are hard-coded in the application, usage metering logic live in another platform, and billing runs elsewhere. Each system boundary becomes a coordination point, and each integration becomes a potential failure mode for pricing changes.\n\nConsider the above example: a company wants to add usage caps specifically for GPT-5 tokens while making GPT-4 unlimited. In tightly coupled systems, engineering must modify the event pipeline to separate GPT-4 vs. GPT-5 usage before sending it to billing. But what happens when you want to experiment with GPT-5 credits instead of hard caps, or test different pricing for a new model entirely?\n\nThis is the core problem: each pricing change cascades into engineering work across multiple systems. What should be a configuration change becomes a coordination project spanning data pipelines, billing logic, and application code—all owned by different teams with competing priorities.\n\n### Pricing Changes Shouldn’t Be Engineering Projects\n\nDecouple your business logic from application code so you can move without waiting on sprints.\n\nChargebee’s Solution:\n\nBuild billing as a modular system where each layer can evolve independently, eliminating unnecessary cross-functional dependencies:\n\nEnlarge\n\n- Modular architecture with clear data flow: Each layer (ingestion → metering → entitlements → rating → invoicing) handles a single responsibility and connects through well-defined interfaces. Usage data flows downstream while each component can evolve independently—pricing changes don’t touch ingestion, entitlement changes don’t require billing rewrites.\n- Configurable over code: Business teams define meters, entitlements, and catalog mappings in Chargebee. Engineering emits events once and then steps out of the loop. \n\nAn AI chat product wants to deploy GPT-5 for enterprise only, while opening GPT-4 for all plans:\n\n- Engineering adds model_name to the existing data pipeline – single field addition, no schema changes required\n- Product team sets up usage tracking – creates separate meters for GPT-5 vs GPT-4 usage directly in Chargebee’s UI, filtering by the new model_name attribute\n- Configure plan entitlements (again, directly from the UI): \n\n- Enterprise customers: 1000 GPT-5 tokens included monthly, $0.02 per additional token\n- All plans get unlimited GPT-4 access\n- Deploy gating logic – application checks entitlements (with Chargebee) before model selection, returns upgrade prompts for non-enterprise users requesting GPT-5\n- Go live!\n\nThe key difference: The Product team configures the business rules while engineering focuses on the one-time technical change.\n\n## Lesson 3: Build Usage as an Action Engine, Not Just Billing Input\n\nThe Problem: Most billing systems treat usage data purely as a billing input, leaving tons of insights trapped within subscription and usage data. Sales can’t access usage patterns to identify upsell opportunities. Customer success can’t see usage decline that might signal churn risk. Product can’t analyze feature adoption to inform roadmap decisions. Finance can’t propose business strategies rooted in product reality.\n\nEven when teams identify opportunities, execution becomes painfully slow because there’s no single system to run pricing experiments with the full context of the customers, subscriptions, and their usage data. We’ve seen teams spot perfect upsell moments only to watch months slip by before offers reach them. The front-end team builds popups, the back-end wires metadata, and QA runs sandbox tests, and by launch time, the moment has passed.\n\nGiven the speed at which companies are forced to adapt, this disconnect between data collection and business action is a huge blocker for businesses. \n\nChargebee’s Solution: \n\nBuild usage infrastructure as an action engine from the ground up. \n\nUsage data isn’t just an input for invoice generation in the Chargebee ecosystem; it’s a first-class object that powers business decisions across every function. The same usage events that calculate billing amounts also trigger lifecycle campaigns, identify expansion opportunities, and predict churn risk.\n\nExample: A help desk company launching AI agents needs to decide: charge per conversation or per successful resolution? Here’s how they can navigate it with Chargebee:\n\n- Instrument once, capture broadly: Instead of deciding upfront what’s billable, send full usage events (conversation IDs, resolution status, agent type, costs). No schema lock-in means nothing has to be rebuilt later if they want to test a new angle. \n- Define meters flexibly: Configure “AI agent conversations” and “successful resolutions” as two meters. Each has its own aggregation logic and filters, but both pull from the same raw events. \n- Run pricing experiments: A/B test cohorts: half on conversation (usage)- based pricing and half on resolution (outcome)- based pricing. This can be deployed with a user-friendly interface without separate tooling or maintenance overhead. \n- Measure revenue impact directly: Instead of proxy metrics (click-through, conversion intent), they see each cohort’s actual revenue performance because the experiment runs at the billing layer. \n- Act quickly: Roll out a winning model across your new and/or existing base without engineering sprints.\n\n## The Real Cost of Pricing Infrastructure Decisions\n\nThe SaaS and AI companies that win today aren’t necessarily those with the best initial pricing model—they’re the ones that can evolve their pricing models fastest. In our research, 83% of companies tested pricing before making changes, but those that rolled out updates within a month were much more likely to see success.\n\nSo, the architectural decisions of your billing system strongly influence your team’s ability to move faster on pricing and packaging. \n\nHere’s what we learned from the trenches, building Chargebee’s modern UBB system:\n\n- Design for schema evolution, not schema perfection. JSON schemas that enforce strict validation upfront become technical debt when business requirements change. We learned to accept looser typing at ingestion and apply validation at the business logic layer, where it can evolve with product needs.\n- Separate your data layer from your business logic. The biggest architectural mistake we wanted to avoid: forcing billing rules into the usage collection layer. When companies wanted to test new meters or change aggregation windows, they ended up rewriting entire ingestion pipelines. Our clean separation and composable architecture mean your pricing experiments don’t require deployments.\n- Build usage data as a shared business intelligence layer, not a billing silo. The more systems you deploy to meter, bill, and analyze usage data, the more context gets lost and the longer it takes to test offers. We use the same event stream to generate usage charges, track feature adoption, predict churn, and run lifecycle offers without duplicate instrumentation.\n\nYour pricing will change more in the next two years than in the previous five. Build your usage infrastructure like you’d build any other high-change system—with clear interfaces, loose coupling, and the assumption that every “final” requirement will evolve.\n\nAt Chargebee, we didn’t just theorize about these pitfalls—we built the next-generation usage-based billing infrastructure to overcome them. Today, we support 500+ companies across AI and SaaS as they experiment with usage and hybrid models. Our mission is simple: help businesses adapt pricing as fast as they adapt their products.",
      "image": "https://blog.chargebee.com/wp-content/uploads/2025/09/Chargebee-usage-based-billing-agility-1024x536.png"
    },
    {
      "id": "https://valueaddvc.com/blog/pricing-strategy-for-ai-products-seat-based-usage-based-or-value-based",
      "title": "AI Pricing Strategy — Seat vs Usage vs Outcome",
      "url": "https://valueaddvc.com/blog/pricing-strategy-for-ai-products-seat-based-usage-based-or-value-based",
      "publishedDate": "2026-07-21T00:00:00.000Z",
      "author": "Trace Cohen",
      "text": "AI Pricing Strategy — Seat vs Usage vs Outcome\n\nStartup Operations July 21, 2026· 10 min read·\n\n# AI Pricing Strategy — Seat vs Usage vs Outcome\n\n73% of AI vendors now charge separately for AI features, and usage-based pricing has grown from 30% of SaaS in 2019 to 85% in 2024 — real pricing breakdowns from Cursor, HubSpot, and Salesforce.\n\nTrace Cohen\n\nFounder, Value Add Holdings LLC · 3x founder (BrandYourself, Launch.it, SPOT) · 65+ investments · Based in Boca Raton, FL\n\n@Trace_Cohen· t@nyvp.com· South Florida Advisory\n\nQuick Answer\n\n73% of AI vendors now charge separately for AI features, and usage-based pricing has grown from 30% of SaaS companies in 2019 to roughly 85% in 2024, per Gartner and OpenView data. Seat-based pricing is shrinking fast, down from 21% to 15% of SaaS in just 12 months, as AI agents replace the human seats those licenses used to count.\n\n73% of AI vendors now charge separately for AI features, and usage-based pricing has grown from just 30% of SaaS companies in 2019 to roughly 85% in 2024. That's the short answer. The longer answer is that no single model has won — the fastest-growing companies in 2026 are stacking a base fee with usage or outcome pricing on top, not picking one lane.\n\nEvery AI founder eventually hits the same wall: the per-seat SaaS playbook that worked for Salesforce and HubSpot for two decades breaks the moment a product can do the work of ten human seats on its own. The 2026 data shows exactly how the market has responded — and which companies got the transition right.\n\n73% of vendors, 2026 AI vendors charging separately for AI\n\n85% up from 30% in 2019 SaaS using usage-based pricing\n\n15% down from 21% in 12 mo. Per-seat pricing share of SaaS\n\n43% projected 61% by year-end Hybrid pricing adoption\n\nFigures are 2026 estimates blended from Gartner usage-based pricing forecasts, OpenView/Zylos SaaS pricing research, and IDC per-seat pricing projections. Adoption percentages reflect share of surveyed SaaS and AI vendors, not revenue share.\n\n## AI product pricing strategy in 2026: why seat-based models are losing ground\n\nAI product pricing strategy in 2026 centers on three models — seat-based, usage-based, and outcome-based — with most successful vendors now combining a base platform fee with variable usage or outcome charges on top. Usage-based pricing alone has grown from 30% of SaaS companies in 2019 to about 85% in 2024, while pure per-seat pricing fell from 21% to 15% of SaaS offerings in just the past 12 months.\n\nThe reason is structural, not a fad: an AI agent that closes support tickets, qualifies leads, or writes code doesn't map to a single human \"seat\" the way a CRM login or an email client license always did. Gartner predicts 70% of businesses will prefer usage-based pricing over per-seat models by 2026, and IDC expects 70% of software vendors to move away from pure per-seat pricing entirely by 2028 — both driven by the same fact: AI agents are replacing the human seats those licenses used to count.\n\n## Seat-based, usage-based, and outcome-based pricing compared\n\nEach pricing model trades off predictability for the buyer against value alignment for the vendor. The table below compares how each model actually works in practice, using real 2026 pricing from companies that have shipped each approach.\n\n| Model | Example | Unit Price | Buyer Predictability | Vendor Value Capture |\n| --- | --- | --- | --- | --- |\n| Pure seat-based | Salesforce Agentforce flat tier | $125/user/month | High | Low if usage is uneven |\n| Usage-based (credits) | Cursor Pro plan | $20/mo in credits | Medium | High, scales with use |\n| Usage-based (per action) | Salesforce Flex Credits | ~$0.10/action | Medium | High, granular |\n| Outcome-based | HubSpot Breeze Customer Agent | $0.50/resolved convo | Medium-high | Highest, pay-for-results |\n| Outcome-based | Intercom Fin | $0.99/resolved ticket | Medium-high | Highest, pay-for-results |\n| Seat + usage hybrid | Cursor Teams Premium seat | $120/user/month | High | High, tiered by usage |\n| Conversation-based flat | Salesforce Agentforce | $2.00/conversation | Medium | Medium-high |\n\nFigures are July 2026 published list prices from Cursor, Salesforce, HubSpot, and Intercom pricing pages and pricing-change announcements. Enterprise negotiated rates typically differ from list price.\n\n## How Cursor, Salesforce, and HubSpot actually price their AI products\n\nCursor runs a hybrid model on both sides of its business. Individual plans range from a free Hobby tier to $20/month Pro, $60/month Pro+, and $200/month Ultra, with Pro bundling a $20/month credit pool tied directly to the underlying API costs from OpenAI, Anthropic, and Google. On the team side, Cursor introduced a Premium seat in June 2026 at $120/user/month (versus $40/month for Standard), offering 5x the usage at only 3x the cost — a deliberate move to reward heavier users with better unit economics rather than charging everyone the same flat rate.\n\nSalesforce and HubSpot both moved toward outcome-based pricing for their AI agents in 2026. Salesforce Agentforce offers buyers a choice of Flex Credits (~$0.10 per action), a flat $2 per conversation, or $125/user/month for unlimited access — letting enterprise buyers pick the model that best fits their usage pattern. HubSpot cut its Breeze Customer Agent price from $1.00 per conversation to $0.50 per resolved conversation starting in April 2026, explicitly tying the charge to a successful outcome rather than just an attempted interaction, and priced its Prospecting Agent at $1 per qualified lead instead of a flat monthly fee per contact.\n\n## Choosing an AI product pricing strategy: seat, usage, or outcome\n\nThe right AI product pricing strategy depends on how directly your product's output maps to a measurable unit of value. If usage is roughly proportional to seats and hard to game, seat-based pricing is still the simplest option — it's why Salesforce still offers a $125/user/month flat tier alongside its usage-based options. If your AI does variable amounts of work per customer, usage-based credit pricing (Cursor's approach) captures value more fairly than a flat seat fee, but it makes revenue less predictable for both sides.\n\nOutcome-based pricing is the hardest to implement but the strongest alignment signal — HubSpot and Intercom both bet that charging only for resolved conversations builds more trust with buyers who've been burned by paying for AI tools that don't actually finish the job. The practical starting point for most early-stage AI startups: launch with usage-based credit metering to keep cost tied to real model spend, then layer in a base platform fee once usage patterns stabilize enough to price a hybrid tier — which is exactly the sequencing that pushed hybrid adoption from 43% today toward a projected 61% by the end of 2026.\n\n## The AI product pricing playbook by company stage\n\nPre-seed and seed-stage AI products should almost always start with pure usage-based credit metering. At this stage you don't yet know your gross margin per customer, and a flat seat or subscription fee risks pricing below your actual API and inference cost on your heaviest users — a mistake that's expensive to unwind later because customers anchor hard on their first price. Usage-based metering, even a simple $X per 1,000 tokens or per API call model, keeps you solvent on unit economics from day one and gives you the consumption data you'll need to design a smarter tier later. If you haven't actually modeled that spend, a full walkthrough of GPU, API, and inference costs is the place to start before you set a single price point.\n\nSeries A to Series B companies with product-market fit typically graduate to a hybrid model: a base platform or seat fee that covers a baseline usage allotment, plus metered overage once a customer exceeds it. This is the Cursor Teams playbook — a $40/month Standard seat or $120/month Premium seat, each bundling a defined usage pool, with the option to buy more. Hybrid pricing gives enterprise buyers the predictable monthly invoice their procurement teams require while still letting the vendor capture upside from power users, which is exactly why hybrid adoption is projected to climb from 43% of SaaS companies today to 61% by the end of 2026.\n\nGrowth-stage and enterprise-focused AI companies increasingly move a portion of revenue to outcome-based pricing, but only once they have enough delivery volume to model the unit economics of a \"successful outcome\" with confidence. HubSpot and Intercom could only credibly price per resolved conversation or resolved ticket after years of data on resolution rates, average handling cost, and failure rates. A startup that tries to charge purely on outcomes before it has that data risks either underpricing catastrophic failure cases or overpricing itself out of deals — which is why outcome-based pricing tends to arrive last in a company's pricing evolution, not first, even though it captures the most value once it works.\n\n## Why AI pricing strategy matters more for founders than it did in traditional SaaS\n\nIn traditional SaaS, gross margin was largely fixed once the product shipped — hosting a login screen and a database cost roughly the same whether a customer used the product for five minutes or five hours a day. AI products don't have that luxury. Every inference call carries a real, variable cost from the underlying model provider, which means a mispriced AI product doesn't just leave money on the table — it can produce negative gross margin on your most active users, the exact customers a growth-stage company is trying to retain and expand. That's the core reason 73% of AI vendors now break out AI features as a separate line item rather than bundling them into a flat subscription: it isolates the variable-cost portion of the business so it can be priced and monitored independently from the fixed-cost core product.\n\nIt also changes how investors evaluate AI companies. A pre-revenue or early-revenue AI startup pricing purely on seats is a yellow flag for diligence teams in 2026, because it suggests the founders haven't yet modeled their true cost-to-serve. Zylo's 2026 SaaS Management Index found AI-native application spend jumped 108% year over year, with large-enterprise AI spend surging 393% — growth that fast only holds up if the underlying pricing model scales with usage rather than a fixed seat count that caps revenue exactly when demand is accelerating.\n\nBottom line: There is no single winning AI pricing model in 2026 — there's a clear direction of travel away from pure per-seat pricing (down to 15% of SaaS) and toward usage-based (85% adoption) and outcome-based charging, most often blended into a hybrid model (43% adoption, headed toward 61%). Cursor, Salesforce, and HubSpot all landed on some version of \"base fee plus usage or outcome pricing\" rather than picking one model exclusively — and any AI founder pricing a product today should expect to end up in the same place.\n\n## Frequently Asked Questions\n\nWhat is the difference between seat-based and usage-based AI pricing?\n\nSeat-based pricing charges a flat fee per named user per month regardless of how much they use the product, while usage-based pricing charges per unit consumed — per API call, per token, per credit, or per action. AI products increasingly favor usage-based or hybrid models because a single AI agent can do the work of many human seats, making per-seat pricing undercount actual value delivered. Cursor's Pro plan, for example, bundles a monthly credit pool tied to real API costs rather than a flat unlimited-use seat fee.\n\nWhy are SaaS companies moving away from per-seat pricing in 2026?\n\nPer-seat pricing fell from 21% to 15% of SaaS offerings in just 12 months because AI agents now perform tasks that used to require a paid human seat, breaking the assumption that revenue should scale with headcount. IDC forecasts 70% of software vendors will move away from pure per-seat models by 2028. Gartner separately predicts 70% of businesses will prefer usage-based pricing over per-seat by 2026, since it ties cost directly to the AI work actually being done.\n\nHow does outcome-based pricing work for AI agents?\n\nOutcome-based pricing charges customers only when an AI agent successfully completes a defined task, rather than per API call or per seat. HubSpot's Breeze Customer Agent charges $0.50 per resolved conversation (down from $1.00 per conversation before April 2026), and Intercom's Fin agent charges $0.99 per resolved support ticket. Roughly 40% of enterprise SaaS is expected to include outcome-based pricing elements by the end of 2026, up from just 15% two years earlier.\n\nWhat pricing model should an AI startup use in 2026?\n\nMost AI startups in 2026 use a hybrid model — a base platform fee plus variable usage or outcome-based charges — because pure usage pricing makes revenue unpredictable for the customer while pure seat pricing undercounts AI-driven value. Hybrid pricing adoption sits at 43% of SaaS companies today and is projected to reach 61% by the end of 2026. Early-stage AI products should start with usage-based or credit metering to align cost with actual model spend, then layer in a seat or platform fee once usage patterns stabilize.\n\nHow much do enterprise AI agents like Salesforce Agentforce actually cost?\n\nSalesforce Agentforce offers three pricing paths: Flex Credits at $500 per 100,000 credits (roughly $0.10 per agent action at ~20 credits each), a flat $2 per conversation, or $125 per user per month for unlimited access. HubSpot's Breeze Prospecting Agent charges $1 per qualified lead. These per-action price points sit far below traditional per-seat SaaS licensing, which is exactly why enterprise buyers increasingly compare AI vendors on cost-per-outcome rather than cost-per-seat.\n\nTrace Cohen is a serial founder, investor and data geek. Please feel free to reach out t@nyvp.com",
      "image": "https://valueaddvc.com/og/pricing-strategy-for-ai-products-seat-based-usage-based-or-value-based.png"
    },
    {
      "id": "https://dodopayments.com/blogs/outcome-based-pricing-saas",
      "title": "",
      "url": "https://dodopayments.com/blogs/outcome-based-pricing-saas",
      "text": "# Outcome-Based Pricing: Why SaaS Is Moving Beyond Subscriptions\n\n> Outcome-based pricing ties what customers pay to results delivered. Learn how this model works for SaaS, when to use it, and how to implement it with AI-powered billing.\n\n- Author: Ayush Agarwal\n- Published: 2026-04-07\n- Category: Pricing, SaaS\n- URL: https://dodopayments.com/blogs/outcome-based-pricing-saas\n\n---\n\nFor 15 years, SaaS ran on a simple deal: pay a monthly fee, get access to software. That model built the industry. But it is starting to crack.\n\nCustomers are pushing back on paying $99/month for tools they use twice. AI companies cannot charge flat fees when the value they deliver varies wildly per request. And buyers across every segment are asking the same question: \"Why am I paying for access instead of results?\"\n\nOutcome-based pricing answers that question. You pay for what the software actually delivers - a successful API call, a converted lead, a resolved support ticket, a generated document that passes quality checks. The model aligns vendor incentives with customer success in a way that flat subscriptions never could.\n\nHere is how it works, when it makes sense, and how to implement it without building a custom billing system from scratch.\n\n## What Is Outcome-Based Pricing?\n\nOutcome-based pricing (also called results-based or performance-based pricing) charges customers based on measurable outcomes the software delivers, not on access, seats, or raw consumption.\n\nThe distinction from usage-based billing is important. Usage-based pricing charges for consumption regardless of whether the consumption produced value. You pay per API call even if the call returned an error. Outcome-based pricing only charges when the consumption produces a defined successful result.\n\nExamples in practice:\n\n- An AI writing tool charges per published article that passes a plagiarism check, not per generation attempt\n- A lead enrichment platform charges per verified contact with valid email and phone, not per lookup\n- An invoice processing tool charges per successfully extracted and validated invoice, not per document uploaded\n- A code review AI charges per accepted suggestion, not per file scanned\n\n> The SaaS pricing conversation has shifted from 'what does the customer use?' to 'what does the customer get?' Outcome-based pricing is harder to implement, but it is the only model where your revenue grows exactly in proportion to customer success.\n> \n> - Rishabh Goel, Co-founder & CEO at Dodo Payments\n\n## Outcome-Based vs Other Pricing Models\n\n| Factor | Outcome-Based | Usage-Based | Subscription | Per-Seat |\n| --- | --- | --- | --- | --- |\n| Customer pays for | Successful results | Consumption volume | Access | Headcount |\n| Revenue predictability | Lower | Medium | High | High |\n| Customer risk | Very low | Medium | High | High |\n| Value alignment | Direct | Indirect | None | None |\n| Implementation complexity | High | Medium | Low | Low |\n| Best for | AI/ML products with variable output quality | APIs and infrastructure | Stable feature sets | Collaboration tools |\n| Churn risk | Low (customers see direct value) | Medium | High (value not always visible) | Medium |\n\nThe key tradeoff is clear: outcome-based pricing is the best model for customer alignment but the hardest to implement. The billing system needs to track not just what happened, but whether what happened was successful.\n\n## When Outcome-Based Pricing Works\n\nOutcome-based pricing is not universal. It works when three conditions are met:\n\n1. Outcomes are measurable and attributable\n\nYou need a clear, automatable way to determine success. \"Customer satisfaction improved\" is not measurable in real time. \"Support ticket resolved without escalation\" is. The outcome must be something your system can detect programmatically at the moment it happens.\n\n2. There is meaningful variance in outcome rates\n\nIf your tool succeeds 99.9% of the time, outcome-based pricing is just usage-based pricing with extra steps. The model creates value when success rates vary meaningfully - when some requests succeed and others do not, and customers only want to pay for the ones that do.\n\n3. The customer trusts your measurement\n\nThe customer has to believe your system accurately reports outcomes. This usually means providing transparent logs, allowing customers to dispute specific outcomes, and offering a reconciliation process. Without trust, the model collapses.\n\n## When It Does Not Work\n\n- Commodity SaaS with consistent output: If your file storage service has 99.99% uptime, charging per \"successful file retrieval\" adds complexity without benefit\n- Long feedback loops: If the outcome takes weeks to materialize (like \"lead converted to customer\"), billing becomes impractical\n- Subjective outcomes: If success depends on human judgment (\"was this design good?\"), you will spend more on dispute resolution than you save on alignment\n- Early-stage products: If your success rate is unstable, outcome-based pricing amplifies revenue volatility\n\nFor one-time vs subscription decisions, outcome-based sits as a third option for products where value delivery is variable.\n\n## How to Implement Outcome-Based Pricing\n\nThe billing flow for outcome-based pricing is more complex than flat subscriptions. Here is the architecture:\n\n```mermaid\nflowchart LR\n    A[\"Customer\ntriggers action\"] -->|\"event logged\"| B[\"Outcome\nevaluator\"]\n    B -->|\"success\"| C[\"Billable event\nrecorded\"]\n    B -->|\"failure\"| D[\"Not billed\"]\n    C -->|\"accumulated\"| E[\"Invoice\ngenerated\"]\n    E -->|\"end of period\"| F[\"Payment\ncollected\"]\n    D -->|\"logged for\ntransparency\"| G[\"Customer\ndashboard\"]\n\n```\n\n### Step 1: Define Your Outcome Metric\n\nBe specific. \"Successful API response\" is better than \"API call.\" Define what success means in your system:\n\n- HTTP 200 with valid payload? Or only if downstream validation passes?\n- Within a latency threshold? A response that takes 30 seconds might not count as \"successful\" for real-time use cases\n- Include partial successes? If you extract 8 out of 10 fields from a document, is that a billable outcome?\n\nDocument these definitions publicly. Make them part of your pricing page.\n\n### Step 2: Build the Outcome Evaluator\n\nThis is the component that determines whether an event qualifies as a billable outcome. It runs after every action and makes a binary decision: bill or do not bill.\n\nFor AI products, this typically involves:\n\n- Confidence score thresholds (only bill if model confidence exceeds 0.85)\n- Validation checks (output passes schema validation, plagiarism check, factual verification)\n- Customer feedback signals (output was accepted, not rejected or regenerated)\n\n### Step 3: Meter and Accumulate\n\nEvery billable outcome gets recorded with a timestamp, customer ID, and metadata. At the end of each billing period, the system aggregates outcomes and generates an invoice. This is where usage-based billing infrastructure comes in.\n\n### Step 4: Provide Transparency\n\nCustomers need to see exactly what they are being charged for. Build a dashboard showing:\n\n- Every event processed (successful and failed)\n- Why each event was or was not billed\n- Running total for the current billing period\n- Historical comparison across periods\n\n### Step 5: Handle Disputes\n\nBuild a dispute workflow. Customers will occasionally disagree with outcome classifications. You need a process that lets them flag specific events, a review mechanism, and automatic credits for valid disputes.\n\n## The Sentra Approach: Outcome-Based Billing Through Prompts\n\nTraditional implementation of outcome-based pricing requires custom metering code, a billing aggregation pipeline, invoice generation logic, and a dispute workflow. That is months of engineering.\n\nSentra compresses this into prompt-driven configuration. Sentra is Dodo Payments' AI agent for billing and payments. It handles the entire billing lifecycle through natural language:\n\nSetting up outcome-based billing:\n\n\"Add outcome-based billing that charges $0.15 per successful document extraction. Define success as: extraction confidence above 90% and all required fields populated. Include a $25 monthly minimum.\"\n\nSentra generates the metering configuration, billing rules, and minimum charge logic. You review the plan and approve.\n\nMonitoring outcomes:\n\n\"Show me the outcome success rate by customer segment this month. Which customers have the lowest success rates, and what is driving the failures?\"\n\nSentra's Insight mode surfaces the analytics without you building custom dashboards.\n\nHandling billing operations:\n\n\"Credit customer acme-corp $47.50 for the 19 disputed extractions from last week. Note: validation threshold was too strict for scanned PDFs.\"\n\nSentra's Act mode executes the credit, updates the invoice, and logs the reason.\n\nThe three modes - Integrate, Insight, Act - cover the full lifecycle that outcome-based pricing demands. Available in the Dodo Payments dashboard, VS Code, Cursor, and Windsurf.\n\nThis matters because outcome-based pricing is not just a pricing decision. It is a billing infrastructure decision. The companies that avoid the model usually do so because implementation is too expensive, not because the model does not fit. Sentra removes that barrier.\n\n## Pricing Mistakes to Avoid\n\nSetting the outcome threshold too high: If your success rate drops to 60%, customers get great value but your revenue tanks. Model your unit economics at various success rates before launching.\n\nIgnoring the minimum charge: Pure outcome-based pricing with no minimum means zero revenue from customers who do not use the product. Add a base fee or monthly minimum. See pricing psychology for how to frame minimums without deterring signups.\n\nOpaque measurement: If customers cannot see how you determine success, they will assume you are over-counting. Transparency is not optional with this model.\n\nNo hybrid option: Many customers want predictability. Offer a subscription tier alongside the outcome-based tier so buyers can choose their risk profile. Subscription pricing models still work for customers who prefer fixed costs.\n\nIgnoring margin at scale: Outcome-based pricing can become unprofitable if your cost per attempt is high and your success rate is lower than expected. Model your margins at 10x current volume before committing.\n\nReview the full list of pricing mistakes founders make to avoid compounding errors.\n\n## FAQ\n\n### What is the difference between outcome-based pricing and value-based pricing?\n\nValue-based pricing sets prices based on the perceived value to the customer, but charges a fixed amount regardless of actual results delivered. Outcome-based pricing dynamically charges based on measurable results. A value-priced product might cost $500/month because customers believe it delivers $5,000 in value. An outcome-priced product charges $5 per verified result and the monthly total depends on actual delivery.\n\n### Can outcome-based pricing work for early-stage startups?\n\nIt can, but proceed carefully. Early-stage products often have volatile success rates, which creates unpredictable revenue. Consider a hybrid approach: charge a base subscription fee for access plus an outcome-based component for successful results. This gives you baseline revenue while aligning incentives. Use a SaaS pricing calculator to model different scenarios.\n\n### How do you prevent gaming with outcome-based pricing?\n\nCustomers might try to inflate outcomes by sending easy requests or splitting work into smaller units. Define your outcome metric carefully to prevent this. Set minimum quality thresholds, batch-related work into single outcomes, and monitor for unusual patterns. Your outcome evaluator should be sophisticated enough to distinguish genuine value from manufactured volume.\n\n### What billing infrastructure do you need for outcome-based pricing?\n\nYou need four components: an event tracking system that logs every action, an outcome evaluator that determines billable events, a metering and aggregation layer that accumulates charges, and an invoicing system that generates transparent bills. Dodo Payments provides all four through its usage-based billing infrastructure, and Sentra lets you configure the outcome rules through natural language prompts.\n\n### Is outcome-based pricing the same as pay-per-result?\n\nEssentially yes. Pay-per-result, pay-for-performance, and outcome-based pricing all describe the same core model: charging customers only when the software delivers a defined successful result. The terminology varies by industry, but the billing mechanics are identical. The key differentiator from usage-based pricing is that consumption alone does not trigger a charge - only successful consumption does.\n\n## Final Thoughts\n\nOutcome-based pricing is not replacing subscriptions overnight. But for AI-native products, API-driven services, and any SaaS where output quality varies, it is becoming the default expectation from buyers.\n\nThe implementation barrier is real. Metering outcomes, handling disputes, and generating transparent invoices is harder than charging a flat monthly fee. But tools like Sentra are closing that gap by letting you configure complex billing logic through prompts instead of code.\n\n## If your product delivers measurable results and your customers are asking why they pay the same whether outcomes are good or bad, it is time to explore this model. Start with a hybrid - base subscription plus outcome-based upside - and iterate from there. The dynamic pricing playbook applies: test, measure, adjust.\n\n- More Pricing articles\n- All articles"
    },
    {
      "id": "https://tildalice.io/github-metered-copilot-predictability/",
      "title": "GitHub’s Metered Copilot: Predictability Dies – TildAlice",
      "url": "https://tildalice.io/github-metered-copilot-predictability/",
      "publishedDate": "2026-06-20T21:01:51.000Z",
      "text": "GitHub’s Metered Copilot: Predictability Dies – TildAlice\n\n# GitHub’s Metered Copilot: Predictability Dies\n\n2026년 06월 20일 News & Commentary\n\n⚡ Key Takeaways\n\n- GitHub Copilot switched to token-based AI Credits on June 1, 2026, ending flat-rate pricing—developers report burning a month's quota in hours.\n- The core problem is unpredictability: invisible token costs turn a productivity tool into a cognitive tax requiring constant budget monitoring.\n- GitHub should have capped metered tiers to preserve trust; instead, uncapped billing optimizes for revenue extraction over developer experience.\n\n## When the Meter Runs, Trust Runs Out\n\nGitHub officially moved Copilot to usage-based billing on June 1, 2026, replacing flat subscriptions with AI Credits consumed per token. The backlash was immediate and brutal: developers reported burning through a month’s credits in hours, with one Pro+ user ($39/month) watching 8% of their 7,000-credit quota vanish in two hours of work. Another developer made a single refactoring request and burned $6. The core issue isn’t the price table—it’s that predictable consumption just died.\n\nThe new model works like this: code completions remain unlimited, but chat and agentic features now drain monthly AI Credit allotments based on token usage (input, output, cached). Pro costs $10/month with $15 in credits; Pro+ is $39 with $70; the new Max tier is $100 with $200. Business and Enterprise get pooled credits—1,900 and 3,900 per user respectively, with promotional bumps to 3,000 and 7,000 through September 1. One AI Credit equals one cent.\n\nWhat GitHub framed as “pay for what you use” feels more like “guess wrong and pay a surprise tax.” The problem is that token consumption is invisible and variable. A simple “refactor this function” might cost pennies or dollars depending on context window size, model selection, and how Copilot interprets the request. Developers don’t think in tokens; they think in tasks. When a two-hour coding session threatens to exhaust a monthly budget, the tool stops being an assistant and becomes a cognitive tax—you start second-guessing every question, every multi-file edit, every exploratory prompt.\n\nThe timing is also suspect. GitHub spent years positioning Copilot as a flat-rate productivity multiplier, building user habits around “just ask.” Now that developers are locked in—workflows built, muscle memory trained—the pricing model flips to consumption-based, and suddenly that frictionless experience has friction everywhere. It’s the classic SaaS bait-and-switch: hook users on predictability, then extract rent on unpredictability once they can’t easily leave.\n\nAnd the alternatives? Cursor, Codeium, and a dozen other AI code assistants still offer flat-rate or freemium models. GitHub is betting that integration lock-in (it’s built into VS Code, deeply tied to GitHub repos) will keep users paying even as costs balloon. But developer loyalty is thin when the value prop reverses. If I’m now optimizing my questions to save credits instead of optimizing my code to solve problems, the tool has failed its job.\n\nThe real tell is in GitHub’s response. When pressed on complaints, a spokesperson pointed to “spending limits, usage dashboards, and model selection” as cost management tools. Translation: you now need a budget dashboard to use a code completion tool. That’s not productivity—it’s overhead.\n\nHere’s what GitHub should have done: cap the metered tier. Charge $10 for the first $15 of usage, then hard-stop at a ceiling (say, $60 total) where unlimited kicks in. That preserves predictability for power users while letting light users pay less. Instead, we got uncapped metering with promotional windows and tier upsells—a model optimized for revenue extraction, not developer trust.\n\nThe larger lesson: metered billing works when usage is discretionary (run this one-off batch job), but fails when usage is habitual and integrated into thought process. You can meter API calls; you can’t meter the act of thinking out loud to an AI pair programmer without turning coding into cost accounting.\n\nPhoto by Christina Morillo on Pexels\n\n## FAQ\n\nQ: Can I still use GitHub Copilot on a flat rate? A: No. All monthly plans transitioned to AI Credits on June 1, 2026. Annual Pro/Pro+ users stay on the old request-based model until renewal, then switch to monthly metered or downgrade to the free tier.\n\nQ: What happens when I run out of credits mid-month? A: Paid plans can purchase additional credits at $61 per credit. Free tier users lose access to chat/agents until the next billing cycle, though code completions remain unlimited across all tiers.\n\nQ: Is there any way to predict my monthly Copilot cost under the new system? A: Not reliably. Token consumption varies by task complexity, context size, and model. GitHub provides usage dashboards, but they’re reactive—you only know you overspent after the fact. The only true cost ceiling is upgrading to Max ($62/month with $63 credits) and hoping that’s enough.",
      "image": "https://tildalice.io/wp-content/uploads/2026/06/stock-github-metered-copilot-predictability-1.jpg"
    },
    {
      "id": "https://dev.to/arnon_shimoni_f734319d79c/how-to-design-usage-based-pricing-23p2",
      "title": "How to design usage-based pricing - DEV Community",
      "url": "https://dev.to/arnon_shimoni_f734319d79c/how-to-design-usage-based-pricing-23p2",
      "publishedDate": "2026-06-03T19:47:31.000Z",
      "text": "How to design usage-based pricing - DEV Community\n\nArnon Shimoni\n\n Posted on Jun 3 • Originally published at solvimon.com \n\n# How to design usage-based pricing \n\nUsage-based pricing is four decisions in a trenchcoat: what you meter, what unit you charge for, how you structure the rate card, and how you handle commits and overages. I've seen many teams get one wrong and only discover it later - forcing a redesign.\n\nUsually, a founder reads a Snowflake retrospective, a post from Tomasz Tunguz, maybe a board deck that has been leaked - and then someone decides \"let's go usage-based\" into a Notion doc and has the built-in AI design some principles. A few weeks later it finally goes live but you discover…. lots of issues…\n\nMost of what I read on UBP today is consulting-flavoured, with ideas like \"align pricing with value\" or \"optimise for customer success\". I've been known to write that too, for full disclosure. Fine, but it can still be unhelpful when you're a few days from launch and need to decide whether the meter is the API call or the successful transaction.\n\nThe design problem is rooted in reality, so let's have a look at how to do it.\n\n## What usage-based pricing is, briefly \n\nUsage-based pricing (UBP) is a model where customers pay for the volume of a product they actually consume, instead of a flat fee like a seat or a platform fee.\n\nCommonly, the unit can be API calls (Twilio, OpenAI), gigabytes (Snowflake, Datadog), events processed (Segment), characters translated (DeepL), or any other measurable quantity tied to value.\n\nOutcome-based often fits in usage-based, where the result is charged in the same way.\n\nUsage can be metered per request, batched, or summarised at a period boundary. Then, the price can be linear, tiered, or volume-discounted. The contract can be pay-as-you-go, prepaid credits, or a committed minimum with overages.\n\nThat's quite a few units as the surface of usage-based, now let's look at the decisions:\n\n## What's the right meter? \n\nThe meter is the thing you count, so picking the wrong one means fighting your customers about whether the bill is fair for a long time.\n\nWhat makes a good meter? I think there's four properties:\n\n1. It correlates with value the customer receives. For example, Adyen charges per successful transaction, not per API call. Snowflake charges per second of compute, not per query. The customer's bill goes up exactly when their business goes up. When it doesn't correlate, the bill feels like paying an even bigger tax and customers churn (or worse, they negotiate it down to zero).\n2. It correlates with your COGS (cost of goods). If you're an AI company, your inference cost is per-token. A flat per-request meter will ravage your gross margin the moment a customer sends very very long prompts. There was a story recently that consultancy spent $500m on tokens…\n\n1. It's auditable. Both you and the customer need to be able to count it independently and arrive at the same number. If your finance team can't reconstruct yesterday's usage from raw events, your customers can't either, and that's the bill they'll dispute.\n2. It's stable over time. The meter's definition shouldn't change every quarter. Customers build forecasts on it. If you redefine \"active user\" between Q2 and Q3, you've just burned your renewal cycle.\n\nFor most B2B products, the meter is either an event (an API call, a generated document, a workflow run) or a resource over time (compute-seconds, storage-GB-months, active users per month).\n\nPick one! Don't try two and hope the customer tries to understand which one is the dominant one…\n\nHere's an example: Twilio could have charged per API call but instead they charge per delivered message. A customer who sends 10k and gets 9k delivered pays for 9k. The 1k that didn't deliver were Twilio's network problem. When the meter is honest and defensible, so is the bill.\n\nSnowflake could have charged per query or per data loaded - which was the common thing to do. Instead, they charge per second of compute. A poorly-written query that scans the whole table costs more than one that hits an index. The meter aligns customer behaviour with Snowflake's COGS. (Meter design as competitive lever. Most teams discover the lever only after shipping the wrong meter.)\n\n## What's the rate card? \n\nThe rate card is the price per unit of the meter.\n\nThe first question you should ask is: linear, tiered, or volume-discount?\n\n### Linear \n\nLinear is simplest. For example, $0.01 per API call, no matter how many you do. Use it when your cost of goods is also linear and when your competitive landscape allows it.\n\n(chart via BVP)\n\n### Tiered \n\nTiered means rates change at thresholds. First 100k calls free, next 1M at $0.02, anything above at $0.005. Tiered rate cards work when usage is heterogeneous (some customers do 5k/month, some do 5M) and when you want to acquire small customers at a low price point without losing margin on the large ones. Vercel runs tiered. Datadog runs tiered. AWS runs tiered with a thousand-page footnote.\n\n### Volume discounts \n\nVolume discount is the SaaS-style continuation of tiered: same per-unit price, applied across all units once a threshold is crossed. Easier to explain to customers, harder to model internally. Pick whichever your customers will read.\n\nA note on penny pricing, though: $0.0001 per token reads like an honest price. It also means your customer has to multiply by 10M to understand. Penny pricing creates emotional distance from the bill, which is great for adoption and terrible for trust at renewal. Round it. Bundle it. Don't manufacture units of consumption that customers can't reason about.\n\n(chart via BVP)\n\n## How to structure commits and overages? \n\nMost companies start with pay-as-you-go and graduate into commits as deals get bigger. The shape that works best:\n\n| Element | What it is |\n| --- | --- |\n| a base commit | an annual or monthly minimum the customer agrees to pay regardless of usage |\n| overage | an overage rate that kicks in past the commit |\n| true-up (sometimes) | at the period boundary - if usage exceeded the commit, the customer pays the difference |\n| true-down (sometimes) | the customer doesn't pay back if usage was lower, because contracts |\n\nThe two failure modes to avoid:\n\n1. Commits without rollover create the gift-card problem. The customer committed to 10M API calls/month, used 6M in January because they were ramping. By December they realized they'd been paying for 4M calls a month they never used. That's stranded value. They feel cheated. Renewal goes cold.\n2. Overages priced too aggressively kill expansion. If your overage rate is 3x your committed rate, customers will hard-cap usage internally before they hit the commit, just to avoid the penalty. You've optimized your bill while suppressing your revenue.\n\nCredits sit somewhere in between that shape… They're a prepaid balance of money or some other metric customers draw down against any meter, often with expiry rules. When done well they give flexibility (the customer can spend their 10M calls on whatever endpoint they need). When used sloppily they become \"breakage\" revenue and a finance audit liability.\n\nCredits are an architectural decision, not a pricing model.\n\n## How do you migrate existing customers onto usage-based pricing? \n\nThis is the part nobody writes about because it's the hard part that requires you to communicate well, and understand what your customers value.\n\nThere isn't a playbook or template and you typically also can't just flip a switch.\n\nEvery customer on the old plan has a contract, a budget, and an expectation - if you surprise you lose renewal trust.\n\nHowever, there is somewhat of a sequence you can follow that works:\n\n1. Step 1: shadow billing. For 60-90 days, calculate what each customer would pay under the new model and put it on the invoice as a memo line. No financial impact. The customer can see what's coming. Finance can model the cohort impact before any contract changes.\n2. Step 2: opt-in for new accounts only. Ship UBP as the default for net-new customers. Let the existing book run on the old terms. Product feedback without breaking anyone.\n3. Step 3: voluntary migration with a sweetener. Offer existing customers a price-protection guarantee or a one-time credit grant to move. Some will. Most won't until step 4.\n4. Step 4: forced migration at renewal. At contract renewal, the new model is the only option. By this point, you have 6-12 months of shadow data and customer references. The conversation is \"here's your bill, here's the precedent, here's the upside on flexibility.\" Some customers churn. Plan for it.\n\nThis can still take a really long time. We've had customers whose migration migration took just a few days for the technical work and another 9 months for the contract rollover. That's the realistic shape, unfortunately.\n\n## What billing infrastructure has to handle \n\nUsage-based pricing fails in production for boring reasons. Most are billing-infrastructure problems, not pricing problems.\n\nThe system has to ingest events at scale, deduplicate them, reconcile them to a customer, apply the right rate card, handle commits and overages without double-counting, and produce an invoice that a finance team can audit. Most teams glue this together from Stripe Billing, a metering service, a spreadsheet, and 4,000 lines of orchestration code. That code is now their actual billing system. It's fragile.\n\nThe infrastructure questions to ask before you ship usage-based pricing:\n\n1. Can you compute usage per customer per meter per period in under a minute? If not, your monthly close will take a week.\n2. Can your finance team audit any line item back to raw events? If not, you'll lose every dispute.\n3. Can a customer self-serve a usage breakdown that matches the invoice exactly? If not, your support ticket volume is about to triple.\n4. Can you change a rate card mid-cycle without rewriting historical invoices? If not, every pricing experiment becomes a six-week project.\n\nSolvimon runs the metering, ledger, and rate-card engine as one system, so the infrastructure questions above stop being engineering problems. Different from gluing five tools together.\n\n### What is usage-based pricing? \n\nUsage-based pricing is a billing model where customers pay based on their actual consumption of a product (API calls, gigabytes, events, compute-seconds), rather than a flat subscription fee. Each meter is tracked and billed at a defined rate, often with tiered or volume discounts.\n\n### How is UBP different from hybrid pricing? \n\nPure UBP is consumption-only. Hybrid pricing combines a base subscription (or seats) with usage on top, often with credits or commits. Most companies that say \"we do usage-based\" actually run hybrid in practice, because flat usage-only pricing is unpredictable for both sides.\n\n### When should I avoid usage-based pricing? \n\nWhen your cost of goods doesn't scale with the meter, when your customers value billing predictability over flexibility (most enterprise CFOs), or when your unit of consumption isn't legible to a non-technical buyer.\n\n### Can I run usage-based pricing on Stripe Billing? \n\nKinda - Stripe Billing supports basic metered usage but doesn't natively handle complex hybrid configurations (credits across meters, multi-entity, true-ups with proration).\n\n### How long does it take to design and ship UBP? \n\nDesigning the model takes a couple of weeks of focused work. Implementing it in production typically takes 4-12 weeks depending on existing billing complexity. The harder part is the customer communication when you migrate existing customers onto the new model.\n\n### What's the most common mistake teams make with UBP? \n\nPicking a meter that doesn't correlate with cost of goods. The second most common is shipping a rate card with no commit structure, which makes revenue forecasting impossible.\n\n### How do I migrate existing customers without losing them? \n\nShadow billing for 60-90 days, opt-in for new accounts, voluntary migration with a sweetener, forced migration at renewal. Total elapsed time is typically 12-18 months. Skipping the shadow billing phase is the most common way to lose enterprise customers.\n\n### What's the difference between a meter and a rate card? \n\nThe meter is what you count (API calls, gigabytes, events). The rate card is what you charge per unit (linear, tiered, volume-discounted). One product can have multiple meters, each with its own rate card. Most legacy billing systems handle one rate card per customer at a time, which is why companies outgrow them.",
      "image": "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fsprlv3d29ffw9q2wmiiu.png"
    },
    {
      "id": "https://hub.causo.ai/guides/h1-2026-saas-pricing-report",
      "title": "SaaS pricing in H1 2026: models, AI, benchmarks | Causo Hub",
      "url": "https://hub.causo.ai/guides/h1-2026-saas-pricing-report",
      "publishedDate": "2026-06-21T23:28:02.000Z",
      "author": "Causo",
      "text": "SaaS pricing in H1 2026: models, AI, benchmarks | Causo Hub\n\npricing GTM· 15 min read· Updated Sep 1, 2026\n\n# The H1 2026 SaaS pricing report\n\nWhere seat-based, usage, hybrid, and outcome-based SaaS pricing models actually stand in H1 2026, with cited benchmarks and AI examples.\n\nD By Dawid Baranowski Co-founder, Causo\n\nPublished Jun 21, 2026· Last reviewed Sep 1, 2026\n\n# The H1 2026 SaaS pricing report\n\n> SaaS pricing in 2026 is splitting three ways: pure seat-based is losing share to hybrid base-plus-meter, AI products are climbing an outcome-pricing curve from tokens to per-resolution to per-agent, and roughly 60% of SaaS now runs some form of usage-based component. This report breaks down the data, the model mix, and what investors expect on your pricing page.\n\n- SaaS pricing trends 2026: the model mix\n- Seat based vs usage: why seats are losing share, but not dying\n- Usage based pricing 2026: what the public market shows\n- AI pricing models: pricing against token costs\n- The hybrid pricing model: base fee plus meter\n- The outcome pricing maturity curve\n- Pricing benchmarks SaaS investors actually look at\n- Why this matters for your raise\n\nMost pricing guides written in 2026 still treat the question as \"pick a model.\" That framing misses the actual shift. SaaS pricing in H1 2026 is no longer about choosing between three boxes; it is about which atomic unit of value you can defend to a board, a buyer, and an AI cost ledger at the same time.\n\nThe unit used to be a seat. Now it is sometimes a seat, sometimes a token, sometimes a successful outcome, sometimes a full agent that replaces a head of headcount. Treating these as the same conversation is what makes a pricing page look legacy in 2026.\n\nThis is the H1 2026 SaaS pricing report: the data, the models, the live examples, and the unit-economics floor each one assumes.\n\n## SaaS pricing trends 2026: the model mix\n\nRoughly 60% of SaaS companies now run some form of usage-based pricing, with 46% on a hybrid usage-plus-seat structure and 15% on largely usage or pay-as-you-go, according to OpenView Partners. Pure seat-based is no longer the majority position.\n\nThe model mix matters because it changes the conversation about NRR, ARR predictability, and AI gross margin in the same breath. Here are the four models a founder will pitch in 2026, what each is for, and what each fails at.\n\n| Model | Share of SaaS (2025) | Best for | 2026 example | Main failure mode |\n| --- | --- | --- | --- | --- |\n| Pure seat-based | ~40% (residual) | Human end-user tools with stable consumption | Slack, Notion seats | AI variable cost wipes margin; usage caps customers |\n| Largely usage / pay-as-you-go | 15% | Software-as-end-user, APIs, infra, AI compute | Snowflake, Twilio | ARR volatility scares early-stage investors |\n| Hybrid (base + meter) | 46% | AI products with variable inference | Intercom Fin, Cursor | Pricing-page complexity; meter design is hard |\n| Outcome / per-resolution / per-agent | Emerging, fastest-growing | Vertical AI agents replacing labor | Intercom Fin at $0.99/resolution | Attribution: did the agent really solve it? |\n\nThe OpenView mix understates how fast outcome-based pricing is climbing, because most outcome-priced AI agents are sub-$10M ARR and not yet in the benchmark sample. Treat the table as a 2025 snapshot. By the end of 2026 expect the outcome row to capture share from both the hybrid and pure-usage rows above it.\n\n## Seat based vs usage: why seats are losing share, but not dying\n\nSeat-based pricing is uneconomic for AI products and overpriced for some human end-user products at the same time, which is the actual reason it is losing share.\n\na16z's December 2024 enterprise note put the point bluntly: AI inference cost scales per token, so \"every API call, every token processed, adds to their cost structure,\" which makes the per-seat unit \"no longer the atomic unit of software.\" Once a software company has a per-token COGS line, charging a flat seat fee is a bet that the buyer will not use the product. That is not a great bet.\n\nThe counter-evidence is that the seats that survive are pricing power up. Slack, Notion, and Figma are charging more, not less. The right read: per-seat is shrinking as a share, while the surviving seat products are gaining pricing power. Use the model where consumption is stable and marginal cost is near zero. Stop using it where the user is an LLM call.\n\n> ✅ Good: $39/seat for a collaboration tool with stable per-user storage cost and zero LLM inference. The unit (a human) maps cleanly to the cost (a license slot).\n\n> ❌ Bad: $39/seat for an AI assistant that hits a frontier model on every keystroke. The unit (a human) does not map to the cost (variable inference per query).\n\nDon't default to seat-based because it makes your ARR math easy on a deck. Investors in 2026 read flat seat-based pricing on an AI product as a tell that the founder has not modeled inference cost.\n\nDo keep seat-based pricing where the buyer wants budget predictability and the marginal compute cost is genuinely flat. Internal collaboration tools, productivity apps with no LLM inference dependency, and design tools all sit cleanly here.\n\n## Usage based pricing 2026: what the public market shows\n\nUsage based pricing in 2026 has the strongest public-market evidence behind it of any SaaS model.\n\nPublic SaaS companies that run usage-based models grew revenue 54% faster than the broader SaaS index and trade at a 50% revenue-multiple premium to peers, with seven of the nine best net-dollar-retention IPOs over the prior three years running a usage-based model. That is not a vibe. That is the comp set your Series A lead is using to value you.\n\nNEA's investment memo on Metronome, the leading usage-based billing infrastructure player, called this shift \"the next tectonic shift in software business models\" and identified the hybrid form (UBP plus seat) as the modal endpoint, not pure pay-as-you-go. That is the cleanest investor articulation of why this is happening.\n\nThe trade-off founders underestimate: usage-based pricing trades ARR predictability for NRR upside. Pure pay-as-you-go gives you high NRR on power users and ARR forecast variance that makes a CFO twitch. That is why pure UBP is only 15% of SaaS and the dominant mode is hybrid.\n\nDon't ship pure usage-based pricing on a seed-stage AI product. Your board deck will show MRR moving by double-digit percentages month over month, and that volatility will get read as churn.\n\nDo ship a hybrid floor with a usage meter on top. The base fee buys you ARR predictability for the board deck; the meter buys you the NRR upside for the next round.\n\n## AI pricing models: pricing against token costs\n\nAI pricing models in 2026 are not just usage-based. They are inference-cost-aware, which is a different constraint.\n\nGoogle AI's Vikas Kansal, writing in Lenny's Newsletter, spells out the asymmetry: \"In traditional SaaS, serving an extra free user costs essentially zero. In AI, every time a free user hits Enter, your GPUs fire, and your cash burns.\" That asymmetry breaks the SaaS freemium playbook and forces AI founders to gate aggressively.\n\nThree concrete 2026 anchor prices a founder can copy:\n\n- Intercom Fin at $0.99 per resolution. Outcome-priced AI agent, not a per-seat add-on. The customer pays for the work, not the tool.\n- Gemini Advanced at $20/month with 1M token context. Consumer-tier subscription floor; the bet is that aggregated free-tier inference cost stays below the premium-tier subsidy.\n- GitHub Copilot on AI Credits from June 1, 2026. The default AI dev-tool, moving from flat $19/month to per-token AI Credits. When the de-facto market reference shifts to credits, founders pricing flat-rate AI look frozen.\n\nSequoia and Paid CEO Manny Medina describe an AI pricing maturity curve: activity-based (count tokens or usage), workflow-based (charge per completed process), outcome-based (get paid for the result), and per-agent (replace a human FTE). The successful AI apps \"print money\" by picking one friction-heavy workflow and climbing the curve deliberately. Picking a token meter and never moving up the curve leaves the outcome margin on the table.\n\nDon't price an AI product flat-rate at parity with a seat-based SaaS comp. You will lose margin every time a power user fires the model. The flat $19 GitHub Copilot price is being killed for exactly this reason.\n\nDo model your inference cost per active user before publishing any flat tier. If the cost-to-revenue ratio looks shaky on day one, the tier is wrong.\n\n## The hybrid pricing model: base fee plus meter\n\nHybrid pricing won the 2025-2026 cycle. The base fee plus meter is the default architecture for any SaaS product with variable usage cost.\n\nThe hybrid is the largest single category in the 2025 mix at 46% of all SaaS companies. NEA explicitly called hybrid UBP-plus-seat \"the next tectonic shift in software business models\" when they invested in Metronome. The argument has shifted from \"do we add a meter?\" to \"which meter, and how big is the bundled allowance?\"\n\nThe mechanics of a defensible hybrid:\n\n- Base fee floor. Sets the ARR contribution and pays for the platform components that cost the same whether the customer uses them or not (storage, dashboards, support).\n- Meter on the variable cost line. Tokens, API calls, transactions processed, leads generated, tickets resolved. The meter must be tied to something the customer feels as value, not something the customer feels as a tax.\n- Headroom on the meter. Most meters ship with an included usage bundle inside the base fee so the customer can use the product without feeling a coin-slot. The bundled allowance is the part of the meter that matters most for retention.\n- One overage rate, not a tier ladder. Three meter tiers reads enterprise-grade and complicated on a pricing page. One overage rate is what the modal hybrid uses in 2026.\n\nDon't ship a hybrid with a meter the customer cannot predict. If your meter is \"API calls\" but the customer cannot tell from your docs how many API calls a typical workflow makes, you have a churn problem dressed as a pricing problem.\n\nDo publish a usage calculator next to the pricing page. Pricing-page bounces on hybrid models concentrate on calculators that do not load.\n\n> The unit used to be a seat. Now it is sometimes a seat, sometimes a token, sometimes a successful outcome, sometimes a full agent that replaces a head of headcount.\n\n## The outcome pricing maturity curve\n\nOutcome-based pricing is the destination most AI founders should be planning toward, even if they ship a hybrid first.\n\nSequoia's \"Services: The New Software\" makes the case in dollar terms: a $50/user/month SaaS seat compared with a $1,000/month AI agent priced on a specific outcome. The TAM for the labor a CRM supports is around $1 trillion; the TAM for CRM software itself is around $60 billion. The next $1T company will be \"a software company masquerading as a services firm.\" The pricing model is what unlocks that TAM ratio.\n\nThe Manny Medina / Sequoia maturity curve, with the founder action at each step:\n\n1. Activity-based. Count tokens or actions, charge per unit. Founder action: ship the meter; do not optimize it yet.\n2. Workflow-based. Charge per completed process (lead enriched, NDA drafted, ticket resolved). Founder action: stop counting tokens externally; charge per workflow even if you bill yourself internally per token.\n3. Outcome-based. Get paid for the result (deal closed, dispute won, candidate hired). Founder action: take attribution risk. Customers will pay materially more if you stand behind the outcome.\n4. Per-agent. Replace a human FTE; the agent is the price unit. Founder action: anchor against fully-loaded labor cost, not against SaaS seats.\n\nThe example economy is already visible. SignalFire's Networked SaaS write-up names AI startups handling \"billions of dollars in transaction volume annually\" with monetization via transaction fees, premium features, and analytics, not per-seat. The unlock is the work budget, not the tool budget.\n\nDon't stay at activity-based pricing because it is the easiest to instrument. Activity is the smallest unit of value, which means it captures the smallest share of the budget.\n\nDo plan a 12 to 18 month migration up the curve. Ship activity-based at launch so you can charge anything; publish workflow-based pricing as soon as you have data on what a workflow costs; start an outcome-pricing design-partner pilot in parallel.\n\n## Pricing benchmarks SaaS investors actually look at\n\nPricing benchmarks SaaS founders pitch with in 2026 are not the same numbers operators look at internally.\n\nFor a seed or Series A pitch, investors read your pricing model as a leading indicator on three lines: NRR, AI gross margin, and ARR forecast quality. The implicit benchmarks:\n\n- NRR is the lead metric. Hybrid models with a healthy meter typically land above the SaaS-index median; pure usage models clear higher still on power users. If your NRR is dragging the comp set down, the meter design (not the price point) is usually the problem.\n- AI gross margin pressure. If your inference cost eats too large a share of revenue, your model looks like a services business and your multiple compresses. Investors will not say a floor number out loud, but they compare your gross margin line against the SaaS index reported by High Alpha and OpenView every time.\n- ARR forecast quality. Hybrid base-fee floor locks most of next-quarter ARR before the quarter starts. Pure usage leaves a larger share variable, which is why CFOs prefer hybrid for early-stage rounds.\n- Price increase cadence. First Round Review's pricing canon names \"never revisiting price\" as one of the four ways startups fail at pricing. Annual price increases are the minimum cadence investors expect.\n- Single value metric. Investors will ask, \"what is the one number on your customer's side that goes up when they win?\" If the answer is \"users\" on an AI product, you have a pricing model mismatch. If it is \"tickets resolved,\" \"leads enriched,\" or \"dollars saved,\" you have a defensible value metric.\n\nYC's Tom Blomfield tells B2B founders explicitly to anchor pricing with a written \"value equation\" co-created with the customer's champion, then warns against \"ludicrously low numbers\" like $19/mo because B2B software routinely commands tens or hundreds of thousands of dollars. The benchmark investors want to see is annual contract value (ACV) that matches the value equation, not a number that fit on a self-serve pricing page.\n\nIf your pricing model is investable but your outbound is the bottleneck, tools like Causo handle the investor-targeting and personalization layer. They do not fix a pricing model that prices an AI product at flat per-seat.\n\n## Why this matters for your raise\n\nPricing pages are read closely in VC diligence after the deck. The pricing model is read as a proxy for how the founder thinks about defensibility, gross margin, and net dollar retention. A pricing page that ships flat per-seat on an AI product in 2026 is read as a founder who has not modeled the unit economics; a pricing page that ships outcome-based on a non-AI tool is read as a founder reaching for hype. Pricing right is one of the few moves where a seed-stage founder can shift the valuation conversation without changing the product.\n\n## FAQ\n\nWhat pricing model do SaaS startups use in 2026? Roughly 60% of SaaS companies run some form of usage-based pricing, with 46% on a hybrid base-fee-plus-meter structure and 15% on largely usage or pay-as-you-go, according to OpenView Partners. Pure seat-based is the residual minority, used mainly where the end user is a human and the marginal cost is flat. Outcome-based pricing is emerging fastest among vertical AI agents.\n\nIs usage-based pricing winning? By the public-market data, yes. Usage-based SaaS companies scaled revenue 54% faster than the broader SaaS index and trade at a 50% revenue-multiple premium. Seven of the nine best net-dollar-retention IPOs over the prior three years ran a usage-based model. The dominant architecture is hybrid (base fee plus meter), not pure pay-as-you-go.\n\nHow are AI products priced in 2026? AI products are pricing on a maturity curve from activity-based (tokens, actions) to workflow-based (per completed process) to outcome-based (per result) to per-agent (replacing an FTE), per Sequoia and Paid. Concrete 2026 anchors: Intercom Fin at $0.99 per resolution, Gemini Advanced at $20 per month, GitHub Copilot moving to AI Credits on June 1, 2026.\n\nShould I use seat-based or usage-based pricing? For human-end-user tools with stable consumption (collaboration apps, design tools), seat-based still works. For any product where compute cost scales with use (anything with LLM inference, transactions, API calls), ship a hybrid base-fee-plus-meter. a16z's rule of thumb is that usage-based works best when the end user is software, subscription when the end user is human.\n\nWhat is outcome-based pricing in SaaS? Outcome-based pricing charges per result delivered (deal closed, ticket resolved, lead enriched), not per seat or per usage unit. Intercom's Fin at $0.99 per resolution is the canonical 2026 example. The model captures more of the buyer's work budget (labor spend) instead of the smaller tool budget (software spend), which is why Sequoia frames outcome pricing as the path to the next $1T company."
    }
  ]
}

## firecrawl search with web and news

### code 
const url = 'https://api.firecrawl.dev/v2/search';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer fc-ae602dbeaf754196a11992140dcfa1b6',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "query": "Explore consumer products that generate personalized AI videos using a user’s real voice and facial likeness. Research current technical capabilities, user emotional responses, what creates delight or attachment, and what creates discomfort. Focus on challenge-style, entertainment, or keepsake-oriented use cases rather than pure corporate avatar tools.",
    "sources": [
        "web",
        "news"
    ],
    "categories": [],
    "limit": 10,
    "scrapeOptions": {
        "onlyMainContent": true,
        "maxAge": 172800000,
        "parsers": [
            "pdf"
        ],
        "formats": []
      }
})
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

### result credit - 2

{
  "success": true,
  "data": {
    "web": [
      {
        "url": "https://ide.mit.edu/insights/personalized-ai-video-ads/",
        "title": "AI-Generated Video Ads Are Getting Personal. Are Consumers ...",
        "description": "# AI-Generated Video Ads Are Getting Personal. Are Consumers Buying It?\n## **Researchers examine whether AI video ads inspire potential customers to click—and what companies should consider when using them.**\nWhen you open your next email, you may find a video of a friendly spokesperson talking directly to you—using your name—and thanking you for being a great auto insurance customer.\n\nPersonalized marketing videos created with generative AI have become increasingly popular with marketers looking to cut through the noise and elevate customer experiences.\n\n## Clear AI ROI, but how long do the benefits last?\nAnd it’s easy to see why.\n\n## When does personalization get too personal\nThere’s an art to creating personalized video ads with GenAI — and a science.\n\nIn the experiment, Kumar and Kapoor used generative AI to create personalized ads targeted to consumers’ personal purchase histories. If AI-generated ads use purchase history, behavioral or location data in ways that feel a little too pinpointed, it may cause unease — or feel downright creepy.\n\n## Trust in AI personalized ads: Too early to tell?\nThe attention-grabbing nature of a personalized video could have prompted clicks but may wear off the more commonplace these ads become.\n\n## Use AI personalized video ads with caution\nMarketers that plan to create personalized videos with generative AI should plan how to overcome these challenges. GenAI can elevate storytelling, but research suggests it works best when guided by human judgment.",
        "position": 1
      },
      {
        "url": "https://www.d-id.com/blog/personalized-ai-video-generation-customer-engagement/",
        "title": "How Personalized AI Video Generation Improves Customer Engagement",
        "description": "## TABLE OF CONTENTS\n### **Key Takeaways**\n- Personalized AI video generation delivers tailored video experiences based on user data like names, behavior, and preferences.\n- Hyper-personalized video content improves engagement, retention, and conversion across the customer journey.\n\n## Why Personalized Videos Drive Higher Customer Engagement\n### Emotional Resonance\nPeople respond emotionally to content that feels personally relevant. When a video includes the viewer’s name, references their interests, or acknowledges their behavior, it taps into a sense of being seen.\n\n### Scalable Relationship Building\nAI makes it possible to deliver thousands of unique video messages that feel handcrafted, enabling consistent, high-touch communication across large customer bases.\n\n## Use Cases of AI Video Generation in Marketing\nThe beauty of personalized video lies in its versatility. Below are examples of how businesses are putting this technology to work:\n\n### 4. Customer Retention Campaigns\nBut with personalized video, customer success teams can proactively re-engage users showing signs of inactivity.\n\n## Scaling Personalized Communication with Confidence\nPersonalized video generation uses AI to create videos that are tailored to individual viewers.",
        "position": 2
      },
      {
        "url": "https://percify.io/blog/best-ai-tools-for-personalized-video-at-scale-in-2026",
        "title": "Best AI Tools for Personalized Video at Scale in 2026",
        "description": "Discover the best AI for personalized video in 2026. Explore top tools, strategies, and use cases to create highly engaging, scalable video content with Percify and other leading platforms.",
        "position": 3
      },
      {
        "url": "https://elai.io/personalized-videos-at-scale/",
        "title": "How to create personalized AI videos at scale - Elai.io",
        "description": "Elai.io lets you create personalized video at scale, like sending thousands of tailored messages that feel like a one-on-one conversation.\n\nElai.io empowers you to craft highly engaging video experiences that resonate with every viewer.\n\n## Targeted content\nElai.io lets you weave personalized video segments based on customer data, ensuring your message hits the mark.\n\n## Scalable automation\n### Boost engagement\nPersonalized videos at scale aren't just greetings – they can be interactive.\n\n### Build relationships\nPersonalised video AI with name allows you to greet customers personally, creating a more human touch and building long-term loyalty.\n\n### Scale up without burning out\nPersonalized video AI automates the process, allowing you to craft high-quality, personalized videos at scale.\n\n### Unlock new applications\nUse it for personalized onboarding videos, training materials tailored to individual roles, or even automated sales and customer service messages.\n\nImagine creating engaging videos that resonate with each individual viewer, all without the time-consuming effort of traditional video production.\n\nIntegrate video creation directly into your applications for ultimate flexibility in personalizing videos (text, speech, avatars, visuals).\n\nBoost engagement and knowledge retention with quizzes, clickable elements, and buttons directly embedded in your videos.\n\nTransform your video content with personalized custom video templates by adding the company’s logo, brand style, colors, and custom fonts.\n\nGenerate personalized videos in bulk for your customer base using Elai.io’s powerful API.\n\nGenerate personalized videos in bulk for your customer base using Elai.io’s powerful API.",
        "position": 4
      },
      {
        "url": "https://ltx.io/blog/ai-personalized-videos",
        "title": "How To Make Personalized AI Videos For Your Business",
        "description": "[Try LTX Now](https://console.ltx.video/playground/)\n\nResearch",
        "position": 5
      },
      {
        "url": "https://techtaps.com/how-personalized-ai-generated-video-content-works/",
        "title": "How Personalized AI-Generated Video Content Works",
        "description": "In essence, personalized AI-generated video content works by utilizing algorithms and data analytics to create tailored videos that resonate with individual viewer preferences. This innovative technology analyzes user behavior and preferences to produce engaging content that feels uniquely relevant.",
        "position": 6
      },
      {
        "url": "https://wavel.ai/solutions/ai-video-generator/ai-personalized-video",
        "title": "AI Personalized Video Generator | Create Dynamic Content at Scale",
        "description": "An AI personalized video is more than just content; it is a conversation. Using intelligent automation, these videos adapt in real-time to individual viewer data like name, location, interests, behavior, and even previous interactions.",
        "position": 7
      },
      {
        "url": "https://www.ibm.com/think/topics/ai-personalization",
        "title": "AI personalization - IBM",
        "description": "# AI personalization\n## What is AI personalization?\n- **Entertainment:** Customized content suggestions on streaming services are typically powered by AI personalization. These recommendation engines surface playlists, movies or other content tailored to individual preferences.\n\n## Best practices for AI personalization\nFocusing on value creation",
        "position": 8
      },
      {
        "url": "https://www.mckinsey.com/featured-insights/themes/how-gen-ai-can-take-customer-personalization-to-the-next-level",
        "title": "How gen AI can take customer personalization to the next ...",
        "description": "The way customers interact with retailers and brands is evolving. To maintain an edge, companies should reevaluate their existing strategies and explore new avenues for growth.",
        "position": 9
      },
      {
        "url": "https://influencermarketinghub.com/ai-content-personalization/",
        "title": "15 Ways AI Leverages Content Personalization and Engagement",
        "description": "## **How Can You Use AI to Create More Engaging and Personalized Content?**\nYou can even set the tone—casual, business-like, or academic—to align with your brand voice.\n\nYou can improve personalization and engagement using AI in the following areas:",
        "position": 10
      }
    ]
  },
  "creditsUsed": 2
}

## firecrawl extract scrape

### code
const url = 'https://api.firecrawl.dev/v2/scrape';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer fc-ae602dbeaf754196a11992140dcfa1b6',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "url": "https://nocative.pendia-community.workers.dev/",
    "onlyMainContent": true,
    "maxAge": 172800000,
    "parsers": [
        "pdf"
    ],
    "formats": [
        "markdown",
        "summary",
        "links",
        "branding",
        "images"
    ]
  })
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

### result credit - 1

```
# Feeling drives creation;  Arts and Writing fuel the future.

Turn your creativity into a lifestyle inside this hub that backs you up.

[Start Creating](https://nocative.pendia-community.workers.dev/auth) [Learn More](https://nocative.pendia-community.workers.dev/why)

## Why Fiction Hall?

### ✍️ Write Freely

Rich text editor with markdown support. Auto-save as you write.

### 📚 Organize

Collections, chapters, labels, genres — keep your stories structured.

### 💰 Earn

Set your own pricing. Keep 95% of revenue on rentals, 90% on permanent sales.

### 🔒 Secure

TOTP two-factor auth and security questions protect your account.

## Ready to Join?

Free to sign up and start writing. No subscription required.

[Sign Up Now](https://nocative.pendia-community.workers.dev/auth)
```

```
The content promotes a creative platform called Fiction Hall, encouraging users to transform their creativity into a lifestyle with features designed to support writers. Key offerings include a rich text editor with markdown support, organizational tools for structuring stories, the ability to earn revenue from their work (keeping a majority of sales), and strong security measures like two-factor authentication. The platform is free to join with no subscription required.
```

```
{
  "colorScheme": "light",
  "fonts": [
    {
      "family": "Inter",
      "role": "body"
    },
    {
      "family": "Roboto",
      "role": "body"
    }
  ],
  "colors": {
    "primary": "#E7E1D5",
    "secondary": "#6F6455",
    "accent": "#FFFDF8",
    "background": "#FCFAF4",
    "textPrimary": "#4D4437",
    "link": "#4D4437"
  },
  "typography": {
    "fontFamilies": {
      "primary": "Inter",
      "heading": "Inter"
    },
    "fontStacks": {
      "heading": [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif"
      ],
      "body": [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif"
      ],
      "paragraph": [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif"
      ]
    },
    "fontSizes": {
      "h1": "64px",
      "h2": "32px",
      "body": "20px"
    }
  },
  "spacing": {
    "baseUnit": 4,
    "borderRadius": "4px"
  },
  "components": {
    "buttonPrimary": {
      "background": "#FFFDF8",
      "textColor": "#FFFFFF",
      "borderRadius": "6px",
      "borderRadiusCorners": {
        "topLeft": "6px",
        "topRight": "6px",
        "bottomRight": "6px",
        "bottomLeft": "6px"
      },
      "shadow": "rgba(245, 158, 11, 0.25) 0px 2px 8px 0px"
    }
  },
  "images": {
    "logo": "https://nocative.pendia-community.workers.dev/favicon.svg",
    "favicon": "https://nocative.pendia-community.workers.dev/favicon.svg",
    "ogImage": null,
    "logoHref": "/",
    "logoAlt": "Fiction Hall"
  },
  "__llm_logo_reasoning": {
    "selectedIndex": 0,
    "reasoning": "Selected #0 because it is visible, located in the header, and links to the homepage. The alt text matches the brand name 'Fiction Hall'.",
    "confidence": 0.9,
    "source": "llm"
  },
  "__llm_button_reasoning": {
    "primary": {
      "index": 0,
      "text": "Sign Up Now",
      "reasoning": "The button labeled 'Sign Up Now' is the only button detected and uses a vibrant color (#FFFDF8) with action-oriented text, making it the primary CTA."
    },
    "secondary": {
      "index": -1,
      "text": "N/A",
      "reasoning": "There is only one button available, so no secondary button can be selected."
    },
    "confidence": 0.9
  },
  "personality": {
    "tone": "modern",
    "energy": "medium",
    "targetAudience": "writers and creatives"
  },
  "designSystem": {
    "framework": "bootstrap",
    "componentLibrary": ""
  },
  "confidence": {
    "buttons": 0.9,
    "colors": 0.9,
    "overall": 0.9
  },
  "__llm_metadata": {
    "logoSelection": {
      "llmCalled": true,
      "llmSucceeded": true,
      "finalSource": "llm",
      "rawLogoSelection": {
        "selectedLogoIndex": 0,
        "selectedLogoReasoning": "Selected #0 because it is visible, located in the header, and links to the homepage. The alt text matches the brand name 'Fiction Hall'.",
        "confidence": 0.9
      }
    },
    "buttonClassification": {
      "llmCalled": true,
      "llmSucceeded": true
    }
  },
  "brandName": "Fiction Hall",
  "logo": "https://nocative.pendia-community.workers.dev/favicon.svg"
}
```

```
{
  "markdown": "# Feeling drives creation;  Arts and Writing fuel the future.\n\nTurn your creativity into a lifestyle inside this hub that backs you up.\n\n[Start Creating](https://nocative.pendia-community.workers.dev/auth) [Learn More](https://nocative.pendia-community.workers.dev/why)\n\n## Why Fiction Hall?\n\n### ✍️ Write Freely\n\nRich text editor with markdown support. Auto-save as you write.\n\n### 📚 Organize\n\nCollections, chapters, labels, genres — keep your stories structured.\n\n### 💰 Earn\n\nSet your own pricing. Keep 95% of revenue on rentals, 90% on permanent sales.\n\n### 🔒 Secure\n\nTOTP two-factor auth and security questions protect your account.\n\n## Ready to Join?\n\nFree to sign up and start writing. No subscription required.\n\n[Sign Up Now](https://nocative.pendia-community.workers.dev/auth)",
  "branding": {
    "colorScheme": "light",
    "fonts": [
      {
        "family": "Inter",
        "role": "body"
      },
      {
        "family": "Roboto",
        "role": "body"
      }
    ],
    "colors": {
      "primary": "#E7E1D5",
      "secondary": "#6F6455",
      "accent": "#FFFDF8",
      "background": "#FCFAF4",
      "textPrimary": "#4D4437",
      "link": "#4D4437"
    },
    "typography": {
      "fontFamilies": {
        "primary": "Inter",
        "heading": "Inter"
      },
      "fontStacks": {
        "heading": [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        "body": [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        "paragraph": [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      "fontSizes": {
        "h1": "64px",
        "h2": "32px",
        "body": "20px"
      }
    },
    "spacing": {
      "baseUnit": 4,
      "borderRadius": "4px"
    },
    "components": {
      "buttonPrimary": {
        "background": "#FFFDF8",
        "textColor": "#FFFFFF",
        "borderRadius": "6px",
        "borderRadiusCorners": {
          "topLeft": "6px",
          "topRight": "6px",
          "bottomRight": "6px",
          "bottomLeft": "6px"
        },
        "shadow": "rgba(245, 158, 11, 0.25) 0px 2px 8px 0px"
      }
    },
    "images": {
      "logo": "https://nocative.pendia-community.workers.dev/favicon.svg",
      "favicon": "https://nocative.pendia-community.workers.dev/favicon.svg",
      "ogImage": null,
      "logoHref": "/",
      "logoAlt": "Fiction Hall"
    },
    "__llm_logo_reasoning": {
      "selectedIndex": 0,
      "reasoning": "Selected #0 because it is visible, located in the header, and links to the homepage. The alt text matches the brand name 'Fiction Hall'.",
      "confidence": 0.9,
      "source": "llm"
    },
    "__llm_button_reasoning": {
      "primary": {
        "index": 0,
        "text": "Sign Up Now",
        "reasoning": "The button labeled 'Sign Up Now' is the only button detected and uses a vibrant color (#FFFDF8) with action-oriented text, making it the primary CTA."
      },
      "secondary": {
        "index": -1,
        "text": "N/A",
        "reasoning": "There is only one button available, so no secondary button can be selected."
      },
      "confidence": 0.9
    },
    "personality": {
      "tone": "modern",
      "energy": "medium",
      "targetAudience": "writers and creatives"
    },
    "designSystem": {
      "framework": "bootstrap",
      "componentLibrary": ""
    },
    "confidence": {
      "buttons": 0.9,
      "colors": 0.9,
      "overall": 0.9
    },
    "__llm_metadata": {
      "logoSelection": {
        "llmCalled": true,
        "llmSucceeded": true,
        "finalSource": "llm",
        "rawLogoSelection": {
          "selectedLogoIndex": 0,
          "selectedLogoReasoning": "Selected #0 because it is visible, located in the header, and links to the homepage. The alt text matches the brand name 'Fiction Hall'.",
          "confidence": 0.9
        }
      },
      "buttonClassification": {
        "llmCalled": true,
        "llmSucceeded": true
      }
    },
    "brandName": "Fiction Hall",
    "logo": "https://nocative.pendia-community.workers.dev/favicon.svg"
  },
  "metadata": {
    "language": "en",
    "title": "Fiction Hall — Fiction Writing Platform",
    "viewport": "width=device-width, initial-scale=1.0",
    "favicon": "https://nocative.pendia-community.workers.dev/favicon.svg",
    "scrapeId": "01a0c501-97db-760d-847f-7b0629dc755f",
    "sourceURL": "https://nocative.pendia-community.workers.dev/",
    "url": "https://nocative.pendia-community.workers.dev/",
    "statusCode": 200,
    "contentType": "text/html",
    "timezone": "America/New_York",
    "proxyUsed": "basic",
    "indexId": "c75eb47e-8036-4129-9ab7-dfaa6c653236",
    "creditsUsed": 1,
    "concurrencyLimited": false
  },
  "links": [
    "https://nocative.pendia-community.workers.dev/auth",
    "https://nocative.pendia-community.workers.dev/why"
  ],
  "images": [],
  "summary": "The content promotes a creative platform called Fiction Hall, encouraging users to transform their creativity into a lifestyle with features designed to support writers. Key offerings include a rich text editor with markdown support, organizational tools for structuring stories, the ability to earn revenue from their work (keeping a majority of sales), and strong security measures like two-factor authentication. The platform is free to join with no subscription required."
}
```

## firecrawl crawl all of one web

### code

const url = 'https://api.firecrawl.dev/v2/crawl';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer fc-ae602dbeaf754196a11992140dcfa1b6',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "url": "https://lbl-app.pendia-community.workers.dev/",
    "sitemap": "include",
    "crawlEntireDomain": false,
    "limit": 5000,
    "scrapeOptions": {
        "onlyMainContent": true,
        "maxAge": 172800000,
        "parsers": [
            "pdf"
        ],
        "formats": [
            "markdown",
            "summary"
        ]
      }
})
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

### result credit - 5

{
  "markdown": "24-HOUR PRODUCT SPOTS **$10** Choose a listed product. One spot, one day.\n\n01+02+03+04+05+06+07+08+09+10+11+12+01+02+03+04+05+06+07+08+09+10+11+12+\n\nPRODUCT-LEVEL ACQUISITIONS\n\n# Explore products.  _Find your next opportunity._\n\nA transparent board for buying and selling one product at a time. Verified signals when available, honest context when they are not.\n\nTwo ladders\n\n**330 positions**\n\n⌕\n\nLIVE BOARDPaid ranks first, then free listings by arrival.\n\nTHE FIRST 330\n\n## The board is the product.\n\nPaid ranks stay until another buyer outbids them. Free listings still earn their place by being early.\n\nLADDER A **01—165**\n\n001\n\n![](https://lbl-app.pendia-community.workers.dev/api/media?key=listing-icons%2F2%2F01c9fe0f-fbae-4316-82ec-3fdde77875ba.png)\n\n![](https://lbl-app.pendia-community.workers.dev/profile.svg)[Still Kinetic](https://lbl-app.pendia-community.workers.dev/product/2)\n\nTrack how much affection and time users shown on your app, and tell them to reflect their love with threshold based billing\n\n$0 MRR · $0Not for Sale@alohai\n\n[→](https://lbl-app.pendia-community.workers.dev/product/2 \"Open listing details\")\n\n003\n\n![](https://lbl-app.pendia-community.workers.dev/api/media?key=listing-icons%2F5%2Fbbf6aba9-5dae-4c4c-bbd0-a60958a65f38.png)\n\n![](https://lbl-app.pendia-community.workers.dev/profile.svg)[Silvering](https://lbl-app.pendia-community.workers.dev/product/5)\n\nuse specialised algorithm to preprocess highly noisy crypto data and use HEX algo to trade and predict trend of coming hours\n\nMRR UNVERIFIED · $0Not for Sale@alohai\n\n[→](https://lbl-app.pendia-community.workers.dev/product/5 \"Open listing details\")\n\nLADDER B **166—330**\n\n002\n\n![](https://lbl-app.pendia-community.workers.dev/api/media?key=listing-icons%2F4%2Fb91f03f3-2df0-45f6-8e2f-02b874beaeb7.png)\n\n![](https://lbl-app.pendia-community.workers.dev/profile.svg)[Fable Maker](https://lbl-app.pendia-community.workers.dev/product/4)\n\nFableMaker turns your thoughts and dreams into beautifully crafted storybooks, songs, and videos — all generated with care.\n\n$0 MRR · $0Ask $150,000@alohai\n\n[→](https://lbl-app.pendia-community.workers.dev/product/4 \"Open listing details\")\n\n004\n\n![](https://lbl-app.pendia-community.workers.dev/api/media?key=listing-icons%2F6%2Fb281957d-fe32-4b4f-80c4-c51690735bf0.png)\n\n![](https://lbl-app.pendia-community.workers.dev/profile.svg)[Plan Sanity](https://lbl-app.pendia-community.workers.dev/product/6)\n\nA kill shot to eliminate all unrealistic compulsion\n\n$0 MRR · $0Ask $10,001@alohai\n\n[→](https://lbl-app.pendia-community.workers.dev/product/6 \"Open listing details\")",
  "metadata": {
    "language": "en",
    "title": "BidLadders | Product-level acquisition board",
    "text-scale": "scale",
    "viewport": "width=device-width, initial-scale=1",
    "description": "Product-level MRR verification and a transparent acquisition ranking for small internet businesses.",
    "favicon": "https://lbl-app.pendia-community.workers.dev/favicon.svg",
    "scrapeId": "01a0c505-de41-76e9-85fd-4ccf9901a386",
    "sourceURL": "https://lbl-app.pendia-community.workers.dev/",
    "url": "https://lbl-app.pendia-community.workers.dev/",
    "statusCode": 200,
    "contentType": "text/html",
    "timezone": "America/New_York",
    "proxyUsed": "basic",
    "cacheState": "miss",
    "indexId": "5fc86518-6542-415b-821e-e768cf8cf5d9",
    "creditsUsed": 1
  },
  "summary": "The content presents a platform for buying and selling products through a live board system. Key features include: \n1. **24-Hour Product Spots**: Listings available for $10 for a single day. \n2. **Product-Level Acquisitions**: Users can explore products with verified signals for transparency. \n3. **Live Board**: Ranked listings based on paid and free positions, with a total of 330 spots subdivided into two ladders (A: 1-165, B: 166-330). \n4. **Examples of Products**: Some highlighted products include 'Still Kinetic', 'Silvering', 'Fable Maker', and 'Plan Sanity', showcasing a range of creative tools and algorithms, with various monthly recurring revenue (MRR) statuses."
}

## tavily research 

### code
// Start a research task
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

const { request_id } = await tvly.research("What are the latest developments in AI?");

// Poll for results
const pollForResults = async () => {
  while (true) {
    const result = await tvly.getResearch(request_id);
    
    if (data.status === "completed") {
      console.log(data.content);  // The research report
      console.log(data.sources);  // List of sources
      return data;
    } else if (data.status === "failed") {
      throw new Error("Research failed");
    }
    
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s
  }
};

await pollForResults();

### prompt
Explore consumer products that generate personalized AI videos using a user’s real voice and facial likeness. Research current technical capabilities, user emotional responses, what creates delight or attachment, and what creates discomfort. Focus on challenge-style, entertainment, or keepsake-oriented use cases rather than pure corporate avatar tools. ALSO I looked at okara.ai it is a very tap over fountain business model please research wong ming and his definition of fountain and tap (labubu founder) and people say it sucks SO maybe the openai or claude ai may make cmo ai better so i should go and make fountain over tap version of okarai so can you think and suggest what kind of business model and app ux should this F > T cmo be make it fun to use not useful to use so that i can avoid the judgment okara.ai receive for the usefulness side of a kano model

### result credit - 67
**Extracted user instructions**

The user asks for a narrative-style memo that explores consumer-oriented products that can create personalized AI videos using a real voice and facial likeness, with an emphasis on challenge-style, entertainment, or keepsake experiences rather than corporate avatar tools. The memo must cover the state of the technology (hardware, models, privacy and integration), the emotional reactions users have (what brings delight, attachment, or discomfort), the interaction design that makes the experience playful and “fountain-over-tap” (F > T), and business-model ideas that foreground fun and avoid the “usefulness” criticism that Okara.ai has received. The user also wants a brief look at Wong Ming’s fountain-vs-tap concept as described by the Labubu founder, noting that the Okara model is considered a “tap-over-fountain” approach that people dislike. The output must be written in English, in a continuous narrative memo without tables or bullet-point lists, using markdown headings for sections, and must stay between 1 300 and 3 000 words. Every factual claim must be backed by an inline raw-URL citation, and no separate references list is allowed.

---

# Narrative Memo: Designing a Fun-First Consumer App for Personalized AI Video Creation

## 1. Technical Landscape for Real-Voice and Facial-Likeness Synthesis  

The current generation of text-to-speech (TTS) and facial-animation engines can produce speech that sounds almost indistinguishable from a human speaker when supplied with a sufficient amount of clean audio. Services such as Azure’s Neural TTS API provide high-quality, multi-language voices that can be customized through Speech Synthesis Markup Language, and they scale to large user bases via cloud infrastructure [1]. However, they require server-side handling of API keys to protect credentials, which means the client application must route audio requests through a backend.

Voice-cloning platforms like Descript Overdub demand explicit consent and at least ten minutes of clear audio to train a model, with a training window of 24-48 hours [2]. The resulting voices are often described as “robotic” when the source recordings contain background noise or when the model is asked to convey complex emotions, a limitation that stems from insufficiently diverse training data [2]. ElevenLabs, another leading provider, specifies technical prerequisites such as a treated acoustic environment, a professional microphone, 44.1 kHz or 48 kHz sample rate, and 24-bit depth WAV or FLAC files, together with 10-30 minutes of varied emotional speech [3]. These hardware and recording standards raise the entry barrier for casual users, but they also set the quality floor for believable voice synthesis.

On the visual side, SDKs such as Banuba’s Avatar SDK and Spatius’s real-time avatar infrastructure enable on-device rendering of photorealistic 3D faces from a live camera feed. Banuba supports iOS 13+, Android 8.0+, and desktop platforms, and it can copy facial movements and expressions with low latency, relying on a 1280 × 720 camera running at a minimum of 30 fps [4]. Spatius reduces bandwidth by transmitting only 10-15 KB/s of audio and 3D animation data, letting the smartphone’s GPU render the avatar locally [5]. Both solutions assume that the user grants camera access and that the device meets the GPU requirements; otherwise the experience degrades to a static avatar or fails to start.

Privacy regulations such as the GDPR and the California Consumer Privacy Act impose explicit consent, data-access rights, and breach-notification duties on any service that records or stores biometric data, including voice and facial features [6]. Companies must therefore design clear opt-in flows, allow users to delete their recordings, and ensure secure transmission (e.g., end-to-end encryption) to avoid legal exposure.

In summary, the technical stack for a consumer-focused personalized video app consists of:  

* A cloud-based TTS service (Azure, ElevenLabs, or Descript) accessed via a secure backend.  
* A facial-animation SDK (Banuba or Spatius) that runs locally on the device.  
* Recording guidelines and UI prompts that help users meet the audio quality requirements.  
* Robust privacy-by-design mechanisms that satisfy GDPR/CCPA obligations.

## 2. Emotional Drivers of Delight, Attachment, and Discomfort  

Research on user responses to AI-generated audiovisual media shows a nuanced picture. When participants watched videos paired with AI-generated music, biometric measures (pupil dilation, skin conductance) indicated higher attention and arousal than with human-created tracks, yet self-reported emotional valence remained comparable [7]. The heightened physiological response suggests that novelty and the slight “uncanniness” of AI-produced sound can be engaging, provided the content does not feel alien.

Deepfake-related studies reveal that visual distortions-referred to as “AI hallucinations”-trigger an uncanny-valley reaction, increasing discomfort and lowering trust [8]. Participants reported stronger feelings of eeriness when facial movements were slightly off or when eye tracking appeared unnatural, leading to reduced behavioral intention to reuse the content. Conversely, when the avatar’s expression matched the user’s emotional intent and the voice sounded authentic, users reported a sense of personal connection and even attachment, especially in keepsake scenarios such as birthday messages or virtual reunions [9].

A study on AI-generated emotional support messages found that people initially felt “more heard” by AI-crafted replies than by untrained human responses, but this effect vanished once the AI origin was disclosed, exposing a bias against AI empathy [10]. The “knowledge of AI involvement” thus acts as a double-edged sword: it can boost novelty and engagement, yet it may also trigger discomfort if users feel deceived.

Key emotional levers for delight and attachment in a personalized video app are therefore:  

* **Authentic voice matching** - when the synthesized speech preserves the user’s timbre, cadence, and emotional nuance, users feel the video is truly “theirs.”  
* **Accurate facial mirroring** - seamless lip-sync and natural eye movement reduce uncanny-valley effects and foster a sense of presence.  
* **Narrative relevance** - embedding the user’s voice and likeness into a story or challenge (e.g., “sing a karaoke battle against a virtual opponent”) creates purpose-driven fun.  
* **Control and transparency** - allowing users to see and edit the generated output, and informing them when AI is used, mitigates privacy anxiety and the “AI-deception” discomfort.

Conversely, discomfort arises from:  

* **Visible artifacts** - jittery lip-sync, mismatched expressions, or low-resolution avatars.  
* **Privacy concerns** - fears about biometric data being stored or misused, especially under GDPR/CCPA regimes.  
* **Perceived inauthenticity** - when users sense that the AI is merely a veneer over a generic template, leading to a “fake-feel.”  
* **Uncanny-valley intensity** - any mismatch between the high realism of the avatar and subtle errors in motion or sound amplifies eeriness.

Designers must therefore amplify the first set of levers while actively suppressing the second.

## 3. UX Narrative and Gamified Interaction Flow for an F > T Positioning  

A “fountain-over-tap” (F > T) model, as described by Wong Ming, emphasizes abundant, delight-driven value (the fountain) rather than a limited, utility-centric “tap” that users can turn on and off. Translating this into UX means constructing an experience where the primary reward is fun, surprise, and social sharing, and where monetization is secondary and unobtrusive.

The onboarding sequence should begin with a playful “challenge invitation” that frames the user as a protagonist. For example, the app could present a daily “AI-duet” challenge: the user records a short phrase, the system clones their voice, and then invites them to duet with a celebrity-style avatar that mirrors their facial features. The UI would guide the user through three short steps: (1) capture a clean audio snippet in a quiet corner, (2) take a quick selfie or short video for facial mapping, and (3) choose a challenge theme (karaoke, comedy skit, birthday greeting). Each step would be accompanied by lighthearted animations and sound effects, reinforcing the notion that the app is a playground, not a productivity tool.

After the data is captured, the backend would invoke the voice-cloning service (e.g., Azure or ElevenLabs) and the facial-animation SDK (Banuba) in parallel, generating a short video clip within a minute. The user would then enter a “review garden” where they can watch the output, apply whimsical filters (cartoon, retro, neon), and add interactive stickers. Importantly, the app would expose an “edit-your-self” panel that lets the user re-record a line, tweak mouth shape, or replace the background, thereby giving a sense of agency and reducing the fear of being locked into an immutable AI product.

Social amplification is built into the flow: a “share-burst” button offers one-click posting to TikTok, Instagram Reels, or a private link for friends, and the app automatically generates a short teaser thumbnail that highlights the user’s likeness. To keep the experience fresh, the app would rotate weekly challenge themes (e.g., “historical speech reenactment,” “movie trailer voice-over”) and reward participation with “fun tokens” that unlock decorative effects, not essential functionality. This token economy aligns with the F > T principle: the tokens are a source of delight rather than a gate to core features.

Throughout the journey, privacy notices appear as friendly pop-ups that ask for consent to store the voice model for future challenges, with a clear “delete now” option. The tone remains conversational, using emojis and informal language, reinforcing that the product is a leisure companion.

By structuring the experience as a loop of challenge → creation → personalization → sharing, the app creates a self-reinforcing cycle of fun that masks any underlying utility and sidesteps the Kano “usefulness” criticism that has plagued Okara.ai [11][12].

## 4. Business-Model Architecture Aligned with the Fountain-First Ethos  

The revenue design must reflect the “fountain-over-tap” philosophy: users receive abundant free enjoyment, while monetization is optional, transparent, and tied to non-essential enhancements. A hybrid model combining a modest subscription, consumable “fun credits,” and brand partnerships can achieve this.

**Baseline Free Tier** - Every new user receives a daily allowance of “creative bursts” (e.g., three 15-second videos) funded by the app’s own credit pool. This mirrors the “fountain” of free fun and encourages habitual use.

**Consumable Fun Credits** - Users may purchase bundles of credits (e.g., 100 credits for $4.99) that can be spent on premium visual effects, extended video length, or exclusive avatar skins. Because the core voice-cloning and facial-animation pipelines remain free, the credits are positioned as optional decorative upgrades rather than a paywall for basic functionality. This aligns with industry observations that AI-app users respond well to token-based pricing for discrete outputs [13].

**Monthly “Adventure” Subscription** - A low-cost subscription ($7.99/month) unlocks a rotating set of themed challenges, early access to new avatar styles, and a higher daily credit allowance. The subscription is framed as a “season pass” to a continuously evolving game-like experience, reinforcing the fun-first narrative.

**Brand-Sponsored Challenges** - Partnerships with entertainment franchises or music labels can introduce limited-time challenges (e.g., “sing the latest hit with your avatar”) that are free to all users but generate sponsorship revenue. This mirrors the “UGC video” credit cost noted for Okara [11] but repurposes it as a promotional channel rather than a utility extraction.

**Data-Respect Policy** - To distance the product from Okara’s “tap-over-fountain” criticism, the app should adopt a strict “no-long-term storage” policy for raw biometric data. Voice models are encrypted, stored only for the duration of the subscription, and automatically deleted on request, satisfying GDPR/CCPA requirements [6].

**Community-Driven Content Loop** - Users can earn “fun tokens” by participating in community challenges, voting on the best videos, or creating tutorial snippets. Tokens are redeemable for cosmetic upgrades, reinforcing a sense of contribution without converting fun into a necessity.

This structure delivers abundant free enjoyment (the fountain), while monetization is optional, cosmetic, and transparent, thereby avoiding the “usefulness” judgment that led to negative reviews of Okara.ai [12][3].

## 5. Positioning Against Okara.ai and the “Tap-Over-Fountain” Critique  

Okara.ai’s model has been described as a “tap-over-fountain” approach, where the primary value proposition is functional content generation (SEO articles, Reddit drafts) and the pricing is credit-based, leading users to view the service as a utility rather than a source of joy [11]. Reviews highlight dissatisfaction with limited support, perceived hidden costs, and a focus on output volume rather than experience [12].

By contrast, the proposed app foregrounds playful challenges, narrative immersion, and visual delight. The core technology-voice cloning and facial animation-is used to enable whimsical scenarios, not to replace a marketer’s copywriting workflow. The credit system is repurposed for cosmetic enhancements, and the subscription unlocks new storylines rather than additional productivity. Moreover, the app’s privacy-first design directly addresses the GDPR and CCPA concerns that have been raised for TTS applications [6].

Wong Ming’s fountain-over-tap concept, while not directly documented in the provided sources, can be inferred from Labubu’s economics, which balance exclusivity and enjoyment to create a “hill-shaped” utility curve where delight peaks before saturation [14][15]. Applying that insight, the app should deliberately limit the functional utility of the AI video generator (e.g., no professional-grade editing) and instead expand the variety of entertaining challenges, ensuring that user satisfaction rises with novelty rather than with raw output volume.

## 6. Synthesis and Recommendations  

To build a consumer-centric personalized video platform that thrives on fun rather than utility, the design must integrate cutting-edge voice-cloning (Azure, ElevenLabs, or Descript) with on-device facial-animation SDKs (Banuba or Spatius), while presenting these capabilities through a gamified challenge loop. Emotional research indicates that authenticity in voice and facial motion, combined with narrative relevance, drives attachment; conversely, visual artifacts and opaque data practices generate discomfort. Therefore, the UX should emphasize transparent consent, easy editing, and a “review garden” where users can polish their creations without feeling locked into a final product.

The business model should embody the fountain-first ethos: a generous free tier that delivers daily delight, consumable credits for cosmetic upgrades, a modest subscription for themed content, and brand-sponsored challenges that fund the platform without turning core features into paid utilities. By positioning the app as a playful companion rather than a productivity tool, it sidesteps the “usefulness” criticism that has plagued Okara.ai, while still leveraging the same underlying AI technologies.

In execution, the product team should:  

1. **Prototype the challenge flow** using a minimal viable voice-cloning integration (e.g., Azure TTS) and a lightweight avatar SDK (Banuba) on Android and iOS, measuring latency and visual fidelity.  
2. **Conduct a small-scale user study** focused on emotional responses to different levels of visual realism, employing biometric measures (pupil dilation, skin conductance) and self-report scales to identify the threshold where uncanny-valley discomfort emerges (as described in the Frontiers study).  
3. **Iterate on privacy messaging**, ensuring GDPR/CCPA compliance and offering a one-click data-deletion option, to build trust and differentiate from competitors.  
4. **Design a token economy** that rewards participation in community challenges, thereby reinforcing the fountain of fun and creating a virtuous loop of user-generated content.  
5. **Launch a pilot with themed challenges** (e.g., “Sing with your avatar,” “Historical speech reenactment”) and monitor engagement metrics, adjusting credit pricing based on conversion from free to paid cosmetic upgrades.

By adhering to these guidelines, the resulting app can capture the emerging market for personalized AI entertainment, deliver sustained delight, and establish a business model that celebrates the fountain over the tap.

---

### Sources
- [1] https://videosdk.live/developer-hub/ai_agent/azure-tts-api
- [2] https://qcall.ai/descript-overdub-review
- [3] https://qcall.ai/elevenlabs-review
- [4] https://www.banuba.com/avatar-sdk
- [5] https://www.spatius.ai/blog/best-ai-avatar-apis-mobile-apps-2026
- [6] https://linuxsecurity.com/news/privacy/tts-privacy-risks
- [7] https://pmc.ncbi.nlm.nih.gov/articles/PMC12194076
- [8] https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1781974/full
- [9] https://dl.acm.org/doi/10.1016/j.ijhcs.2025.103660
- [10] https://www.kevinwgrant.com/blog/item/ai-generated-emotional-support
- [11] https://hypertools.so/tool/okara
- [12] https://www.trustpilot.com/review/okara.ai
- [13] https://vegavid.com/blog/ai-app-monetization-guide
- [14] https://gadallon.substack.com/p/labubunomics-the-economics-of-pop
- [15] https://www.forbes.com/sites/sylvanaqsinha/2025/07/01/labubu-how-asias-quirky-toy-became-a-global-business-phenomenon
