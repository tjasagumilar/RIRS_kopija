import React, { useState } from "react";
import { TextField, Container, Typography, Box, Button } from "@mui/material";

const SalaryCalculator = () => {
    const [formData, setFormData] = useState({
        hourlyRate: "",
        hoursWorked: "",
        salary: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const calculateSalary = (e) => {
        e.preventDefault();
        const { hourlyRate, hoursWorked } = formData;

        if (!hourlyRate || !hoursWorked || isNaN(hourlyRate) || isNaN(hoursWorked)) {
            alert("Prosim, vnesite veljavne številke za urno postavko in ure.");
            return;
        }

        const salary = parseFloat(hourlyRate) * parseFloat(hoursWorked);
        setFormData({ ...formData, salary });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Kalkulator Plače
                </Typography>
                <form onSubmit={calculateSalary}>
                    <TextField
                        label="Urna postavka (€)"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"
                        required
                    />
                    <TextField
                        label="Oddelane ure"
                        name="hoursWorked"
                        value={formData.hoursWorked}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Izračunaj Plačo
                    </Button>
                </form>
                {formData.salary !== null && (
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        Vaša plača: {formData.salary.toFixed(2)} €
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default SalaryCalculator;
