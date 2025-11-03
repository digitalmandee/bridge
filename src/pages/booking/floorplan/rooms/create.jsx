import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box } from "@mui/system";
import {
    Alert,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Paper,
    CircularProgress,
    TextField,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { MdArrowBackIos } from "react-icons/md";
import colors from "@/assets/styles/color";

const CreateRoom = () => {
    const { branch } = useParams();
    const navigate = useNavigate();

    const [floors, setFloors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [roomName, setRoomName] = useState("");
    const [roomNameError, setRoomNameError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    useEffect(() => {
        setIsLoadingData(true);
        axiosInstance
            .get("floor-plan/floor-plan-list")
            .then((res) => {
                setFloors(res.data.floors || []);
            })
            .catch((error) => {
                console.error("❌ Error fetching floors:", {
                    message: error.message,
                    response: error.response,
                    data: error.response?.data,
                });
                setSnackbar({
                    open: true,
                    message: "Failed to fetch floors.",
                    severity: "error",
                });
            })
            .finally(() => setIsLoadingData(false));
    }, []);

    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value);
        setRoomNameError("");
    };

    const handleSubmit = async () => {
        if (!selectedFloor || !roomName) {
            setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" });
            return;
        }

        setIsLoading(true);
        setRoomNameError("");

        axiosInstance
            .post("floor-plan/rooms", {
                floor_id: selectedFloor,
                name: roomName,
            })
            .then(() => {
                setSnackbar({ open: true, message: "Room created successfully", severity: "success" });
                setTimeout(() => navigate(`/${branch}/branch/floorplan/rooms`), 1200);
            })
            .catch((error) => {
                console.error("❌ Error creating room:", {
                    message: error.message,
                    response: error.response,
                    data: error.response?.data,
                });

                const errorMessage =
                    error.response?.data?.errors?.name?.[0] || "Failed to create room";
                
                // Show error in both snackbar and field
                setRoomNameError(errorMessage);
                setSnackbar({ open: true, message: errorMessage, severity: "error" });
            })
            .finally(() => setIsLoading(false));
    };

    const isCreateDisabled =
        !selectedFloor || !roomName || isLoading || isLoadingData;

    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sidebarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Box className="page-content" px={1}>
                        <Box className="d-flex justify-content-between align-items-center flex-wrap" mb={3}>
                            <div
                                style={{
                                    paddingTop: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    onClick={() => navigate(-1)}
                                    style={{
                                        cursor: "pointer",
                                        marginTop: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <MdArrowBackIos style={{ fontSize: "20px", marginRight:'1rem' }} />
                                </div>
                                <h3 style={{ margin: 0 }}>Create Room</h3>
                            </div>
                        </Box>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            {isLoadingData && (
                                <Box display="flex" justifyContent="center" my={2}>
                                    <CircularProgress sx={{ color: colors.primary }} />
                                </Box>
                            )}

                            <Box display="flex" flexDirection="column" gap={3}>
                                <FormControl fullWidth disabled={isLoadingData}>
                                    <InputLabel>Select Floor</InputLabel>
                                    <Select
                                        value={selectedFloor}
                                        label="Select Floor"
                                        onChange={(e) => setSelectedFloor(e.target.value)}
                                    >
                                        {floors.map((floor) => (
                                            <MenuItem key={floor.id} value={floor.id}>
                                                {floor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Room Name"
                                    value={roomName}
                                    onChange={handleRoomNameChange}
                                    disabled={isLoadingData}
                                    required
                                    error={!!roomNameError}
                                    helperText={roomNameError}
                                />

                                <Button
                                    variant="contained"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        px: 6,
                                        bgcolor: colors.primary,
                                        "&:hover": { bgcolor: colors.primary },
                                    }}
                                    onClick={handleSubmit}
                                    disabled={isCreateDisabled}
                                >
                                    {isLoading ? "Creating..." : "Create Room"}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </div>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateRoom;
