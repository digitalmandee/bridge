import React from 'react';
import TopNavbar from './topNavbar';
import Sidebar from './leftSideBar';
import FloorPlan from './floor/floor';
import { IoIosArrowDropright } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Booking from './booking';
import { height } from '@mui/system';

const Home = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/booking'); // Navigate to the Booking screen
  };
  return (
    <>
      <TopNavbar />
      <div className='main'>
        <div className='sidebarWrapper'>
          <Sidebar />
        </div>
        <div className='content'>
          <div className='right-content'>
            <h3 className="title">Floor Plan</h3>
            <button className="btn create-booking-btn" onClick={handleNextClick}>Next
              <span className='icon'><IoIosArrowDropright /></span>
            </button>
          </div>
          <div className="dashboard-section">
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '20px',
              gap: '3.5rem',
              // backgroundColor:'#000'
            }}>

              <button
                style={{
                  backgroundColor: '#ffcc00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  width: "30%",
                  padding: '10px 10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                View Seats Allocation
              </button>

              {/* View Booking Request Button */}
              <button
                style={{
                  backgroundColor: '#ffcc00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  width: "30%",
                  padding: '10px 10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                View Booking Request
              </button>
              <button
                style={{
                  backgroundColor: '#ffcc00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  width: "20%",
                  padding: '10px 10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                Select Floor
              </button>
            </div>

            {/* Cards Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '20px',
              // gap:'3.5rem',
              gap: '1.2rem',
              // backgroundColor:'black',
            }}>
              {/* Available Seats Card */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  // flex: '1',
                  width: '35%',
                  height: '20%',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <h6 style={{ color: '#888', marginBottom: '10px' }}>Available Seats</h6>
                  <h2 style={{ fontSize: '36px', color: '#000', margin: '0' }}>60</h2>
                </div>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#425af5',
                    borderRadius: '10px',
                    // margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <span role="img" aria-label="seat">
                    🪑
                  </span>
                </div>
              </div>

              {/* Occupied Seats Card */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  // flex: '1',
                  width: '35%',
                  height: '20%',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <h6 style={{ color: '#888', marginBottom: '10px' }}>Occupied Seats</h6>
                  <h2 style={{ fontSize: '36px', color: '#000', margin: '0' }}>45</h2>
                </div>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#00c853',
                    borderRadius: '10px',
                    // margin: '20px auto 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <span role="img" aria-label="group">
                    👥
                  </span>
                </div>
              </div>

              {/* Floor Selector */}
              <div
                style={{
                  maxWidth: '20%',
                  height: '20%',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  flex: '1',
                  // width:'25%',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >

                <button
                  style={{
                    backgroundColor: '#ffcc00',
                    // width:'20%',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Floor 1 <span style={{ marginLeft: '10px', fontSize: '16px' }}>▼</span>
                </button>
              </div>
            </div>
          </div>
          <FloorPlan />
        </div>
      </div>
    </>
  )
}

export default Home
