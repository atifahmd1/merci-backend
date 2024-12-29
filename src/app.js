import User from "./models/User";

const dummyAddress = {
  street: "Batla House",
  city: "New Delhi",
  state: "Delhi",
  zip: "110025",
  country: "India", // Optional
};

async function pushDummyAddress(email) {
  try {
    // Find the user by email
    console.log("hello");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return; // Exit the function if user not found
    }

    // Create a new User instance with updated address (recommended)
    const updatedUser = new User({
      ...user._doc, // Use user._doc for Mongoose properties (avoids overwriting methods)
      address: dummyAddress,
    });

    // Save the updated user with the dummy address
    await updatedUser.save();
    console.log("Dummy address saved successfully!");
  } catch (err) {
    console.error("Error saving address:", err);
  } finally {
    // Optional cleanup or closing connections (if applicable)
  }
}

// Example usage:
pushDummyAddress("riti@gmail.com")
  .then(() => console.log("Push operation complete"))
  .catch((err) => console.error("Error during push:", err));
