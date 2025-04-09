// Generate 50 sample property listings for MongoDB
const properties = [];

const propertyTypes = ["Apartment", "House", "Villa", "Condo", "Townhouse", "Studio"];
const amenitiesOptions = ["WiFi", "Air Conditioning", "Parking", "Swimming Pool", "Gym", "Kitchen", "TV"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat", "Navsari"];
const countries = ["India", "USA", "UK", "Canada", "Australia", "UAE"];

for (let i = 1; i <= 50; i++) {
  const randomAmenities = [];
  const amenitiesCount = Math.floor(Math.random() * 4) + 2; // 2-5 amenities
  for (let j = 0; j < amenitiesCount; j++) {
    const randomAmenity = amenitiesOptions[Math.floor(Math.random() * amenitiesOptions.length)];
    if (!randomAmenities.includes(randomAmenity)) {
      randomAmenities.push(randomAmenity);
    }
  }

  const imageCount = Math.floor(Math.random() * 10) + 1; // 2-10 images
  const images = [];
  for (let k = 0; k < imageCount; k++) {
    images.push({
      public_id: `StayZio_Dev/image${i}_${k}`,
      url: `https://res.cloudinary.com/ds6lutlko/image/upload/v${1744000000 + i + k}/StayZio_Dev/image${i}_${k}`,
      // https://res.cloudinary.com/ds61utlko/image/upload/v1744093077/StayZio_Dev/yofzes8qfuvumi0axedv.jpg
    });
  }

  properties.push({
    title: `${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]} ${i}`,
    description: `Beautiful property with ${randomAmenities.length} amenities`,
    type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    location: cities[Math.floor(Math.random() * cities.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    price: Math.floor(Math.random() * 9000) + 1000, // 1000-10000
    bedrooms: Math.floor(Math.random() * 5) + 1, // 1-5
    bathrooms: Math.floor(Math.random() * 4) + 1, // 1-4
    amenities: randomAmenities,
    images: images,
    userId: '67f371f8248a84d510f2d155', // Replace with actual user IDs if needed
    createdAt: new Date(new Date().getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Last 30 days
    updatedAt: new Date(),
    __v: 0
  });
}

// To insert into MongoDB
// db.properties.insertMany(properties);

propertyListingModel.insertMany(properties).then(() => {
  console.log("Sample properties inserted successfully");
}).catch((error) => {
  console.error("Error inserting sample properties:", error);
});
