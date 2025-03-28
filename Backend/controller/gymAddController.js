
  import GymAdd from '../model/gymModel.js';

  // Add Gym

  export const addGym = async (req, res) => {
    try {
      // console.log("Received Data:", req.body); // Debugging line
  
      const { gymName, address, pricing, personalTrainerPricing, openingTime, closingTime, description } = req.body;
      const ownerId = req.user?.id;
      if (!gymName || !address || !address.street|| !pricing || !personalTrainerPricing || !openingTime || !closingTime) {
        return res.status(400).json({ message: "Please fill all required fields" });
      }
  
      const newGym = new GymAdd({
        gymName,
        address,
        pricing,
        personalTrainerPricing,
        openingTime,
        closingTime,
        description,
        gymOwner: ownerId,
      });
      console.log("street is", newGym)  
      const savedGym = await newGym.save();
      res.status(201).json({ message: "Gym added successfully", gym: savedGym });
  
    } catch (error) {
      console.error("Error adding gym:", error);
      res.status(500).json({ message: "Server error while adding gym", error: error.message });
    }
  };
  

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

    // get Gym for City
    export const getGymCity = async (req, res) => {
      try {
        const { city } = req.query;
        if (!city) {
          return res.status(400).json({ message: "City parameter is required" });
        }
    
        const gyms = await GymAdd.find({ "address.location": { $regex: city, $options: "i" } })
          .populate("gymOwner", "name email");
    
        if (!gyms.length) {
          return res.status(404).json({ message: "No gyms found in this city." });
        }
    
        res.status(200).json(gyms);
      } catch (error) {
        console.error("Error fetching gyms:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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
