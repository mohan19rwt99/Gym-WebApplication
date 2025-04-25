import GymAdd from '../model/gymModel.js';
import Payment from '../model/booking.js';
import upload from '../upload/upload.js';
import path from "path"
import {Storage} from "@google-cloud/storage"

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET; // Name of the bucket
const bucket = storage.bucket(bucketName);

console.log(`Using bucket: ${bucketName}`);

console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

export const addGym = async (req, res) => {
  try {
    const {
      gymName,
      address,
      coordinates,
      pricing,
      personalTrainerPricing,
      timings,
      currency,
      description,
      amenities,
    } = JSON.parse(req.body.data);

    console.log('Amenities:', timings.morning);

    const currencySymbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      RUB: '₽',
      KRW: '₩',
    };

    if (!currency || !currency.name || !currencySymbols[currency.name]) {
      throw new Error('Invalid or missing currency Name');
    }

    const currencyWithSymbol = {
      name: currency.name,
      symbol: currency.symbol || currencySymbols[currency.name],
    };

    // Validate amenities
    const validatedAmenities = amenities.map((amenity) => ({
      id: amenity.id,
      label: amenity.label || amenity.id,
      checked: amenity.checked !== undefined ? amenity.checked : true,
    }));

    console.log('Validated Amenities:', validatedAmenities);

    // Handle image upload to Google Cloud Storage
    let imageDetails = null;
    if (req.file) {
      const blob = bucket.file(Date.now() + '-' + req.file.originalname); // Generate a unique file name
      const blobStream = blob.createWriteStream({
        resumable: true,
        contentType: req.file.mimetype,
      });

      // Use a Promise to handle the asynchronous nature of the upload
      await new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.error('Error uploading to Google Cloud Storage:', err);
          reject(new Error('Failed to upload image'));
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
          console.log('Image uploaded successfully:', publicUrl);

          imageDetails = {
            public_id: blob.name, // Unique file name in the bucket
            url: publicUrl, // Public URL of the image
          };
          resolve();
        });

        blobStream.end(req.file.buffer); // Pipe the file buffer to the stream
      });
    }

    console.log('Validated Amenities to Save:', validatedAmenities);

    // Create the new Gym entry
    const newGym = await GymAdd.create({
      gymName,
      address,
      coordinates,
      pricing,
      personalTrainerPricing,
      timings,
      currency: currencyWithSymbol,
      description,
      gymOwner: req.user.id,
      amenities: validatedAmenities,
      images: imageDetails,
    });

    console.log('New Gym Added:', newGym);

    res.status(201).json({
      success: true,
      message: 'Gym added successfully',
      data: newGym,
    });
  } catch (error) {
    console.error('Error adding gym:', error);

    // Delete uploaded files if gym creation fails
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(path.join(__dirname, file.path), (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add gym',
    });
  }
};


export const getGym = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    console.log("owner id", ownerId)

    if (!ownerId) {
      return res.status(401).json({ message: "User Id is not found" });
    }

    const gyms = await GymAdd.find({ gymOwner: ownerId ,isDeleted:false});

    if (!gyms || gyms.length === 0) {
      return res.status(404).json({ message: "No gyms found for this user." });
    }

    res.status(200).json({ gyms });
  } catch (error) {
    console.log("Error fetching gyms:", error);
    res.status(500).json({
      message: "Server error while fetching gyms",
      error: error.message
    });
  }
};

// get Gym for City
export const getGymCity = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const gyms = await GymAdd.find({
      isDeleted:false,
      $or: [
        { gymName: { $regex: query, $options: "i" } },
        { "address.location": { $regex: query, $options: "i" } },
      ],
    });

    if (!gyms.length) {
      return res.status(404).json({ message: "No gyms found." });
    }

    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// getSingleIdGym
export const getSingleGym = async (req, res) => {
  try {
    const gym = await GymAdd.findById(req.params.id);
    // console.log("gym is define", gym)
    if (!gym) {
      return res.status(404).json({ msg: "Gym Not Found" })
    }
    res.status(200).json(gym)
  } catch (error) {
    res.status(500).json({ message: "server error" })
  }
}


// Update Gym
export const updateGym = async (req, res) => {
  const { id } = req.params;
  
  const updatedData = JSON.parse(req.body.data);

  console.log("Incoming Data for update JSon 1", updatedData)


  try {
    const updatedGym = await GymAdd.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedGym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    console.log('Updated Gym Details 5', updatedGym)
    res.status(200).json(updatedGym);
  } catch (error) {
    console.error("Error updating gym:", error);
    res.status(500).json({ message: 'Error updating gym', error });
  }
};

// Delete Gym
export const deleteGym = async (req, res) => {
  const { id } = req.params;
  try {
    const gym = await GymAdd.findByIdAndUpdate(id,{isDeleted:true});


    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    res.status(200).json("Gym Soft-deleted succsefully")
  } catch (error) {
    console.error("Error deleting gym:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// get Gym owner total gyms and customer
export const dashboardAdmin = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    console.log("owner id dashboard", ownerId);
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const totalGyms = await GymAdd.find({ gymOwner: ownerId, isDeleted:false });
    console.log("Total gyms", totalGyms.length);

    // Fetch all payments for the gyms owned by the owner
    const payments = await Payment.find({ gymId: { $in: totalGyms.map(gym => gym._id) } });

    // Get unique customers based on email
    const uniqueCustomers = new Set(payments.map(payment => payment.email));
    const totalCustomers = uniqueCustomers.size;
    console.log("Total unique customers", totalCustomers);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // Count today's unique customers
    const todayCustomers = new Set(
      payments
        .filter(payment => {
          const paymentDate = new Date(payment.createdAt);
          paymentDate.setHours(0, 0, 0, 0);
          return paymentDate.getTime() === today.getTime();
        })
        .map(payment => payment.email)
    ).size;

    console.log("Today's unique customers", todayCustomers);

    // Active Customers 

    const activeCustomers = new Set(
      payments.filter(payment => {
        const startDate = new Date(payment.startDate);
        const endDate = new Date(payment.endDate);
    
        // Normalize all dates to midnight
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
    
        return today >= startDate && today <= endDate;
      })
      .map(payment => payment.email)
    ).size;
    console.log("Active Customers", activeCustomers)

    res.json({ totalGyms, totalCustomers, todayCustomers, activeCustomers });
  } catch (error) {
    console.error("Error fetching gym and customer stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getNearbyGyms = async (req, res)=>{
  try {
    const {lat, lng} = req.query;

    if(!lat || !lng){
        return res.status(400).json({message:"Lattitude and Longitude is required"})
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Geospatial query for nearby gyms
    const gyms = await GymAdd.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 3000
        }
      }
    }).populate("gymOwner", "name email");

    console.log("gymsn found or not", gyms)

    if(!gyms.length){
      return res.status(404).json({message:"NO Gyms Found Near By"})
    }
    res.status(200).json(gyms)
  } catch (error) {
    console.error("Error fetching nearby gyms:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
