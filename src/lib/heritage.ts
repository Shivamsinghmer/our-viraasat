/**
 * Content for the site. Facts here are deliberately conservative: inscription
 * years come from the UNESCO World Heritage List, and anything not inscribed is
 * marked as such rather than quietly listed alongside the rest.
 */

export interface Monument {
	slug: string;
	name: string;
	place: string;
	/** Year inscribed on the UNESCO World Heritage List, or null if not inscribed. */
	inscribed: number | null;
	/** Set when the site sits on India's UNESCO *Tentative* List instead. */
	tentative?: boolean;
	/** UNESCO property type. Cultural unless stated. */
	category?: "cultural" | "natural" | "mixed";
	period: string;
	blurb: string;
	/**
	 * Legacy hero path for the first eleven entries. New entries omit it: the
	 * lead image is resolved from the credits file instead, so a page can never
	 * point at a photograph that failed to download. See lib/gallery.ts.
	 */
	image?: string;
	alt: string;
	/** Longer description for the detail page. */
	description: string;
	/** Historical background. */
	history: string;
	/** Architectural details. Cultural properties only. */
	architecture?: string;
	/** Terrain, habitat and wildlife. Natural and mixed properties only. */
	landscape?: string;
	/** Why this site matters. */
	significance: string;
	/** UNESCO criteria for inscription. */
	unescoCriteria: string;
	/** Practical visitor information. */
	visitorInfo: string;
	/** Key facts displayed on the detail page. */
	keyFacts: { label: string; value: string }[];
}

/** India's 45th World Heritage property, Sarnath, was inscribed in July 2026. */
export const UNESCO_SITE_COUNT = 45;

export const monuments: Monument[] = [
	{
		slug: "taj-mahal",
		name: "Taj Mahal",
		place: "Agra, Uttar Pradesh",
		inscribed: 1983,
		period: "17th century",
		blurb:
			"A mausoleum in white marble raised by Shah Jahan for Mumtaz Mahal. Its symmetry is almost total — the plan mirrors itself across both axes, and the four minarets lean fractionally outward so that an earthquake would drop them away from the dome.",
		image: "/images/heritage/taj-mahal.jpg",
		alt: "The Taj Mahal in white marble, reflected in its watercourse at dawn.",
		description:
			"The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra. It was commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal. The tomb is the centrepiece of a 17-hectare complex that includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.",
		history:
			"Mumtaz Mahal died in 1631 during the birth of their fourteenth child. Shah Jahan, consumed by grief, commissioned the Taj Mahal immediately. Construction began around 1632 and was largely complete by 1643, though work on the surrounding elements continued until 1553. An estimated 20,000 artisans and 1,000 elephants were employed. The primary architect is believed to be Ustad Ahmad Lahauri, though the design drew on traditions from Ottoman, Persian, and Indian architecture.",
		architecture:
			"The mausoleum stands on a square plinth and is topped by an iconic bulbous dome rising 35 metres. The exterior is clad in white marble inlaid with semi-precious stones (pietra dura) forming floral and geometric patterns. Four minarets at the corners of the plinth lean slightly outward. The interior houses the cenotaphs of Mumtaz Mahal and Shah Jahan in an octagonal chamber decorated with marble screens and calligraphic inscriptions from the Quran.",
		significance:
			"The Taj Mahal is widely regarded as the finest example of Mughal architecture and a symbol of India's cultural heritage. It attracts 7–8 million visitors annually and was named one of the New Seven Wonders of the World in 2007. The monument represents the pinnacle of Mughal artistic achievement and the enduring power of its founding love story.",
		unescoCriteria:
			"Inscribed under Criteria (i) as a masterpiece of creative genius, and (iii) as an outstanding example of Mughal architecture that illustrates a significant stage in human history.",
		visitorInfo:
			"The Taj Mahal is open from sunrise to sunset, Friday excepted (closed for prayers). Night viewing is available on full moon night and two nights before and after. Entry fees differ for Indian and international visitors. Shoes must be removed before entering the main tomb chamber.",
		keyFacts: [
			{ label: "Built", value: "1632–1653" },
			{ label: "Architect", value: "Ustad Ahmad Lahauri (attributed)" },
			{ label: "Material", value: "White marble, red sandstone" },
			{ label: "Dome height", value: "35 metres" },
			{ label: "UNESCO criteria", value: "(i), (iii)" },
			{ label: "Annual visitors", value: "7–8 million" },
		],
	},
	{
		slug: "khajuraho",
		name: "Khajuraho Group of Monuments",
		place: "Chhatarpur, Madhya Pradesh",
		inscribed: 1986,
		period: "950–1050 CE",
		blurb:
			"Chandela temples built across a single century, then left to the forest for five hundred years. Of an estimated eighty-five, about twenty-five survive — their walls carrying registers of sculpture that treat divinity, court life and desire as one continuous subject.",
		image: "/images/heritage/khajuraho.jpg",
		alt: "Carved sandstone spires and figure sculpture on a temple at Khajuraho.",
		description:
			"The Khajuraho Group of Monuments is a group of Hindu and Jain temples in Madhya Pradesh. They are one of the seven UNESCO World Heritage Sites in India. Famous for their erotic sculptures, the temples represent a celebration of human existence in all its forms — spiritual, social, and sensual.",
		history:
			"Built between 950 and 1050 CE by the Chandela dynasty, the original complex contained around 85 temples spread over 20 square kilometres. Over centuries of neglect, many were reclaimed by the jungle. By the time the British surveyed the area in the 1830s, only 25 remained. The temples were rediscovered and brought to international attention in the late 19th century.",
		architecture:
			"The temples are built of sandstone and follow a common plan: a pyramidal tower (shikhara) over the sanctum, a mandapa (hall), and an entrance porch. They are arranged in three groups: Western (the most famous, including Kandariya Mahadeva), Eastern, and Southern. The sculptural program covers every surface — divine figures, celestial nymphs, musicians, animals, and scenes of daily life are carved in high relief.",
		significance:
			"Khajuraho is celebrated for its celebration of the fullness of human life. The erotic sculptures, which comprise roughly 10% of the total decoration, are found primarily on the outer walls and represent the Tantric tradition of celebrating the union of male and female principles. The temples demonstrate extraordinary mastery of stone carving and architectural engineering.",
		unescoCriteria:
			"Inscribed under Criteria (i) as a masterpiece of creative genius and (iii) as an outstanding example of Indian temple architecture and sculpture.",
		visitorInfo:
			"The temples are open from sunrise to sunset. The Western Group has a light-and-sound show every evening. The best time to visit is October to March. The Khajuraho Dance Festival held in February-March is a major cultural event featuring classical Indian dance forms.",
		keyFacts: [
			{ label: "Built", value: "950–1050 CE" },
			{ label: "Dynasty", value: "Chandela" },
			{ label: "Temples remaining", value: "25 (of ~85)" },
			{ label: "Material", value: "Sandstone" },
			{ label: "UNESCO criteria", value: "(i), (iii)" },
			{ label: " Erotic sculptures", value: "~10% of decoration" },
		],
	},
	{
		slug: "konark",
		name: "Sun Temple, Konârak",
		place: "Puri, Odisha",
		inscribed: 1984,
		period: "13th century",
		blurb:
			"The temple is built as the chariot of Surya, the sun: twenty-four carved stone wheels along its base, drawn by seven horses. The wheels are sundials, and the spokes still read the hour.",
		image: "/images/heritage/konark.jpg",
		alt: "A carved stone chariot wheel on the plinth of the Sun Temple at Konark.",
		description:
			"The Konark Sun Temple is a 13th-century Hindu temple dedicated to the sun god Surya. Located on the eastern shore of Odisha, it is designed in the form of a giant chariot with 24 elaborately carved stone wheels, pulled by seven horses. The temple is one of the most renowned examples of Kalinga architecture.",
		history:
			"Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty, the temple was intended to be the crown jewel of Odisha's temple tradition. However, within a century of its construction, the main sanctum collapsed — possibly due to structural instability, invasion, or natural disasters. The British attempted to remove the wheels and horses in the early 20th century but abandoned the effort when one wheel sank into the sand.",
		architecture:
			"The temple is designed as a colossal chariot of Surya, standing on 24 wheels each about 3 metres in diameter. The wheels are not merely decorative — they function as sundials that can be used to calculate time accurately to within minutes. The main entrance is flanked by two enormous lions, each standing on a human figure. The walls are covered with intricate carvings of musicians, dancers, erotic figures, and geometric patterns.",
		significance:
			"The Sun Temple at Konark represents the culmination of Odisha's temple-building tradition and is considered one of the finest examples of Indian temple architecture. The mathematical precision of the wheels and the artistic excellence of the sculpture demonstrate the advanced state of science and art in medieval India. It is featured on the reverse side of the Indian ₹10 coin.",
		unescoCriteria:
			"Inscribed under Criteria (i) for its extraordinary architectural and sculptural genius, and (iii) as an outstanding testimony to the Kalinga school of architecture.",
		visitorInfo:
			"The temple is open from 6:00 AM to 6:00 PM. The annual Konark Dance Festival in December showcases classical Indian dance forms against the backdrop of the temple. Sound and light shows are held in the evening. Wheelbarrow rides around the complex are available.",
		keyFacts: [
			{ label: "Built", value: "c. 1250 CE" },
			{ label: "Patron", value: "King Narasimhadeva I" },
			{ label: "Wheels", value: "24 (each ~3m diameter)" },
			{ label: "Horses", value: "7 stone horses" },
			{ label: "UNESCO criteria", value: "(i), (iii)" },
			{ label: "Architecture", value: "Kalinga style" },
		],
	},
	{
		slug: "hampi",
		name: "Group of Monuments at Hampi",
		place: "Vijayanagara, Karnataka",
		inscribed: 1986,
		period: "14th–16th century",
		blurb:
			"The last capital of the Vijayanagara empire, set among granite boulders on the Tungabhadra. Persian and European visitors described a city rivalling Rome; it was sacked in 1565 and never rebuilt.",
		image: "/images/heritage/hampi.jpg",
		alt: "Temple ruins among granite boulders in the landscape at Hampi.",
		description:
			"Hampi was the capital of the Vijayanagara Empire, one of the richest and largest cities in the world during its peak. The ruins spread over 26 square kilometres contain exceptional groups of monuments — temples, fortifications, market streets, royal and sacred complexes — that tell the story of a flourishing medieval city.",
		history:
			"Founded in 1336 by Harihara I and Bukka Raya I of the Sangama dynasty, Hampi grew into a thriving cosmopolitan centre. At its peak in the 15th century, it housed hundreds of thousands of residents and was famed for its markets dealing in diamonds and spices. In 1565, the city was sacked by a coalition of Deccan Sultanates after the Battle of Talikota. It was never rebuilt, and the ruins were gradually reclaimed by nature.",
		architecture:
			"The Hampi landscape is extraordinary — hundreds of massive granite boulders balanced precariously on hillsides, with temples and palaces nestled between them. Key structures include the Virupaksha Temple (still active), the Vittala Temple with its famous stone chariot and musical pillars, the Lotus Mahal, the Elephant Stables, and the massive stone gateway of the Hazara Rama Temple. The architecture blends Dravidian temple styles with Islamic influences from the Deccan.",
		significance:
			"Hampi is a testament to the wealth and cultural sophistication of the Vijayanagara Empire, which was one of the last great Hindu kingdoms. The ruins provide an exceptionally complete picture of a medieval Indian city — from the royal precinct to the merchant quarters, from sacred complexes to markets. The landscape itself, with its dramatic boulder-strewn terrain, is integral to the site's identity.",
		unescoCriteria:
			"Inscribed under Criteria (i) as a masterpiece of human creative genius, (iii) as an outstanding testimony to a vanished civilization, and (iv) as an exceptional example of a type of building or architectural ensemble.",
		visitorInfo:
			"Hampi is best explored on foot or by bicycle. The site is divided into the Sacred Centre (Virupaksha area) and the Royal Centre. The Hippie Island area across the Tungabhadra offers a more relaxed atmosphere. October to February is the best time to visit. The annual Hampi Festival in November features music and cultural performances.",
		keyFacts: [
			{ label: "Capital of", value: "Vijayanagara Empire" },
			{ label: "Peak population", value: "~500,000" },
			{ label: "Area", value: "26 km²" },
			{ label: "Destroyed", value: "1565" },
			{ label: "UNESCO criteria", value: "(i), (iii), (iv)" },
			{ label: "Key temples", value: "Virupaksha, Vittala" },
		],
	},
	{
		slug: "ajanta",
		name: "Ajanta Caves",
		place: "Aurangabad, Maharashtra",
		inscribed: 1983,
		period: "2nd century BCE – 6th century CE",
		blurb:
			"Thirty Buddhist prayer halls and monasteries cut into a horseshoe of basalt cliff. The murals inside are the largest surviving body of early Indian painting — and the reason so much of what we know about the period's dress, music and court life is known at all.",
		image: "/images/heritage/ajanta.jpg",
		alt: "Rock-cut facades of the Buddhist cave complex at Ajanta.",
		description:
			"The Ajanta Caves are 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE. Cut into a horseshoe-shaped cliff overlooking the Waghora River, they contain some of the finest surviving examples of ancient Indian painting, sculpture, and architectural design.",
		history:
			"The caves were carved in two distinct phases: the earlier Satavahana phase (2nd century BCE – 1st century CE) and the later Vakataka phase (5th–6th century CE). After the decline of Buddhism in India, the caves were abandoned and forgotten, hidden by jungle for over a thousand years. They were rediscovered in 1819 by a British officer, John Smith, during a tiger hunt.",
		architecture:
			"The caves include both viharas (monasteries) and chaityas (prayer halls). The most celebrated are Cave 1 (the Padmapani and Vajrapani Bodhisattva paintings), Cave 2 (the famous Yakshi hanging from a tree), Cave 10 (the oldest chaitya), and Cave 26 (a Buddhist chaitya with elaborate sculptural decoration). The murals depict the Jataka tales — stories of the Buddha's previous lives — with extraordinary naturalism and emotional depth.",
		significance:
			"Ajanta's murals represent the zenith of ancient Indian painting. They are the only surviving examples of the Ajanta school of painting, which profoundly influenced art across Asia — from Sri Lanka to Japan. The caves also provide invaluable documentation of the social life, costume, and architecture of ancient India.",
		unescoCriteria:
			"Inscribed under Criteria (i) as a masterpiece of creative genius and (ii) for its outstanding influence on the art of Buddhism across Asia.",
		visitorInfo:
			"The caves are open from 9:00 AM to 5:30 PM, closed on Mondays. Photography is prohibited inside the caves to protect the murals. The best time to visit is October to March. An audio guide is available and highly recommended to appreciate the paintings and their context.",
		keyFacts: [
			{ label: "Caves", value: "30 (24 viharas, 6 chaityas)" },
			{ label: "Period", value: "2nd century BCE – 6th century CE" },
			{ label: "Rediscovered", value: "1819" },
			{ label: "Medium", value: "Rock-cut basalt" },
			{ label: "UNESCO criteria", value: "(i), (ii)" },
			{ label: "Paintings", value: "Jataka tales, Bodhisattvas" },
		],
	},
	{
		slug: "sanchi",
		name: "Buddhist Monuments at Sanchi",
		place: "Raisen, Madhya Pradesh",
		inscribed: 1989,
		period: "3rd century BCE onward",
		blurb:
			"The oldest stone structures in India still standing, begun under Ashoka. The Great Stupa's four gateways are carved with the Buddha's life told entirely through symbol — a footprint, an empty throne, a wheel — because the figure itself was not yet depicted.",
		image: "/images/heritage/sanchi.jpg",
		alt: "The carved eastern gateway of the Great Stupa at Sanchi.",
		description:
			"The Buddhist Monuments at Sanchi are among the oldest stone structures in India. The complex centres on the Great Stupa (Stupa 1), which was originally commissioned by Emperor Ashoka in the 3rd century BCE and enlarged in the 1st century BCE. The site includes stupas, temples, monasteries, and monolithic pillars.",
		history:
			"Ashoka established the original brick stupa at Sanchi around 262 BCE to enshrine relics of the Buddha. In the 1st century BCE, the stupa was enlarged and encased in stone, and its four elaborately carved gateways (toranas) were added. The site was abandoned after the 12th century and was rediscovered in 1818 by General Henry Taylor. A major restoration was carried out in the early 20th century by Sir John Marshall.",
		architecture:
			"The Great Stupa is a hemispherical dome 16.46 metres high and 36.6 metres in diameter, surrounded by a stone balustrade and entered through four cardinal gateways. The gateways are covered with narrative relief sculptures depicting the Buddha's life, the Jataka tales, and scenes from Buddhist mythology. Notably, the Buddha is never shown in human form — instead, he is represented by symbols: a Bodhi tree, an empty throne, footprints, or a wheel.",
		significance:
			"Sanchi is the best-preserved group of Buddhist monuments in India and provides an unbroken record of Buddhist art and architecture from the 3rd century BCE to the 12th century CE. The gateways are masterpieces of narrative sculpture and were influential across Buddhist Asia. The Ashoka Pillar at Sanchi, with its four lions, inspired the State Emblem of India.",
		unescoCriteria:
			"Inscribed under Criteria (i), (ii), (iii), (iv), and (vi) — an exceptional testimony to Buddhist religious art and architecture, with outstanding influence across Asia.",
		visitorInfo:
			"The site is open from sunrise to sunset. The Archaeological Museum nearby houses important sculptures from the site. The best time to visit is October to March. Audio guides are available. The site is about 46 km from Bhopal.",
		keyFacts: [
			{ label: "Commissioned", value: "c. 262 BCE" },
			{ label: "Great Stupa diameter", value: "36.6 metres" },
			{ label: "Gateways", value: "4 carved toranas" },
			{ label: "Buddha representation", value: "Symbolic only" },
			{ label: "UNESCO criteria", value: "(i), (ii), (iii), (iv), (vi)" },
			{ label: "Rediscovered", value: "1818" },
		],
	},
	{
		slug: "sarnath",
		name: "Ancient Buddhist Site of Sarnath",
		place: "Varanasi, Uttar Pradesh",
		inscribed: 2026,
		period: "3rd century BCE onward",
		blurb:
			"Where the Buddha gave his first sermon and the Sangha began. The Ashokan lion capital excavated here became the State Emblem of India, and the wheel from its abacus sits at the centre of the national flag.",
		image: "/images/heritage/sarnath.jpg",
		alt: "Ruined monastery walls beside the Dhamek Stupa at Sarnath.",
		description:
			"Sarnath is where the Buddha gave his first sermon after attaining enlightenment, making it one of the four holiest Buddhist pilgrimage sites. The Dhamek Stupa, built by Emperor Ashoka, marks the spot of the first sermon. The site also yielded the Lion Capital, now India's national emblem.",
		history:
			"After attaining enlightenment at Bodh Gaya, the Buddha travelled to Sarnath and delivered his first discourse — the Dhammacakkappavattana Sutta — to five ascetics. Emperor Ashoka visited Sarnath around 249 BCE and erected a monastery, a pillar, and the Lion Capital. The site flourished until the 12th century, when it was destroyed by Turkic invasions. Systematic excavations began in the 19th century.",
		architecture:
			"The most prominent structure is the Dhamek Stupa, a massive cylindrical tower 43.6 metres high and 28 metres in diameter, built in stages from the 5th to 12th centuries. The Ashoka Pillar, fragments of which survive, was originally topped by the famous Lion Capital — four Asiatic lions standing back to back on an abacus adorned with a wheel, a bull, a horse, and an elephant. The monastic ruins reveal the layout of Buddhist monastic life.",
		significance:
			"Sarnath is the birthplace of the Buddhist Sangha (monastic community) and the site where the Dharma wheel was first set in motion. The Lion Capital of Ashoka, discovered here in 1904, was adopted as the State Emblem of India in 1950, and the Ashoka Chakra (wheel) from its abacus appears at the centre of the Indian national flag. Sarnath is India's 45th World Heritage property.",
		unescoCriteria:
			"Inscribed under Criteria (iii) as an outstanding testimony to the Buddhist tradition, and (vi) for its direct association with the life of the Buddha and the founding of the Sangha.",
		visitorInfo:
			"Sarnath is open from sunrise to sunset. The Archaeological Museum houses the original Lion Capital and other important sculptures. The site is about 10 km from Varanasi and easily accessible by taxi or auto-rickshaw. The best time to visit is October to March.",
		keyFacts: [
			{ label: "First sermon", value: "c. 528 BCE" },
			{ label: "Dhamek Stupa height", value: "43.6 metres" },
			{ label: "Lion Capital", value: "National Emblem of India" },
			{ label: "UNESCO inscribed", value: "2026" },
			{ label: "UNESCO criteria", value: "(iii), (vi)" },
			{ label: "Distance from Varanasi", value: "10 km" },
		],
	},
	{
		slug: "mahabalipuram",
		name: "Group of Monuments at Mahabalipuram",
		place: "Chengalpattu, Tamil Nadu",
		inscribed: 1984,
		period: "7th–8th century",
		blurb:
			"Pallava monuments cut straight from the shore's granite — monolithic rathas, cave temples, and Arjuna's Penance, a relief the size of a building face in which a carved fissure once ran with real water.",
		image: "/images/heritage/mahabalipuram.jpg",
		alt: "Rock-cut monuments on the shore at Mahabalipuram.",
		description:
			"The Group of Monuments at Mahabalipuram includes rock-cut cave temples, monolithic rathas (chariots), structural temples, and open-air bas-reliefs. Created during the Pallava dynasty in the 7th and 8th centuries, they represent some of the earliest examples of Dravidian architecture.",
		history:
			"Mahabalipuram was a thriving port city of the Pallava dynasty, the first great patrons of South Indian temple architecture. King Narasimhavarman I (630–668 CE) initiated the monument-building program, and his successor Narasimhavarman II completed it. The famous Tsunami of 2004 revealed submerged ruins off the coast, confirming medieval accounts of a 'Seven Pagodas' — six of which remain underwater.",
		architecture:
			"The monuments include five monolithic rathas (Dharmaraja, Bhima, Arjuna, Nakula-Sahadeva, and Draupadi), each carved from a single granite boulder. Cave temples like the Mahishasuramardini Mandapa contain exquisite relief panels. The Descent of the Ganges (also called Arjuna's Penance) is one of the world's largest open-air bas-reliefs — 27 by 9 metres — depicting the river Ganges descending from heaven. A natural cleft in the rock once channelled water over the carved figures.",
		significance:
			"Mahabalipuram marks the transition from rock-cut to structural temple architecture in South India. The rathas served as prototypes for later Dravidian temple forms. The site demonstrates the Pallava mastery of granite carving and their pioneering role in Indian temple architecture. It remains an active centre of stone carving today.",
		unescoCriteria:
			"Inscribed under Criteria (i), (ii), (iii), and (vi) — as an outstanding example of Pallava art and architecture, and for its influence on the development of South Indian temple forms.",
		visitorInfo:
			"The monuments are open from 6:00 AM to 6:00 PM. The Shore Temple is best visited at sunset. The annual Mamallapuram Dance Festival in December-January features classical Indian dance. The site is about 58 km south of Chennai. Stone carving workshops in the town offer demonstrations.",
		keyFacts: [
			{ label: "Rathas", value: "5 monolithic" },
			{ label: "Descent of the Ganges", value: "27 × 9 metres" },
			{ label: "Dynasty", value: "Pallava" },
			{ label: "Material", value: "Granite" },
			{ label: "UNESCO criteria", value: "(i), (ii), (iii), (vi)" },
			{ label: "Submerged pagodas", value: "6 (confirmed 2004)" },
		],
	},
	{
		slug: "qutb-minar",
		name: "Qutb Minar and its Monuments",
		place: "Delhi",
		inscribed: 1993,
		period: "1199 onward",
		blurb:
			"A fluted victory tower of red sandstone and marble, 73 metres tall, built in stages by successive rulers. Beside it stands a fourth-century iron pillar that has resisted rust for sixteen hundred years.",
		image: "/images/heritage/qutb-minar.jpg",
		alt: "The fluted red sandstone shaft of the Qutb Minar in Delhi.",
		description:
			"The Qutb Minar is a 73-metre tall tapering minaret built in the early 13th century. It stands within the Quwwat-ul-Islam Mosque complex, the first mosque built in India after the Islamic conquest. The complex also includes the mysterious Iron Pillar of Delhi, a 4th-century metallurgical marvel that has resisted corrosion for over 1,600 years.",
		history:
			"Construction of the Qutb Minar was begun by Qutb ud-Din Aibak in 1199 and completed by his successor Iltutmish around 1220. Three more storeys were added by Firoz Shah Tughlaq in 1368 after an earthquake damaged the top. The Iron Pillar, originally erected in the 4th century CE inUdayagiri (Madhya Pradesh), was brought to Delhi by the Tomara rulers. The complex also contains the Alai Darwaza (1311) and the Alai Minar (unfinished, started by Alauddin Khalji in 1316).",
		architecture:
			"The Qutb Minar has five storeys, each marked by a projecting balcony supported on ornate muqarnas (stalactite) brackets. The first three storeys are of red sandstone, the fourth and fifth of marble and sandstone. Fluted and circular sections alternate, with each storey tapering progressively. The Quwwat-ul-Islam Mosque was built using materials from 27 demolished Hindu and Jain temples, and its pillars retain the original carved motifs.",
		significance:
			"The Qutb complex is a remarkable document of early Indo-Islamic architecture — a synthesis of Persian, Central Asian, and Indian building traditions. The Iron Pillar is a testament to ancient Indian metallurgy: its corrosion resistance is attributed to a protective layer of misawite (iron hydrogen phosphate hydrate) formed by the phosphorus content of the iron.",
		unescoCriteria:
			"Inscribed under Criteria (iv) as an outstanding example of early Indo-Islamic architecture, representing the beginning of a new architectural tradition in India.",
		visitorInfo:
			"The complex is open from sunrise to sunset. It is closed on Mondays. The best time to visit is October to March. The site is easily accessible by Delhi Metro (Qutub Minar station). An annual sound-and-light show is held in the evenings.",
		keyFacts: [
			{ label: "Height", value: "73 metres" },
			{ label: "Storeys", value: "5" },
			{ label: "Iron Pillar age", value: "4th century CE" },
			{ label: "Pillar material", value: "Red sandstone, marble" },
			{ label: "UNESCO criteria", value: "(iv)" },
			{ label: "Mosque", value: "First in India" },
		],
	},
	{
		slug: "red-fort",
		name: "Red Fort Complex",
		place: "Delhi",
		inscribed: 2007,
		period: "1639–1648",
		blurb:
			"Shah Jahan's citadel at Shahjahanabad, and the place from which the Prime Minister addresses the country every Independence Day. Its private halls once carried the inscription: if there is a paradise on earth, it is this.",
		image: "/images/heritage/red-fort.jpg",
		alt: "The red sandstone walls and gateway of the Red Fort in Delhi.",
		description:
			"The Red Fort is a 17th-century fortress-palace that served as the main residence of the Mughal emperors for nearly 200 years. Built by Shah Jahan when he moved his capital from Agra to Delhi, it is a masterwork of Mughal architecture, combining Persian, Timurid, and Indian traditions.",
		history:
			"Shah Jahan commissioned the Red Fort in 1638 when he decided to build a new capital, Shahjahanabad, on the banks of the Yamuna. Construction was completed in 1648. The fort served as the Mughal seat of power until 1857, when the British exiled the last emperor, Bahadur Shah Zafar, after the Indian Rebellion. The British converted parts of the palace into military offices and demolished several structures. The fort has been the site of the Prime Minister's Independence Day address since 1947.",
		architecture:
			"The fort is enclosed by massive red sandstone walls stretching 2.5 kilometres, rising up to 33 metres. The main entrance is the Lahore Gate. Inside, the Diwan-i-Am (Hall of Public Audience) and the Diwan-i-Khas (Hall of Private Audience) are connected by the Nahar-i-Bihisht (Stream of Paradise) water channel. The Moti Masjid (Pearl Mosque), the Rang Mahal (Palace of Colour), and the Hamam (royal baths) showcase the refined aesthetics of Shah Jahan's court.",
		significance:
			"The Red Fort is a symbol of Indian sovereignty and national pride. The annual Independence Day ceremony, where the Prime Minister hoists the national flag and addresses the nation from its ramparts, makes it one of the most politically significant monuments in India. The phrase 'if there is a paradise on earth, it is this, it is this, it is this' (from an inscription in the Diwan-i-Khas) encapsulates the Mughal vision of earthly splendour.",
		unescoCriteria:
			"Inscribed under Criteria (ii) and (vi) — for its outstanding testimony to Mughal architectural and cultural achievement, and its association with India's independence movement.",
		visitorInfo:
			"The Red Fort is open from 9:30 AM to 4:30 PM, closed on Mondays. The evening sound-and-light show (in Hindi and English) recounts the fort's history. The fort is a short walk from Chandni Chowk metro station. The National Flag Hoisting Ceremony on 15th August is a major event.",
		keyFacts: [
			{ label: "Commissioned", value: "1638" },
			{ label: "Completed", value: "1648" },
			{ label: "Wall length", value: "2.5 km" },
			{ label: "Wall height", value: "Up to 33 metres" },
			{ label: "UNESCO criteria", value: "(ii), (vi)" },
			{ label: "Independence Day", value: "Since 1947" },
		],
	},
	{
		slug: "meenakshi",
		name: "Meenakshi Amman Temple",
		place: "Madurai, Tamil Nadu",
		inscribed: null,
		tentative: true,
		period: "Rebuilt 16th–17th century",
		blurb:
			"A working temple city rather than a monument: fourteen gopurams rising over a walled complex that still orders the street plan of Madurai around it. It sits on India's UNESCO Tentative List, not the World Heritage List.",
		image: "/images/heritage/meenakshi.jpg",
		alt: "Sculpted gopuram towers of the Meenakshi Amman Temple, Madurai.",
		description:
			"The Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of the Vaigai River in Madurai. Dedicated to Goddess Meenakshi (a form of Parvati) and Lord Sundareshwar (a form of Shiva), it is one of the most important temples in Tamil Nadu and a major pilgrimage centre.",
		history:
			"The original temple was built around the 6th century CE by the Pandya dynasty. The present structure was largely rebuilt in the 16th and 17th centuries by the Nayak rulers after being damaged during the Malik Kafur invasion of 1311. The temple was restored to its full glory under Thirumalai Nayak (1623–1659), who added many of the current gopurams and the musical pillars of the Vasantha Mandapam.",
		architecture:
			"The temple complex covers 14 acres and is enclosed by nine gopurams (gateway towers) ranging from 39 to 52 metres tall. The tallest, the southern tower, was completed in 1955. The thousand-pillar hall (Aayiram Kaal Mandapam) features carved pillars that produce different musical notes when struck. The temple's 33,000 sculptures are among the most colourful in South India, with every gopuram covered in thousands of painted figures.",
		significance:
			"The Meenakshi Amman Temple is the cultural and commercial heart of Madurai, one of the oldest continuously inhabited cities in the world. The temple's layout — with the city's four major streets radiating from the temple in cardinal directions — is a living example of the ancient Indian concept of the temple as the centre of urban life. The temple hosts over 15,000 visitors daily and is the site of the 10-day Chithirai Festival.",
		unescoCriteria:
			"India's Tentative List entry proposes inscription under Criteria (iii), (iv), (v), and (vi) — as an outstanding example of Dravidian architecture and a living Hindu temple complex.",
		visitorInfo:
			"The temple is open from 5:00 AM to 12:30 PM and 4:00 PM to 9:30 PM. Non-Hindus are not permitted in the inner sanctum. Photography is restricted in certain areas. The evening puja ceremony is a powerful experience. The temple is in the heart of Madurai, easily accessible from the railway station.",
		keyFacts: [
			{ label: "Dedicated to", value: "Meenakshi & Sundareshwar" },
			{ label: "Complex area", value: "14 acres" },
			{ label: "Gopurams", value: "9 (up to 52m)" },
			{ label: "Sculptures", value: "33,000+" },
			{ label: "Status", value: "UNESCO Tentative List" },
			{ label: "Daily visitors", value: "15,000+" },
		],
	},
];

