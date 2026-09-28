import { officialElephants, officialCustodianUsers } from './data/elephants';

const baseUsers = [
    {
      "id": "u-admin",
      "name": "Kerala Devaswom Commissioner",
      "email": "admin@devaswom.gov.in",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "admin",
      "phone": "04712300000",
      "district": "Trivandrum",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.023Z"
    },
    {
      "id": "u-comm-thrissur",
      "name": "Thrissur Pooram Central Committee",
      "email": "committee.thrissur@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543210",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "u-comm-nemmara",
      "name": "Nemmara-Vellangi Committee",
      "email": "committee.nemmara@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543211",
      "district": "Palakkad",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "u-comm-arattupuzha",
      "name": "Arattupuzha Temple Devaswom Committee",
      "email": "committee.arattupuzha@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543220",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-comm-uthralikavu",
      "name": "Sree Ruthira Mahakalikavu Devaswom Committee",
      "email": "committee.uthralikavu@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543221",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-comm-chinakkathoor",
      "name": "Sree Chinakkathoor Devaswom Committee",
      "email": "committee.chinakkathoor@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543222",
      "district": "Palakkad",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-comm-thirunakkara",
      "name": "Thirunakkara Devaswom Committee",
      "email": "committee.thirunakkara@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543223",
      "district": "Kottayam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-comm-peruvanam",
      "name": "Sree Peruvanam Mahadeva Temple Committee",
      "email": "committee.peruvanam@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543228",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-comm-chettikulangara",
      "name": "Chettikulangara Devi Temple Committee",
      "email": "committee.chettikulangara@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543229",
      "district": "Alappuzha",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-comm-adoor",
      "name": "Sree Parthasarathy Devaswom Committee",
      "email": "committee.adoor@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543230",
      "district": "Pathanamthitta",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-comm-thripunithura",
      "name": "Thripunithura Poornathrayeesa Seva Sangham",
      "email": "committee.thripunithura@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "committee",
      "phone": "9876543231",
      "district": "Ernakulam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-owner-ramachandran",
      "name": "Thechikottukavu Devaswom Trust",
      "email": "owner.ramachandran@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543212",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "u-owner-karnan",
      "name": "Mangalamkunnu Elephant Syndicate",
      "email": "owner.karnan@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543213",
      "district": "Palakkad",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "u-owner-rajan",
      "name": "Pampady M.A. Thomas & Family",
      "email": "owner.rajan@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543224",
      "district": "Kottayam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-owner-kalidasan",
      "name": "Chirakkal Madhu",
      "email": "owner.kalidasan@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543225",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-owner-sivakumar",
      "name": "Cochin Devaswom Board",
      "email": "owner.sivakumar@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543226",
      "district": "Ernakulam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-owner-sivaraju",
      "name": "Travancore Devaswom Board",
      "email": "owner.sivaraju@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543227",
      "district": "Kollam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "u-owner-guruvayur",
      "name": "Guruvayur Devaswom Trust",
      "email": "owner.guruvayur@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543232",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-owner-puthuppally",
      "name": "Puthuppally Elephant Syndicate",
      "email": "owner.puthuppally@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543233",
      "district": "Kottayam",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-owner-cherpulassery",
      "name": "Cherpulassery Elephant Trust",
      "email": "owner.cherpulassery@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "elephant_owner",
      "phone": "9876543234",
      "district": "Palakkad",
      "isVerified": true,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "u-acc-owner-1",
      "name": "Kerala Traditional Crafts & Rentals",
      "email": "crafts.rentals@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "accessory_owner",
      "phone": "9876543214",
      "district": "Thrissur",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "u-acc-owner-2",
      "name": "Malabar Temple Decorators",
      "email": "malabar.decor@pooramconnect.org",
      "passwordHash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
      "role": "accessory_owner",
      "phone": "9876543215",
      "district": "Palakkad",
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.024Z"
    }
  ];

const allUsers = [...baseUsers, ...officialCustodianUsers.filter(cu => !baseUsers.some(bu => bu.id === cu.id))];

export const initialDbData = {
  users: allUsers,
  "temples": [
    {
      "id": "t-vadakkunnathan",
      "committeeId": "u-comm-thrissur",
      "name": "Vadakkunnathan Temple",
      "location": "Swaraj Round, Thrissur",
      "district": "Thrissur",
      "history": "The historic Shiva temple that serves as the main venue for the world-famous Thrissur Pooram. Founded by Sage Parasurama according to legend.",
      "imageUrl": "/assets/temples/vadakkunnathan.jpg",
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "t-nemmara",
      "committeeId": "u-comm-nemmara",
      "name": "Nellikulangara Bhagavathy Temple",
      "location": "Nemmara, Palakkad",
      "district": "Palakkad",
      "history": "The holy shrine dedicated to Goddess Bhagavathy, hosting the annual Nemmara-Vellangi Vela, one of Kerala's most vibrant visual spectacles.",
      "imageUrl": "/assets/temples/nemmara.jpg",
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "t-arattupuzha",
      "committeeId": "u-comm-arattupuzha",
      "name": "Arattupuzha Temple",
      "location": "Arattupuzha, Thrissur",
      "district": "Thrissur",
      "history": "A historical Sastha Temple located in Thrissur, home to the oldest and most grand Devamela festival in India, where 23 deities from neighboring villages assemble.",
      "imageUrl": "/assets/temples/arattupuzha.jpg",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "t-uthralikavu",
      "committeeId": "u-comm-uthralikavu",
      "name": "Sree Ruthira Mahakalikavu Temple",
      "location": "Wadakkanchery, Thrissur",
      "district": "Thrissur",
      "history": "A powerful Bhagavathy temple situated amidst paddy fields, celebrated for its unique structural design next to railway tracks and the high-energy Uthralikavu Pooram.",
      "imageUrl": "/assets/temples/uthralikavu.jpg",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "t-chinakkathoor",
      "committeeId": "u-comm-chinakkathoor",
      "name": "Sree Chinakkathoor Bhagavathy Temple",
      "location": "Palappuram, Palakkad",
      "district": "Palakkad",
      "history": "A renowned shrine dedicated to Goddess Durga, hosting the famous Chinakkathoor Pooram with its distinct traditional arts like shadow puppetry and grand horse effigies.",
      "imageUrl": "/assets/temples/chinakkathoor.jpg",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "t-thirunakkara",
      "committeeId": "u-comm-thirunakkara",
      "name": "Thirunakkara Mahadeva Temple",
      "location": "Thirunakkara, Kottayam",
      "district": "Kottayam",
      "history": "A historic 500-year-old temple dedicated to Lord Shiva built by the King of Thekkumkoor, famous for its magnificent Kerala style mural paintings and the annual Thirunakkara Pooram.",
      "imageUrl": "/assets/temples/thirunakkara.jpg",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "t-peruvanam",
      "committeeId": "u-comm-peruvanam",
      "name": "Peruvanam Mahadeva Temple",
      "location": "Cherpu, Thrissur",
      "district": "Thrissur",
      "history": "One of the oldest and most grand Shiva temples in Kerala, renowned for its double-storied circular sanctum and hosting the ancient Peruvanam Pooram featuring unique, traditional percussion ensembles.",
      "imageUrl": "/assets/temples/peruvanam.jpg",
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "t-chettikulangara",
      "committeeId": "u-comm-chettikulangara",
      "name": "Chettikulangara Devi Temple",
      "location": "Mavelikara, Alappuzha",
      "district": "Alappuzha",
      "history": "A highly famous temple dedicated to Goddess Bhadrakali, famous for hosting the Chettikulangara Bharani where towering, decorated horse effigies (Kettukazhcha) are pulled by thousands of devotees.",
      "imageUrl": "/assets/temples/chettikulangara.jpg",
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "t-adoor",
      "committeeId": "u-comm-adoor",
      "name": "Sree Parthasarathy Temple",
      "location": "Adoor, Pathanamthitta",
      "district": "Pathanamthitta",
      "history": "A magnificent shrine dedicated to Lord Krishna (as Parthasarathy), celebrated across South Kerala for hosting the annual Adoor Gajamela featuring a pageantry of nine giant elephants.",
      "imageUrl": "/assets/temples/adoor.jpg",
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "t-thripunithura",
      "committeeId": "u-comm-thripunithura",
      "name": "Sree Poornathrayeesa Temple",
      "location": "Thripunithura, Ernakulam",
      "district": "Ernakulam",
      "history": "The royal shrine of the Cochin dynasty, dedicated to Lord Vishnu. It hosts the world-famous Vrishchikotsavam, celebrated with 15 caparisoned elephants twice a day for eight consecutive days.",
      "imageUrl": "/assets/temples/thripunithura.jpg",
      "createdAt": "2026-07-15T14:48:00.000Z"
    }
  ],
  "festivals": [
    {
      "id": "f-thrissur-pooram-2026",
      "templeId": "t-vadakkunnathan",
      "name": "Thrissur Pooram 2026",
      "startDate": "2026-04-26",
      "endDate": "2026-04-28",
      "description": "The mother of all Poorams, featuring the majestic Kudamattom (umbrella exchange) and the historic Ilanjithara Melam with over 200 artists.",
      "imageUrl": "/assets/festivals/thrissur.jpg",
      "schedule": {
        "Day 1": "Flag Hoisting & Kodiyettam (Procession from constituent temples)",
        "Day 2": "Sample Vedikettu (Fireworks) & Kudamattom (Umbrella exchange at Southern Gate)",
        "Day 3": "Pakal Pooram (Day pooram) & Farewell Ceremony (Upacharam Cholli Piriyal)"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "f-nemmara-vela-2026",
      "templeId": "t-nemmara",
      "name": "Nemmara-Vellangi Vela 2026",
      "startDate": "2026-04-03",
      "endDate": "2026-04-05",
      "description": "Known for its giant decorated canopies (Aana Pandhal) and competing fireworks displays between the Nemmara and Vellangi wings.",
      "imageUrl": "/assets/festivals/nemmara.jpg",
      "schedule": {
        "Day 1": "Temple rituals, Kodiyettam, and Vellangi Vela procession",
        "Day 2": "Grand fireworks, traditional Chenda Melam, and illumination of Pandhals"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-02T10:16:42.024Z"
    },
    {
      "id": "f-thrissur-pooram-2027",
      "templeId": "t-vadakkunnathan",
      "name": "Thrissur Pooram 2027",
      "startDate": "2027-04-17",
      "endDate": "2027-04-19",
      "description": "The grand mother of all Poorams, featuring the majestic Kudamattom (umbrella exchange), historic Ilanjithara Melam with over 200 artists, and world-famous fireworks at Thekkinkadu Maidan.",
      "imageUrl": "/assets/festivals/thrissur.jpg",
      "schedule": {
        "Day 1 (April 17, 2027)": "Kodiyettam & Madathil Varavu procession from constituent temples",
        "Day 2 (April 18, 2027)": "Sample Vedikettu (Fireworks) & grand Kudamattom at Southern Gate",
        "Day 3 (April 19, 2027)": "Pakal Pooram & Farewell Ceremony (Upacharam Cholli Piriyal)"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-nemmara-vela-2027",
      "templeId": "t-nemmara",
      "name": "Nemmara-Vellangi Vela 2027",
      "startDate": "2027-04-03",
      "endDate": "2027-04-04",
      "description": "Celebrated at the Nellikulangara Bhagavathy Temple, known for the competing wings of Nemmara and Vellangi, giant illuminated structures (Aana Pandhal), and explosive firework displays.",
      "imageUrl": "/assets/festivals/nemmara.jpg",
      "schedule": {
        "Day 1 (April 3, 2027)": "Vela procession, traditional Chenda Melam, and illumination of Pandhals",
        "Day 2 (April 4, 2027)": "Grand fireworks display & farewell ceremony"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-arattupuzha-pooram-2027",
      "templeId": "t-arattupuzha",
      "name": "Arattupuzha Pooram 2027",
      "startDate": "2027-03-20",
      "endDate": "2027-03-21",
      "description": "The oldest temple festival in Kerala (referred to as the Devamela), where 23 deities from various shrines assemble on caparisoned elephants for a grand visual extravaganza.",
      "imageUrl": "/assets/temples/arattupuzha.jpg",
      "schedule": {
        "Day 1 (March 20, 2027)": "Sasthavinte Pooram and grand assembly of 23 deities on decorated elephants",
        "Day 2 (March 21, 2027)": "Ritualistic Arattu (holy bath) ceremony at the river and farewell procession"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-uthralikavu-pooram-2027",
      "templeId": "t-uthralikavu",
      "name": "Uthralikavu Pooram 2027",
      "startDate": "2027-03-02",
      "endDate": "2027-03-03",
      "description": "Held at the Sree Ruthira Mahakalikavu Temple, famous for its grand daytime elephant pageantry and high-intensity fireworks that shake the Wadakkanchery valley.",
      "imageUrl": "/assets/temples/uthralikavu.jpg",
      "schedule": {
        "Day 1 (March 2, 2027)": "Kodiyettam and combined elephant pageantry (Kottikayattam) in the fields",
        "Day 2 (March 3, 2027)": "Late night fireworks and traditional percussion ensemble (Panchavadyam)"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-chinakkathoor-pooram-2027",
      "templeId": "t-chinakkathoor",
      "name": "Chinakkathoor Pooram 2027",
      "startDate": "2027-02-21",
      "endDate": "2027-02-22",
      "description": "Celebrated at Sree Chinakkathoor Bhagavathy Temple, noted for its massive procession of dummy horses and bulls (Kudhirakali), shadow puppetry (Tholpavakoothu), and a stunning line-up of 17 elephants.",
      "imageUrl": "/assets/temples/chinakkathoor.jpg",
      "schedule": {
        "Day 1 (February 21, 2027)": "Tholpavakoothu performance, Kudhirakali procession, and major elephant line-up",
        "Day 2 (February 22, 2027)": "Kumbham Makam special prayers and Aarattu procession"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-thirunakkara-pooram-2027",
      "templeId": "t-thirunakkara",
      "name": "Thirunakkara Pooram 2027",
      "startDate": "2027-03-23",
      "endDate": "2027-03-24",
      "description": "A historic temple festival in Kottayam featuring traditional art forms like Mayilattom and Velakali, ending with a majestic procession of 9 caparisoned elephants accompanied by Panchavadyam.",
      "imageUrl": "/assets/temples/thirunakkara.jpg",
      "schedule": {
        "Day 1 (March 23, 2027)": "Grand Pooram procession with 9 caparisoned elephants and traditional melam",
        "Day 2 (March 24, 2027)": "Aarattu ceremony and flag lowering"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "f-peruvanam-pooram-2027",
      "templeId": "t-peruvanam",
      "name": "Peruvanam Pooram 2027",
      "startDate": "2027-03-18",
      "endDate": "2027-03-19",
      "description": "One of the most ancient temple pageants, celebrated at Sree Peruvanam Mahadeva Temple. Famous for the long hours of Peruvanam Panchari Melam, attracting thousands of percussion enthusiasts.",
      "imageUrl": "/assets/temples/peruvanam.jpg",
      "schedule": {
        "Day 1 (March 18, 2027)": "Kodiyettam, initial rituals, and late evening Sreeveli with 11 caparisoned elephants",
        "Day 2 (March 19, 2027)": "Peruvanam Pooram final procession, Panchari Melam, and ritualistic Aarattu"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "f-chettikulangara-bharani-2027",
      "templeId": "t-chettikulangara",
      "name": "Chettikulangara Bharani 2027",
      "startDate": "2027-03-13",
      "endDate": "2027-03-14",
      "description": "Celebrated on the Bharani Nakshatra of Kumbham. Renowned for Kuthiyottam performance and the visually stunning Kettukazhcha pageantry showcasing giant decorated wooden horses and chariots.",
      "imageUrl": "/assets/temples/chettikulangara.jpg",
      "schedule": {
        "Day 1 (March 13, 2027)": "Kuthiyottam performance, traditional prayers, and arrival of Kettukazhcha structures at the temple field",
        "Day 2 (March 14, 2027)": "Grand reception of chariots, devotional cultural events, and flag lowering"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "f-adoor-gajamela-2027",
      "templeId": "t-adoor",
      "name": "Adoor Gajamela 2027",
      "startDate": "2027-01-19",
      "endDate": "2027-01-20",
      "description": "The crowning glory of the 10-day annual festival at Sree Parthasarathy Temple, featuring nine highly decorated majestic elephants positioned side-by-side in front of a sea of devotees.",
      "imageUrl": "/assets/temples/adoor.jpg",
      "schedule": {
        "Day 1 (January 19, 2027)": "Gajamela procession with 9 caparisoned elephants, Panchavadyam, and temple art forms",
        "Day 2 (January 20, 2027)": "Aarattu holy dip ceremony in the local river and concluding prayers"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "f-thripunithura-vrishchikotsavam-2027",
      "templeId": "t-thripunithura",
      "name": "Thripunithura Vrishchikotsavam 2027",
      "startDate": "2027-11-10",
      "endDate": "2027-11-17",
      "description": "The royal 8-day festival at Sree Poornathrayeesa Temple, famous for hosting daily processions with 15 caparisoned elephants in both morning and night, accompanied by legendary Chenda Melam artists.",
      "imageUrl": "/assets/temples/thripunithura.jpg",
      "schedule": {
        "Day 1 (November 10, 2027)": "Kodiyettam flag hoisting, Thrikkethu prayers, and start of daily double elephant sreevelis",
        "Day 4 (November 13, 2027)": "Valiya Vilakku procession, spectacular temple illumination, and grand Panchavadyam ensemble",
        "Day 8 (November 17, 2027)": "Concluding Aarattu ceremony, lowering of the festival flag, and farewell elephant assembly"
      },
      "status": "upcoming" as const,
      "createdAt": "2026-07-15T14:48:00.000Z"
    }
  ],
  "elephants": officialElephants,
  "accessories": [
    {
      "id": "a-nettipattam-gold",
      "ownerId": "u-acc-owner-1",
      "name": "Premium Gold-Plated Nettipattam (1.5m)",
      "category": "Nettipattam",
      "imageUrl": "/assets/accessories/nettipattam.jpg",
      "description": "Exquisite elephant forehead ornaments made of high-quality copper alloy double gold-plated, traditional round medallions reflecting sunlight beautifully.",
      "quantityTotal": 15,
      "rentalPrice": 3500,
      "specifications": {
        "Height": "150cm",
        "Material": "Copper & Gold-Plating",
        "Style": "Central Travancore Tradition"
      },
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "a-muthukuda-velvet",
      "ownerId": "u-acc-owner-1",
      "name": "Designer Silk Muthukuda (Assorted Colors)",
      "category": "Muthukuda",
      "imageUrl": "/assets/accessories/muthukuda.jpg",
      "description": "Vibrant traditional decorative umbrellas used during Kudamattom, available in deep maroon, bright yellow, royal blue, and gold-trimmed borders.",
      "quantityTotal": 50,
      "rentalPrice": 450,
      "specifications": {
        "Diameter": "90cm",
        "Fabric": "Silk Velvet",
        "Fringe": "Golden Zari"
      },
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "a-chenda-brass",
      "ownerId": "u-acc-owner-2",
      "name": "Asuravadyam Chenda Instrument Set",
      "category": "Chenda Melam instruments",
      "imageUrl": "/assets/accessories/chenda.jpg",
      "description": "Handcrafted traditional drums made of jackfruit wood and tightly stretched calfskin, tuned for both Uruttu Chenda and Veeku Chenda performances.",
      "quantityTotal": 20,
      "rentalPrice": 800,
      "specifications": {
        "Wood": "Varikka Plavu (Jackfruit)",
        "Skin": "Natural Cowhide",
        "Strap": "Coir & Hemp Cord"
      },
      "isVerified": true,
      "createdAt": "2026-07-02T10:16:42.025Z"
    }
  ],
  "elephantBookings": [
    {
      "id": "eb-1",
      "festivalId": "f-thrissur-pooram-2026",
      "elephantId": "e-ramachandran",
      "startDate": "2026-04-26",
      "endDate": "2026-04-27",
      "status": "confirmed",
      "notes": "Confirmed for opening the southern entrance doorway (Thekke Gopura Vaatil).",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "eb-2",
      "festivalId": "f-thrissur-pooram-2026",
      "elephantId": "e-karnan",
      "startDate": "2026-04-27",
      "endDate": "2026-04-28",
      "status": "confirmed",
      "notes": "Booked for leading the Thiruvambady section of the procession.",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "eb-3",
      "festivalId": "f-nemmara-vela-2026",
      "elephantId": "e-ramachandran",
      "startDate": "2026-04-03",
      "endDate": "2026-04-05",
      "status": "pending",
      "notes": "Awaiting offline review of transportation and crowd safety measures.",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "eb-2027-1",
      "festivalId": "f-thrissur-pooram-2027",
      "elephantId": "e-ramachandran",
      "startDate": "2027-04-17",
      "endDate": "2027-04-18",
      "status": "confirmed",
      "notes": "Officially confirmed for the opening ceremony of the Southern Gate of Vadakkunnathan Temple.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "eb-2027-2",
      "festivalId": "f-thrissur-pooram-2027",
      "elephantId": "e-kalidasan",
      "startDate": "2027-04-17",
      "endDate": "2027-04-18",
      "status": "confirmed",
      "notes": "Booked for carrying the main Kolam for Paramekkavu Devaswom section.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "eb-2027-3",
      "festivalId": "f-thrissur-pooram-2027",
      "elephantId": "e-sivakumar",
      "startDate": "2027-04-17",
      "endDate": "2027-04-18",
      "status": "confirmed",
      "notes": "Booked for representing the Thiruvambady temple Devaswom committee.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "eb-2027-4",
      "festivalId": "f-arattupuzha-pooram-2027",
      "elephantId": "e-rajan",
      "startDate": "2027-03-20",
      "endDate": "2027-03-21",
      "status": "confirmed",
      "notes": "Carrying the main deity (Sastha Kolam) during the grand assembly of 23 deities.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "eb-2027-5",
      "festivalId": "f-uthralikavu-pooram-2027",
      "elephantId": "e-sivaraju",
      "startDate": "2027-03-02",
      "endDate": "2027-03-03",
      "status": "confirmed",
      "notes": "Leading the Wadakkanchery wing procession with maximum Thala Pokkam.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "eb-2027-6",
      "festivalId": "f-peruvanam-pooram-2027",
      "elephantId": "e-ananthapadmanabhan",
      "startDate": "2027-03-18",
      "endDate": "2027-03-19",
      "status": "confirmed",
      "notes": "Leading the Sreeveli procession during the evening Panchari Melam.",
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "eb-2027-7",
      "festivalId": "f-thripunithura-vrishchikotsavam-2027",
      "elephantId": "e-indrasen",
      "startDate": "2027-11-10",
      "endDate": "2027-11-17",
      "status": "confirmed",
      "notes": "Representing the royal deity of Poornathrayeesa during the double-Sreeveli procession.",
      "createdAt": "2026-07-15T14:48:00.000Z"
    },
    {
      "id": "eb-2027-8",
      "festivalId": "f-adoor-gajamela-2027",
      "elephantId": "e-kesavan",
      "startDate": "2027-01-19",
      "endDate": "2027-01-20",
      "status": "confirmed",
      "notes": "Carrying the main Krishna Kolam for the central Adoor Gajamela panel.",
      "createdAt": "2026-07-15T14:48:00.000Z"
    }
  ],
  "accessoryBookings": [
    {
      "id": "ab-1",
      "festivalId": "f-thrissur-pooram-2026",
      "accessoryId": "a-nettipattam-gold",
      "startDate": "2026-04-26",
      "endDate": "2026-04-28",
      "quantity": 15,
      "status": "confirmed",
      "notes": "All 15 units reserved for the main elephant row during Kudamattom.",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "ab-2",
      "festivalId": "f-thrissur-pooram-2026",
      "accessoryId": "a-muthukuda-velvet",
      "startDate": "2026-04-27",
      "endDate": "2026-04-27",
      "quantity": 30,
      "status": "confirmed",
      "notes": "Set of 30 multi-colored Muthukudas for the competitive umbrella exchange.",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "ab-3",
      "festivalId": "f-nemmara-vela-2026",
      "accessoryId": "a-chenda-brass",
      "startDate": "2026-04-03",
      "endDate": "2026-04-05",
      "quantity": 10,
      "status": "accepted",
      "notes": "Accepted for renting 10 drums; down payment pending offline verification.",
      "createdAt": "2026-07-02T10:16:42.025Z"
    },
    {
      "id": "ab-2027-1",
      "festivalId": "f-thrissur-pooram-2027",
      "accessoryId": "a-nettipattam-gold",
      "startDate": "2027-04-17",
      "endDate": "2027-04-18",
      "quantity": 15,
      "status": "confirmed",
      "notes": "15 gold-plated Nettipattams reserved for the Paramekkavu vs Thiruvambady elephant pageantry.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    },
    {
      "id": "ab-2027-2",
      "festivalId": "f-thrissur-pooram-2027",
      "accessoryId": "a-muthukuda-velvet",
      "startDate": "2027-04-18",
      "endDate": "2027-04-18",
      "quantity": 40,
      "status": "confirmed",
      "notes": "Reserved 40 Muthukudas for the legendary Kudamattom event.",
      "createdAt": "2026-07-15T14:32:00.000Z"
    }
  ]
};
