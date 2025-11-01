import React, { useEffect, useState } from "react";
import Logo from "./assets/Logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { useAccount } from "wagmi";
import { getAccount } from '@wagmi/core'

import Button, { config } from "./Components/Button.jsx";
import {
  MINTNFT,
  GETUSERCOLLECTIONS,
} from "./Components/ContractIntegration.js";
import toast, { Toaster } from "react-hot-toast";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div
      className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}
    >
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">{subtitle}</p>
    </div>
  </div>
);

export default function App() {
  const commonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-white";
  const [toggleMenu, setToggleMenu] = useState(false);
  
//  const [user, setUser] = useState(null);
  const [contractName, setContractName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [community, setCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState("");
  const [amount, setAmount] = useState(1);
  const [userCollection, setUserCollection] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const account = useAccount({
    config,
  });
  // const account = getAccount(config);
  const user = account.address;
  console.log("User:", user);
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
      
  //   }, 2000); // 10000 milliseconds = 10 seconds
  
  //   return () => clearInterval(intervalId); // Cleanup function to clear the interval
  // },[])
  useEffect(() => {
    console.log("User:", user);
    
  },[user])

  const uploadImageToPinata = async (file) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          pinata_api_key: "b670445db8b318a6e492",
          pinata_secret_api_key:
            "7d343880e219ccc78e44c8c8ffd43d62a5fc250d087a809a8f2123aac91c9aed",
        },
        body: formData,
      });

      const result = await response.json();
      if (result.IpfsHash) {
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await uploadImageToPinata(file);
        setMedia(url);
        console.log("Image URL:", url);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error during file upload:", error);
      }
    }
  };

  const uploadFileToPinata = async (file) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          pinata_api_key: "b670445db8b318a6e492",
          pinata_secret_api_key: "7d343880e219ccc78e44c8c8ffd43d62a5fc250d087a809a8f2123aac91c9aed",
        },
        body: formData,
      });

      const result = await response.json();
      if (result.IpfsHash) {
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
        setLoading(false);
        setCommunity(fileUrl);
        setFileUrl(fileUrl);
        return fileUrl;
      } else {
        setLoading(false);
        throw new Error("Failed to upload file to Pinata");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file to Pinata:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await uploadFileToPinata(file);
      console.log("File URL:", url);
    }
  };


  // const handleFileChange = async(event) => {
  //   const file = event.target.files[0];
  //   const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  // let data = new FormData();
  // data.append("file", file);

  // const headers = {
  //   pinata_api_key: "b670445db8b318a6e492",
  //   pinata_secret_api_key:
  //     "7d343880e219ccc78e44c8c8ffd43d62a5fc250d087a809a8f2123aac91c9aed",
  // };

  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: headers,
  //   body: data,
  // });
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setMediaFile(file);
  //     setMedia(url);
  //   }
  // };
  const handleMint = async () => {
    setLoading(true);
    if (
      contractName === "" ||
      tokenSymbol === "" ||
      community === "" ||
      media === "" ||
      amount === "" ||
      contractName === null ||
      tokenSymbol === null ||
      community === null ||
      media === null ||
      amount === null ||
      contractName === undefined ||
      tokenSymbol === undefined ||
      community === undefined ||
      media === undefined ||
      amount === undefined
    ) {
      toast.error("Please fill all the fields");
      console.log("Please fill all the fields");
      return;
    }
    console.log("Contract Name:", contractName);
    console.log("Token Symbol:", tokenSymbol);
    console.log("Community:", community);
    console.log("Media:", media);
    console.log("Amount:", amount);
    const tokenId = await MINTNFT(
      contractName,
      tokenSymbol,
      community,
      media,
      amount
    );
    console.log("Token ID:", tokenId);
    if (tokenId !== null || tokenId !== undefined) {
      toast.success("Your meme NFT minted successfully!");
    } else {
      toast.error("Error while minting NFT");
    }
    setLoading(false);
  };
  useEffect(() => {
     const fetchUserCollection = async () => {
       const answer = await GETUSERCOLLECTIONS(user);
       setUserCollection(answer);
       console.log("User Collection:", answer);
       console.log(answer.communities);
       console.log("User Collection:", userCollection);
       console.log("contract Name", userCollection.contractNames[0]);
       console.log("communities", userCollection.communities[0]);
       console.log("medias", userCollection.medias);
     };
    // const fetchUserCollection = async () => {
    //   try {
    //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     const userAddress = accounts[0]; 

    //     if (!userAddress) {
    //       console.error('User address is not available');
    //       return;
    //     }

    //     const userCollections = await GETUSERCOLLECTIONS(userAddress);

    //     setUserCollection(answer);

    //     console.log('User Collections:', userCollections);
    //     // Handle userCollections.communities as needed

    //   } catch (error) {
    //     console.error('Error fetching user collection:', error);
    //   }
    // };
    // Fetch immediately on mount
    fetchUserCollection();

    // Set interval to fetch every 10 seconds
    const intervalId = setInterval(fetchUserCollection, 10000); // 10000 milliseconds = 10 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [user]);

  const TwitterShareButton = ({ url, text }) => {
    const handleShareClick = () => {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    };
  };
  return (
    <div>
      <Toaster />
      {/* Navbar */}
      <nav className="w-full flex justify-between lg:justify-center  items-center p-4">
        <div className="md:flex-[0.5] justify-center items-center">
          <div className="flex gap-4 items-center mr-5">
            <img
              src={Logo}
              alt="Logo logo"
              className="h-14 w-14 cursor-pointer"
            />
            <span className="text-white text-2xl font-bold font-mono text-nowrap">
              <span className="text-3xl font-extrabold">O</span>nChain meme
            </span>
          </div>
        </div>
        <ul className="text-white md:flex hidden list-none flex-row justify-between items-center">
          <li className="mx-4 cursor-pointer">
            <a href="#">Home</a>
          </li>
          <li className="mx-4 cursor-pointer">
            <a href="#view">View NFT's</a>
          </li>
          <li className="mx-4 cursor-pointer">
            <a href="#features">Features</a>
          </li>
          <Button />
        </ul>
        <div className="flex relative">
          {toggleMenu ? (
            <AiOutlineClose
              fontSize={28}
              className="text-white cursor-pointer md:hidden"
              onClick={() => {
                setToggleMenu(false);
              }}
            />
          ) : (
            <HiMenuAlt4
              fontSize={28}
              className="text-white cursor-pointer md:hidden"
              onClick={() => {
                setToggleMenu(true);
              }}
            />
          )}
          {toggleMenu && (
            <ul className="z-10 fixed top-0 right-0 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start  blue-glassmorphism rounded-none text-white animate-slide-in">
              <li className="text-xl w-full my-2">
                <AiOutlineClose
                  fontSize={28}
                  className="text-white cursor-pointer "
                  onClick={() => setToggleMenu(false)}
                />
              </li>
              <div className="flex mt-10 flex-col gap-5">
                <li className="mx-4 cursor-pointer">
                  <a href="#">Home</a>
                </li>
                <li className="mx-4 cursor-pointer">
                  <a href="#view">View NFT's</a>
                </li>
                <li className="mx-4 cursor-pointer">
                  <a href="#features">Features</a>
                </li>
                <Button />
              </div>
            </ul>
          )}
        </div>
      </nav>

      {/* Home */}
      <div id="Home" className="flex w-full justify-center items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between lg:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start flex-col md:mr-10 text-center">
            <h1 className="text-3xl sm:text-5xl text-white py-1 text-gradient text-center">
              Your Memes, Your NFT: Join <br /> the Digital Art Revolution.
            </h1>
            <p className="mt-5 text-gray-500 w-96 text-center mx-auto">
              Own and trade your favorite memes as NFTs. Create, mint, and share
              with a global community of meme enthusiasts. Join the meme
              revolution now! <br />
            </p>
          </div>
          <div className="w-96 white-glassmorphism flex flex-col justify-center items-center gap-3 px-3 py-10 mt-5 lg:mt-0">
            {user ? (
              <p className="text-white text-2xl mb-2">
                {user.slice(0, 4) + "..." + user.slice(-4)}
              </p>
            ) : (
              <p className="text-white text-2xl mb-2">Connect Wallet</p>
            )}
            <label htmlFor="image" className="text-white mr-auto ml-6">Choose meme image :</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              disabled={loading}
              className="file-input file-input-bordered bg-transparent w-full max-w-xs"
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="text-white mr-auto ml-6">Music for meme :</label>
            <input
              type="file"
              accept="audio/*"
              id="file"
              disabled={loading}
              placeholder="Community"
              onChange={handleFileUpload}
              className="file-input file-input-bordered bg-transparent w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Meme Name"
              disabled={loading}
              className="input input-bordered w-full max-w-xs bg-transparent"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              disabled={loading}
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="input input-bordered w-full max-w-xs bg-transparent"
            />
            

            {media && <img src={media} alt="NFT Preview" width="100" />}
            {fileUrl && (
        <div>
          {/* <p>File uploaded successfully. Access it <a href={fileUrl} target="_blank" rel="noopener noreferrer">here</a>.</p> */}
          {fileUrl && (
            <audio controls>
            <source src={fileUrl} type="audio/ogg" />
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          )}
        </div>
      )}
            <button
              className="btn rounded-full bg-[#2952E3] text-white w-[80%] mt-4 disabled:bg-gray-900"
              onClick={handleMint}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner text-white"></span>
                </>
              ) : (
                "Mint NFT"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* View */}
      <p className="text-3xl sm:text-5xl text-white text-gradient text-center mb-12">
        Minted meme NFT'S
      </p>
      <div
        id="view"
        className="w-full flex flex-wrap justify-center items-center gap-7"
      >
        {Array.isArray(userCollection) && userCollection.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center items-center ">
            {userCollection.contractNames.map((contractName, index) => (
              <div
                key={index}
                className="w-96 h-[600px] white-glassmorphism flex flex-col items-center justify-between p-4 shadow-lg"
              >
                <img
                  src={userCollection.medias[index]}
                  alt="NFT"
                  className="w-64 h-64 rounded shadow-lg"
                />
            <div className="w-full flex items-start justify-start flex-col gap-3 mt-2">
                <div className=" flex  gap-2 justify-start items-start flex-col">

                  <div className="flex justify-start">
                    <p className="font-bold text-white mr-2">Meme:</p>
                    <p>{contractName}</p>
                  </div>
                  <div className="flex justify-start">
                    <p className="font-bold text-white mr-2">Description:</p>
                    <p>{userCollection.tokenSymbols[index]}</p>
                  </div>

                 

                  
                  {/* <div className="flex justify-start">
                    <p className="font-bold">Community:</p>
                    <p>{userCollection.communities[index]}</p>
                  </div> */}
                </div>
                
            </div>
            <div className="flex justify-start gap-4 my-3">
                  <button onClick={
                    () => {
                      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(userCollection.medias[index])}&text=${encodeURIComponent(contractName)}`;
                      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                    }
                  }><FaSquareXTwitter className="text-white w-10 h-10 hover:text-blue-600"/>
                  </button>
                  <button
                  onClick={
                    () => {
                      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userCollection.medias[index])}&quote=${encodeURIComponent(contractName)}`;
                      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
                    }
                  } 
                  >
                    <FaFacebook className="text-white w-10 h-10 hover:text-blue-600"/>
                  </button>
                </div>
            <audio controls>
            <source src={userCollection.communities[index]} type="audio/ogg" />
            <source src={userCollection.communities[index]} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white text-lg">No NFT's found...</div>
        )}

        {/* <div className="w-80 h-96  white-glassmorphism flex justify-center items-center flex-col gap-3">
          <img src={Logo} alt="" className="w-64 h-64" />
          <div>
            <p>Contract Name:</p>
            <p>Community:</p>
          </div>
        </div> */}
      </div>

      {/* Features */}
      <div id="features">
        <div className="flex w-full justify-center items-center ">
          <div className="flex lg:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                Create, Mint, Trade, Enjoy
              </h1>
              <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                Explore and discover how you can engage with memes, convert them
                into NFTs, and participate in the global marketplace to unlock
                rewards and opportunities.
              </p>
            </div>
            <div className="flex-1 flex flex-col justify-start items-center">
              <ServiceCard
                color="bg-[#2952E3]"
                title="Create Your Meme"
                icon={
                  <BiSearchAlt fontSize={21} className="text-white" />
                  
                }
                subtitle="Design your next viral meme with our intuitive creation tool, where every idea can become a masterpiece."
              />
              <ServiceCard
                color="bg-[#8945F8]"
                title="Mint Your Meme"
                icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
                subtitle="Transform your meme into a unique, collectible NFT with just a few clicks, ensuring authenticity and ownership."
              />
              <ServiceCard
                color="bg-[#F84550]"
                title="Trade and Enjoy"
                icon={<RiHeart2Fill fontSize={21} className="text-white" />}
                subtitle="Connect with a global community of meme enthusiasts, trade your NFTs, and enjoy the benefits of digital ownership. "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
        <div className=" w-full h-[0.25px] bg-gray-400 mt-5  mb-5" />
        <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
          <div className="flex flex-[0.5] justify-center items-center">
            <div className="flex gap-4 items-center mr-5">
              <img
                src={Logo}
                alt="Logo logo"
                className="h-14 w-14 cursor-pointer"
              />
              <span className="text-white text-2xl font-bold font-mono text-nowrap">
                <span className="text-3xl font-extrabold">O</span>nChain meme
              </span>
            </div>
          </div>
          <div className="flex flex-1 justify-center gap-6 items-center flex-wrap sm:mt-0 mt-5 w-full">
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              <a href="#">Home</a>
            </p>
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              <a href="#view">View</a>
            </p>
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              <a href="#features">Features</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
