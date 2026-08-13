/**
 * Reference material about India itself, so the site explains the country its
 * heritage belongs to rather than assuming the reader already knows it.
 *
 * Figures here are deliberately conservative and sourced from official
 * positions: the Constitution's Eighth Schedule for languages, the 2011 Census
 * for population and mother tongues, UNESCO's lists for heritage counts.
 */

export interface Figure {
	value: string;
	label: string;
	note?: string;
}

export const landFigures: Figure[] = [
	{
		value: "3.29m",
		label: "Square kilometres",
		note: "Seventh largest country by area",
	},
	{
		value: "7,500 km",
		label: "Coastline",
		note: "Arabian Sea, Indian Ocean and Bay of Bengal",
	},
	{
		value: "28 + 8",
		label: "States and union territories",
		note: "Each with its own languages and building traditions",
	},
	{
		value: "6",
		label: "Land neighbours",
		note: "Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar",
	},
];

export const peopleFigures: Figure[] = [
	{
		value: "22",
		label: "Scheduled languages",
		note: "Listed in the Eighth Schedule of the Constitution",
	},
	{
		value: "121",
		label: "Languages with 10,000+ speakers",
		note: "2011 Census; 1,369 rationalised mother tongues recorded",
	},
	{
		value: "11",
		label: "Classical languages",
		note: "Tamil first, in 2004; five more added in 2024",
	},
	{
		value: "2",
		label: "Official languages of the Union",
		note: "Hindi in Devanagari script, with English as associate",
	},
];

export interface Region {
	name: string;
	summary: string;
	marks: string;
}

/**
 * The point of this section is that "Indian heritage" is not one tradition.
 * Each region below built differently because it had different stone, different
 * rainfall and different rulers.
 */
export const regions: Region[] = [
	{
		name: "The Himalaya and the north",
		summary:
			"Mountain and foothill country running the length of the northern border, holding the headwaters of the river systems the plains depend on.",
		marks:
			"Timber-and-stone temple building, Buddhist monastic architecture in Ladakh and Sikkim, and the hill railways cut into the slopes under British administration.",
	},
	{
		name: "The Gangetic plain",
		summary:
			"Alluvial flatland along the Ganges and Yamuna, the most densely populated part of the country and the seat of most of its imperial capitals.",
		marks:
			"Mauryan pillars, Buddhist stupas at Sanchi and Sarnath, the Delhi Sultanate and Mughal capitals, and the brick monasteries of Nalanda.",
	},
	{
		name: "The desert and the west",
		summary:
			"Arid Rajasthan and Gujarat, where water storage determined where people could live and how much they could build.",
		marks:
			"Hill forts on defensible scarps, stepwells cut seven storeys into the ground, and the Harappan city of Dholavira with its sixteen reservoirs.",
	},
	{
		name: "The Deccan plateau",
		summary:
			"Volcanic basalt uplands in the centre of the peninsula — rock hard enough to cut into and stable enough to hold a carved ceiling.",
		marks:
			"The rock-cut halls of Ajanta, Ellora and Elephanta, the Chalukyan temples at Pattadakal, and Vijayanagara's capital at Hampi.",
	},
	{
		name: "The south",
		summary:
			"Granite country below the Deccan, with a temple tradition that continued unbroken where the north was repeatedly interrupted.",
		marks:
			"Pallava shore temples at Mahabalipuram, the Chola temples at Thanjavur, Hoysala soapstone carving, and living temple cities such as Madurai.",
	},
	{
		name: "The east and north-east",
		summary:
			"Delta, hill and forest country from Odisha through Bengal to the Brahmaputra valley, with the highest rainfall in the country.",
		marks:
			"The Sun Temple at Konark, the mangrove Sundarbans, Ahom burial mounds at Charaideo, and the Vaishnava monasteries that keep Sattriya alive.",
	},
];

export interface IchElement {
	name: string;
	year: number;
	note: string;
}

/**
 * UNESCO's Representative List of the Intangible Cultural Heritage of Humanity
 * — the counterpart to the World Heritage list, covering practice rather than
 * place. It is the better measure of living heritage, because none of it
 * survives without someone still doing it.
 */
export const intangibleHeritage: IchElement[] = [
	{
		name: "Tradition of Vedic chanting",
		year: 2008,
		note: "Recitation techniques engineered so that an error in a memorised text is audible.",
	},
	{
		name: "Ramlila, the traditional performance of the Ramayana",
		year: 2008,
		note: "Community-staged cycles performed over days across northern India.",
	},
	{
		name: "Kutiyattam, Sanskrit theatre",
		year: 2008,
		note: "Kerala's Sanskrit drama, among the oldest continuously performed theatre forms.",
	},
	{
		name: "Ramman, religious festival and ritual theatre",
		year: 2009,
		note: "A masked spring festival of the Garhwal Himalayas.",
	},
	{
		name: "Mudiyettu, ritual theatre and dance drama",
		year: 2010,
		note: "Kerala temple ritual enacting the goddess Kali's victory over Darika.",
	},
	{
		name: "Kalbelia folk songs and dances",
		year: 2010,
		note: "Songs and dance of the Kalbelia community of Rajasthan.",
	},
	{
		name: "Chhau dance",
		year: 2010,
		note: "Masked martial dance traditions of Odisha, Jharkhand and West Bengal.",
	},
	{
		name: "Buddhist chanting of Ladakh",
		year: 2012,
		note: "Recitation of sacred texts in the monasteries of the trans-Himalaya.",
	},
	{
		name: "Sankirtana: ritual singing, drumming and dancing",
		year: 2013,
		note: "Vaishnava performance of Manipur, related to the Manipuri dance tradition.",
	},
	{
		name: "Brass and copper craft of the Thatheras",
		year: 2014,
		note: "Utensil-making by hand at Jandiala Guru in Punjab.",
	},
	{
		name: "Yoga",
		year: 2016,
		note: "Philosophy and practice with roots in the same textual tradition as the Vedas.",
	},
	{
		name: "Nawrouz",
		year: 2016,
		note: "New year observance shared with a dozen other countries.",
	},
	{
		name: "Kumbh Mela",
		year: 2017,
		note: "The largest peaceful gathering of people anywhere on earth.",
	},
	{
		name: "Durga Puja in Kolkata",
		year: 2021,
		note: "A city-scale festival of commissioned temporary architecture and sculpture.",
	},
	{
		name: "Garba of Gujarat",
		year: 2023,
		note: "Circular devotional dance performed around a central lamp.",
	},
];

export interface Symbol {
	name: string;
	value: string;
	adopted: string;
	note: string;
}

export const nationalSymbols: Symbol[] = [
	{
		name: "Flag",
		value: "Tiranga",
		adopted: "22 July 1947",
		note: "Saffron, white and green, with the Ashoka Chakra of twenty-four spokes at the centre — taken from the lion capital at Sarnath.",
	},
	{
		name: "State Emblem",
		value: "Lion Capital of Ashoka",
		adopted: "26 January 1950",
		note: "Adapted from the third-century BCE capital at Sarnath, with the motto Satyameva Jayate below it.",
	},
	{
		name: "Anthem",
		value: "Jana Gana Mana",
		adopted: "24 January 1950",
		note: "Composed by Rabindranath Tagore, who also founded Santiniketan.",
	},
	{
		name: "Song",
		value: "Vande Mataram",
		adopted: "24 January 1950",
		note: "By Bankim Chandra Chatterjee, given equal status with the anthem.",
	},
	{
		name: "Calendar",
		value: "Saka era",
		adopted: "22 March 1957",
		note: "Used alongside the Gregorian calendar in official communication.",
	},
];
