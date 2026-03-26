import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for OTP codes (in production, use database)
interface OTPSession {
  code: string;
  phone: string;
  createdAt: number;
  attempts: number;
}

const otpSessions = new Map<string, OTPSession>();
const MAX_ATTEMPTS = 5;
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const OTP_LENGTH = 6;

// Generate random OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate phone number format
function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Allow 7-15 digits for international support (including Ukraine +380)
  return digits.length >= 7 && digits.length <= 15;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  
  // Send OTP to phone number
  app.post("/api/auth/send-otp", (req: Request, res: Response) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      if (!isValidPhone(phone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      // Generate OTP
      const otp = generateOTP();
      const sessionId = Math.random().toString(36).substring(2, 15);

      // Store OTP session
      otpSessions.set(sessionId, {
        code: otp,
        phone,
        createdAt: Date.now(),
        attempts: 0,
      });

      // Log OTP (in production, send via SMS service)
      console.log(`\n📱 OTP for ${phone}: ${otp}`);
      console.log(`Session ID: ${sessionId}\n`);

      // Return session ID to client
      res.json({
        success: true,
        sessionId,
        otp, // Added for easy testing in browser
        message: "OTP sent successfully. Check console for code.",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Verify OTP code
  app.post("/api/auth/verify-otp", (req: Request, res: Response) => {
    try {
      const { sessionId, code } = req.body;

      if (!sessionId || !code) {
        return res.status(400).json({ error: "Session ID and code are required" });
      }

      const session = otpSessions.get(sessionId);

      if (!session) {
        return res.status(400).json({ error: "Invalid or expired session" });
      }

      // Check if OTP has expired
      if (Date.now() - session.createdAt > OTP_EXPIRY) {
        otpSessions.delete(sessionId);
        return res.status(400).json({ error: "OTP has expired" });
      }

      // Check attempts
      if (session.attempts >= MAX_ATTEMPTS) {
        otpSessions.delete(sessionId);
        return res.status(400).json({ error: "Too many attempts. Please request a new OTP." });
      }

      // Verify code
      if (code === session.code) {
        const phone = session.phone;
        otpSessions.delete(sessionId);

        // Create user session (in production, use proper session management)
        const token = Math.random().toString(36).substring(2, 15);

        res.json({
          success: true,
          token,
          phone,
          message: "Phone verified successfully",
        });
      } else {
        session.attempts++;
        res.status(400).json({
          error: "Invalid OTP code",
          attemptsLeft: MAX_ATTEMPTS - session.attempts,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    console.log(`📱 SMS verification API ready`);
  });
}

startServer().catch(console.error);
