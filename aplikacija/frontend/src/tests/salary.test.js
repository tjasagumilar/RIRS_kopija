import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SalaryCalculator from "../components/SalaryCalculator";

describe("SalaryCalculator component", () => {
  it("should render input fields and the calculate button", () => {
    render(<SalaryCalculator />);
    expect(screen.getByLabelText(/Urna postavka/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Oddelane ure/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Izračunaj Plačo/i })).toBeInTheDocument();
  });

  it("should calculate and display the salary when valid inputs are provided", () => {
    render(<SalaryCalculator />);

    fireEvent.change(screen.getByLabelText(/Urna postavka/i), { target: { value: "15" } });
    fireEvent.change(screen.getByLabelText(/Oddelane ure/i), { target: { value: "40" } });

    fireEvent.click(screen.getByRole("button", { name: /Izračunaj Plačo/i }));

    expect(screen.getByText(/Vaša plača: 600.00 €/i)).toBeInTheDocument();
  });

  it("should not calculate salary if inputs are invalid", () => {
    render(<SalaryCalculator />);

    fireEvent.change(screen.getByLabelText(/Urna postavka/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Oddelane ure/i), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Izračunaj Plačo/i }));

    expect(screen.queryByText(/Vaša plača:/i)).not.toBeInTheDocument();
  });

  it("should display an alert for invalid inputs", () => {
    render(<SalaryCalculator />);

    fireEvent.change(screen.getByLabelText(/Urna postavka/i), { target: { value: "-10" } });
    fireEvent.change(screen.getByLabelText(/Oddelane ure/i), { target: { value: "abc" } });

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: /Izračunaj Plačo/i }));

    expect(alertMock).toHaveBeenCalledWith("Prosim, vnesite veljavne številke za urno postavko in ure.");

    alertMock.mockRestore();
  });

  it("should reset salary when inputs are changed after calculation", () => {
    render(<SalaryCalculator />);

    fireEvent.change(screen.getByLabelText(/Urna postavka/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/Oddelane ure/i), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /Izračunaj Plačo/i }));

    expect(screen.getByText(/Vaša plača: 200.00 €/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Oddelane ure/i), { target: { value: "15" } });

    expect(screen.queryByText(/Vaša plača: 200.00 €/i)).not.toBeInTheDocument();
  });
});
