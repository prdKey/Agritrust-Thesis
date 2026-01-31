import axios from "axios";

export const uploadImageToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS", // ✅ correct endpoint
      formData,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwYjZkN2NkMi1hMmMzLTQ1NzctYTk3Ni1hMTJhZjQ5MzFjZDciLCJlbWFpbCI6InByYWRva2l0ejE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2MjM0YTE3NjJmM2M5ZTg2YTNjMiIsInNjb3BlZEtleVNlY3JldCI6IjE4NzY1NTQ1ZTlkMjYxODcyZGY2ZWEzZjIyNTYzZGYyOTc5MjhlODhkYzBhMDU3YTVlNDIzOWMwYWUzNTU4ZWYiLCJleHAiOjE4MDEzOTQ0Mzl9.qxFr8oneefTZ94WernUGvIS6W3XgjkU2C_2lCc-gtig`
        },
      }
    );

    const cid = res.data.IpfsHash; // this is your CID
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    console.log("File uploaded:", url);
    return cid;
  } catch (err) {
    console.error("Error uploading to Pinata:", err);
    throw err;
  }
};
