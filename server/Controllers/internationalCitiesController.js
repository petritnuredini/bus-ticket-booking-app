const internationalCities = [
  // Kosovo
  {
    id: "xk-1",
    ville: "Prishtina",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },

  {
    id: "xk-2",
    ville: "Mitrovica",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },
  {
    id: "xk-3",
    ville: "Peje",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },
  {
    id: "xk-4",
    ville: "Prizren",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },
  {
    id: "xk-5",
    ville: "Ferizaj",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },
  {
    id: "xk-6",
    ville: "Gjilan",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },
  {
    id: "xk-7",
    ville: "Gjakove",
    country: "Kosovo",
    countryCode: "XK",
    flag: "🇽🇰",
  },

  // Germany
  {
    id: "de-1",
    ville: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
  },
  {
    id: "de-2",
    ville: "Munich",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
  },
  {
    id: "de-3",
    ville: "Frankfurt",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
  },
  {
    id: "de-4",
    ville: "Hamburg",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
  },
  {
    id: "de-5",
    ville: "Cologne",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
  },

  // Austria
  {
    id: "at-1",
    ville: "Vienna",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
  },
  {
    id: "at-2",
    ville: "Salzburg",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
  },
  {
    id: "at-3",
    ville: "Innsbruck",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
  },

  // Switzerland
  {
    id: "ch-1",
    ville: "Zurich",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
  },
  {
    id: "ch-2",
    ville: "Geneva",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
  },
  {
    id: "ch-3",
    ville: "Basel",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
  },
  {
    id: "ch-4",
    ville: "Bern",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
  },

  // Italy
  {
    id: "it-1",
    ville: "Milan",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
  },
  {
    id: "it-2",
    ville: "Rome",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
  },
  {
    id: "it-3",
    ville: "Venice",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
  },
  {
    id: "it-4",
    ville: "Florence",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
  },
  {
    id: "it-5",
    ville: "Bologna",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
  },

  // France
  {
    id: "fr-1",
    ville: "Paris",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
  },
  {
    id: "fr-2",
    ville: "Lyon",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
  },
  {
    id: "fr-3",
    ville: "Marseille",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
  },
  {
    id: "fr-4",
    ville: "Nice",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
  },

  // Netherlands
  {
    id: "nl-1",
    ville: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
  },
  {
    id: "nl-2",
    ville: "Rotterdam",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
  },
  {
    id: "nl-3",
    ville: "The Hague",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
  },

  // Belgium
  {
    id: "be-1",
    ville: "Brussels",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
  },
  {
    id: "be-2",
    ville: "Antwerp",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
  },
  {
    id: "be-3",
    ville: "Ghent",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
  },

  // Sweden
  {
    id: "se-1",
    ville: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
  },
  {
    id: "se-2",
    ville: "Gothenburg",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
  },
  {
    id: "se-3",
    ville: "Malmö",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
  },

  // Norway
  {
    id: "no-1",
    ville: "Oslo",
    country: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
  },
  {
    id: "no-2",
    ville: "Bergen",
    country: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
  },

  // Denmark
  {
    id: "dk-1",
    ville: "Copenhagen",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
  },
  {
    id: "dk-2",
    ville: "Aarhus",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
  },

  // Czech Republic
  {
    id: "cz-1",
    ville: "Prague",
    country: "Czech Republic",
    countryCode: "CZ",
    flag: "🇨🇿",
  },
  {
    id: "cz-2",
    ville: "Brno",
    country: "Czech Republic",
    countryCode: "CZ",
    flag: "🇨🇿",
  },

  // Hungary
  {
    id: "hu-1",
    ville: "Budapest",
    country: "Hungary",
    countryCode: "HU",
    flag: "🇭🇺",
  },

  // Poland
  {
    id: "pl-1",
    ville: "Warsaw",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
  },
  {
    id: "pl-2",
    ville: "Krakow",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
  },

  // Spain
  {
    id: "es-1",
    ville: "Madrid",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
  },
  {
    id: "es-2",
    ville: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
  },
  {
    id: "es-3",
    ville: "Valencia",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
  },

  // Portugal
  {
    id: "pt-1",
    ville: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
  },
  {
    id: "pt-2",
    ville: "Porto",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
  },

  // Slovenia
  {
    id: "si-1",
    ville: "Ljubljana",
    country: "Slovenia",
    countryCode: "SI",
    flag: "🇸🇮",
  },

  // Croatia
  {
    id: "hr-1",
    ville: "Zagreb",
    country: "Croatia",
    countryCode: "HR",
    flag: "🇭🇷",
  },
  {
    id: "hr-2",
    ville: "Split",
    country: "Croatia",
    countryCode: "HR",
    flag: "🇭🇷",
  },

  // Serbia
  {
    id: "rs-1",
    ville: "Belgrade",
    country: "Serbia",
    countryCode: "RS",
    flag: "🇷🇸",
  },
  {
    id: "rs-2",
    ville: "Novi Sad",
    country: "Serbia",
    countryCode: "RS",
    flag: "🇷🇸",
  },

  // North Macedonia
  {
    id: "mk-1",
    ville: "Skopje",
    country: "North Macedonia",
    countryCode: "MK",
    flag: "🇲🇰",
  },

  // Montenegro
  {
    id: "me-1",
    ville: "Podgorica",
    country: "Montenegro",
    countryCode: "ME",
    flag: "🇲🇪",
  },

  // Albania
  {
    id: "al-1",
    ville: "Tirana",
    country: "Albania",
    countryCode: "AL",
    flag: "🇦🇱",
  },
  {
    id: "al-2",
    ville: "Durres",
    country: "Albania",
    countryCode: "AL",
    flag: "🇦🇱",
  },

  // Bosnia and Herzegovina
  {
    id: "ba-1",
    ville: "Sarajevo",
    country: "Bosnia and Herzegovina",
    countryCode: "BA",
    flag: "🇧🇦",
  },
];

// Get all international cities
const GetAllInternationalCities = async (req, res) => {
  try {
    res.status(200).send({
      status: "success",
      message: "International cities fetched successfully",
      data: internationalCities,
    });
  } catch (error) {
    console.error("Error fetching international cities:", error);
    res.status(500).send({
      status: "error",
      message: "Error fetching international cities",
      error: error.message,
    });
  }
};

// Get cities by country
const GetCitiesByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const cities = internationalCities.filter(
      (city) => city.country.toLowerCase() === country.toLowerCase()
    );

    res.status(200).send({
      status: "success",
      message: `Cities in ${country} fetched successfully`,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities by country:", error);
    res.status(500).send({
      status: "error",
      message: "Error fetching cities by country",
      error: error.message,
    });
  }
};

// Search cities by name
const SearchInternationalCities = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).send({
        status: "error",
        message: "Search query is required",
      });
    }

    const cities = internationalCities.filter(
      (city) =>
        city.ville.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).send({
      status: "success",
      message: "Cities search completed",
      data: cities,
    });
  } catch (error) {
    console.error("Error searching international cities:", error);
    res.status(500).send({
      status: "error",
      message: "Error searching international cities",
      error: error.message,
    });
  }
};

module.exports = {
  GetAllInternationalCities,
  GetCitiesByCountry,
  SearchInternationalCities,
};
