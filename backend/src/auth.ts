import express from "express";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function authRoutes(dataSource: DataSource) {
  const router = express.Router();
  const userRepo = dataSource.getRepository(User);

  const JWT_SECRET = process.env.JWT_SECRET || "mailSchedulerSecret";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:4000/api/auth/google/callback";

  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const oauthEnabled = Boolean(clientId && clientSecret);

  // ===========================
  // Register
  // ===========================
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      const exists = await userRepo.findOne({
        where: { email },
      });

      if (exists) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepo.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepo.save(user);

      res.status(201).json({
        message: "Registration Successful",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Registration failed",
      });
    }
  });

  // ===========================
  // Login
  // ===========================
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userRepo.findOne({
        where: { email },
      });

      if (!user || !user.password) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const match = await bcrypt.compare(
        password,
        user.password
      );

      if (!match) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Login failed",
      });
    }
  });

  // ===========================
  // Google OAuth URL
  // ===========================

  router.get("/google/url", (_req, res) => {
    if (!oauthEnabled) {
      return res.status(500).json({
        error: "Google OAuth not configured",
      });
    }

    const scope = encodeURIComponent(
      "openid email profile"
    );

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline&prompt=consent`;

    res.json({
      url,
    });
  });

  // ===========================
  // Google Callback
  // ===========================

  router.get("/google/callback", async (req, res) => {
    if (!oauthEnabled) {
      return res.status(500).json({
        error: "Google OAuth not configured",
      });
    }

    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({
        error: "Missing code",
      });
    }

    try {
      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code,
            client_id: clientId!,
            client_secret: clientSecret!,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        }
      );

      const tokenData: any = await tokenResponse.json();

      const profileResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization:
              `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const profile: any =
        await profileResponse.json();

      let user = await userRepo.findOne({
        where: {
          googleId: profile.sub,
        },
      });

      if (!user) {
        user = userRepo.create({
          googleId: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
        });

        await userRepo.save(user);
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.redirect(
        `${frontendUrl}/auth/success?token=${encodeURIComponent(
          token
        )}`
      );
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Google Login Failed",
      });
    }
  });

  return router;
}