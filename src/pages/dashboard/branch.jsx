import React, {useState} from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { margin } from '@mui/system';
import Modal from './modal';

const CreateBranch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const navigate = useNavigate();

  const containerStyle = {
    width: '90%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    cursor: 'pointer',
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#333',
    textAlign: 'left',
    marginBottom: '8px',
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
    margin: '0',
  };

  const buttonStyle = {
    backgroundColor: '#0D2B4E',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '200px',
    margin: '20px auto 0',
    cursor: 'pointer',
    display: 'block',
    fontSize: '14px',
  };

  const numberInputStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px',
  }
  return (
    <>
      <TopNavbar />
      <div className="main">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
            <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
            </div>
            <h4 style={{ margin: 0 }}>Create Branch</h4>
          </div>
          <div style={containerStyle}>

            <form onSubmit={handleOpenModal}>
              <div style={formStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Branch Name</label>
                  <input
                    type="text"
                    placeholder="Branch Name"
                    style={inputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    style={inputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>No of Floor</label>
                  <input
                    type="number"
                    placeholder="4"
                    style={numberInputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Total Rooms</label>
                  <input
                    type="number"
                    placeholder="10"
                    style={numberInputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Total Seats</label>
                  <input
                    type="number"
                    placeholder="25"
                    style={numberInputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Total Table</label>
                  <input
                    type="number"
                    placeholder="15"
                    style={numberInputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>User Name</label>
                  <input
                    type="text"
                    placeholder="@Branch_Admin"
                    style={inputStyle}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="Branch_Admin@gmail.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button type="submit" style={buttonStyle}>
                Save
              </button>
              {isModalOpen && <Modal handleCloseModal={handleCloseModal} />}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBranch
