if(process.env.NODE_ENV != "production"){
    require('dotenv').config({ path: '../.env' });
    }
  const dbUrl = process.env.ATLASDB_URL;
  const mongoose = require("mongoose");
  const initData = require("./data.js");
  const Listings = require("../models/listing.js");
  
  async function main() {
    try {
      await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to the database");
      await initDB(); // Call initDB after successful connection
    } catch (err) {
      console.error("Database connection error:", err);
    }
  }
  
  const initDB = async () => {
 try{
      // Remove all existing listings
      await Listings.deleteMany({});
  
      // Modify initData and assign a default owner
      initData.data = initData.data.map((obj) => ({
        ...obj,
        image: {
          url: obj.image.url,
          filename: obj.image.filename,
        },
        geometry: obj.geometry ,
        owner: "674f3a30c025d82e8bba5af7",
      })); 
  
      // Insert new data
      await Listings.insertMany(initData.data);
      console.log("Data has been initialized");
    } catch (err) {
      console.error("Error initializing database:", err);
    }
  };
  
  main();

  