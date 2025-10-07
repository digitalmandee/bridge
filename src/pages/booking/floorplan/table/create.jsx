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

const CreateTable = () => {
    const { branch } = useParams();

    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [tableName, setTableName] = useState("");
    const [tableNameError, setTableNameError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isCheckingName, setIsCheckingName] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    useEffect(() => {
        setIsLoadingData(true);
        axiosInstance
            .get("floor-plan/floors")
            .then((res) => {
                setFloors(res.data.floors || []);
            })
            .finally(() => setIsLoadingData(false));
    }, []);

    useEffect(() => {
        if (selectedFloor) {
            setIsLoadingData(true);
            axiosInstance
                .get(`floor-plan/${selectedFloor}/rooms`)
                .then((res) => {
                    setRooms(res.data.floor.rooms || []);
                    setSelectedRoom("");
                })
                .finally(() => setIsLoadingData(false));
        }
    }, [selectedFloor]);
    console.log('rooms', rooms);

    const handleTableNameChange = (e) => {
        setTableName(e.target.value);
        setTableNameError(""); // Clear error when editing
    };

    const handleSubmit = async () => {
        if (!selectedRoom || !tableName) {
            setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" });
            return;
        }

        setIsCheckingName(true);
        setTableNameError("");

        try {
            const response = await axiosInstance.get(
                `floor-plan/rooms/${selectedRoom}/tables/check-name`,
                { params: { name: tableName } }
            );

            if (response.data.exists) {
                setTableNameError("Table name already exists in this room");
                return;
            }
        } catch (error) {
            console.log(error);

            setTableNameError("Error checking table name", error);
            return;
        } finally {
            setIsCheckingName(false);
        }

        // Only create table if name is valid
        setIsLoading(true);
        axiosInstance
            .post("floor-plan/tables", {
                floor_id: selectedFloor,
                room_id: selectedRoom,
                name: tableName,
            })
            .then(() => {
                setSnackbar({ open: true, message: "Table created successfully", severity: "success" });
                // Optionally navigate away
                setTimeout(() => navigate(`/${branch}/branch/floorplan/tables`), 1200);
            })
            .catch((error) => {
                console.log(error);
                const errorMessage =
                    error.response?.data?.errors?.name?.[0] || "Failed to create table";
                setSnackbar({ open: true, message: errorMessage, severity: "error" });
            })
            .finally(() => setIsLoading(false));
    };

    const isCreateDisabled =
        !selectedRoom || !tableName || isLoading || isLoadingData || isCheckingName;

    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sidebarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Box className="page-content" p={1}>
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
                                <h3 style={{ margin: 0 }}>Create Table</h3>
                            </div>
                        </Box>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            {isLoadingData && (
                                <Box display="flex" justifyContent="center" my={2}>
                                    <CircularProgress />
                                </Box>
                            )}

                            <Box display="flex" flexDirection="column" gap={3}>
                                <FormControl fullWidth disabled={isLoadingData}>
                                    <InputLabel>Floor</InputLabel>
                                    <Select
                                        value={selectedFloor}
                                        label="Floor"
                                        onChange={(e) => setSelectedFloor(e.target.value)}
                                    >
                                        {floors.map((floor) => (
                                            <MenuItem key={floor.id} value={floor.id}>
                                                {floor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth disabled={!rooms.length || isLoadingData}>
                                    <InputLabel>Room</InputLabel>
                                    <Select
                                        value={selectedRoom}
                                        label="Room"
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        {rooms.map((room) => (
                                            <MenuItem key={room.id} value={room.id}>
                                                {room.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Table Name"
                                    value={tableName}
                                    onChange={handleTableNameChange}
                                    disabled={isLoadingData}
                                    required
                                    error={!!tableNameError}
                                    helperText={tableNameError}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={isCreateDisabled}
                                >
                                    {isLoading ? "Creating..." : "Create Table"}
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

export default CreateTable;
