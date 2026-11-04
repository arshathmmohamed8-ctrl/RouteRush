// Centralized Route and City Database for RouteRush
// Covers all requested Tamil Nadu districts and popular intercity destinations

export const TAMIL_NADU_CITIES = [
  { id: 1, name: 'Chennai', state: 'Tamil Nadu', code: 'MAA', popular: true, aliases: ['madras', 'chenai'] },
  { id: 2, name: 'Coimbatore', state: 'Tamil Nadu', code: 'CBE', popular: true, aliases: ['kovai', 'coimbatore'] },
  { id: 3, name: 'Madurai', state: 'Tamil Nadu', code: 'IXM', popular: true, aliases: ['madura'] },
  { id: 4, name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', code: 'TRZ', popular: true, aliases: ['trichy', 'tiruchi', 'tiruchirapalli', 'tiruchirappalli'] },
  { id: 5, name: 'Salem', state: 'Tamil Nadu', code: 'SXV', popular: true, aliases: ['salem'] },
  { id: 6, name: 'Erode', state: 'Tamil Nadu', code: 'ERD', popular: true, aliases: ['erode'] },
  { id: 7, name: 'Tirunelveli', state: 'Tamil Nadu', code: 'TEN', popular: true, aliases: ['nellai', 'tirunelveli'] },
  { id: 8, name: 'Thoothukudi', state: 'Tamil Nadu', code: 'TCR', popular: false, aliases: ['tuticorin', 'thoothukudi'] },
  { id: 9, name: 'Dindigul', state: 'Tamil Nadu', code: 'DGL', popular: false, aliases: ['dindigul', 'dindugal'] },
  { id: 10, name: 'Thanjavur', state: 'Tamil Nadu', code: 'TNJ', popular: false, aliases: ['tanjore', 'thanjavur'] },
  { id: 11, name: 'Vellore', state: 'Tamil Nadu', code: 'VLR', popular: true, aliases: ['vellore'] },
  { id: 12, name: 'Kanyakumari', state: 'Tamil Nadu', code: 'CAPE', popular: true, aliases: ['cape comorin', 'kanyakumari'] },
  { id: 13, name: 'Nagercoil', state: 'Tamil Nadu', code: 'NCJ', popular: false, aliases: ['nagercoil'] },
  { id: 14, name: 'Karur', state: 'Tamil Nadu', code: 'KRR', popular: false, aliases: ['karur'] },
  { id: 15, name: 'Namakkal', state: 'Tamil Nadu', code: 'NKL', popular: false, aliases: ['namakkal'] },
  { id: 16, name: 'Cuddalore', state: 'Tamil Nadu', code: 'CDL', popular: false, aliases: ['cuddalore'] },
  { id: 17, name: 'Villupuram', state: 'Tamil Nadu', code: 'VM', popular: false, aliases: ['villupuram', 'viluppuram'] },
  { id: 18, name: 'Kanchipuram', state: 'Tamil Nadu', code: 'CJ', popular: false, aliases: ['kancheepuram', 'kanchipuram'] },
  { id: 19, name: 'Tiruppur', state: 'Tamil Nadu', code: 'TUP', popular: true, aliases: ['tirupur', 'tiruppur'] },
  { id: 20, name: 'Sivakasi', state: 'Tamil Nadu', code: 'SVKS', popular: false, aliases: ['sivakasi'] },
  { id: 21, name: 'Ramanathapuram', state: 'Tamil Nadu', code: 'RMD', popular: false, aliases: ['ramnad', 'ramanathapuram'] },
  { id: 22, name: 'Krishnagiri', state: 'Tamil Nadu', code: 'KGI', popular: false, aliases: ['krishnagiri'] },
  { id: 23, name: 'Dharmapuri', state: 'Tamil Nadu', code: 'DPI', popular: false, aliases: ['dharmapuri'] },
  { id: 24, name: 'Ooty', state: 'Tamil Nadu', code: 'UAM', popular: true, aliases: ['ooty', 'udhagamandalam', 'ootacamund'] },
  { id: 25, name: 'Hosur', state: 'Tamil Nadu', code: 'HSRA', popular: true, aliases: ['hosur'] },
  { id: 26, name: 'Pollachi', state: 'Tamil Nadu', code: 'POY', popular: false, aliases: ['pollachi'] },
];

export const INTERCITY_DESTINATIONS = [
  { id: 27, name: 'Bangalore', state: 'Karnataka', code: 'BLR', popular: true, aliases: ['bengaluru', 'bangalore'] },
  { id: 28, name: 'Hyderabad', state: 'Telangana', code: 'HYD', popular: true, aliases: ['hyderabad', 'secunderabad'] },
  { id: 29, name: 'Kochi', state: 'Kerala', code: 'COK', popular: true, aliases: ['cochin', 'ernakulam', 'kochi'] },
  { id: 30, name: 'Thiruvananthapuram', state: 'Kerala', code: 'TRV', popular: true, aliases: ['trivandrum', 'thiruvananthapuram'] },
  { id: 31, name: 'Kozhikode', state: 'Kerala', code: 'CCJ', popular: false, aliases: ['calicut', 'kozhikode'] },
  { id: 32, name: 'Mumbai', state: 'Maharashtra', code: 'BOM', popular: true, aliases: ['bombay', 'mumbai'] },
  { id: 33, name: 'Pune', state: 'Maharashtra', code: 'PNQ', popular: true, aliases: ['poona', 'pune'] },
];

export const ALL_CITIES = [...TAMIL_NADU_CITIES, ...INTERCITY_DESTINATIONS];

// Boarding points by city
export const CITY_BOARDING_POINTS = {
  Chennai: ['Koyambedu (Omni Bus Stand)', 'Tambaram (Opp. Railway Station)', 'Perungalathur (Near Bus Stop)', 'Guindy (Kathipara)', 'Ashok Pillar', 'Sriperumbudur Toll'],
  Coimbatore: ['Gandhipuram (Omni Bus Stand)', 'Lakshmi Mills', 'Hopes College', 'KMCH (Avinashi Road)', 'Singanallur', 'Ukkadam'],
  Madurai: ['Mattuthavani (Integrated Bus Stand)', 'Periyar Bus Stand', 'Arappalayam', 'Guru Theatre', 'Thirumangalam Toll'],
  'Tiruchirappalli (Trichy)': ['Central Bus Stand', 'Chatram Bus Stand', 'Mannarpuram Toll', 'Thillai Nagar', 'Samayapuram Toll'],
  Salem: ['New Bus Stand (AVR Roundana)', 'Kondalampatti Bypass', 'Seelanaickenpatti', 'Ammapet Bypass'],
  Erode: ['Erode Central Bus Stand', 'Bhavani Bypass', 'Chithode Tollgate', 'Solar'],
  Tirunelveli: ['New Bus Stand (Veinthaankulam)', 'Vannarpettai', 'Palayamkottai', 'Kayathar Toll'],
  Thoothukudi: ['New Bus Stand', 'VVD Signal', 'Old Bus Stand', 'Spic Nagar'],
  Dindigul: ['Dindigul Bus Stand', 'Collectorate Office', 'Palani Bypass Road'],
  Thanjavur: ['New Bus Stand', 'Old Bus Stand', 'Medical College Road'],
  Vellore: ['New Bus Stand', 'Green Circle Bypass', 'VIT Main Gate', 'Sathuvachari'],
  Kanyakumari: ['Kanyakumari Bus Stand', 'Vivekananda Rock Road', 'Agasteeswaram'],
  Nagercoil: ['Vadasery Bus Stand', 'Chettikulam', 'Asaripallam'],
  Karur: ['Karur Bus Stand', 'Vengamedu', 'Puliyur Bypass'],
  Namakkal: ['Namakkal Bus Stand', 'Muthalaipatty Bypass', 'Paramathi Velur'],
  Cuddalore: ['Cuddalore Bus Stand', 'Semmandalam', 'Vadalur'],
  Villupuram: ['Villupuram New Bus Stand', 'Janakipuram Toll', 'Koliyanur Bypass'],
  Kanchipuram: ['Kanchipuram Bus Stand', 'Collectorate', 'Sunguvarchatram'],
  Tiruppur: ['New Bus Stand', 'Old Bus Stand', 'Avinashi Bypass'],
  Sivakasi: ['Sivakasi Bus Stand', 'Thiruthangal', 'Satchiyapuram'],
  Ramanathapuram: ['Ramanathapuram Bus Stand', 'Collectorate Bypass', 'Uchipuli'],
  Krishnagiri: ['Krishnagiri Toll Plaza', 'New Bus Stand', 'Sundampatti'],
  Dharmapuri: ['Dharmapuri Bus Stand', 'Four Road Roundana', 'Thoppur Toll'],
  Ooty: ['Ooty Main Bus Stand', 'Charring Cross', 'Lovedale Junction'],
  Hosur: ['Hosur Bus Stand', 'Zuzuvadi Toll Plaza', 'Sipcot Ring Road'],
  Pollachi: ['Pollachi Central Bus Stand', 'Mahalingam College', 'Achipatti'],
  Bangalore: ['Majestic (Kempegowda Bus Station)', 'Madiwala', 'Silk Board Junction', 'Electronic City Toll', 'Shantinagar Bus Station', 'Hebbal'],
  Hyderabad: ['MGBS (Imlibun)', 'Ameerpet', 'Kukatpally', 'Gachibowli', 'Shamshabad Airport'],
  Kochi: ['Vyttila Mobility Hub', 'Edappally Toll', 'Aluva Bypass', 'Ernakulam KSRTC Stand'],
  Thiruvananthapuram: ['Thampanoor KSRTC Stand', 'Kazhakkoottam Technopark', 'East Fort'],
  Kozhikode: ['Kozhikode KSRTC Bus Stand', 'Palayam', 'Thondayad Bypass'],
  Mumbai: ['Borivali East', 'Andheri East', 'Sion Chunabhatti', 'Vashi Toll Plaza', 'Panvel'],
  Pune: ['Swargate', 'Shivajinagar (Wakdewadi)', 'Wakad Hinjewadi Bridge', 'Katraj'],
};

// Dropping points by city
export const CITY_DROPPING_POINTS = {
  Chennai: ['Perungalathur', 'Tambaram', 'Guindy', 'Koyambedu Omni Bus Stand', 'Central Railway Station'],
  Coimbatore: ['Hopes College', 'KMCH (Avinashi Road)', 'Gandhipuram Omni Bus Stand', 'Singanallur', 'Ukkadam'],
  Madurai: ['Mattuthavani Bus Stand', 'Arappalayam', 'Periyar Bus Stand', 'Fathima College', 'Thirumangalam'],
  'Tiruchirappalli (Trichy)': ['Samayapuram Toll', 'Mannarpuram', 'Central Bus Stand', 'Chatram'],
  Salem: ['Thoppur Toll', 'Steel Plant Gate', 'AVR Roundana', 'New Bus Stand', 'Kondalampatti'],
  Erode: ['Chithode Bypass', 'Bhavani Road', 'Erode Central Bus Stand', 'Solar'],
  Tirunelveli: ['Kayathar Toll', 'Vannarpettai', 'New Bus Stand (Veinthaankulam)', 'Palayamkottai'],
  Thoothukudi: ['Pudur Pandiapuram Toll', 'VVD Signal', 'New Bus Stand'],
  Dindigul: ['Palani Road Bypass', 'Dindigul Bus Stand', 'Collectorate'],
  Thanjavur: ['Vallam Bypass', 'New Bus Stand', 'Old Bus Stand'],
  Vellore: ['Sathuvachari', 'Green Circle Bypass', 'New Bus Stand'],
  Kanyakumari: ['Kanyakumari Town Entrance', 'Kanyakumari Bus Stand'],
  Nagercoil: ['Thovalai', 'Vadasery Bus Stand', 'Chettikulam'],
  Karur: ['Manmangalam Toll', 'Karur Bus Stand', 'Vengamedu'],
  Namakkal: ['Muthalaipatty Bypass', 'Namakkal Bus Stand'],
  Cuddalore: ['Semmandalam', 'Cuddalore Bus Stand'],
  Villupuram: ['Janakipuram Toll', 'Villupuram New Bus Stand'],
  Kanchipuram: ['Sunguvarchatram', 'Kanchipuram Bus Stand'],
  Tiruppur: ['Avinashi Bypass', 'New Bus Stand'],
  Sivakasi: ['Thiruthangal', 'Sivakasi Bus Stand'],
  Ramanathapuram: ['Collectorate Bypass', 'Ramanathapuram Bus Stand'],
  Krishnagiri: ['Krishnagiri Toll', 'New Bus Stand'],
  Dharmapuri: ['Thoppur Toll', 'Dharmapuri Bus Stand'],
  Ooty: ['Charring Cross', 'Ooty Main Bus Stand'],
  Hosur: ['Zuzuvadi Toll', 'Hosur Bus Stand'],
  Pollachi: ['Achipatti', 'Pollachi Central Bus Stand'],
  Bangalore: ['Electronic City Toll', 'Silk Board', 'Madiwala', 'Shantinagar', 'Majestic', 'Yeshwanthpur'],
  Hyderabad: ['Shamshabad', 'Aramghar', 'MGBS', 'Lakdi-ka-pul', 'Ameerpet', 'Kukatpally'],
  Kochi: ['Aluva Bypass', 'Edappally', 'Vyttila Mobility Hub', 'KSRTC Stand'],
  Thiruvananthapuram: ['Kazhakkoottam', 'Pattom', 'Thampanoor Central'],
  Kozhikode: ['Thondayad Bypass', 'Palayam', 'KSRTC Bus Stand'],
  Mumbai: ['Panvel', 'Vashi', 'Sion Chunabhatti', 'Andheri East', 'Borivali East'],
  Pune: ['Wakad Bridge', 'Shivajinagar', 'Swargate', 'Hadapsar'],
};

// Normalize city names with alias tolerance
export const normalizeCity = (input) => {
  if (!input || typeof input !== 'string') return '';
  const clean = input.trim().toLowerCase();

  for (const city of ALL_CITIES) {
    if (city.name.toLowerCase() === clean) return city.name;
    if (city.aliases && city.aliases.some(alias => alias.toLowerCase() === clean)) {
      return city.name;
    }
  }

  // Prefix matching
  for (const city of ALL_CITIES) {
    if (city.name.toLowerCase().startsWith(clean)) return city.name;
    if (city.aliases && city.aliases.some(alias => alias.toLowerCase().startsWith(clean))) {
      return city.name;
    }
  }

  // Fallback title-case
  return input.trim().charAt(0).toUpperCase() + input.trim().slice(1);
};

// Standard Route Matrix with realistic highway distances and durations
const ROUTE_MATRIX = {
  // Chennai originating
  'Chennai-Madurai': { distance: 460, durationMin: 450, baseFare: 550 },
  'Madurai-Chennai': { distance: 460, durationMin: 450, baseFare: 550 },
  'Chennai-Coimbatore': { distance: 505, durationMin: 480, baseFare: 620 },
  'Coimbatore-Chennai': { distance: 505, durationMin: 480, baseFare: 620 },
  'Chennai-Bangalore': { distance: 350, durationMin: 380, baseFare: 480 },
  'Bangalore-Chennai': { distance: 350, durationMin: 380, baseFare: 480 },
  'Chennai-Salem': { distance: 345, durationMin: 350, baseFare: 450 },
  'Salem-Chennai': { distance: 345, durationMin: 350, baseFare: 450 },
  'Chennai-Tiruchirappalli (Trichy)': { distance: 330, durationMin: 330, baseFare: 420 },
  'Tiruchirappalli (Trichy)-Chennai': { distance: 330, durationMin: 330, baseFare: 420 },
  'Chennai-Tirunelveli': { distance: 620, durationMin: 600, baseFare: 750 },
  'Tirunelveli-Chennai': { distance: 620, durationMin: 600, baseFare: 750 },
  'Chennai-Kanyakumari': { distance: 705, durationMin: 690, baseFare: 850 },
  'Kanyakumari-Chennai': { distance: 705, durationMin: 690, baseFare: 850 },
  'Chennai-Vellore': { distance: 140, durationMin: 165, baseFare: 220 },
  'Vellore-Chennai': { distance: 140, durationMin: 165, baseFare: 220 },
  'Chennai-Hosur': { distance: 310, durationMin: 330, baseFare: 420 },
  'Hosur-Chennai': { distance: 310, durationMin: 330, baseFare: 420 },
  'Chennai-Erode': { distance: 400, durationMin: 420, baseFare: 520 },
  'Erode-Chennai': { distance: 400, durationMin: 420, baseFare: 520 },
  'Chennai-Thoothukudi': { distance: 600, durationMin: 590, baseFare: 720 },
  'Thoothukudi-Chennai': { distance: 600, durationMin: 590, baseFare: 720 },
  'Chennai-Thanjavur': { distance: 345, durationMin: 360, baseFare: 440 },
  'Thanjavur-Chennai': { distance: 345, durationMin: 360, baseFare: 440 },
  'Chennai-Dindigul': { distance: 420, durationMin: 420, baseFare: 520 },
  'Dindigul-Chennai': { distance: 420, durationMin: 420, baseFare: 520 },
  'Chennai-Nagercoil': { distance: 685, durationMin: 660, baseFare: 820 },
  'Nagercoil-Chennai': { distance: 685, durationMin: 660, baseFare: 820 },
  'Chennai-Karur': { distance: 380, durationMin: 390, baseFare: 490 },
  'Karur-Chennai': { distance: 380, durationMin: 390, baseFare: 490 },
  'Chennai-Kochi': { distance: 690, durationMin: 660, baseFare: 850 },
  'Kochi-Chennai': { distance: 690, durationMin: 660, baseFare: 850 },

  // Coimbatore routes
  'Coimbatore-Salem': { distance: 165, durationMin: 175, baseFare: 260 },
  'Salem-Coimbatore': { distance: 165, durationMin: 175, baseFare: 260 },
  'Coimbatore-Madurai': { distance: 215, durationMin: 240, baseFare: 320 },
  'Madurai-Coimbatore': { distance: 215, durationMin: 240, baseFare: 320 },
  'Coimbatore-Bangalore': { distance: 365, durationMin: 390, baseFare: 490 },
  'Bangalore-Coimbatore': { distance: 365, durationMin: 390, baseFare: 490 },
  'Coimbatore-Tiruppur': { distance: 55, durationMin: 70, baseFare: 120 },
  'Tiruppur-Coimbatore': { distance: 55, durationMin: 70, baseFare: 120 },
  'Coimbatore-Ooty': { distance: 85, durationMin: 165, baseFare: 180 },
  'Ooty-Coimbatore': { distance: 85, durationMin: 165, baseFare: 180 },
  'Coimbatore-Pollachi': { distance: 45, durationMin: 60, baseFare: 100 },
  'Pollachi-Coimbatore': { distance: 45, durationMin: 60, baseFare: 100 },
  'Coimbatore-Erode': { distance: 100, durationMin: 110, baseFare: 180 },
  'Erode-Coimbatore': { distance: 100, durationMin: 110, baseFare: 180 },
  'Coimbatore-Tirunelveli': { distance: 360, durationMin: 390, baseFare: 480 },
  'Tirunelveli-Coimbatore': { distance: 360, durationMin: 390, baseFare: 480 },

  // Madurai routes
  'Madurai-Tirunelveli': { distance: 160, durationMin: 160, baseFare: 240 },
  'Tirunelveli-Madurai': { distance: 160, durationMin: 160, baseFare: 240 },
  'Madurai-Bangalore': { distance: 435, durationMin: 450, baseFare: 550 },
  'Bangalore-Madurai': { distance: 435, durationMin: 450, baseFare: 550 },
  'Madurai-Tiruchirappalli (Trichy)': { distance: 135, durationMin: 130, baseFare: 210 },
  'Tiruchirappalli (Trichy)-Madurai': { distance: 135, durationMin: 130, baseFare: 210 },
  'Madurai-Kanyakumari': { distance: 245, durationMin: 250, baseFare: 340 },
  'Kanyakumari-Madurai': { distance: 245, durationMin: 250, baseFare: 340 },
  'Madurai-Dindigul': { distance: 65, durationMin: 65, baseFare: 110 },
  'Dindigul-Madurai': { distance: 65, durationMin: 65, baseFare: 110 },
  'Madurai-Sivakasi': { distance: 75, durationMin: 90, baseFare: 130 },
  'Sivakasi-Madurai': { distance: 75, durationMin: 90, baseFare: 130 },

  // Bangalore & Intercity routes
  'Bangalore-Hyderabad': { distance: 570, durationMin: 540, baseFare: 680 },
  'Hyderabad-Bangalore': { distance: 570, durationMin: 540, baseFare: 680 },
  'Bangalore-Salem': { distance: 205, durationMin: 220, baseFare: 310 },
  'Salem-Bangalore': { distance: 205, durationMin: 220, baseFare: 310 },
  'Bangalore-Hosur': { distance: 40, durationMin: 55, baseFare: 90 },
  'Hosur-Bangalore': { distance: 40, durationMin: 55, baseFare: 90 },
  'Bangalore-Kochi': { distance: 550, durationMin: 570, baseFare: 690 },
  'Kochi-Bangalore': { distance: 550, durationMin: 570, baseFare: 690 },
  'Mumbai-Pune': { distance: 150, durationMin: 195, baseFare: 280 },
  'Pune-Mumbai': { distance: 150, durationMin: 195, baseFare: 280 },
  'Kochi-Thiruvananthapuram': { distance: 205, durationMin: 250, baseFare: 310 },
  'Thiruvananthapuram-Kochi': { distance: 205, durationMin: 250, baseFare: 310 },
};

// Get route metadata between two cities
export const getRouteInfo = (from, to) => {
  const normFrom = normalizeCity(from);
  const normTo = normalizeCity(to);

  if (!normFrom || !normTo || normFrom === normTo) return null;

  const key = `${normFrom}-${normTo}`;
  const reverseKey = `${normTo}-${normFrom}`;

  if (ROUTE_MATRIX[key]) {
    return {
      from: normFrom,
      to: normTo,
      ...ROUTE_MATRIX[key],
    };
  }

  if (ROUTE_MATRIX[reverseKey]) {
    return {
      from: normFrom,
      to: normTo,
      ...ROUTE_MATRIX[reverseKey],
    };
  }

  return null;
};

// Operator roster with verified profiles
const OPERATORS = [
  { id: 'op1', company_name: 'Orange Travels', rating: 4.8, total_reviews: 3240, verified: true },
  { id: 'op2', company_name: 'KPN Travels', rating: 4.6, total_reviews: 2890, verified: true },
  { id: 'op3', company_name: 'Parveen Travels', rating: 4.5, total_reviews: 1980, verified: true },
  { id: 'op4', company_name: 'SRS Travels', rating: 4.4, total_reviews: 2150, verified: true },
  { id: 'op5', company_name: 'IntrCity SmartBus', rating: 4.7, total_reviews: 4120, verified: true },
  { id: 'op6', company_name: 'VRL Travels', rating: 4.5, total_reviews: 2780, verified: true },
  { id: 'op7', company_name: 'TNSTC Ultra Deluxe', rating: 4.2, total_reviews: 6200, verified: true },
  { id: 'op8', company_name: 'Kallada Tours', rating: 4.5, total_reviews: 1650, verified: true },
];

// Generates dynamic, route-aware trips matching the selected cities and date
export const generateTripsForRoute = (from, to, dateStr = new Date().toISOString().split('T')[0], passengers = 1) => {
  const normFrom = normalizeCity(from);
  const normTo = normalizeCity(to);

  if (!normFrom || !normTo || normFrom === normTo) {
    return [];
  }

  const routeInfo = getRouteInfo(normFrom, normTo);
  if (!routeInfo) {
    return []; // No direct buses for unsupported routes
  }

  const { distance, durationMin, baseFare } = routeInfo;
  const boardingPoints = CITY_BOARDING_POINTS[normFrom] || [`${normFrom} Main Bus Station`, `${normFrom} Bypass Junction`];
  const droppingPoints = CITY_DROPPING_POINTS[normTo] || [`${normTo} Integrated Bus Terminus`, `${normTo} Central Bypass`];

  // Selected travel date base
  const targetDate = new Date(dateStr);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();

  // Create 5 to 6 varied departure slots across the day
  const departures = [
    { hour: 6, min: 30, busType: 'ac_luxury', busName: 'Volvo 9400 Multi-Axle B11R', opIndex: 0, fareMod: 1.25, seats: 24, amenities: ['wifi', 'charging', 'blanket', 'water', 'ac'] },
    { hour: 9, min: 15, busType: 'ac_sleeper', busName: 'Scania Multi-Axle Intercity Berth', opIndex: 1, fareMod: 1.15, seats: 18, amenities: ['ac', 'blanket', 'charging', 'water', 'reading_light'] },
    { hour: 13, min: 30, busType: 'ac_seater', busName: 'Mercedes-Benz Super Luxury', opIndex: 2, fareMod: 0.95, seats: 32, amenities: ['wifi', 'ac', 'charging', 'entertainment'] },
    { hour: 17, min: 45, busType: 'non_ac_sleeper', busName: 'Ashok Leyland 2+1 Comfort Sleeper', opIndex: 6, fareMod: 0.75, seats: 14, amenities: ['charging', 'blanket', 'first_aid'] },
    { hour: 21, min: 15, busType: 'ac_luxury', busName: 'IntrCity SmartBus Club Class', opIndex: 4, fareMod: 1.35, seats: 8, amenities: ['wifi', 'ac', 'blanket', 'water', 'gps', 'cctv'] },
    { hour: 22, min: 45, busType: 'ac_sleeper', busName: 'VRL High-Deck Executive Sleeper', opIndex: 5, fareMod: 1.20, seats: 19, amenities: ['wifi', 'charging', 'blanket', 'water', 'ac', 'reading_light'] },
  ];

  return departures.map((slot, index) => {
    const depDate = new Date(year, month, day, slot.hour, slot.min, 0);
    const arrDate = new Date(depDate.getTime() + durationMin * 60000);
    const operator = OPERATORS[slot.opIndex] || OPERATORS[0];
    const calculatedFare = Math.round(baseFare * slot.fareMod / 10) * 10;

    return {
      id: `${normFrom.slice(0, 3).toUpperCase()}-${normTo.slice(0, 3).toUpperCase()}-${index + 1}`,
      fare: calculatedFare,
      available_seats: Math.max(passengers, slot.seats),
      departure_time: depDate.toISOString(),
      arrival_time: arrDate.toISOString(),
      status: 'scheduled',
      boarding_points: boardingPoints,
      dropping_points: droppingPoints,
      bus: {
        id: `bus-${slot.opIndex + 1}-${index}`,
        name: slot.busName,
        bus_type: slot.busType,
        total_seats: 40,
        amenities: slot.amenities,
        operator: operator,
      },
      route: {
        id: `route-${normFrom}-${normTo}`,
        from_city: { name: normFrom },
        to_city: { name: normTo },
        distance_km: distance,
        estimated_duration_min: durationMin,
      },
    };
  });
};

