
import GymAdd from '../model/gymModel.js';

// Add Gym

export const addGym = async (req, res) => {
    try {
        // console.log("Incoming request body:", req.user.id);
        // // console.log("Incoming user data:", req);
        // // console.log("Incoming request headers:", req.headers);
        // res.status(201).json({ message: "Gym added successfully" });
        // return;
       
        const { gymName, location, pricing, personalTrainerPricing, openingTime, closingTime, description } = req.body;
        const ownerId = req.user.id;
        // console.log("owneriD", req.user.id)

        if (!gymName || !location || !pricing || !personalTrainerPricing || !openingTime || !closingTime) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const newGym = new GymAdd({
            gymName,
            location,
            pricing,
            personalTrainerPricing,
            openingTime,
            closingTime,
            description,
            gymOwner: ownerId,
        });

        const savedGym = await newGym.save();
        // console.log("Gym saved successfully:", savedGym);
        res.status(201).json({ message: "Gym added successfully" });
    } catch (error) {
        console.error("Error adding gym:", error);
        res.status(500).json({ message: "Server error while adding gym", 
            error: error.message });
    }
};

// export const addGym = async (req, res) => {
//   try {
//       const { gymName, location, latitude, longitude, pricing, personalTrainerPricing, openingTime, closingTime, description } = req.body;
//       const ownerId = req.user.id;

//       if (!gymName || !location || !latitude || !longitude || !pricing || !personalTrainerPricing || !openingTime || !closingTime) {
//           return res.status(400).json({ message: "Please fill all required fields" });
//       }

//       const newGym = new GymAdd({
//           gymName,
//           location,
//           latitude,
//           longitude,
//           pricing,
//           personalTrainerPricing,
//           openingTime,
//           closingTime,
//           description,
//           gymOwner: ownerId,
//       });

//       const savedGym = await newGym.save();
//       res.status(201).json({ message: "Gym added successfully", gym: savedGym });
//   } catch (error) {
//       console.error("Error adding gym:", error);
//       res.status(500).json({ message: "Server error while adding gym", error: error.message });
//   }
// };

// Get Gym

export const getGym = async (req, res) => {
    try {
      const ownerId = req.user?.id;
      console.log("owner id", ownerId)
  
      if (!ownerId) {
        return res.status(401).json({ message: "User Id is not found" });
      }
  
      const gyms = await GymAdd.find({ gymOwner: ownerId });
  
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

  // getSingleIdGym
  export const getSingleGym = async(req,res)=>{
    try {
        const gym = await GymAdd.findById(req.params.id);
        // console.log("gym is define", gym)
        if(!gym){
            return res.status(404).json({msg:"Gym Not Found"})
        }
        res.status(200).json(gym)
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
  }


// Update Gym
export const updateGym = async (req, res) => {
    const { id } = req.params;
    console.log("Received ID:", id);
    console.log("Incoming Data for update:", req.body);
    const updatedData = {
        ...req.body,
        gymName: req.body.gymName || req.body.name
    }

    console.log("Incoming Data for update", updatedData)
  

    try {
        const updatedGym = await GymAdd.findByIdAndUpdate(id, updatedData, { new: true });
        console.log("Updated Gym Details:", updatedGym);
        if (!updatedGym) {
          return res.status(404).json({ message: 'Gym not found' });
        }
        console.log('Updated Gym Details', updatedGym)
        res.status(200).json(updatedGym);
      } catch (error) {
        console.error("Error updating gym:", error);
        res.status(500).json({ message: 'Error updating gym', error });
      }
};

// Delete Gym
export const deleteGym = async (req, res) => {
    const {id} = req.params;
    try {
        const gym = await GymAdd.findByIdAndDelete(id);

        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }

        res.status(200).json("Gym is succsefully delete")
    } catch (error) {
        console.error("Error deleting gym:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
