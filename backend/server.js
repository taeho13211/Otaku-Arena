import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

import express from "express";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import regesterChatSocket from "./sockets/chatSocket/js";

const __filename = fileURLToPath(import.meta.url);
