import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const AddEventForm = ({ onEventAdded }) => {
    const [formData, setFormData] = useState({
        eventName: "",
        startDate: "",
        startTime: "",
        location: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                eventName: formData.eventName,
                startDate: new Date(formData.startDate).toISOString().split("T")[0],
                startTime: formData.startTime,
                location: formData.location,
                description: formData.description,
            };

            console.log("Submitting event:", formattedData);
            const response = await axios.post("http://localhost:5000/api/events", formattedData);
            alert("Event added successfully. ID: " + response.data.id);

            setFormData({
                eventName: "",
                startDate: "",
                startTime: "",
                location: "",
                description: "",
                participants: "",
            });

            if (onEventAdded) {
                onEventAdded(response.data);
            }
        } catch (error) {
            console.error("Error adding event:", error);
            alert("Error adding event. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Načrtuj dogodek
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Ime dogodka"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Datum"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Čas"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Lokacija"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Opis"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Načrtuj
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

AddEventForm.propTypes = {
    onEventAdded: PropTypes.func,
};

export default AddEventForm;