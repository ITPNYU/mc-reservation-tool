"use client";
import { Box, Button, Typography } from "@mui/material";
import { Department, Role } from "../../../../types";
import React, { useContext, useEffect } from "react";

import { BookingContext } from "../bookingProvider";
import Dropdown from "../components/Dropdown";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

const Center = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled(Box)(({ theme }) => ({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "4px",
  //TODO: Fix later
  border: `1px solid ${theme.palette.divider}`,
}));

export default function UserRolePage() {
  const { role, department, setDepartment, setRole } =
    useContext(BookingContext);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, []);

  const handleNextClick = () => {
    if (!role || !department) {
      alert("Please make sure all fields are selected.");
      return;
    }
    router.push("/book/selectRoom");
  };

  return (
    <Center>
      <Container padding={4} marginTop={6}>
        <Typography fontWeight={500}>Affiliation</Typography>
        <Dropdown
          value={department}
          updateValue={setDepartment}
          options={Object.values(Department)}
          placeholder="Choose a Department"
          sx={{ marginTop: 4 }}
        />
        <Dropdown
          value={role}
          updateValue={setRole}
          options={Object.values(Role)}
          placeholder="Choose a Role"
          sx={{ marginTop: 4 }}
        />
        <Button
          onClick={handleNextClick}
          variant="contained"
          color="primary"
          sx={{ marginTop: 6 }}
        >
          Next
        </Button>
      </Container>
    </Center>
  );
}
