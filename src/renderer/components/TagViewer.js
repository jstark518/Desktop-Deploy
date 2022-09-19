import React from 'react';
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import CloneViewer from "./CloneViewer";

export default function TagViewer({ selectedNode }) {
    return <span>{selectedNode.selection.url}</span>;
}