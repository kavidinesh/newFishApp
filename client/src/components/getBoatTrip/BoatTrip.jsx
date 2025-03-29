import React, { useEffect, useState } from "react";
import "../getBoatTrip/BoatTrip.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../backgroundimage/logo.jpg";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaCloudSun, FaTimes } from 'react-icons/fa'; // Weather Icon and Close Icon

const BoatTrip = () => {
  const navigate = useNavigate();
  const [boatTrips, setBoatTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTripType, setSelectedTripType] = useState("");
  const [sortByProfit, setSortByProfit] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null); // State for weather data
  const [showWeatherPopup, setShowWeatherPopup] = useState(false); // Toggle for weather popup
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null }); // User's location
  const [weatherError, setWeatherError] = useState(null); // Error state for weather data
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // Index to navigate through the days

  const handleSortByProfit = () => {
    setSortByProfit(!sortByProfit);
  };

  const handleTripTypeChange = (event) => {
    setSelectedTripType(event.target.value);
    setSortByProfit(false); // Reset profit sorting
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/boattrip/getboattrip");
        const sortedBoatTrips = response.data.sort((a, b) => a.tripID - b.tripID);
        setBoatTrips(sortedBoatTrips);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherForecast = () => {
    if (userLocation.latitude && userLocation.longitude) {
      const API_KEY = '3f8265e2fd6333167853a1058533336f'; // Replace with your actual OpenWeatherMap API key
      const { latitude, longitude } = userLocation;

      // Construct URL for the 5-day weather forecast API
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => setWeatherData(data)) // Set the forecast data
        .catch((error) => {
          setWeatherError(error.message);
          console.error("Error fetching weather forecast data:", error);
        });
    }
  };

  const handleWeatherClick = () => {
    setShowWeatherPopup(!showWeatherPopup); // Toggle weather popup visibility
    if (!weatherData && !weatherError) {
      fetchWeatherForecast(); // Fetch the forecast if not already fetched
    }
  };

  const handlePreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < 4) { // Only allow moving up to Day 5
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const handleCloseCard = () => {
    setShowWeatherPopup(false); // Close the weather popup
  };

  const deleteBoatTrip = async (id, tripID, boatName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Trip ID: ${tripID} And Boat Name ${boatName}?`);
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/boattrip/deleteboattrip/${id}`);
        setBoatTrips(boatTrips.filter(boatTrip => boatTrip._id !== id));
        alert(`Trip with ID ${tripID} and Boat Name ${boatName} has been deleted successfully.`);
      } catch (error) {
        console.error("Error:", error);
        alert(`Failed to delete trip with ID ${tripID} and Boat Name ${boatName}.`);
      }
    }
  };

  const downloadPageAsPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = Logo;

    img.onload = function () {
      doc.addImage(this, 'JPEG', 15, 10, 50, 50);
      doc.setFontSize(18);
      doc.text(80, 30, "Chooti Putha Fish Company");
      generatePDFContent(doc);
    };

    const generatePDFContent = (doc) => {
      const headers = [
        "TripID",
        "Boat Name",
        "Trip Type",
        "Passengers",
        "Distance",
        "Rental Cost",
        "fuel required",
      ];

      const tableData = filteredBoatTrips.map((boatTrip) => [
        boatTrip.tripID.toString(),
        boatTrip.boatName,
        boatTrip.tripType,
        boatTrip.noOfEmployees.toString(),
        boatTrip.fishingCaught.toString(),
        boatTrip.costAvg.toString(),
        boatTrip.profitAvg.toString(),
      ]);

      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 80,
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(15, doc.internal.pageSize.height - 10, `Page ${i} of ${totalPages}`);
      }

      doc.save("BoatTripPage.pdf");
    };
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  let sortedBoatTrips = [...boatTrips];

  if (selectedTripType) {
    sortedBoatTrips = sortedBoatTrips.filter(boatTrip => boatTrip.tripType === selectedTripType);
  }

  if (sortByProfit) {
    sortedBoatTrips = sortedBoatTrips.sort((a, b) => b.profitAvg - a.profitAvg);
  }

  const filteredBoatTrips = sortedBoatTrips.filter(boatTrip =>
    boatTrip.boatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="boatboattriptable">
      <center>
        <div>
          <h1>Boat Trip Details: {currentDate.toLocaleDateString()}</h1>
        </div>
      </center>

      {/* Weather Icon */}
      <div className="weather-icon" onClick={handleWeatherClick}>
        <FaCloudSun size={30} color="#ffcc00" />
      </div>

      {/* Weather Popup */}
      {showWeatherPopup && weatherData && (
        <div className="weather-popup">
          <div className="close-btn" onClick={handleCloseCard}>
            <FaTimes size={20} />
          </div>

          <h3>{currentDayIndex === 0 ? "Today" : `Day ${currentDayIndex + 1}`}</h3>

          {/* Weather Card */}
          <div className="weather-card">
            <p><strong>Location:</strong> {weatherData.city.name}</p>
            <p><strong>Temperature:</strong> {weatherData.list[currentDayIndex].main.temp}°C</p>
            <p><strong>Condition:</strong> {weatherData.list[currentDayIndex].weather[0].description}</p>
            <p><strong>Humidity:</strong> {weatherData.list[currentDayIndex].main.humidity}%</p>
            <p><strong>Wind Speed:</strong> {weatherData.list[currentDayIndex].wind.speed} m/s</p>
          </div>

          {/* Navigation Buttons */}
          <div className="weather-navigation">
            <button onClick={handlePreviousDay} disabled={currentDayIndex === 0}>Previous</button>
            <button onClick={handleNextDay} disabled={currentDayIndex === 4}>Next</button>
          </div>
        </div>
      )}

      {/* Error Handling for Weather Fetch */}
      {weatherError && (
        <div className="weather-error">
          <p>{weatherError}</p>
        </div>
      )}

      <div className="boatbuttonContainer">
      </div>
      <div className="boatsearchboattrip">
        <input
          type="text"
          placeholder="Search by Boat Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="boatbuttonContainer">
        <Link to="/tripadd" className="boatboattripaddButton">Add Boat Trip</Link>
      </div>
      <div className="boatsearchAndSortContainer">
        <div className="boatbutton-container">
          <button className={`boatsortprofit ${sortByProfit ? 'active' : ''}`} onClick={handleSortByProfit}>
            Sort by Profit (High to Low)
          </button>
          <div className="boatfilterOptions">
            <select
              value={selectedTripType}
              onChange={handleTripTypeChange}
              className={`${selectedTripType ? 'active' : ''}`}
            >
              <option value="">All Trip Types</option>
              <option value="one_day">One Day</option>
              <option value="one_week">One Week</option>
              <option value="One_month">One Month</option>
            </select>
          </div>
        </div>
        <div className="boatdownloadButtonContainer">
          <Link onClick={downloadPageAsPDF} className="boatdownloadButton">
            Download Trip Details as PDF
          </Link>
        </div>
      </div>
      <table id="boatboattrip-table" className="boattripdetailstable" border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>TripID</th>
            <th>Boat Name</th>
            <th>Trip Type</th>
            <th>No Of Passengers Joining</th>
            <th>Estimated travel distance (miles)</th>
            <th>Rental Cost</th>
            <th>Fuel required</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBoatTrips.map((boatTrip, index) => (
            <tr key={boatTrip._id} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#a7e0a6' }}>
              <td>{boatTrip.tripID}</td>
              <td>{boatTrip.boatName}</td>
              <td>{boatTrip.tripType}</td>
              <td>{boatTrip.noOfEmployees}</td>
              <td>{boatTrip.fishingCaught}</td>
              <td>{boatTrip.costAvg}</td>
              <td>{boatTrip.profitAvg}</td>
              <td>
                <button className="boatbtripdeletebt" onClick={() => deleteBoatTrip(boatTrip._id, boatTrip.tripID, boatTrip.boatName)}><i className="fa-solid fa-trash"></i></button>
                <button className="boatbtripupdatebt"><Link to={`/tripupdate/${boatTrip._id}`} className="boatbtripupdatebt"><i className="fa-solid fa-pen-to-square"></i></Link></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoatTrip;