/**
 * The remaining World Heritage properties, added so the site documents all
 * {@link UNESCO_SITE_COUNT} rather than a selection. Entries here carry no
 * `image` field: their lead photograph is resolved from the credits file.
 */
export const additionalMonuments: Monument[] = [
	{
		slug: "agra-fort",
		name: "Agra Fort",
		place: "Agra, Uttar Pradesh",
		inscribed: 1983,
		period: "1565 onward",
		blurb:
			"A walled imperial city in red sandstone, rebuilt by Akbar and refaced in marble by Shah Jahan — who spent his last years imprisoned inside it, within sight of the tomb he had built for his wife.",
		alt: "The red sandstone ramparts and gateway of Agra Fort.",
		description:
			"Agra Fort is a fortified imperial residence on the right bank of the Yamuna, roughly two and a half kilometres upstream of the Taj Mahal. Its walls run for some two and a half kilometres in a rough crescent, rising over twenty metres, and enclose what was effectively a city: audience halls, palaces, mosques, gardens and quarters. It served as the principal seat of the Mughal empire until the court moved to Delhi.",
		history:
			"Akbar took the site in 1558 and rebuilt what had been a brick fort in red sandstone from 1565. Jahangir and then Shah Jahan altered it heavily, the latter demolishing sections of Akbar's sandstone work to build in white marble. Shah Jahan was deposed by his son Aurangzeb in 1658 and held at the fort until his death in 1666.",
		architecture:
			"The outer walls and the Delhi and Amar Singh gates are Akbar's, in dressed red sandstone with inlaid white marble patterning. Inside, the sequence runs from Jahangiri Mahal — Hindu and Central Asian forms worked together in sandstone — to Shah Jahan's marble additions: the Khas Mahal, the Sheesh Mahal with its mirror mosaic, the Diwan-i-Am for public audience and the Diwan-i-Khas for private. The Musamman Burj, an octagonal marble tower over the river, looks directly toward the Taj Mahal.",
		significance:
			"Agra Fort records the Mughal style changing in place across three reigns, from Akbar's robust sandstone syncretism to Shah Jahan's marble refinement — the two visible within a few metres of each other. It is also the clearest surviving example of the Mughal fort-palace as a working seat of government rather than a monument.",
		unescoCriteria:
			"Inscribed in 1983 under criterion (iii) as an outstanding testimony to Mughal civilisation at its height.",
		visitorInfo:
			"Open daily from sunrise to sunset. Roughly a quarter of the complex is accessible to visitors; the remainder is held by the Indian Army. Separate entry rates apply to Indian and international visitors, and a combined ticket with the Taj Mahal is available.",
		keyFacts: [
			{ label: "Built", value: "From 1565, under Akbar" },
			{ label: "Material", value: "Red sandstone, later white marble" },
			{ label: "Wall circuit", value: "About 2.5 km" },
			{ label: "UNESCO criteria", value: "(iii)" },
			{ label: "Inscribed", value: "1983" },
		],
	},
	{
		slug: "ellora",
		name: "Ellora Caves",
		place: "Aurangabad district, Maharashtra",
		inscribed: 1983,
		period: "6th–10th century CE",
		blurb:
			"Thirty-four halls cut into a basalt scarp by Buddhist, Hindu and Jain patrons in succession. The Kailasa temple among them was not built but excavated — carved downward out of the cliff as a single rock.",
		alt: "The Kailasa temple at Ellora, carved downward out of solid basalt.",
		description:
			"Ellora is a line of thirty-four rock-cut monasteries and temples running along a basalt escarpment in the Charanandri hills. The excavations belong to three religions — Buddhist, Hindu and Jain — cut over roughly four centuries, in places adjacent to one another. The site was never lost and has been in more or less continuous use.",
		history:
			"The Buddhist caves are broadly the earliest, from around the sixth to eighth centuries; the Hindu caves overlap and continue; the Jain group is latest, into the tenth. Patronage came from successive dynasties, notably the Rashtrakutas, under whom the Kailasa temple is generally attributed to Krishna I in the eighth century. That the three traditions were cut side by side, without the earlier work being destroyed, is itself part of the record.",
		architecture:
			"Cave 16, the Kailasa temple, is the exceptional case: rather than being built up from blocks, it was excavated top-down from the living rock, removing an estimated two hundred thousand tonnes of basalt to leave a free-standing temple complex — gateway, shrine, hall, courtyard and monolithic elephants — carved as one continuous piece. The Buddhist caves include multi-storeyed viharas and the Vishvakarma chaitya with its ribbed ceiling cut to imitate timber. The Jain caves at the northern end are smaller and exceptionally finely finished.",
		significance:
			"Ellora is the largest single-rock excavation of its kind anywhere, and the clearest physical evidence of religious coexistence in early medieval India: three traditions at work on the same cliff, over centuries, with the earlier excavations left intact.",
		unescoCriteria:
			"Inscribed in 1983 under criteria (i), (iii) and (vi), as a masterpiece of creative genius, a testimony to the civilisation of ancient India, and a place associated with living religious traditions.",
		visitorInfo:
			"Open daily except Tuesday. The caves are numbered along the scarp and spread over roughly two kilometres, so a full visit takes several hours. Photography without flash is generally permitted; the interiors are dim.",
		keyFacts: [
			{ label: "Caves", value: "34" },
			{ label: "Traditions", value: "Buddhist, Hindu, Jain" },
			{ label: "Kailasa temple", value: "8th century, cut top-down" },
			{ label: "UNESCO criteria", value: "(i), (iii), (vi)" },
			{ label: "Inscribed", value: "1983" },
		],
	},
	{
		slug: "elephanta",
		name: "Elephanta Caves",
		place: "Elephanta Island, Maharashtra",
		inscribed: 1987,
		period: "5th–8th century CE",
		blurb:
			"Rock-cut Shaiva halls on an island in Mumbai harbour, holding the Trimurti — a three-headed Shiva nearly six metres high, cut from the cave wall.",
		alt: "The three-headed Trimurti sculpture of Shiva at the Elephanta Caves.",
		description:
			"Elephanta is a group of rock-cut caves on Gharapuri island, about ten kilometres east of the Mumbai waterfront. The principal cave is a large Shaiva hall on a plan of columns and aisles, cut into the basalt of the hillside, with a series of monumental relief panels around its walls.",
		history:
			"The excavations are generally dated between the fifth and eighth centuries, with attribution debated between the Kalachuri and later dynasties. The island took its European name from a large stone elephant found near the landing, later moved to Mumbai. The caves suffered damage during the Portuguese period, and several panels are broken.",
		architecture:
			"The main cave is entered on three sides and organised around a free-standing shrine to the linga. The great panels along the walls show Shiva in successive aspects — as Nataraja, as Ardhanarishvara combining male and female, bringing the Ganga to earth, and killing Andhaka. The Trimurti at the rear, a three-faced bust close to six metres tall, is the best known: the faces are read as the creative, the protective and the fierce aspects held in one image.",
		significance:
			"The Elephanta reliefs are among the finest achievements of Indian rock-cut sculpture, and the Trimurti is one of the defining images of Shaivism. The scale is unusual — these are not niche figures but wall-sized compositions cut in situ.",
		unescoCriteria:
			"Inscribed in 1987 under criteria (i) and (iii), as a masterpiece of human creative genius and an exceptional testimony to a civilisation that has disappeared.",
		visitorInfo:
			"Reached by ferry from the Gateway of India in Mumbai; the crossing takes about an hour and services do not run in the monsoon. Closed on Mondays. A steep flight of steps leads from the jetty to the caves, with a small toy train covering part of the approach.",
		keyFacts: [
			{ label: "Location", value: "Gharapuri island, Mumbai harbour" },
			{ label: "Dedicated to", value: "Shiva" },
			{ label: "Trimurti height", value: "About 6 m" },
			{ label: "UNESCO criteria", value: "(i), (iii)" },
			{ label: "Inscribed", value: "1987" },
		],
	},
	{
		slug: "chola-temples",
		name: "Great Living Chola Temples",
		place: "Thanjavur, Gangaikonda Cholapuram and Darasuram, Tamil Nadu",
		inscribed: 1987,
		period: "11th–12th century",
		blurb:
			"Three temples built by the Cholas at the height of their power, still in worship. The vimana at Thanjavur rises about sixty metres and was, when finished in 1010, the tallest structure in India.",
		alt: "The towering vimana of the Brihadisvara temple at Thanjavur.",
		description:
			"The property covers three temples: Brihadisvara at Thanjavur, Brihadisvara at Gangaikonda Cholapuram, and Airavatesvara at Darasuram. All three are Shaiva, all three are in continuous ritual use, and together they record the Chola dynasty's temple architecture across its peak and its refinement.",
		history:
			"Rajaraja I completed the Thanjavur temple in 1010, financing it partly from campaign revenue and recording the endowments in inscriptions cut into the temple itself. His son Rajendra I built a new capital at Gangaikonda Cholapuram and a temple there around 1035. Airavatesvara at Darasuram followed under Rajaraja II in the twelfth century. Thanjavur was inscribed in 1987; the other two were added as an extension in 2004.",
		architecture:
			"Thanjavur's vimana — the tower over the sanctum — rises about sixty metres in thirteen diminishing storeys, capped by a single large stone. The temple is built in granite, which is not local to the immediate area and had to be brought in. Gangaikonda Cholapuram's tower is lower and its profile more curved. Airavatesvara is smaller and the most ornate of the three, with a stone chariot-form mandapa and finely cut miniature friezes.",
		significance:
			"The temples are simultaneously religious buildings, dynastic statements and archives: their walls carry inscriptions recording land grants, wages, temple staff and irrigation arrangements, which makes them one of the richest sources for how a medieval South Indian state actually operated.",
		unescoCriteria:
			"Inscribed in 1987, extended 2004, under criteria (i), (ii) and (iii) as outstanding creative achievements of Chola architecture and testimony to its civilisation.",
		visitorInfo:
			"All three are active temples, open daily with a midday closure at Thanjavur. Modest dress is expected and footwear is removed before entering. Thanjavur is the most visited; Gangaikonda Cholapuram and Darasuram are quieter and require separate travel.",
		keyFacts: [
			{ label: "Temples", value: "Three, in Tamil Nadu" },
			{ label: "Thanjavur completed", value: "1010, under Rajaraja I" },
			{ label: "Vimana height", value: "About 60 m" },
			{ label: "Material", value: "Granite" },
			{ label: "Inscribed", value: "1987, extended 2004" },
		],
	},
	{
		slug: "pattadakal",
		name: "Group of Monuments at Pattadakal",
		place: "Bagalkot district, Karnataka",
		inscribed: 1987,
		period: "7th–8th century CE",
		blurb:
			"A Chalukyan coronation site where northern and southern temple forms were built side by side — an experiment in architecture conducted in stone, in one place, within a century.",
		alt: "Sandstone temples of the Pattadakal group beside the Malaprabha river.",
		description:
			"Pattadakal is a group of eight major temples and a number of smaller shrines on the bank of the Malaprabha river in northern Karnataka. It served the Chalukyas of Badami as a ceremonial site, and the temples were built largely in the seventh and eighth centuries.",
		history:
			"The Chalukyas ruled the Deccan from Badami, with Aihole and Pattadakal as associated centres. Pattadakal was used for royal coronations. The Virupaksha temple was built by Queen Lokamahadevi around 740 to mark a Chalukyan victory over the Pallavas, and its architects appear to have drawn directly on Pallava work at Kanchipuram.",
		architecture:
			"The interest of Pattadakal is that both principal Indian temple idioms appear together: four temples in the northern nagara style, with curved shikharas, and four in the southern dravida style, with stepped, storeyed vimanas. Virupaksha and Mallikarjuna are the largest of the southern group; Kashi Vishwanatha and Galaganatha represent the northern. The Jain temple sits slightly apart. Sculpture on the walls carries narrative sequences from the Ramayana, Mahabharata and Puranas.",
		significance:
			"Pattadakal is where the two great streams of Indian temple architecture can be compared directly, built by the same patrons within a short span. It is effectively a working laboratory of eighth-century architectural practice, preserved intact.",
		unescoCriteria:
			"Inscribed in 1987 under criteria (iii) and (iv) as an outstanding testimony to Chalukyan civilisation and an eclectic high point of temple architecture.",
		visitorInfo:
			"Open daily. Pattadakal is usually visited together with Badami and Aihole, which lie within about twenty kilometres and complete the Chalukyan sequence. Early morning gives the best light on the river-facing elevations.",
		keyFacts: [
			{ label: "Temples", value: "Eight major, plus smaller shrines" },
			{ label: "Styles", value: "Nagara and dravida, side by side" },
			{ label: "Virupaksha temple", value: "c. 740 CE" },
			{ label: "UNESCO criteria", value: "(iii), (iv)" },
			{ label: "Inscribed", value: "1987" },
		],
	},
	{
		slug: "humayuns-tomb",
		name: "Humayun's Tomb",
		place: "Delhi",
		inscribed: 1993,
		period: "1560s",
		blurb:
			"The first great Mughal garden tomb, and the direct architectural ancestor of the Taj Mahal — a domed mausoleum set at the centre of a garden quartered by water channels.",
		alt: "Humayun's Tomb in red sandstone and white marble, seen across its garden.",
		description:
			"Humayun's Tomb stands in a walled garden in the Nizamuddin area of Delhi, built for the second Mughal emperor. It established, on Indian soil, the pattern that Mughal imperial tombs would follow for the next century: a monumental domed mausoleum raised on a plinth at the centre of a formal charbagh.",
		history:
			"Humayun died in 1556. The tomb was commissioned by his widow, Bega Begum, and completed around 1570, with Mirak Mirza Ghiyas named as architect. The complex declined with the empire, and the gardens were substantially altered under British occupation. A major conservation programme from the late 1990s restored the water channels and garden layout.",
		architecture:
			"The mausoleum is built in red sandstone with white marble inlay and stands on a high arcaded plinth containing further graves. It carries a double dome — an inner shell shaping the chamber below and an outer shell giving the external profile — an approach later used at the Taj Mahal. The charbagh divides the garden into four quarters with intersecting water channels and paths, a plan carrying Persian precedent into India at scale.",
		significance:
			"Nearly everything that makes the Taj Mahal what it is appears here first: the garden tomb, the double dome, the plinth, the strict symmetry. It is also the point at which Persian form and Indian material and craft settle into a single working style.",
		unescoCriteria:
			"Inscribed in 1993 under criteria (ii) and (iv) for its influence on later architecture and as an outstanding example of the Mughal garden tomb.",
		visitorInfo:
			"Open daily from sunrise to sunset. The wider complex includes Isa Khan's tomb, which predates the mausoleum, and the adjacent Sunder Nursery. Allow two hours to see the site properly.",
		keyFacts: [
			{ label: "Completed", value: "c. 1570" },
			{ label: "Commissioned by", value: "Bega Begum" },
			{ label: "Architect", value: "Mirak Mirza Ghiyas" },
			{ label: "Garden plan", value: "Charbagh" },
			{ label: "Inscribed", value: "1993" },
		],
	},
	{
		slug: "fatehpur-sikri",
		name: "Fatehpur Sikri",
		place: "Agra district, Uttar Pradesh",
		inscribed: 1986,
		period: "1571–1585",
		blurb:
			"A complete Mughal capital built in red sandstone and abandoned within about fifteen years — which is why it survives as a city plan rather than a ruin overwritten by later building.",
		alt: "The red sandstone courtyards and pavilions of Fatehpur Sikri.",
		description:
			"Fatehpur Sikri is a walled city about forty kilometres west of Agra, built by Akbar as his capital and occupied only briefly. Its palaces, courts, mosque and administrative buildings survive largely as constructed, because almost nothing was built over them afterwards.",
		history:
			"Akbar founded the city in 1571, traditionally in fulfilment of a vow after the Sufi saint Salim Chishti foretold the birth of an heir. The court moved there and the principal buildings went up quickly in local red sandstone. It was effectively abandoned by about 1585, with water supply usually given as the reason, and the capital moved to Lahore and later back to Agra.",
		architecture:
			"The buildings are trabeated — post and beam, cut in sandstone — rather than arched, drawing on Gujarati and Rajasthani craft traditions as much as Persian ones. The Diwan-i-Khas has a single central pillar with a carved capital supporting radiating bridges. The Buland Darwaza, added around 1576, is a gateway some fifty-four metres high. Salim Chishti's tomb, in white marble with pierced screens, sits within the mosque courtyard. The Panch Mahal is a five-storeyed open pavilion of diminishing tiers.",
		significance:
			"Fatehpur Sikri is the most complete surviving Mughal city plan, and the clearest statement of Akbar's synthesis: Hindu, Jain and Islamic forms and craft used together in one programme, at one moment, by one patron.",
		unescoCriteria:
			"Inscribed in 1986 under criteria (ii), (iii) and (iv) for its influence, its testimony to Mughal civilisation, and as an outstanding architectural ensemble.",
		visitorInfo:
			"Open daily from sunrise to sunset. The mosque complex and Salim Chishti's tomb are still in religious use and free to enter; the palace complex is ticketed. Shoes are removed in the mosque courtyard, which is uncomfortably hot underfoot in summer.",
		keyFacts: [
			{ label: "Built", value: "1571–1585" },
			{ label: "Founder", value: "Akbar" },
			{ label: "Buland Darwaza", value: "About 54 m high" },
			{ label: "Material", value: "Red sandstone" },
			{ label: "Inscribed", value: "1986" },
		],
	},
	{
		slug: "goa-churches",
		name: "Churches and Convents of Goa",
		place: "Velha Goa, Goa",
		inscribed: 1986,
		period: "16th–17th century",
		blurb:
			"The surviving religious core of the Portuguese capital in Asia, where European Baroque and Manueline forms were built in laterite and local craft — and from which those forms spread across Asia.",
		alt: "The laterite facade of the Basilica of Bom Jesus at Velha Goa.",
		description:
			"The property covers the churches and convents of Old Goa, the former Portuguese colonial capital on the Mandovi river. What survives is a group of monumental religious buildings; the surrounding city was largely abandoned after repeated epidemics and is now mostly cleared ground.",
		history:
			"The Portuguese took Goa in 1510 and made it the seat of their Estado da Índia. Church building followed through the sixteenth and seventeenth centuries. Malaria and cholera outbreaks from the seventeenth century onward emptied the city, and the administration moved downriver to Panjim in the eighteenth. The religious buildings remained.",
		architecture:
			"The Basilica of Bom Jesus, completed in 1605, is built in exposed laterite with a Baroque facade and holds the remains of St Francis Xavier in a silver casket on a marble monument. The Sé Cathedral, the largest church in Asia when finished, is Portuguese-Manueline outside and Corinthian within. The Church of St Francis of Assisi, the Chapel of St Catherine and the tower of St Augustine complete the principal group. Construction is in local laterite, often plastered, with limestone and timber detail worked by Indian craftsmen.",
		significance:
			"These buildings carried European ecclesiastical architecture into Asia and became the model for churches across the Portuguese sphere from Africa to Japan. They also record what happens when an imported style meets local material: laterite behaves nothing like European stone, and the buildings show it.",
		unescoCriteria:
			"Inscribed in 1986 under criteria (ii), (iv) and (vi) for the spread of these forms across Asia and their association with the evangelisation of the region.",
		visitorInfo:
			"Open daily and free to enter; the Basilica remains an active place of worship and holds services. Old Goa is about ten kilometres from Panjim. The relics of St Francis Xavier are exposed publicly only at intervals of several years.",
		keyFacts: [
			{ label: "Location", value: "Velha Goa (Old Goa)" },
			{ label: "Basilica of Bom Jesus", value: "Completed 1605" },
			{ label: "Material", value: "Laterite, plaster, limestone" },
			{ label: "UNESCO criteria", value: "(ii), (iv), (vi)" },
			{ label: "Inscribed", value: "1986" },
		],
	},
	{
		slug: "bodh-gaya",
		name: "Mahabodhi Temple Complex",
		place: "Bodh Gaya, Bihar",
		inscribed: 2002,
		period: "3rd century BCE onward; present temple 5th–6th century CE",
		blurb:
			"The place where the Buddha is held to have attained enlightenment, marked by a descendant of the original tree and one of the earliest surviving brick temples in India.",
		alt: "The tall brick tower of the Mahabodhi Temple at Bodh Gaya.",
		description:
			"The Mahabodhi Temple Complex marks the site of the Buddha's enlightenment. It contains the main temple, the Bodhi tree, the Vajrasana or diamond throne, and a series of six sacred places associated with the weeks the Buddha is said to have spent there after enlightenment, together with votive stupas.",
		history:
			"Ashoka is credited with the first shrine at the site in the third century BCE, and the polished sandstone Vajrasana is attributed to him. The present temple is generally dated to the fifth or sixth century CE, with substantial later restoration, including major nineteenth-century work under Alexander Cunningham and Joseph Beglar. The tree now standing is held to descend from the original.",
		architecture:
			"The temple is built of brick — unusual for a surviving structure of this age in India — and rises about fifty metres in a straight-sided pyramidal tower with a series of stepped niches and small corner towers repeating the form. A stone railing, parts of which are earlier than the temple, surrounds the complex; sections are original and sections are later replacement.",
		significance:
			"Bodh Gaya is the most important of the four principal Buddhist pilgrimage sites, and the temple is one of the earliest brick structures still standing in the subcontinent. Its form influenced Buddhist architecture across Asia, and reproductions of it were built as far away as Myanmar and Thailand.",
		unescoCriteria:
			"Inscribed in 2002 under criteria (i), (ii), (iii), (iv) and (vi), covering its architectural achievement, its influence, and its direct association with the life of the Buddha.",
		visitorInfo:
			"Open daily from early morning to late evening, and free to enter. It remains an active pilgrimage site with monasteries built by many Buddhist countries nearby. Security screening applies and bags are restricted.",
		keyFacts: [
			{ label: "Marks", value: "Site of the Buddha's enlightenment" },
			{ label: "Present temple", value: "5th–6th century CE" },
			{ label: "Height", value: "About 50 m" },
			{ label: "Material", value: "Brick" },
			{ label: "Inscribed", value: "2002" },
		],
	},
	{
		slug: "mountain-railways",
		name: "Mountain Railways of India",
		place: "Darjeeling, the Nilgiris and Kalka–Shimla",
		inscribed: 1999,
		period: "1881–1908",
		blurb:
			"Three working narrow-gauge lines that solved the problem of getting a train up a mountain — by loops, zigzags and a rack section rather than by tunnelling through it.",
		alt: "A narrow-gauge steam locomotive on a mountain railway in India.",
		description:
			"The property covers three separate railways: the Darjeeling Himalayan Railway in West Bengal, the Nilgiri Mountain Railway in Tamil Nadu, and the Kalka–Shimla Railway in Himachal Pradesh. All three are still in service.",
		history:
			"The Darjeeling line opened in 1881 and was inscribed first, in 1999. The Nilgiri Mountain Railway, begun in 1899 and completed in 1908, was added in 2005, and the Kalka–Shimla Railway, opened in 1903, in 2008. All were built to connect hill stations to the plains under British administration, and all have remained in continuous operation since.",
		architecture:
			"Each line answers the gradient differently. Darjeeling uses loops and Z-reverses to gain height on a two-foot gauge, climbing to about 2,200 metres. The Nilgiri line is the steepest in Asia and uses an Abt rack-and-pinion system on its central section, with locomotives pushing rather than pulling. Kalka–Shimla runs on a two-foot-six-inch gauge through more than a hundred tunnels and over eight hundred bridges and viaducts.",
		significance:
			"These are engineering solutions to mountain terrain that were exported and copied, and they are unusual among World Heritage properties in being working infrastructure rather than preserved relics. Steam locomotives over a century old are still in scheduled service on the Darjeeling line.",
		unescoCriteria:
			"Inscribed in 1999, extended 2005 and 2008, under criteria (ii) and (iv) as an influential and outstanding example of railway engineering in difficult terrain.",
		visitorInfo:
			"All three carry regular passenger services and tickets can be booked through Indian Railways. Joy rides over shorter sections are available on the Darjeeling line. Services are subject to landslide closures in the monsoon.",
		keyFacts: [
			{ label: "Lines", value: "Darjeeling, Nilgiri, Kalka–Shimla" },
			{ label: "Opened", value: "1881, 1908, 1903" },
			{ label: "Nilgiri system", value: "Abt rack and pinion" },
			{ label: "Status", value: "Still in scheduled service" },
			{ label: "Inscribed", value: "1999, extended 2005 and 2008" },
		],
	},
	{
		slug: "bhimbetka",
		name: "Rock Shelters of Bhimbetka",
		place: "Raisen district, Madhya Pradesh",
		inscribed: 2003,
		period: "Mesolithic onward",
		blurb:
			"Sandstone shelters carrying painted images made over tens of thousands of years — and villages at the foot of the hill whose life still resembles what is painted on the walls above.",
		alt: "Prehistoric paintings in red and white on the wall of a rock shelter at Bhimbetka.",
		description:
			"Bhimbetka is a dense group of natural rock shelters in the Vindhyan hills, about forty-five kilometres south of Bhopal. Several hundred shelters carry paintings, of which a subset is open to visitors. The site records human occupation over an exceptionally long span.",
		history:
			"The shelters were identified as significant by V. S. Wakankar in 1957. Excavation has produced stone tools from the Acheulean onward, and the painted sequence is generally taken to begin in the Mesolithic and continue, in layers, into the historic period. Some walls carry images from several widely separated periods superimposed.",
		architecture:
			"The paintings are in natural pigments, predominantly red and white, with some green and yellow. Subjects include hunting scenes, animals — bison, tigers, rhinoceros, elephants — dancers, and later horses and riders with weapons that place those images much closer to the present. The shelters themselves are formed by weathering of the quartzitic sandstone.",
		significance:
			"Bhimbetka holds some of the earliest known traces of human life on the subcontinent, and the paintings give an unusually direct view of how people lived. UNESCO's citation notes the continuity between what is painted on the rock and the practices of the villages immediately below the hill.",
		unescoCriteria:
			"Inscribed in 2003 under criteria (iii) and (v) as testimony to a long cultural tradition and as an outstanding example of a human settlement in interaction with its environment.",
		visitorInfo:
			"Open daily. A marked circuit covers about fifteen of the shelters and takes roughly ninety minutes on foot. The site is easily combined with Sanchi, which lies on the other side of Bhopal.",
		keyFacts: [
			{ label: "Shelters", value: "Several hundred; about 15 on the circuit" },
			{ label: "Identified", value: "1957, by V. S. Wakankar" },
			{ label: "Earliest paintings", value: "Mesolithic" },
			{ label: "Pigments", value: "Red and white ochres" },
			{ label: "Inscribed", value: "2003" },
		],
	},
	{
		slug: "chhatrapati-shivaji-terminus",
		name: "Chhatrapati Shivaji Maharaj Terminus",
		place: "Mumbai, Maharashtra",
		inscribed: 2004,
		period: "1878–1888",
		blurb:
			"A Victorian Gothic railway terminus built with Indian ornament — and one of the busiest working stations in the country, moving millions of commuters a day beneath the stone carving.",
		alt: "The Victorian Gothic facade and central dome of Chhatrapati Shivaji Maharaj Terminus.",
		description:
			"Formerly Victoria Terminus, the station is the headquarters of Central Railway and one of the busiest railway stations in India. It is a working terminus, not a museum, and the building carries the load of an ordinary weekday alongside its heritage status.",
		history:
			"Designed by Frederick William Stevens, construction ran from 1878 to 1888 and the building was named for Queen Victoria in her jubilee year. It was renamed Chhatrapati Shivaji Terminus in 1996 and Chhatrapati Shivaji Maharaj Terminus in 2017. The building was among the sites attacked in November 2008.",
		architecture:
			"The design is High Victorian Gothic Revival — pointed arches, a ribbed dome, gargoyles and a skyline of turrets — executed in local yellow Kurla stone with Italian marble and blue-grey granite detail. The ornament was carved by students of the Sir Jamsetjee Jeejebhoy School of Art, and the vocabulary is Indian: peacocks, monkeys, elephants and local floral forms worked into Gothic framing. A statue representing Progress crowns the dome.",
		significance:
			"CSMT is the fullest expression of the hybrid style that developed in nineteenth-century Bombay, where a European structural idiom was executed by Indian craftsmen using Indian motifs. UNESCO describes it as an outstanding example of that meeting.",
		unescoCriteria:
			"Inscribed in 2004 under criteria (ii) and (iv) for the interchange of Victorian Gothic and Indian traditions and as an outstanding example of that fusion.",
		visitorInfo:
			"The concourse is open to ticket-holders as a functioning station. Heritage tours of the administrative wing run at set times through Central Railway. The exterior is best seen in the evening, when the facade is lit.",
		keyFacts: [
			{ label: "Built", value: "1878–1888" },
			{ label: "Architect", value: "Frederick William Stevens" },
			{
				label: "Style",
				value: "Victorian Gothic Revival with Indian ornament",
			},
			{ label: "Status", value: "Working terminus" },
			{ label: "Inscribed", value: "2004" },
		],
	},
	{
		slug: "champaner-pavagadh",
		name: "Champaner-Pavagadh Archaeological Park",
		place: "Panchmahal district, Gujarat",
		inscribed: 2004,
		period: "8th–16th century",
		blurb:
			"A short-lived capital below a hill fort, holding what UNESCO calls the only complete and unchanged pre-Mughal Islamic city still standing.",
		alt: "The carved stone minarets and dome of the Jami Masjid at Champaner.",
		description:
			"The property covers the ruined city of Champaner on the plain and the fortified hill of Pavagadh above it, together with prehistoric sites, hill forts, palaces, religious buildings, residential quarters and water installations spanning roughly eight centuries.",
		history:
			"Pavagadh was held by successive Rajput rulers before Sultan Mahmud Begada took it in 1484 after a long siege and made Champaner his capital, renaming it Muhammadabad. The city flourished briefly and was effectively abandoned after the Mughal conquest in 1535, when the capital returned to Ahmedabad. It was never substantially rebuilt.",
		architecture:
			"The Jami Masjid, completed around 1513, is the principal building: a large congregational mosque with two tall carved minarets, a richly worked entrance porch, and more than a hundred pillars, blending Islamic form with Gujarati craft detail. Other structures include the Kevada Masjid, the Nagina Masjid, stepwells and an extensive water-management system. The Kalika Mata temple on the summit of Pavagadh remains an important pilgrimage site.",
		significance:
			"Because Champaner was abandoned rather than overbuilt, it preserves a pre-Mughal Islamic capital essentially as it stood — a condition UNESCO notes as unique. The site also shows Hindu and Islamic architecture in the same landscape, with the hill shrine still in active worship above the ruined city.",
		unescoCriteria:
			"Inscribed in 2004 under criteria (iii), (iv), (v) and (vi) for its testimony, its architecture, its settlement pattern and its living religious associations.",
		visitorInfo:
			"Open daily. The plain-level monuments are easily walked; the summit is reached by a long stair or by ropeway and is busy with pilgrims, particularly during Navratri.",
		keyFacts: [
			{ label: "Capital", value: "1484–1535, under Mahmud Begada" },
			{ label: "Jami Masjid", value: "c. 1513" },
			{ label: "Span covered", value: "8th–16th century" },
			{ label: "UNESCO criteria", value: "(iii), (iv), (v), (vi)" },
			{ label: "Inscribed", value: "2004" },
		],
	},
	{
		slug: "jantar-mantar",
		name: "The Jantar Mantar, Jaipur",
		place: "Jaipur, Rajasthan",
		inscribed: 2010,
		period: "1727–1734",
		blurb:
			"An observatory of masonry instruments built to be read by eye, including the largest stone sundial in the world — accurate, in principle, to about two seconds.",
		alt: "The large masonry sundial and astronomical instruments of the Jantar Mantar in Jaipur.",
		description:
			"The Jantar Mantar is a collection of nineteen fixed astronomical instruments built in masonry and stone, designed for naked-eye observation. It is the largest and best preserved of five such observatories built by Sawai Jai Singh II.",
		history:
			"Jai Singh II, ruler of Amber and founder of Jaipur, built observatories at Delhi, Jaipur, Ujjain, Mathura and Varanasi in the first half of the eighteenth century. The Jaipur instruments were constructed between 1727 and 1734. Jai Singh drew on Islamic, Hindu and European astronomical traditions, and had Ptolemaic and contemporary European work translated for the purpose.",
		architecture:
			"The instruments are architectural in scale, built because size increases precision when reading by eye. The Samrat Yantra, a right-triangle gnomon about twenty-seven metres high with quadrant scales on either side, is the largest stone sundial in the world. The Jai Prakash Yantra is a pair of hemispherical bowls sunk into the ground, marked so an observer can read a star's position directly. The Ram Yantra measures altitude and azimuth; twelve Rashivalaya instruments are each aligned to a zodiac sign.",
		significance:
			"The observatory is a monumental expression of the astronomical knowledge of its period, and a case of scientific instruments built at architectural scale. It remains in a condition where the instruments can still be read.",
		unescoCriteria:
			"Inscribed in 2010 under criteria (iii) and (iv) as testimony to the astronomical skills of its period and an outstanding example of a monumental observatory.",
		visitorInfo:
			"Open daily. Guides are available and worth taking, because the instruments are difficult to interpret unaided. The site sits beside the City Palace and Hawa Mahal in the walled city.",
		keyFacts: [
			{ label: "Built", value: "1727–1734" },
			{ label: "Founder", value: "Sawai Jai Singh II" },
			{ label: "Instruments", value: "19" },
			{ label: "Samrat Yantra", value: "About 27 m; largest stone sundial" },
			{ label: "Inscribed", value: "2010" },
		],
	},
	{
		slug: "hill-forts-rajasthan",
		name: "Hill Forts of Rajasthan",
		place: "Chittorgarh, Kumbhalgarh, Ranthambore, Amber, Jaisalmer and Gagron",
		inscribed: 2013,
		period: "8th–18th century",
		blurb:
			"Six Rajput forts using the hills themselves as fortification, each enclosing a working town rather than a garrison — one with a wall said to be second in length only to the Great Wall of China.",
		alt: "The ramparts of a Rajput hill fort following the contours of a ridge.",
		description:
			"A serial property of six forts across Rajasthan: Chittorgarh, Kumbhalgarh, Sawai Madhopur (Ranthambore), Jhalawar (Gagron), Jaipur (Amber) and Jaisalmer. Each is an extensive fortified enclosure containing palaces, temples, water structures and urban quarters.",
		history:
			"The forts were built and rebuilt between roughly the eighth and eighteenth centuries under various Rajput states. Chittorgarh, the largest, was besieged repeatedly and is associated with the jauhar of its defenders. Amber served the Kachhwahas before Jaipur was founded on the plain below. Jaisalmer is unusual in remaining continuously inhabited.",
		architecture:
			"The defining principle is the use of terrain: walls follow ridgelines and cliffs rather than imposing a geometric plan, so the hill does much of the defensive work. Kumbhalgarh's perimeter wall runs some thirty-six kilometres. Within the walls the forts contain palaces, Hindu and Jain temples, stepwells and tanks — water management being as strategically important as the walls. Jaisalmer is built in yellow sandstone that gives the whole fort a single colour.",
		significance:
			"Together the six show Rajput military architecture over a thousand years, and record a form of fortification that encloses a functioning settlement rather than a purely military post. Jaisalmer remains a living fort with residents inside the walls, which brings its own conservation problems.",
		unescoCriteria:
			"Inscribed in 2013 under criteria (ii) and (iii) for the interchange of Rajput architectural traditions and as testimony to Rajput culture.",
		visitorInfo:
			"All six are open to visitors and each requires separate travel; they are spread across the state. Jaisalmer's fort is inhabited, and visitors are asked to be mindful of water use, which has contributed to structural damage.",
		keyFacts: [
			{ label: "Forts", value: "Six, across Rajasthan" },
			{ label: "Kumbhalgarh wall", value: "About 36 km" },
			{ label: "Span", value: "8th–18th century" },
			{ label: "UNESCO criteria", value: "(ii), (iii)" },
			{ label: "Inscribed", value: "2013" },
		],
	},
	{
		slug: "rani-ki-vav",
		name: "Rani-ki-Vav, the Queen's Stepwell",
		place: "Patan, Gujarat",
		inscribed: 2014,
		period: "11th century",
		blurb:
			"A stepwell built as an inverted temple, descending seven storeys through more than five hundred principal sculptures — silted over for centuries, which is why the carving is so sharp.",
		alt: "The descending sculpted galleries of the Rani-ki-Vav stepwell at Patan.",
		description:
			"Rani-ki-Vav is a stepwell on the bank of the Saraswati river at Patan, built as a memorial and as a water source. It is organised as an inverted temple, descending in stages to the water table, with the shaft at the far end.",
		history:
			"The stepwell is attributed to Queen Udayamati, in memory of her husband Bhima I of the Chaulukya dynasty, and dated to the eleventh century. The Saraswati flooded and the well silted up, burying it for centuries. It was excavated by the Archaeological Survey of India in the 1980s, and the sculpture emerged in remarkable condition precisely because it had been packed in silt rather than exposed.",
		architecture:
			"The well descends through seven levels of stairs and galleries to a rectangular shaft. More than five hundred principal sculptures and over a thousand minor ones cover the walls, most on religious themes; Vishnu in his ten avatars is prominent, together with apsaras and nagakanyas. The design treats water as sacred and the descent as a ritual sequence rather than a utility.",
		significance:
			"Rani-ki-Vav is the high point of the stepwell as a building type, and demonstrates a subterranean water architecture developed for a region of scarce and seasonal rainfall. Its condition makes it the best surviving example of Maru-Gurjara sculpture at scale.",
		unescoCriteria:
			"Inscribed in 2014 under criteria (i) and (iv) as a masterpiece of craftsmanship and an outstanding example of subterranean water architecture.",
		visitorInfo:
			"Open daily. Descent into the lower levels is restricted to protect the sculpture, so the deepest galleries are viewed from above. Patan is about 130 kilometres from Ahmedabad and is also known for Patola weaving.",
		keyFacts: [
			{ label: "Built", value: "11th century" },
			{ label: "Attributed to", value: "Queen Udayamati" },
			{ label: "Levels", value: "Seven" },
			{ label: "Sculptures", value: "Over 500 principal figures" },
			{ label: "Inscribed", value: "2014" },
		],
	},
	{
		slug: "nalanda",
		name: "Archaeological Site of Nalanda Mahavihara",
		place: "Nalanda district, Bihar",
		inscribed: 2016,
		period: "3rd century BCE – 13th century CE",
		blurb:
			"The excavated remains of a monastic university that ran for some eight hundred years and drew students from across Asia — brick monasteries and temples in rows, and a library said to have burned for months.",
		alt: "Excavated brick monastery foundations and stupas at Nalanda.",
		description:
			"Nalanda Mahavihara was a Buddhist monastic and scholastic institution in what is now Bihar. The excavated site covers monasteries, temples, stupas and shrines built in brick over successive periods, laid out along a north–south axis.",
		history:
			"Activity at the site runs from about the third century BCE. The great monastic university was established under the Guptas in the fifth century CE and continued to the thirteenth, attracting students from China, Korea, Japan, Tibet and South-East Asia. The Chinese pilgrim Xuanzang studied and taught there in the seventh century and left a detailed account. The institution was sacked in the late twelfth or early thirteenth century, and tradition holds that its library burned for an extended period.",
		architecture:
			"The excavated plan is unusually regular: a row of monasteries on the east facing a row of temples on the west, separated by a broad path. The monasteries follow a standard plan of cells around a courtyard, several rebuilt in place so that earlier structures survive within later ones. Temple Site No. 3 is a stepped stupa enlarged repeatedly, with earlier shells preserved inside.",
		significance:
			"Nalanda is the most complete surviving example of an ancient centre of organised higher learning, and the transmission point from which Buddhist scholarship reached much of Asia. The stratified rebuilding makes it an exceptional record of monastic architecture developing over eight centuries.",
		unescoCriteria:
			"Inscribed in 2016 under criteria (iv) and (vi) as an outstanding example of an educational and religious institution and for its association with the transmission of Buddhism.",
		visitorInfo:
			"Open daily except Friday. The adjacent archaeological museum holds sculpture and bronzes from the site. Rajgir and the modern Nalanda University lie nearby.",
		keyFacts: [
			{ label: "Active", value: "5th–13th century as a university" },
			{ label: "Recorded by", value: "Xuanzang, 7th century" },
			{ label: "Material", value: "Brick" },
			{ label: "UNESCO criteria", value: "(iv), (vi)" },
			{ label: "Inscribed", value: "2016" },
		],
	},
	{
		slug: "chandigarh-capitol",
		name: "Capitol Complex, Chandigarh",
		place: "Chandigarh",
		inscribed: 2016,
		period: "1952–1965",
		blurb:
			"Le Corbusier's government precinct for a new state capital — India's contribution to a transnational World Heritage property spread across seven countries.",
		alt: "The concrete portico of the Palace of Assembly in Chandigarh's Capitol Complex.",
		description:
			"The Capitol Complex is the government precinct of Chandigarh, comprising the Palace of Assembly, the High Court, the Secretariat and a series of monuments including the Open Hand. It is the Indian component of the serial property 'The Architectural Work of Le Corbusier'.",
		history:
			"After Partition, Punjab lost its capital at Lahore and a new city was planned. Albert Mayer and Matthew Nowicki produced the first scheme; after Nowicki's death, Le Corbusier was engaged in 1951, working with Pierre Jeanneret, Maxwell Fry and Jane Drew. The Capitol buildings were constructed through the 1950s and into the 1960s. The transnational property, covering seventeen sites in seven countries, was inscribed in 2016.",
		architecture:
			"The buildings are in board-marked reinforced concrete, using the vocabulary Le Corbusier developed in his late work: brise-soleil sun-breakers sized to the latitude, sculptural roof forms, and the Modulor proportional system. The High Court sits under a great parasol roof; the Assembly has a hyperbolic tower over its chamber and a sculptural portico. The Open Hand, a rotating metal sculpture, is the city's emblem.",
		significance:
			"Chandigarh is one of the few twentieth-century planned capitals realised largely as designed, and the Capitol is the fullest built statement of Le Corbusier's late architectural language. Its inclusion recognises the modern movement as heritage in its own right.",
		unescoCriteria:
			"Inscribed in 2016 as part of a transnational serial property under criteria (i), (ii) and (vi), for its creative genius, its worldwide influence and its association with the modern movement.",
		visitorInfo:
			"The Capitol Complex sits close to the Punjab–Haryana border and access is controlled. Free guided tours run at fixed times daily and must be arranged in advance with photo identification; independent wandering is not permitted.",
		keyFacts: [
			{ label: "Architect", value: "Le Corbusier" },
			{ label: "Built", value: "1952–1965" },
			{ label: "Material", value: "Board-marked reinforced concrete" },
			{ label: "Property", value: "Transnational, 7 countries" },
			{ label: "Inscribed", value: "2016" },
		],
	},
	{
		slug: "ahmadabad",
		name: "Historic City of Ahmadabad",
		place: "Ahmedabad, Gujarat",
		inscribed: 2017,
		period: "15th century onward",
		blurb:
			"India's first World Heritage city: a walled sultanate capital of gated residential quarters, where Hindu and Jain craft traditions were put to work on Islamic buildings.",
		alt: "The carved stone tracery window of the Sidi Saiyyed Mosque in Ahmedabad.",
		description:
			"The inscribed area is the walled city on the east bank of the Sabarmati, founded by Sultan Ahmad Shah. It comprises mosques and tombs of the sultanate period, Hindu and Jain temples, and the dense residential fabric of the pols — gated neighbourhood clusters with shared courtyards, wells and bird feeders.",
		history:
			"Ahmad Shah I founded the city in 1411 as the capital of the Gujarat Sultanate. It became a major centre of textile production and trade, passed to the Mughals in 1573, and continued as a commercial city under later regimes and into the colonial period. It was the base for much of Gandhi's activity in India from 1915.",
		architecture:
			"The sultanate architecture of Gujarat is distinctive for absorbing local temple craft: minarets, mihrabs and domes executed with the carving vocabulary of Hindu and Jain masons. The Jami Masjid of 1424 stands on some 260 columns. The Sidi Saiyyed Mosque's pierced stone tracery window, cut as an intertwined tree, is the city's emblem. Beyond the monuments, the pols form a residential typology of narrow streets, timber-fronted houses and internal courtyards.",
		significance:
			"Ahmadabad was the first Indian city inscribed as a whole rather than as a set of monuments, recognising an urban fabric where sultanate architecture, Hindu and Jain building, and a distinctive residential pattern have coexisted for six centuries.",
		unescoCriteria:
			"Inscribed in 2017 under criteria (ii) and (v) for the interchange of architectural traditions and as an outstanding example of a traditional human settlement.",
		visitorInfo:
			"The municipal corporation runs a heritage walk through the pols each morning, starting from the Swaminarayan temple at Kalupur. The walled city is best covered on foot; vehicle access is difficult.",
		keyFacts: [
			{ label: "Founded", value: "1411, by Ahmad Shah I" },
			{ label: "Jami Masjid", value: "1424" },
			{ label: "Residential form", value: "Pols" },
			{ label: "First Indian", value: "World Heritage city" },
			{ label: "Inscribed", value: "2017" },
		],
	},
	{
		slug: "mumbai-ensembles",
		name: "Victorian Gothic and Art Deco Ensembles of Mumbai",
		place: "Mumbai, Maharashtra",
		inscribed: 2018,
		period: "19th–20th century",
		blurb:
			"Two architectural eras facing each other across an open maidan — Victorian Gothic public buildings on one side, a 1930s Art Deco seafront on the other.",
		alt: "Art Deco apartment blocks along Marine Drive in Mumbai.",
		description:
			"The property covers two adjacent building groups in south Mumbai: a nineteenth-century Victorian Gothic ensemble of public buildings, and a twentieth-century Art Deco ensemble along the reclaimed seafront, separated by the Oval Maidan.",
		history:
			"The Victorian buildings went up from the 1860s as Bombay expanded on cotton-boom money, following the demolition of the fort walls. The Art Deco buildings followed in the 1930s on land reclaimed at Backbay, built largely for and by Indian owners. The result is two complete architectural statements from consecutive eras, in direct sight of each other.",
		architecture:
			"The Victorian group — the High Court, the University with its Rajabai Clock Tower, the Public Works Department buildings — is Gothic Revival adapted to the climate, with verandas, balconies and shaded openings, and ornament drawn from Indian sources. The Art Deco group along Marine Drive and around the Oval comprises apartment blocks and cinemas in streamlined forms with curved corners, ziggurat motifs, coloured glass and Indian decorative detail, a local variant sometimes called Deco-Saracenic.",
		significance:
			"Mumbai holds one of the largest concentrations of Art Deco buildings in the world, second only to Miami by most counts. The property records how imported styles were localised twice over, seventy years apart, by a city that was in both periods among the wealthiest in Asia.",
		unescoCriteria:
			"Inscribed in 2018 under criteria (ii) and (iv) for the exchange of architectural influences and as outstanding examples of both styles adapted to local conditions.",
		visitorInfo:
			"The ensembles are streets and working buildings, best seen on foot around the Oval Maidan, Fort and Marine Drive. The High Court and University interiors have restricted access.",
		keyFacts: [
			{ label: "Two ensembles", value: "Victorian Gothic and Art Deco" },
			{ label: "Periods", value: "1860s onward; 1930s onward" },
			{ label: "Separated by", value: "The Oval Maidan" },
			{ label: "UNESCO criteria", value: "(ii), (iv)" },
			{ label: "Inscribed", value: "2018" },
		],
	},
	{
		slug: "jaipur-city",
		name: "Jaipur City, Rajasthan",
		place: "Jaipur, Rajasthan",
		inscribed: 2019,
		period: "Founded 1727",
		blurb:
			"A planned city laid out on a grid in 1727 — unusual in India for being built on open ground to a single scheme, with commerce designed into the street plan from the start.",
		alt: "The pink sandstone facade of the Hawa Mahal in Jaipur.",
		description:
			"The inscribed property is the walled city of Jaipur, founded by Sawai Jai Singh II and laid out on a grid of wide streets with continuous colonnaded market frontages, gates, and a palace and observatory quarter at its centre.",
		history:
			"Jai Singh II moved his capital down from the hill fort at Amber in 1727, choosing flat ground and a planned layout. Vidyadhar Bhattacharya is credited with the plan. The uniform pink wash that gives the city its nickname was applied in the nineteenth century, and has been maintained since.",
		architecture:
			"The plan is a grid of nine sectors with a chessboard logic drawn from Vastu principles, adapted to the terrain. Streets are unusually wide and lined with continuous arcaded shopfronts of consistent height, making commerce part of the urban design rather than an afterthought. Within the plan sit the City Palace, the Jantar Mantar observatory and the Hawa Mahal, whose five-storey screen of small windows allowed the women of the court to watch the street unseen.",
		significance:
			"Jaipur is an exceptional example of eighteenth-century urban planning, exchanging medieval defensive hill siting for a commercial grid on the plain. It shows Mughal, Rajput and Western planning ideas combined in a single deliberate scheme that is still legible and still inhabited.",
		unescoCriteria:
			"Inscribed in 2019 under criteria (ii), (iv) and (vi) for the interchange of planning ideas, as an outstanding example of urban planning, and for its living traditions.",
		visitorInfo:
			"The walled city is open ground and free to walk; the City Palace, Jantar Mantar and Hawa Mahal are individually ticketed and a composite ticket exists. The bazaars are busiest in the evening.",
		keyFacts: [
			{ label: "Founded", value: "1727, by Sawai Jai Singh II" },
			{ label: "Planner", value: "Vidyadhar Bhattacharya" },
			{ label: "Plan", value: "Nine-sector grid" },
			{ label: "UNESCO criteria", value: "(ii), (iv), (vi)" },
			{ label: "Inscribed", value: "2019" },
		],
	},
	{
		slug: "ramappa-temple",
		name: "Kakatiya Rudreshwara (Ramappa) Temple",
		place: "Palampet, Telangana",
		inscribed: 2021,
		period: "13th century",
		blurb:
			"A Kakatiya temple known by the name of its sculptor rather than its patron, built on a floating foundation of sand and roofed with bricks light enough to float on water.",
		alt: "The carved basalt bracket figures and stepped tower of the Ramappa Temple.",
		description:
			"The Rudreshwara temple at Palampet is a Shaiva temple of the Kakatiya period, standing on a star-shaped platform with a pillared hall and richly carved bracket figures. It is universally called the Ramappa temple after the sculptor said to have worked on it for decades.",
		history:
			"An inscription at the site records construction beginning in 1213 under Recharla Rudra, a general of the Kakatiya ruler Ganapati Deva. The temple survived later earthquakes that damaged surrounding structures, which is generally attributed to its foundation technique. Marco Polo is traditionally said to have called it the brightest star in the galaxy of temples, though the attribution is not securely documented.",
		architecture:
			"The temple sits on a sandbox foundation — a pit filled with a mix of sand, lime, jaggery and other materials — which absorbs seismic movement rather than resisting it. The superstructure uses bricks so light they float in water, reducing the load on the roof. The base and pillars are in dark basalt polished to a high finish, with slender bracket figures of dancers and musicians cut almost in the round, and the outer walls carry friezes of processions and narrative scenes.",
		significance:
			"The temple is a demonstration of Kakatiya engineering as much as sculpture: the floating foundation and lightweight roofing bricks are solutions to seismic and structural problems that have kept the building standing for eight centuries. The bracket figures are also a primary source for the dance and dress of the period.",
		unescoCriteria:
			"Inscribed in 2021 under criterion (i) as a masterpiece of human creative genius.",
		visitorInfo:
			"Open daily and about seventy kilometres from Warangal. The temple remains in worship. The nearby Ramappa lake, a Kakatiya-period tank, is part of the same landscape.",
		keyFacts: [
			{ label: "Begun", value: "1213 CE" },
			{ label: "Patron", value: "Recharla Rudra, under Ganapati Deva" },
			{ label: "Foundation", value: "Sandbox, seismically absorbent" },
			{ label: "Roof bricks", value: "Light enough to float" },
			{ label: "Inscribed", value: "2021" },
		],
	},
	{
		slug: "dholavira",
		name: "Dholavira: A Harappan City",
		place: "Kachchh district, Gujarat",
		inscribed: 2021,
		period: "c. 3000–1500 BCE",
		blurb:
			"A Harappan city on a salt-flat island, built around an extraordinary system of reservoirs — and carrying a signboard in a script nobody can read.",
		alt: "Excavated stone walls and reservoirs of the Harappan city at Dholavira.",
		description:
			"Dholavira occupies Khadir island in the Rann of Kachchh and is one of the largest Harappan sites in India. Unlike the brick-built cities of the Indus plain, it was constructed largely in stone, and its most striking feature is a cascading network of water reservoirs.",
		history:
			"The site was occupied from roughly 3000 to 1500 BCE, through a full sequence from an early phase to the post-urban decline, which makes it valuable for tracking the civilisation's whole arc in one place. It was discovered in 1967 by J. P. Joshi and excavated substantially from 1989 under R. S. Bisht.",
		architecture:
			"The city divides into a fortified castle, a bailey, a middle town and a lower town, with an unusually large open ceremonial ground between them. Sixteen or more reservoirs, cut and built in stone, collected monsoon runoff from two seasonal streams — a water-conservation system on a scale not seen elsewhere in the civilisation, and the direct response to an arid site. A ten-sign inscription in large gypsum letters, the so-called Dholavira signboard, was found near the north gate.",
		significance:
			"Dholavira shows the Harappan urban model adapted to an extreme environment, with water management as the organising principle of the whole plan. Its stone construction and complete occupation sequence make it a distinct and unusually legible case among Indus sites.",
		unescoCriteria:
			"Inscribed in 2021 under criteria (iii) and (iv) as exceptional testimony to the Harappan civilisation and an outstanding example of its urban planning.",
		visitorInfo:
			"Open daily; the site is remote and reached across the Rann from Bhuj, roughly a four-hour drive. There is an on-site museum. Summer heat is severe and winter is the practical season to visit.",
		keyFacts: [
			{ label: "Occupied", value: "c. 3000–1500 BCE" },
			{ label: "Construction", value: "Stone, not brick" },
			{ label: "Reservoirs", value: "16 or more" },
			{ label: "Signboard", value: "Ten signs, undeciphered" },
			{ label: "Inscribed", value: "2021" },
		],
	},
	{
		slug: "santiniketan",
		name: "Santiniketan",
		place: "Birbhum district, West Bengal",
		inscribed: 2023,
		period: "1901 onward",
		blurb:
			"The school Rabindranath Tagore built in rural Bengal, where classes were held under trees and an art movement grew up around a deliberate rejection of the colonial academy.",
		alt: "A mural-decorated building at Visva-Bharati, Santiniketan.",
		description:
			"Santiniketan began as a residential school founded by Rabindranath Tagore in 1901 and grew into Visva-Bharati, a university built on the idea of an education drawing on Indian and world traditions together rather than on the British colonial model.",
		history:
			"Debendranath Tagore, Rabindranath's father, established an ashram on the site in the 1860s. Rabindranath founded the school in 1901 with a handful of pupils. It expanded into Visva-Bharati in 1921 and became a central university in 1951. Kala Bhavana, its art school, was the base for Nandalal Bose, Benode Behari Mukherjee and Ramkinkar Baij, whose work shaped modern Indian art.",
		architecture:
			"The campus is a collection of pavilions, studios and hostels set among trees, with teaching traditionally conducted outdoors. Buildings incorporate murals, terracotta relief and sculpture made by staff and students rather than commissioned decoration. Ramkinkar Baij's outdoor cement-and-laterite sculptures stand around the grounds. The whole was designed to reject the monumental colonial campus in favour of something closer to an ashram.",
		significance:
			"Santiniketan is a built expression of an educational and artistic philosophy: pan-Asian in outlook, anti-colonial in intent, and rural by choice. It was the seedbed of Bengali modernism and remains a working university.",
		unescoCriteria:
			"Inscribed in 2023 under criteria (iv) and (vi) as an outstanding example of an educational ensemble and for its association with Tagore's ideas and their global influence.",
		visitorInfo:
			"A working campus; visitors are asked to respect teaching. The Rabindra Bhavana museum holds Tagore's manuscripts and belongings. Poush Mela in December and Basanta Utsav in spring are the busiest periods.",
		keyFacts: [
			{ label: "Founded", value: "1901, by Rabindranath Tagore" },
			{ label: "Became Visva-Bharati", value: "1921" },
			{ label: "Art school", value: "Kala Bhavana" },
			{ label: "UNESCO criteria", value: "(iv), (vi)" },
			{ label: "Inscribed", value: "2023" },
		],
	},
	{
		slug: "hoysala-temples",
		name: "Sacred Ensembles of the Hoysalas",
		place: "Belur, Halebidu and Somanathapura, Karnataka",
		inscribed: 2023,
		period: "12th–13th century",
		blurb:
			"Three temples in soapstone, carved to a density that has more in common with metalwork than masonry — star-shaped in plan, and signed by the sculptors who made them.",
		alt: "Densely carved soapstone friezes on a Hoysala temple wall.",
		description:
			"The property covers the Chennakeshava temple at Belur, the Hoysaleswara temple at Halebidu, and the Keshava temple at Somanathapura. All three are Hoysala-period temples, and all three are extraordinary for the density and precision of their carving.",
		history:
			"The Hoysalas ruled much of what is now Karnataka between the eleventh and fourteenth centuries. Chennakeshava at Belur was begun around 1117 under Vishnuvardhana; Hoysaleswara at Halebidu followed later in the twelfth century; Keshava at Somanathapura was completed in 1268. Halebidu was sacked in the fourteenth century and its towers were never rebuilt.",
		architecture:
			"The temples are built on stellate — star-shaped — plans raised on a jagati platform, which multiplies the wall surface available for carving. The stone is chloritic schist, soft when quarried and hardening on exposure, which allows undercutting fine enough to produce free-standing detail: jewellery with separate strands, bracelet beads that move. Wall friezes run in continuous horizontal bands of elephants, horsemen, foliage and narrative scenes from the epics. Unusually, many carvings are signed by their sculptors.",
		significance:
			"Hoysala temples represent a distinct regional idiom, neither northern nor purely southern, taken to a technical extreme. The signatures are also notable: they name individual craftsmen at a period when that was rare anywhere.",
		unescoCriteria:
			"Inscribed in 2023 under criteria (i) and (ii) as a masterpiece of creative genius and for the exchange of architectural developments.",
		visitorInfo:
			"Belur and Halebidu lie about sixteen kilometres apart and are usually visited together, roughly four hours from Bengaluru. Somanathapura is separate, near Mysuru, and is no longer an active temple.",
		keyFacts: [
			{ label: "Temples", value: "Belur, Halebidu, Somanathapura" },
			{ label: "Belur begun", value: "c. 1117" },
			{ label: "Somanathapura", value: "Completed 1268" },
			{ label: "Stone", value: "Chloritic schist (soapstone)" },
			{ label: "Inscribed", value: "2023" },
		],
	},
	{
		slug: "moidams",
		name: "Moidams — the Mound-Burial System of the Ahom Dynasty",
		place: "Charaideo, Assam",
		inscribed: 2024,
		period: "13th–19th century",
		blurb:
			"Six centuries of royal burial mounds in Assam, built on a hill chosen for the purpose — the first cultural property from India's north-east on the World Heritage List.",
		alt: "Grass-covered hemispherical burial mounds at Charaideo, Assam.",
		description:
			"The moidams are the mound burials of the Ahom dynasty, concentrated at Charaideo, the dynasty's first capital. Each consists of a vaulted chamber beneath a hemispherical earth mound, enclosed within a boundary wall with an arched gateway.",
		history:
			"The Ahoms established their rule in the Brahmaputra valley in 1228 under Sukapha and governed for close to six hundred years, until the Burmese invasions and the British annexation of the early nineteenth century. Charaideo remained the sacred burial ground throughout, even after the administrative capital moved. Many moidams were plundered in the nineteenth century.",
		architecture:
			"A moidam has a hollow vault of brick or stone beneath a mound of packed earth, topped in some cases by a small pavilion, and surrounded by an octagonal wall. Grave goods and, in earlier practice, retainers were interred with the ruler. The scale varies with the status of the person buried. The mounds sit within a designed landscape of hills, forest and water.",
		significance:
			"The moidams are the surviving physical record of a dynasty that governed the Brahmaputra valley for six centuries and repelled repeated Mughal advances. Their inscription in 2024 brought India's north-east onto the cultural World Heritage list for the first time.",
		unescoCriteria:
			"Inscribed in 2024 under criteria (iii) and (iv) as exceptional testimony to the Ahom funerary tradition and an outstanding example of its architecture.",
		visitorInfo:
			"Charaideo lies about thirty kilometres from Sivasagar in upper Assam. The main cluster is maintained by the Archaeological Survey of India and open daily.",
		keyFacts: [
			{ label: "Dynasty", value: "Ahom, 1228–1826" },
			{ label: "Site", value: "Charaideo, the first Ahom capital" },
			{ label: "Form", value: "Vaulted chamber under an earth mound" },
			{ label: "First from", value: "India's north-east, culturally" },
			{ label: "Inscribed", value: "2024" },
		],
	},
	{
		slug: "maratha-forts",
		name: "Maratha Military Landscapes of India",
		place: "Maharashtra and Tamil Nadu",
		inscribed: 2025,
		period: "17th–19th century",
		blurb:
			"A network of forts sited across hill, coast and island, built to a strategy rather than a plan — the physical logic of Maratha power written across a landscape.",
		alt: "A Maratha sea fort with stone ramparts rising from the coast.",
		description:
			"The property is a serial nomination of forts in Maharashtra and Tamil Nadu, spanning hill forts, hill-forest forts, hill-plateau forts, coastal forts and island forts. Together they represent the fortification system developed under Shivaji and extended by his successors.",
		history:
			"Shivaji established Maratha power in the seventeenth century, using terrain and mobility against larger armies. Raigad became his capital and the site of his coronation in 1674. Coastal and island forts such as Sindhudurg and Vijaydurg supported a navy that was unusual among Indian powers of the period. The network continued in use under the Peshwas into the early nineteenth century.",
		architecture:
			"The defining characteristic is siting rather than a shared architectural style: each fort exploits the specific terrain it occupies, whether a basalt scarp of the Western Ghats, a forested ridge, a headland or a rock in the sea. Common features include concealed approaches, staged gateways set at angles to prevent a straight charge, cisterns and granaries for long sieges, and — at the sea forts — foundations laid directly onto tidal rock.",
		significance:
			"The Maratha forts show a military system built around geography and mobility rather than mass and permanence, and they include one of the few substantial naval fortification programmes mounted by an Indian power. India's forty-fourth property, inscribed in 2025.",
		unescoCriteria:
			"Inscribed in 2025 under criteria (iv) and (vi) as an outstanding example of a fortification system and for its association with Maratha history.",
		visitorInfo:
			"The forts are spread widely and visited individually. Raigad is reached by a long stair or ropeway; Sindhudurg is reached by boat from Malvan. Hill forts are best attempted outside the monsoon, when paths become dangerous.",
		keyFacts: [
			{ label: "Forts", value: "Serial property across two states" },
			{ label: "Associated with", value: "Shivaji and the Marathas" },
			{ label: "Types", value: "Hill, forest, plateau, coastal, island" },
			{ label: "Raigad coronation", value: "1674" },
			{ label: "Inscribed", value: "2025" },
		],
	},
	{
		slug: "kaziranga",
		name: "Kaziranga National Park",
		place: "Golaghat and Nagaon districts, Assam",
		inscribed: 1985,
		category: "natural",
		period: "Protected from 1905",
		blurb:
			"Floodplain grassland on the Brahmaputra holding roughly two-thirds of the world's greater one-horned rhinoceros — a species that was down to a few dozen animals a century ago.",
		alt: "A greater one-horned rhinoceros in the tall grassland of Kaziranga.",
		description:
			"Kaziranga occupies the alluvial floodplain of the Brahmaputra in Assam, a mosaic of tall elephant grass, marshland, shallow pools and semi-evergreen forest. It holds the largest population of the greater one-horned rhinoceros anywhere.",
		history:
			"Mary Curzon, wife of the Viceroy, is credited with prompting protection after visiting in 1904 and failing to see a single rhino. A reserved forest was declared in 1905, the area became a game sanctuary and then a national park in 1974. Rhino numbers have recovered from a few dozen to over two thousand, though poaching remains a continuing pressure.",
		landscape:
			"The park is defined by the annual flood: the Brahmaputra inundates much of it each monsoon, renewing the grassland and forcing animals onto higher ground and across the highway to the Karbi Anglong hills. Besides rhino it holds significant populations of wild water buffalo, eastern swamp deer and Asian elephant, and one of the highest densities of tiger of any protected area. Birdlife is exceptional, and the park is an Important Bird Area.",
		significance:
			"Kaziranga is one of conservation's clearest recoveries, and the flood-driven grassland it protects is a habitat that has almost entirely disappeared elsewhere in the region. The annual inundation is not a threat to be engineered away but the process that sustains the system.",
		unescoCriteria:
			"Inscribed in 1985 under criteria (ix) and (x) for its ecological processes and the significance of its habitat for in-situ conservation of biodiversity.",
		visitorInfo:
			"Open roughly November to April and closed during the monsoon. Access is by jeep or elephant-back safari through designated ranges. Kohora is the main entry point, on the Guwahati–Jorhat highway.",
		keyFacts: [
			{ label: "Protected", value: "From 1905; national park 1974" },
			{ label: "Key species", value: "Greater one-horned rhinoceros" },
			{ label: "Habitat", value: "Brahmaputra floodplain grassland" },
			{ label: "UNESCO criteria", value: "(ix), (x)" },
			{ label: "Inscribed", value: "1985" },
		],
	},
	{
		slug: "keoladeo",
		name: "Keoladeo National Park",
		place: "Bharatpur, Rajasthan",
		inscribed: 1985,
		category: "natural",
		period: "Created 18th century as a duck reserve",
		blurb:
			"A wetland that began as an artificial duck-shooting reserve for the rulers of Bharatpur and is now one of the most important wintering grounds for waterbirds in Asia.",
		alt: "Waterbirds wading among submerged trees in the wetland at Keoladeo.",
		description:
			"Keoladeo is a mosaic of shallow freshwater marsh, grassland, woodland and swamp covering about twenty-nine square kilometres on the edge of Bharatpur. It is entirely man-made in origin and entirely dependent on managed water.",
		history:
			"The wetland was created in the eighteenth century by the Maharaja of Bharatpur, who dammed and flooded a natural depression to make a duck reserve. Shoots continued into the twentieth century with very large recorded bags. It became a bird sanctuary in 1956, a national park in 1982, and was inscribed in 1985. Grazing was banned in 1982, a decision that proved ecologically contentious.",
		landscape:
			"Water is supplied from the Ajan Bund and has to be actively managed; in dry years the marsh can fail, and water allocation is a recurring conflict with agriculture. The park records well over three hundred bird species. It was formerly the only known wintering site in India for the western population of the Siberian crane, which has not been recorded here since 2002 and is presumed lost from this flyway.",
		significance:
			"Keoladeo demonstrates that a wholly artificial habitat can become internationally critical, and it is a case study in the difficulty of managing one: its ecology now depends on decisions about water release and grazing rather than on leaving it alone.",
		unescoCriteria:
			"Inscribed in 1985 under criterion (x) for the significance of its habitat for the conservation of biological diversity, particularly waterbirds.",
		visitorInfo:
			"Open all year; the wintering season from October to February is the reason to come. Vehicles are restricted, and the park is covered on foot, by bicycle or by cycle-rickshaw with trained guides.",
		keyFacts: [
			{ label: "Origin", value: "18th-century artificial duck reserve" },
			{ label: "Area", value: "About 29 km²" },
			{ label: "Bird species", value: "Over 300 recorded" },
			{ label: "Siberian crane", value: "Not recorded since 2002" },
			{ label: "Inscribed", value: "1985" },
		],
	},
	{
		slug: "manas",
		name: "Manas Wildlife Sanctuary",
		place: "Assam",
		inscribed: 1985,
		category: "natural",
		period: "Protected from 1928",
		blurb:
			"Grassland and forest against the Bhutan foothills, holding species found almost nowhere else — and removed from the danger list in 2011 after two decades of conflict and recovery.",
		alt: "Grassland and forest of the Manas Wildlife Sanctuary below the Bhutan hills.",
		description:
			"Manas lies on a gentle slope of the Himalayan foothills in western Assam, on the border with Bhutan, where the Manas river leaves the hills. It combines alluvial grassland, tropical evergreen and moist deciduous forest, and continues across the border as Bhutan's Royal Manas National Park.",
		history:
			"Declared a sanctuary in 1928 and inscribed in 1985, Manas was placed on the List of World Heritage in Danger in 1992 following civil unrest during which infrastructure was destroyed and rhino were wiped out locally. It was removed from the danger list in 2011 after sustained restoration work, including rhino translocation, much of it involving local Bodo communities.",
		landscape:
			"The sanctuary spans the transition from Himalayan foothill forest to the floodplain grasslands of the Brahmaputra basin, which accounts for its unusual species range. It holds populations of tiger, Asian elephant, greater one-horned rhinoceros and wild water buffalo, together with rarities including the pygmy hog, hispid hare, golden langur and Bengal florican — several of which have their most significant populations here.",
		significance:
			"Manas is both an exceptional biodiversity site and a demonstration that a property can be brought back from the danger list. The recovery depended on the participation of the communities living around it rather than on exclusion.",
		unescoCriteria:
			"Inscribed in 1985 under criteria (vii), (ix) and (x) for its natural beauty, ongoing ecological processes and biodiversity significance.",
		visitorInfo:
			"Open roughly November to April. Bansbari, near Barpeta Road, is the main range; Mathanguri sits on the river at the Bhutan border. Jeep safaris and river rafting are available.",
		keyFacts: [
			{ label: "Protected", value: "From 1928" },
			{ label: "In Danger", value: "1992–2011" },
			{ label: "Adjoins", value: "Royal Manas National Park, Bhutan" },
			{ label: "Rarities", value: "Pygmy hog, golden langur, Bengal florican" },
			{ label: "Inscribed", value: "1985" },
		],
	},
	{
		slug: "sundarbans",
		name: "Sundarbans National Park",
		place: "South 24 Parganas, West Bengal",
		inscribed: 1987,
		category: "natural",
		period: "National park from 1984",
		blurb:
			"The Indian portion of the largest mangrove forest on earth, cut by tidal creeks and holding a tiger population that swims between islands.",
		alt: "Mangrove forest and tidal creeks in the Sundarbans delta.",
		description:
			"The Sundarbans National Park covers the Indian part of the mangrove delta formed where the Ganges, Brahmaputra and Meghna meet the Bay of Bengal. The wider Sundarbans continues into Bangladesh, where it is separately inscribed.",
		history:
			"The forest has been worked for timber, honey and fish for centuries. The core area was declared a tiger reserve in 1973, a national park in 1984, and inscribed in 1987. It is also a biosphere reserve and a Ramsar site.",
		landscape:
			"The delta is a shifting network of islands, mudflats and tidal channels, flooded twice daily and reshaped continuously by silt and storm. Vegetation is dominated by salt-tolerant mangrove species adapted to unstable, oxygen-poor mud. The Bengal tigers here are noted for swimming between islands and for a pattern of human conflict unusual elsewhere. Estuarine crocodile, Gangetic and Irrawaddy dolphins, water monitor and a very large number of bird species are present.",
		significance:
			"The Sundarbans is the largest contiguous mangrove system in the world and a working example of an ecosystem defined by disturbance. It is also a first line of defence against cyclones for a densely populated delta, and among the properties most exposed to sea-level rise.",
		unescoCriteria:
			"Inscribed in 1987 under criteria (ix) and (x) for its ecological and biological processes and its biodiversity significance.",
		visitorInfo:
			"Access is by boat only, generally from Godkhali near Canning. Permits are required and most visitors go on organised multi-day boat trips. Watchtowers at Sudhanyakhali and Sajnekhali are the usual viewing points; tiger sightings are rare.",
		keyFacts: [
			{ label: "Ecosystem", value: "Largest mangrove forest on earth" },
			{ label: "Tiger reserve", value: "1973; national park 1984" },
			{ label: "Continues into", value: "Bangladesh" },
			{ label: "UNESCO criteria", value: "(ix), (x)" },
			{ label: "Inscribed", value: "1987" },
		],
	},
	{
		slug: "nanda-devi",
		name: "Nanda Devi and Valley of Flowers National Parks",
		place: "Chamoli district, Uttarakhand",
		inscribed: 1988,
		category: "natural",
		period: "Parks from 1982 and 1982",
		blurb:
			"A high-altitude basin ringed by peaks and closed to entry for decades, beside a valley that fills each monsoon with alpine flowers.",
		alt: "Alpine meadow in bloom below snow peaks in the Valley of Flowers.",
		description:
			"The property combines two adjacent parks in the Garhwal Himalaya: the Nanda Devi National Park, a glacial basin enclosed by a ring of high peaks around India's second-highest mountain, and the Valley of Flowers National Park, an alpine valley known for its seasonal flowering.",
		history:
			"Nanda Devi's inner sanctuary was reached by climbers only in 1934. Heavy expedition traffic and grazing led to closure of the core zone in 1983, and the area has been largely off-limits since, which has allowed substantial recovery. Nanda Devi was inscribed in 1988 and the Valley of Flowers added as an extension in 2005.",
		landscape:
			"The Nanda Devi basin is a near-enclosed glacial amphitheatre surrounded by peaks above 6,000 metres, holding high-altitude meadow, birch and rhododendron. The Valley of Flowers, at around 3,600 metres, carries several hundred flowering plant species that bloom in succession through the monsoon. Fauna includes snow leopard, Himalayan musk deer, Asiatic black bear, blue sheep and Himalayan monal.",
		significance:
			"The two parks together protect a full Himalayan altitudinal sequence and an unusually intact high-altitude ecosystem. Nanda Devi's closure is one of the few cases where access was withdrawn to let a site recover, and it worked.",
		unescoCriteria:
			"Inscribed in 1988, extended 2005, under criteria (vii) and (x) for exceptional natural beauty and biodiversity significance.",
		visitorInfo:
			"The Nanda Devi core zone remains closed. The Valley of Flowers is open roughly June to early October and reached on foot from Govindghat via Ghangaria, a trek of around seventeen kilometres. The flowering peaks in late July and August.",
		keyFacts: [
			{ label: "Nanda Devi", value: "India's second-highest peak" },
			{ label: "Core zone", value: "Closed since 1983" },
			{ label: "Valley of Flowers", value: "Added 2005" },
			{ label: "Flowering season", value: "July–August" },
			{ label: "Inscribed", value: "1988" },
		],
	},
	{
		slug: "western-ghats",
		name: "Western Ghats",
		place: "Kerala, Tamil Nadu, Karnataka, Goa, Maharashtra and Gujarat",
		inscribed: 2012,
		category: "natural",
		period: "Older than the Himalaya",
		blurb:
			"A mountain chain running parallel to the west coast that makes the Indian monsoon behave as it does — and one of the world's eight hottest biodiversity hotspots.",
		alt: "Forested ridges of the Western Ghats under monsoon cloud.",
		description:
			"The Western Ghats run roughly 1,600 kilometres along the western edge of the Indian peninsula. The World Heritage property is a serial nomination of thirty-nine sites — national parks, wildlife sanctuaries and reserved forests — across six states.",
		history:
			"The range is geologically older than the Himalaya and its forests have been continuously occupied and used for millennia. Modern protection began piecemeal through the twentieth century as individual sanctuaries. The serial property was inscribed in 2012 after a long and contested nomination process, with concerns raised locally about restrictions on land use.",
		landscape:
			"The Ghats intercept the south-west monsoon and force it to rise, which is why the windward slopes are among the wettest places on earth and the leeward Deccan is dry. Habitats range from tropical evergreen and shola forest to montane grassland. Endemism is exceptionally high, particularly in amphibians, fish and flowering plants — a large share of the species found here occur nowhere else. Populations of Asian elephant, tiger, lion-tailed macaque and Nilgiri tahr are of global importance.",
		significance:
			"The Ghats are a primary control on the Indian monsoon, and therefore on the agriculture and water supply of a very large population. They are also one of the world's most significant concentrations of endemic species, which is why they are ranked among the top biodiversity hotspots.",
		unescoCriteria:
			"Inscribed in 2012 under criteria (ix) and (x) for ongoing ecological and biological processes and for their exceptional biodiversity and endemism.",
		visitorInfo:
			"The property is a network rather than a single destination. Accessible components include Periyar and Silent Valley in Kerala, Mudumalai in Tamil Nadu, and Kudremukh in Karnataka. The monsoon months bring landslides and leeches.",
		keyFacts: [
			{ label: "Length", value: "About 1,600 km" },
			{ label: "Component sites", value: "39, across six states" },
			{ label: "Older than", value: "The Himalaya" },
			{ label: "Status", value: "Global biodiversity hotspot" },
			{ label: "Inscribed", value: "2012" },
		],
	},
	{
		slug: "great-himalayan",
		name: "Great Himalayan National Park Conservation Area",
		place: "Kullu district, Himachal Pradesh",
		inscribed: 2014,
		category: "natural",
		period: "National park from 1999",
		blurb:
			"A park covering the headwaters of four rivers, protected from the glaciers down to the valley forests — the whole altitudinal range in one property.",
		alt: "Alpine meadow and snow peaks in the Great Himalayan National Park.",
		description:
			"The conservation area covers the upper catchments of the Jiwa Nal, Sainj, Tirthan and Parvati rivers in the Kullu district of Himachal Pradesh, protecting a continuous sequence from valley forest up to high alpine zones and glaciers.",
		history:
			"The park was established in 1984 and formally notified in 1999. Its creation displaced traditional grazing and medicinal-plant collection rights, and a substantial part of the subsequent management effort has gone into ecodevelopment arrangements with the villages around the boundary. It was inscribed in 2014.",
		landscape:
			"Altitude ranges from around 1,500 to over 6,000 metres, which compresses several life zones into a short horizontal distance. Vegetation runs from deodar and oak forest through birch to alpine meadow and permanent snow. The park protects populations of western tragopan, Himalayan monal, musk deer, blue sheep, Himalayan brown bear and snow leopard. Because the entire catchment is protected, the rivers rise inside the property.",
		significance:
			"Protecting complete catchments rather than fragments is what makes this property unusual: the hydrological system it contains is intact from source downward. It sits within the Western Himalaya biodiversity hotspot and holds species with very restricted ranges.",
		unescoCriteria:
			"Inscribed in 2014 under criterion (x) for the significance of its habitats for in-situ conservation of biological diversity.",
		visitorInfo:
			"Entry is on foot; there are no roads inside the park. Treks start from Gushaini and Neuli in the Tirthan and Sainj valleys and require permits. The season runs roughly April to June and September to October.",
		keyFacts: [
			{ label: "Notified", value: "1999" },
			{ label: "Altitude range", value: "About 1,500–6,000 m" },
			{ label: "Protects", value: "Four complete river catchments" },
			{ label: "UNESCO criteria", value: "(x)" },
			{ label: "Inscribed", value: "2014" },
		],
	},
	{
		slug: "khangchendzonga",
		name: "Khangchendzonga National Park",
		place: "Sikkim",
		inscribed: 2016,
		category: "mixed",
		period: "National park from 1977",
		blurb:
			"India's only mixed World Heritage property: a park around the world's third-highest mountain, inscribed for its ecology and for the sacred meaning the mountain holds for the people who live below it.",
		alt: "The snow peaks of Khangchendzonga above forested ridges in Sikkim.",
		description:
			"The park covers a large part of northern and western Sikkim, centred on Khangchendzonga, the third-highest mountain in the world. It was inscribed under both natural and cultural criteria — the only Indian property in that category.",
		history:
			"The park was established in 1977 and expanded subsequently. Khangchendzonga is regarded as sacred in Sikkimese Buddhist and Lepcha tradition, understood as a protective deity, and this is reflected in local practice: Sikkim's summit is by convention left untrodden, and climbers stop short of the true top. The property was inscribed in 2016.",
		landscape:
			"Altitude runs from about 1,200 metres to 8,586 at the summit, giving subtropical forest, temperate broadleaf and conifer forest, alpine meadow and extensive glaciers within one property. The Zemu glacier is among the largest in the eastern Himalaya. Wildlife includes snow leopard, Himalayan black bear, red panda, blue sheep and Himalayan tahr.",
		significance:
			"Khangchendzonga is inscribed for the inseparability of its natural and cultural values: the mountain is both an exceptional ecological system and a sacred landscape whose meanings are still actively held. Indigenous belief here functions as a form of protection rather than as a heritage exhibit.",
		unescoCriteria:
			"Inscribed in 2016 under criteria (iii), (vi), (vii) and (x) — the only mixed property in India, recognised for both cultural association and natural significance.",
		visitorInfo:
			"Permits are required for Sikkim and additionally for protected areas within it. The Goecha La trek from Yuksom is the usual route toward the massif. Trekking seasons are spring and autumn.",
		keyFacts: [
			{ label: "Summit", value: "8,586 m; third-highest in the world" },
			{ label: "Property type", value: "Mixed — India's only one" },
			{ label: "Altitude range", value: "About 1,200–8,586 m" },
			{ label: "Sacred to", value: "Sikkimese Buddhist and Lepcha tradition" },
			{ label: "Inscribed", value: "2016" },
		],
	},
];

