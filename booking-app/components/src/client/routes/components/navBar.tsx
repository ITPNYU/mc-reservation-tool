"use client";

import {
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import ConfirmDialog, { ConfirmDialogControlled } from "./ConfirmDialog";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { BookingContext } from "../booking/bookingProvider";
import { DatabaseContext } from "./Provider";
import { PagePermission } from "../../../types";
import { styled } from "@mui/system";

const Title = styled(Typography)`
  width: fit-content;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const Nav = styled(Toolbar)(({ theme }) => ({
  border: `1px solid ${theme.palette.custom.border}`,
}));

const Divider = styled(Box)(({ theme }) => ({
  width: "2px",
  height: "32px",
  background: theme.palette.custom.gray,
  margin: "0px 20px",
}));

const PATHNAME_HIDE_NAVBAR = ["/approve", "/reject", "/forbidden"];

export default function NavBar() {
  const router = useRouter();
  const { pagePermission, userEmail } = useContext(DatabaseContext);
  const { setHasShownMocapModal } = useContext(BookingContext);
  const [selectedView, setSelectedView] = useState<PagePermission>(
    PagePermission.BOOKING
  );
  const pathname = usePathname();

  const netId = userEmail?.split("@")[0];

  const handleRoleChange = (e: any) => {
    setSelectedView(e.target.value as PagePermission);
  };

  const handleClickHome = () => {
    setSelectedView(PagePermission.BOOKING);
    router.push("/");
  };

  const envTitle = (() => {
    const branch = process.env.NEXT_PUBLIC_BRANCH_NAME;
    if (branch.toLowerCase() === "production") {
      return "";
    }
    const branchTitle = branch.charAt(0).toUpperCase() + branch.slice(1);
    return `[${branchTitle}]`;
  })();

  useEffect(() => {
    if (PATHNAME_HIDE_NAVBAR.some((hidePath) => pathname.includes(hidePath))) {
      return;
    }
    switch (selectedView) {
      case PagePermission.BOOKING:
        router.push("/");
        break;
      case PagePermission.PA:
        router.push("/pa");
        break;
      case PagePermission.ADMIN:
        router.push("/admin");
        break;
    }
  }, [selectedView]);

  const dropdown = useMemo(() => {
    if (
      pagePermission !== PagePermission.ADMIN &&
      pagePermission !== PagePermission.PA
    ) {
      return null;
    }

    return (
      <Select size="small" value={selectedView} onChange={handleRoleChange}>
        <MenuItem value={PagePermission.BOOKING}>
          {PagePermission.BOOKING}
        </MenuItem>
        <MenuItem value={PagePermission.PA}>{PagePermission.PA}</MenuItem>
        {pagePermission === PagePermission.ADMIN && (
          <MenuItem value={PagePermission.ADMIN}>
            {PagePermission.ADMIN}
          </MenuItem>
        )}
      </Select>
    );
  }, [pagePermission, selectedView]);

  const button = useMemo(() => {
    if (selectedView === PagePermission.BOOKING) {
      return (
        <Button
          onClick={() => router.push("/book")}
          variant="outlined"
          sx={{ height: "40px", marginRight: 2 }}
        >
          Book
        </Button>
      );
    }

    if (pagePermission !== PagePermission.BOOKING) {
      return (
        <Button
          onClick={() => {
            router.push("/walk-in");
            setHasShownMocapModal(false);
          }}
          variant="outlined"
          sx={{ height: "40px", marginRight: 2 }}
        >
          Walk In
        </Button>
      );
    }
  }, [pagePermission, selectedView]);

  return (
    <Nav>
      <Box flex={1}>
        <Title as="h1" onClick={handleClickHome}>
          Media Commons {envTitle}
        </Title>
      </Box>
      <Box display="flex" alignItems="center">
        {button}
        {dropdown}
        <Divider />
        <ConfirmDialog
          callback={(result) => console.log("logout:", result)} // TODO @Riho implement logout based on dialog result
          message="Are you sure you want to log out?"
          title="Log Out"
        >
          <Typography
            component="p"
            color="rgba(0,0,0,0.6)"
            minWidth="50px"
            textAlign="right"
            sx={{ cursor: "pointer" }}
          >
            {netId}
          </Typography>
        </ConfirmDialog>
      </Box>
    </Nav>
  );
}
