import { Request, Response } from 'express';
import Joi from 'joi';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@shared/auth';

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'subscriber', 'creator').optional()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('subscriber', 'creator').required(),
  bio: Joi.string().optional(),
  portfolio: Joi.string().uri().optional(),
  paymentMethod: Joi.string().optional()
});

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      } as LoginResponse);
    }

    const { email, password, role } = value as LoginRequest;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos' 
      } as LoginResponse);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos' 
      } as LoginResponse);
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(403).json({ 
        success: false, 
        message: `Usuário não tem permissão para acessar como ${role}` 
      } as LoginResponse);
    }

    // Special check for admin login
    if (user.role === 'admin') {
      // Only allow admin login with the specific credentials
      if (email !== 'cinexnema@gmail.com') {
        return res.status(403).json({ 
          success: false, 
          message: 'Acesso de administrador não autorizado' 
        } as LoginResponse);
      }
    }

    // Check creator approval status
    if (user.role === 'creator' && user.profile?.status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Conta de criador ainda não foi aprovada' 
      } as LoginResponse);
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.json({ 
      success: true, 
      token, 
      user: user.toJSON() 
    } as LoginResponse);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    } as LoginResponse);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      } as RegisterResponse);
    }

    const { email, password, name, role, bio, portfolio, paymentMethod } = value as RegisterRequest;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email já está em uso' 
      } as RegisterResponse);
    }

    // Create user data based on role
    const userData: any = {
      email,
      password,
      name,
      role
    };

    if (role === 'subscriber') {
      userData.subscription = {
        plan: 'premium',
        status: 'inactive'
      };
      userData.watchHistory = [];
    } else if (role === 'creator') {
      userData.profile = {
        bio,
        portfolio,
        status: 'pending'
      };
      userData.content = {
        totalVideos: 0,
        totalViews: 0,
        totalEarnings: 0,
        monthlyEarnings: 0
      };
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: role === 'creator' 
        ? 'Conta de criador criada! Aguarde aprovação da administração.' 
        : 'Conta criada com sucesso!',
      user: user.toJSON() 
    } as RegisterResponse);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    } as RegisterResponse);
  }
};

export const validateToken = async (req: Request, res: Response) => {
  // This route is protected by authenticateToken middleware
  // If we reach here, token is valid
  res.json({ 
    success: true, 
    user: req.user 
  });
};