/**
 * Every documented property: the original selection first, then the rest of the
 * World Heritage list. Pages read this rather than `monuments` so that adding an
 * entry above is all it takes to surface it site-wide.
 */
export const allMonuments: Monument[] = [...monuments, ...additionalMonuments];

export interface DanceForm {
	slug: string;
	name: string;
	state: string;
	/** Rough span in which the form took the shape it is taught in today. */
	origin: string;
	note: string;
	/** Longer description for the detail page. */
	description: string;
	/** How the form reached its present state, including any revival. */
	history: string;
	/** Stance, vocabulary, and what the body is actually asked to do. */
	technique: string;
	/** The items performed, and in what order where an order is fixed. */
	repertoire: string;
	/** Musical system, instruments, and language of the sung text. */
	music: string;
	/** Why it matters, and what is at stake in keeping it. */
	significance: string;
	keyFacts: { label: string; value: string }[];
}

/** The eight forms recognised as classical by the Sangeet Natak Akademi. */
export const danceForms: DanceForm[] = [
	{
		slug: "bharatanatyam",
		name: "Bharatanatyam",
		state: "Tamil Nadu",
		origin: "Temple and court practice; recast for the stage in the 1930s",
		note: "Temple dance of the Kaveri delta, rebuilt for the stage in the twentieth century. Geometry held in a half-seated stance.",
		description:
			"A solo form built on straight lines and symmetry, danced almost entirely from a half-seated position with the knees turned out. Its material divides cleanly into nritta — pure rhythmic movement with no meaning attached — and abhinaya, where the hands, face and eyes carry a sung text. Almost every image people hold of Indian classical dance comes from this form.",
		history:
			"Bharatanatyam descends from sadir, also called dasiattam, performed by devadasis in the temples and courts of the Tamil country. The late nineteenth and early twentieth-century anti-nautch campaign attacked the hereditary system that sustained it, and the Madras Devadasis (Prevention of Dedication) Act of 1947 ended the practice of temple dedication outright. In the same decades E. Krishna Iyer campaigned for the dance itself to be separated from the institution, and Rukmini Devi Arundale founded Kalakshetra in 1936, moving the form onto the proscenium stage under the name it now carries. What survives is therefore a reconstruction: continuous in vocabulary, broken in transmission.",
		technique:
			"The base position is araimandi, a half-seat with the knees opened to the sides and the spine held vertical. Movement is assembled from adavus, fixed units combining a footfall, an arm line and a hand shape. Meaning is carried by mudras — codified hand positions — read together with the eyes and eyebrows. The theoretical frame is the Natya Shastra, with the Abhinaya Darpana supplying much of the hand vocabulary in use.",
		repertoire:
			"A full recital follows the margam, an order that moves from pure rhythm toward interpretation and back: alarippu, jatiswaram, shabdam, varnam, padam, javali and tillana. The varnam sits at the centre and is the longest and most demanding item, alternating rhythmic passages with sustained interpretation of a single line of text.",
		music:
			"Carnatic music. The nattuvanar leads with cymbals, keeping the rhythmic syllables; a vocalist carries the text, with mridangam, violin or veena and flute. Sung texts are commonly in Tamil, Telugu or Sanskrit.",
		significance:
			"Bharatanatyam is the most widely taught Indian classical form in the world, and the clearest case of a tradition that survived by being institutionalised. That rescue is also a loss: the community that held the dance for centuries was dispossessed of it in the process, and the history of the devadasis is part of the form's record, not a footnote to it.",
		keyFacts: [
			{ label: "State", value: "Tamil Nadu" },
			{ label: "Earlier name", value: "Sadir, dasiattam" },
			{ label: "Base stance", value: "Araimandi" },
			{ label: "Music", value: "Carnatic" },
			{ label: "Recital order", value: "Margam" },
		],
	},
	{
		slug: "kathak",
		name: "Kathak",
		state: "Uttar Pradesh",
		origin: "Temple storytelling; court form from the 16th century onward",
		note: "Storytellers' form carried from temple courtyard into Mughal court, where it took its spin and its footwork.",
		description:
			"The only classical form of northern India, and the only one danced from an upright, unbent stance. Kathak is built on two things: rhythm worked out in the feet against a drummer, and narrative delivered in gesture and expression. Its signature is the chakkar, a fast turn on a fixed spot, repeated in multiples that resolve exactly on the beat.",
		history:
			"The name comes from kathakar, a storyteller who recited epic material in temple courtyards. From the sixteenth century the form was taken up in the courts of northern India, and under Mughal and later Awadh patronage it absorbed Persian dress, a secular repertoire and an emphasis on virtuosity. Three gharanas carry it: Lucknow, associated with Bindadin Maharaj and weighted toward expression; Jaipur, weighted toward rhythmic complexity and footwork; and Banaras. Under colonial rule the form was pushed to the margins along with the courts that kept it, and was rebuilt after 1947 through the same institutional route as the other classical forms.",
		technique:
			"The body stays upright, weight even, with none of the deep knee-bend of the southern forms. Rhythm is played out in tatkar, footwork sounded against strings of ankle bells — often a hundred or more per ankle — and structured in tihais, phrases stated three times so that the last syllable lands on the first beat of the cycle. Turns are taken on the ball of one foot with the spine held vertical.",
		repertoire:
			"A recital typically opens slow, with invocation and a gradual laying-out of the rhythmic cycle, then builds through composed pieces — thaat, aamad, tora, tukra, paran — toward faster passages of pure rhythm. Expressive items set thumri or bhajan texts, most often on Krishna, and are usually placed as contrast between rhythmic sections.",
		music:
			"Hindustani music. Tabla or pakhawaj holds the rhythmic cycle, with sarangi or harmonium accompanying the melody; the dancer and the drummer trade phrases directly. Sung texts are commonly in Braj Bhasha, Hindi or Urdu.",
		significance:
			"Kathak is where two traditions met without either replacing the other: a Hindu narrative form that spent three centuries in Muslim courts and came out carrying both. It is the clearest performing-arts evidence that the composite culture of northern India was not a slogan but a working practice.",
		keyFacts: [
			{ label: "State", value: "Uttar Pradesh" },
			{ label: "From", value: "Kathakar, a storyteller" },
			{ label: "Gharanas", value: "Lucknow, Jaipur, Banaras" },
			{ label: "Music", value: "Hindustani" },
			{ label: "Signature", value: "Chakkar and tatkar" },
		],
	},
	{
		slug: "kathakali",
		name: "Kathakali",
		state: "Kerala",
		origin: "17th century, from Ramanattam and Krishnanattam",
		note: "Night-long drama in painted mask-like makeup. Meaning is carried in the hands and, above all, the eyes.",
		description:
			"A dance-drama performed through the night, in which the actors never speak. Everything is delivered through hand gestures, a rigorously trained face, and a body held in a wide, low, outward-turned stance. The makeup takes hours to apply and turns the face into a coloured mask that is still fully mobile.",
		history:
			"Kathakali took shape in seventeenth-century Kerala, developing out of Ramanattam — a cycle of plays on the Ramayana attributed to Kottarakkara Thampuran — which in turn answered the earlier Krishnanattam. Behind both sit the much older Sanskrit theatre of Kutiyattam and the ritual performance traditions of the region, including Theyyam and Mudiyettu. The form was in decline by the early twentieth century; the poet Vallathol Narayana Menon founded Kerala Kalamandalam in 1930, which put its training on an institutional footing and is the main reason it survives.",
		technique:
			"Training begins in childhood and includes a full-body oil massage regime and specific exercises for the eyes, which must move independently and hold sustained expression at a distance. The gesture vocabulary follows the Hastalakshana Deepika, with twenty-four basic hand shapes combined into a working language. The nine rasas are drilled as discrete facial states. Character type is written directly into the makeup: pacha, green, for the noble; kathi, knife, for the arrogant anti-hero; thadi for bearded types; kari, black, for forest dwellers and demons; minukku, polished, for women and sages.",
		repertoire:
			"Plays are drawn from the Mahabharata, the Ramayana and the Puranas, staged as attakatha — texts written specifically for the form. A traditional performance runs from evening until dawn, lit historically by a single large oil lamp at the front of the stage.",
		music:
			"Sopanam-derived vocal style, with two singers narrating the text while the actors perform it. Percussion is heavy and central: chenda and maddalam drums, with chengila gong and elathalam cymbals.",
		significance:
			"Kathakali is the most complete surviving example of the Indian idea that theatre, dance and music are one discipline rather than three. It also carries an unusual burden of training time — a performer is not considered formed for a decade or more — which makes each break in transmission expensive to repair.",
		keyFacts: [
			{ label: "State", value: "Kerala" },
			{ label: "Emerged", value: "17th century" },
			{ label: "Performer speaks", value: "No; singers narrate" },
			{ label: "Makeup types", value: "Pacha, kathi, thadi, kari, minukku" },
			{ label: "Key institution", value: "Kerala Kalamandalam, 1930" },
		],
	},
	{
		slug: "kuchipudi",
		name: "Kuchipudi",
		state: "Andhra Pradesh",
		origin: "Named for the village of Kuchipudi; dance-drama tradition",
		note: "Village dance-drama tradition, distinguished by passages danced on the rim of a brass plate.",
		description:
			"A form that keeps one foot in dance-drama and one in solo recital. Kuchipudi is quicker and more fluid than Bharatanatyam, mixes spoken and sung passages in its traditional plays, and is known for tarangam, in which the dancer performs standing on the rim of a brass plate.",
		history:
			"The form is named after Kuchipudi, a village in the Krishna district of coastal Andhra Pradesh, where it was maintained by families of Brahmin performers. Tradition credits Siddhendra Yogi with composing Bhama Kalapam and establishing the practice of the village troupe. Performances were staged by all-male companies, with men taking the female roles. In the twentieth century Vempati Chinna Satyam was central in developing a solo repertoire and a codified syllabus that could be taught outside the village system, which is the form in which it now travels.",
		technique:
			"The stance is less deeply seated than Bharatanatyam and the movement carries more travel and rounder transitions. Traditional dance-drama includes spoken dialogue and sung passages delivered by the dancer, so the performer is expected to act and sing as well as dance. The tarangam requires balance on the raised rim of a brass plate, sometimes while balancing a pot of water on the head.",
		repertoire:
			"Bhama Kalapam, built around Satyabhama, remains the central dance-drama. Solo repertoire follows a sequence broadly comparable to the Bharatanatyam margam, with items such as jatiswaram, shabdam, tarangam and tillana.",
		music:
			"Carnatic music, with mridangam, violin, flute and vocal. Sung texts are commonly in Telugu, which gives the form much of its particular rhythm and diction.",
		significance:
			"Kuchipudi preserves the dance-drama as a living format rather than a historical one, and shows how a form held by a single village community was rebuilt into a syllabus taught worldwide — with the same gains and losses that transition brought elsewhere.",
		keyFacts: [
			{ label: "State", value: "Andhra Pradesh" },
			{ label: "Named for", value: "Kuchipudi village, Krishna district" },
			{ label: "Traditionally", value: "All-male troupes" },
			{ label: "Signature item", value: "Tarangam, on a brass plate" },
			{ label: "Text language", value: "Telugu" },
		],
	},
	{
		slug: "odissi",
		name: "Odissi",
		state: "Odisha",
		origin: "Temple tradition; reconstructed from the 1950s",
		note: "Reconstructed from temple sculpture — the tribhanga, a three-bend stance, is lifted straight off the stone.",
		description:
			"A lyrical form whose defining shape is the tribhanga, a stance bending the body at neck, torso and knee so that the line runs as an S rather than a column. The resemblance to the figures carved on Odisha's temples is not incidental: the sculpture was one of the sources used to rebuild the dance.",
		history:
			"Odissi descends from two temple lineages: the maharis, women dedicated to the Jagannath temple at Puri, and the gotipuas, boys who danced in female costume outside the temple. Both declined sharply under colonial rule, and by the mid-twentieth century little continuous practice remained. From the 1950s a group of teachers — Kelucharan Mohapatra, Pankaj Charan Das and Deba Prasad Das foremost among them — reconstructed a performing form from surviving gotipua practice, temple sculpture and textual sources including the Natya Shastra and the Abhinaya Chandrika. The Sangeet Natak Akademi recognised it as classical in 1958.",
		technique:
			"Two basic positions govern the form: chauka, a square, weight-even stance associated with Jagannath, and tribhanga, the three-bend line. Movement emphasises independent torso deflection, which gives the form its characteristic softness against a strict rhythmic base.",
		repertoire:
			"A recital moves through mangalacharan, an invocation with an offering of flowers; batu, pure movement in the chauka position; pallavi, a melodic line elaborated in dance; abhinaya, most often set to the Gita Govinda of Jayadeva; and moksha, a closing item taken as release.",
		music:
			"Odissi music, with mardala drum, violin, flute, sitar and vocal. Sung texts are principally in Sanskrit and Odia; the twelfth-century Gita Govinda, composed in Odisha, supplies much of the expressive repertoire.",
		significance:
			"Odissi is the clearest case of a dance rebuilt from evidence. Where transmission failed, sculpture, text and a surviving boys' tradition were used to reconstitute it — which makes it both a living art and a piece of practical archaeology.",
		keyFacts: [
			{ label: "State", value: "Odisha" },
			{ label: "Temple lineages", value: "Mahari and gotipua" },
			{ label: "Stances", value: "Chauka and tribhanga" },
			{ label: "Core text", value: "Gita Govinda" },
			{ label: "Recognised", value: "1958" },
		],
	},
	{
		slug: "manipuri",
		name: "Manipuri",
		state: "Manipur",
		origin: "Older ritual roots; Vaishnava Ras Leela from the 18th century",
		note: "Devotional and continuous, avoiding sharp accent; the drum and the dancer are often the same person.",
		description:
			"A form that deliberately refuses emphasis. Manipuri moves in continuous curves with no hard stop and no struck accent, the feet placed rather than stamped. It is danced as worship rather than as display, and its costume — a stiffened, barrel-shaped skirt — is unlike anything else in the classical repertoire.",
		history:
			"Behind the Vaishnava repertoire sits Lai Haraoba, a much older ritual cycle of Manipur predating the arrival of Vaishnavism. The Ras Leela tradition took its present shape in the eighteenth century under King Bhagyachandra, who is credited with establishing the principal ras forms. Rabindranath Tagore invited a Manipuri teacher to Santiniketan in 1919, which brought the form to national attention and began its life outside the valley.",
		technique:
			"Movement is continuous and rounded, with the weight kept soft and transitions hidden; the aesthetic avoids the angular attack of the other classical forms. Men's repertoire includes vigorous drum and cymbal dances performed while playing the instrument, so that the performer is simultaneously dancer and musician.",
		repertoire:
			"Ras Leela cycles on Radha and Krishna, performed at fixed points in the ritual calendar, form the core. Alongside them stand pung cholom, danced while playing the pung drum, and kartal cholom with cymbals. Lai Haraoba material remains in ritual use.",
		music:
			"Devotional song in Manipuri and Sanskrit, with the pung (a barrel drum) at the centre, plus cymbals and voice. The dancer's own drumming is frequently part of the choreography rather than accompaniment to it.",
		significance:
			"Manipuri holds two religious layers in one practice — a pre-Vaishnava ritual tradition and the Krishna devotion laid over it — without collapsing either. It is also the strongest counter-example to the idea that classical Indian dance is defined by rhythmic attack.",
		keyFacts: [
			{ label: "State", value: "Manipur" },
			{ label: "Older layer", value: "Lai Haraoba" },
			{ label: "Codified", value: "18th century, under Bhagyachandra" },
			{ label: "Drum", value: "Pung" },
			{ label: "Costume", value: "Potloi, a stiffened skirt" },
		],
	},
	{
		slug: "mohiniyattam",
		name: "Mohiniyattam",
		state: "Kerala",
		origin: "Codified in the 19th century; revived from 1930",
		note: "A solo form of swaying, circular movement, named for the enchantress Mohini.",
		description:
			"A solo form built on sway. The torso moves in continuous circles and figures of eight while the feet keep a quiet, gliding rhythm, producing a line that never fully arrests. It is danced in off-white cloth with a gold border, and its name refers to Mohini, the form Vishnu takes as an enchantress.",
		history:
			"References to the form appear by the eighteenth century, and it was given structure under Maharaja Swathi Thirunal of Travancore in the early nineteenth, whose compositions remain in the repertoire. It declined afterwards and was in a poor state by the early twentieth century. Vallathol Narayana Menon added it to the curriculum at Kerala Kalamandalam after 1930, and later teachers — Kalamandalam Kalyanikutty Amma among them — did much of the work of reassembling a coherent syllabus.",
		technique:
			"The defining quality is andolika, a swaying movement carried in the torso and hips, with circular pathways in the upper body. Footwork is soft and sliding rather than percussive. Expression is close-range and understated compared with Kathakali, though both come from the same region and share gesture vocabulary.",
		repertoire:
			"A recital runs through items broadly parallel to other southern forms — cholkettu, jatiswaram, varnam, padam, tillana — with the expressive items given unusual weight relative to pure rhythm.",
		music:
			"Sopanam-influenced vocal style with Carnatic structure; idakka and mridangam, veena and flute. Texts are often in Manipravalam, a blend of Malayalam and Sanskrit.",
		significance:
			"Mohiniyattam is the counterweight to Kathakali within a single regional culture: where one is loud, masked, male and nocturnal, the other is quiet, bare-faced, solo and close. Together they show how wide a range one performance tradition can hold.",
		keyFacts: [
			{ label: "State", value: "Kerala" },
			{ label: "Named for", value: "Mohini, an avatar of Vishnu" },
			{ label: "Codified under", value: "Swathi Thirunal, 19th century" },
			{ label: "Signature", value: "Andolika, a swaying torso" },
			{ label: "Text language", value: "Manipravalam" },
		],
	},
	{
		slug: "sattriya",
		name: "Sattriya",
		state: "Assam",
		origin: "15th–16th century; recognised as classical in 2000",
		note: "Born in the monasteries founded by Srimanta Sankardeva; recognised as classical only in 2000.",
		description:
			"A monastic form, created as part of a religious reform movement and performed for four centuries inside the sattras of Assam by celibate monks. It is the most recently recognised of the eight, and the only one that entered the classical category from an unbroken institutional practice rather than a revival.",
		history:
			"Srimanta Sankardeva (1449–1568) founded the Ekasarana Dharma, a Vaishnava movement in Assam that used performance directly as religious instruction. He wrote the Ankiya Nat, one-act plays staged as Bhaona, and the dance developed as part of that liturgy inside the sattras, the monasteries the movement established. It was maintained there continuously by bhokots, the resident monks. The Sangeet Natak Akademi recognised it as the eighth classical form in 2000, and it has since moved onto the concert stage and been taken up by women performers.",
		technique:
			"Movement is governed by fixed units of hand, foot and body positions set out in the tradition's own texts, with a strong rhythmic base supplied by the khol. Male and female styles — paurashik and stri — are distinguished in stance and energy. Masks are used for certain characters in Bhaona.",
		repertoire:
			"Ankiya Nat plays performed as Bhaona remain the core, alongside independent dance numbers such as Chali, Jhumura and Nadu Bhangi, and the ritual sequences that open a performance.",
		music:
			"Borgeet, the devotional song form composed by Sankardeva and Madhavdeva, carried by the khol drum and taal cymbals with flute. Texts are in Assamese and Brajavali, a literary language devised for the purpose.",
		significance:
			"Sattriya is proof that the classical list is a record of recognition, not a closed canon — the form was five centuries old when it was added. It also shows an unusual survival mechanism: not court patronage or twentieth-century revival, but a monastic institution that simply never stopped.",
		keyFacts: [
			{ label: "State", value: "Assam" },
			{ label: "Founder", value: "Srimanta Sankardeva, 1449–1568" },
			{ label: "Held by", value: "Sattras, Vaishnava monasteries" },
			{ label: "Drum", value: "Khol" },
			{ label: "Recognised", value: "2000" },
		],
	},
];

export interface Era {
	slug: string;
	period: string;
	title: string;
	body: string;
	/** Longer description for the detail page. */
	description: string;
	/** What was happening, and where. */
	context: string;
	/** The physical and textual record — and its gaps. */
	whatSurvives: string;
	/** Why this period is load-bearing for what came after. */
	significance: string;
	/** Places on this site that belong to this era, by monument slug. */
	relatedMonuments: string[];
	keyFacts: { label: string; value: string }[];
}

export const timeline: Era[] = [
	{
		slug: "indus-valley",
		period: "c. 2600–1900 BCE",
		title: "Indus Valley",
		body: "Grid-planned cities at Mohenjo-daro and Dholavira, with covered drains, standardised brick, and a script still unread.",
		description:
			"The subcontinent's first urban civilisation, spread across the Indus basin and well beyond it into what is now Gujarat, Rajasthan and Haryana. Its cities were laid out on a grid, built from bricks made to a standard ratio, and served by covered drains and wells at a density not matched again in the region for millennia. Almost everything known about it comes from excavation, because its writing cannot be read.",
		context:
			"Settlement in the region begins far earlier, at sites such as Mehrgarh, and the mature urban phase runs roughly from 2600 to 1900 BCE. Major sites include Mohenjo-daro and Harappa in present-day Pakistan, and Dholavira, Lothal, Rakhigarhi and Kalibangan in India. Trade connected the region to Mesopotamia; Indus seals have been found at Mesopotamian sites. The civilisation was unknown to modern scholarship until excavations in the 1920s, when Daya Ram Sahni worked at Harappa and R. D. Banerji at Mohenjo-daro — before which the period was simply absent from the record.",
		whatSurvives:
			"Street plans, drainage systems, wells, granaries, dockyards and reservoirs; standardised baked brick in a consistent proportion; a system of weights of remarkable uniformity; thousands of carved seals; terracotta figurines; and the bronze figure conventionally called the Dancing Girl. What does not survive is any readable text. The script runs to several hundred signs, appears mostly in very short inscriptions, and remains undeciphered — which is why there are no names, no rulers and no events for this period, only material.",
		significance:
			"This is the period that sets the terms for everything after it: settled agriculture, urban planning, standardised measurement and long-distance trade. It is also the clearest reminder of how much of the past is unrecoverable. A civilisation of this scale left cities that can be walked through and a language that cannot be read.",
		relatedMonuments: [],
		keyFacts: [
			{ label: "Span", value: "c. 2600–1900 BCE (mature phase)" },
			{ label: "Major Indian sites", value: "Dholavira, Lothal, Rakhigarhi" },
			{ label: "Script", value: "Undeciphered" },
			{ label: "Rediscovered", value: "1920s" },
			{ label: "World Heritage", value: "Dholavira, inscribed 2021" },
		],
	},
	{
		slug: "vedic-period",
		period: "c. 1500–500 BCE",
		title: "Vedic Period",
		body: "The Vedas composed and transmitted orally with a precision of recitation designed to survive without writing.",
		description:
			"A period defined not by buildings but by a body of text, and by the method invented to carry it. The Vedas were composed in early Sanskrit and transmitted by memory for centuries before being written down, using recitation techniques built specifically to make error detectable and correction possible.",
		context:
			"The Rigveda is the oldest of the four collections, with the others — Yajurveda, Samaveda and Atharvaveda — following, and the Brahmanas, Aranyakas and Upanishads layered on afterwards. The material was composed and carried across the north-west and the Gangetic plain as settlement shifted eastward. This is a period with very little monumental archaeology attached to it, which is precisely what makes the transmission method the story.",
		whatSurvives:
			"The texts themselves, in a state of preservation that has few parallels anywhere. The mechanism is a set of layered recitation patterns — padapatha, which separates each word; kramapatha, which recites them in overlapping pairs; and more demanding forms including jatapatha and ghanapatha, which repeat words forwards and backwards in fixed sequences. Any substitution, omission or reordering breaks the pattern audibly, so the redundancy functions as error-correction. UNESCO inscribed the tradition of Vedic chanting on its list of Intangible Cultural Heritage in 2008, having proclaimed it in 2003.",
		significance:
			"The Vedic period is the origin of most of the philosophical and ritual vocabulary that later Indian thought works with. But the durable achievement is procedural: a culture facing the problem of preserving a long text without writing solved it by engineering redundancy into performance — and the solution still works.",
		relatedMonuments: [],
		keyFacts: [
			{ label: "Span", value: "c. 1500–500 BCE" },
			{ label: "Language", value: "Vedic Sanskrit" },
			{ label: "Oldest text", value: "Rigveda" },
			{ label: "Transmission", value: "Oral, with layered recitation" },
			{ label: "UNESCO", value: "Intangible Cultural Heritage, 2008" },
		],
	},
	{
		slug: "mauryan-empire",
		period: "322–185 BCE",
		title: "Mauryan Empire",
		body: "Ashoka's edicts cut into rock across the subcontinent — the earliest deciphered Indian writing, and the source of the national emblem.",
		description:
			"The first empire to hold most of the subcontinent under one administration, and the first period from which Indian writing can actually be read. Ashoka had instructions and moral policy cut into rock faces and free-standing pillars from Afghanistan to Karnataka — a communications programme with no earlier parallel here.",
		context:
			"Chandragupta Maurya founded the dynasty around 322 BCE, and it reached its greatest extent under his grandson Ashoka, who ruled from roughly 268 to 232 BCE. After the conquest of Kalinga, Ashoka's edicts record a turn toward Buddhist principles and a policy expressed as dhamma. The empire declined after his death and ended in 185 BCE. The edicts themselves were unreadable for centuries until James Prinsep deciphered Brahmi in 1837, which reopened the period to history.",
		whatSurvives:
			"Rock edicts, pillar edicts and cave inscriptions across the subcontinent, written mainly in Prakrit in Brahmi and Kharosthi scripts, and — at Kandahar — in Greek and Aramaic. Polished sandstone pillars survive at several sites, along with the stupa at Sanchi, whose core is Mauryan, and the Barabar caves. The lion capital from the pillar at Sarnath, where the Buddha gave his first sermon, is in the Sarnath museum.",
		significance:
			"Everything datable and readable in Indian history starts here. The Mauryan period also supplies the modern republic with its emblems: the Sarnath lion capital was adopted as the State Emblem of India on 26 January 1950, and the wheel from its abacus sits at the centre of the national flag.",
		relatedMonuments: ["sarnath", "sanchi"],
		keyFacts: [
			{ label: "Span", value: "322–185 BCE" },
			{ label: "Ashoka's reign", value: "c. 268–232 BCE" },
			{ label: "Scripts", value: "Brahmi, Kharosthi, Greek, Aramaic" },
			{ label: "Brahmi deciphered", value: "1837, by James Prinsep" },
			{ label: "State Emblem adopted", value: "26 January 1950" },
		],
	},
	{
		slug: "gupta-period",
		period: "c. 320–550 CE",
		title: "Gupta Period",
		body: "Decimal place-value notation and a symbol for zero; Aryabhata gives the earth a rotation and π four correct places.",
		description:
			"A period whose most consequential export was a notation. The decimal place-value system, with a symbol for zero holding an empty position, was in use in India by this era; carried west through Arabic scholarship, it became the number system now used everywhere.",
		context:
			"The Gupta dynasty ruled much of northern India from around 320 to 550 CE. Aryabhata, born in 476, completed the Aryabhatiya in 499 at the age of twenty-three: it gives π to four correct decimal places, states that the apparent movement of the stars is caused by the earth's rotation, and explains eclipses as shadows rather than omens. Later mathematicians in the same tradition, notably Brahmagupta in the seventh century, set out rules for arithmetic with zero and negative numbers.",
		whatSurvives:
			"Mathematical and astronomical texts, chief among them the Aryabhatiya; the Bakhshali manuscript, an arithmetic text whose dating remains debated but which contains a placeholder dot; the iron pillar now at the Qutb complex in Delhi, notable for its corrosion resistance; and the later painted caves at Ajanta, which fall within this period. The great university at Nalanda was founded in the fifth century.",
		significance:
			"Zero as a positional placeholder is not a small notational convenience — it is what makes written arithmetic, and eventually algebra and computation, tractable. This period is the reason the digits on every keyboard in the world are what they are.",
		relatedMonuments: ["ajanta", "qutb-minar"],
		keyFacts: [
			{ label: "Span", value: "c. 320–550 CE" },
			{ label: "Aryabhata born", value: "476 CE" },
			{ label: "Aryabhatiya", value: "499 CE" },
			{ label: "Nalanda founded", value: "5th century" },
			{ label: "Legacy", value: "Decimal place-value and zero" },
		],
	},
	{
		slug: "chola-dynasty",
		period: "9th–13th century",
		title: "Chola Dynasty",
		body: "Bronze casting by lost-wax reaches its height, and temple building becomes an instrument of the state across South India and beyond.",
		description:
			"A southern empire that used temple building as state policy and produced, in bronze, some of the most technically assured sculpture made anywhere. Chola power reached across the Bay of Bengal, and Chola temples functioned as landholders, employers and administrative centres as much as places of worship.",
		context:
			"The imperial Cholas rose in the ninth century and dominated the south into the thirteenth. Rajaraja I completed the Brihadisvara temple at Thanjavur in 1010; his son Rajendra I built a new capital at Gangaikonda Cholapuram and campaigned as far as the Ganges and into South-East Asia. Airavatesvara at Darasuram followed in the twelfth century. The three together are inscribed by UNESCO as the Great Living Chola Temples.",
		whatSurvives:
			"The temples themselves, still in use, with their vimanas, inscriptions and endowment records cut into the stone — an unusually complete administrative archive carved into the buildings it funded. Alongside them, solid bronzes cast by the lost-wax method, of which the Nataraja, Shiva dancing within a ring of flame, is the best known. The bronzes were made to be carried in procession, so they are finished on all sides.",
		significance:
			"Chola bronzes are a high point of metal casting in the pre-modern world, and Chola temple inscriptions are one of the richest sources for how a medieval Indian state actually ran — land grants, wages, irrigation, endowments, recorded in stone because stone outlasts palm leaf.",
		relatedMonuments: ["meenakshi"],
		keyFacts: [
			{ label: "Span", value: "9th–13th century" },
			{ label: "Brihadisvara, Thanjavur", value: "Completed 1010" },
			{ label: "Casting method", value: "Lost wax" },
			{ label: "Best-known form", value: "Nataraja" },
			{ label: "World Heritage", value: "Great Living Chola Temples" },
		],
	},
	{
		slug: "delhi-sultanate",
		period: "1206–1526",
		title: "Delhi Sultanate",
		body: "Persian and Indian building traditions meet: the true arch and the dome arrive and are rebuilt in local stone.",
		description:
			"Three centuries in which a new architectural vocabulary entered northern India and was rebuilt by local masons in local stone. The true arch and the dome — structural forms Indian building had largely managed without — arrived with the Sultanate and were absorbed rather than imposed.",
		context:
			"Five dynasties held Delhi in succession between 1206 and 1526: Mamluk, Khalji, Tughlaq, Sayyid and Lodi. Construction of the Qutb Minar began under Qutb al-Din Aibak around 1199 and continued under his successors. The Alai Darwaza, added by Alauddin Khalji in 1311, is among the earliest surviving true-arch and true-dome structures in India. The Sultanate ended in 1526 at the first battle of Panipat.",
		whatSurvives:
			"The Qutb complex in Delhi, including the minar, the Quwwat-ul-Islam mosque and the Alai Darwaza; the fortified cities of Tughlaqabad and Firozabad; and a large body of tomb architecture. Much early work was assembled from the masonry of demolished buildings, which is visible in the reused carved columns of the Quwwat-ul-Islam and is part of the honest record of the period.",
		significance:
			"This is where the Indo-Islamic architectural synthesis begins. What followed under the Mughals is unimaginable without these three centuries of local craftsmen learning a new structural language and applying their own ornament to it.",
		relatedMonuments: ["qutb-minar"],
		keyFacts: [
			{ label: "Span", value: "1206–1526" },
			{ label: "Dynasties", value: "Mamluk, Khalji, Tughlaq, Sayyid, Lodi" },
			{ label: "Qutb Minar begun", value: "c. 1199" },
			{ label: "Alai Darwaza", value: "1311" },
			{ label: "Introduced", value: "True arch and dome" },
		],
	},
	{
		slug: "mughal-empire",
		period: "1526–1857",
		title: "Mughal Empire",
		body: "Charbagh gardens, pietra dura inlay, and a court style that produced the Taj Mahal and the Red Fort.",
		description:
			"An empire that built at a scale and finish rarely matched, and left a court style — symmetrical, garden-set, inlaid in hard stone — that is now the most widely recognised image of Indian architecture anywhere in the world.",
		context:
			"Babur won at Panipat in 1526. Humayun's tomb, completed around 1570, established the charbagh — a garden quartered by water channels — as the setting for imperial tombs, and is the direct precedent for the Taj Mahal. Shah Jahan built the Taj Mahal at Agra between 1632 and 1653 and the Red Fort at Delhi between 1639 and 1648. Imperial power declined through the eighteenth century, and the empire was formally ended in 1857.",
		whatSurvives:
			"The Taj Mahal, the Red Fort, Humayun's tomb, Fatehpur Sikri, Agra Fort and the Lahore complexes, together with a very large body of painting and manuscript work. The characteristic technique is pietra dura — parchin kari — in which semi-precious stones are cut and set flush into white marble, still practised by workshops in Agra.",
		significance:
			"The Mughal period produced the buildings that most of the world pictures when it pictures India. It also demonstrates the composite character of that heritage: Persian and Central Asian form, Indian material and craft, executed by workshops whose descendants are still working.",
		relatedMonuments: ["taj-mahal", "red-fort"],
		keyFacts: [
			{ label: "Span", value: "1526–1857" },
			{ label: "Humayun's tomb", value: "c. 1570" },
			{ label: "Taj Mahal", value: "1632–1653" },
			{ label: "Red Fort", value: "1639–1648" },
			{ label: "Signature technique", value: "Pietra dura (parchin kari)" },
		],
	},
	{
		slug: "independence",
		period: "1947",
		title: "Independence",
		body: "The wheel from Sarnath's lion capital is placed at the centre of the flag, tying the new republic to a third-century BCE pillar.",
		description:
			"A new state choosing its symbols, and choosing them from the third century BCE. The wheel taken from the abacus of Ashoka's lion capital at Sarnath was placed at the centre of the national flag, and the capital itself became the State Emblem.",
		context:
			"The Constituent Assembly adopted the national flag on 22 July 1947, with the Ashoka Chakra and its twenty-four spokes replacing the spinning wheel of the earlier design. Independence followed on 15 August. The State Emblem, adapted from the Sarnath lion capital, was adopted on 26 January 1950, when the Constitution came into force and India became a republic.",
		whatSurvives:
			"The lion capital itself, excavated at Sarnath and now in the site museum there. The pillar it stood on was raised by Ashoka at the place where the Buddha is held to have given his first sermon — the turning of the wheel of dhamma, which is what the chakra depicts. Sarnath was inscribed on the UNESCO World Heritage List in 2026, becoming India's forty-fifth property.",
		significance:
			"A republic three years old reached back twenty-two centuries for its emblem. That choice is the whole argument of this site in miniature: heritage is not what survives by accident, but what a society decides to carry forward and put at the centre of things.",
		relatedMonuments: ["sarnath"],
		keyFacts: [
			{ label: "Flag adopted", value: "22 July 1947" },
			{ label: "Independence", value: "15 August 1947" },
			{ label: "State Emblem adopted", value: "26 January 1950" },
			{ label: "Chakra spokes", value: "24" },
			{ label: "Source", value: "Lion capital, Sarnath" },
		],
	},
];
