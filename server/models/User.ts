import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole, AdminPermission } from '@shared/auth';

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IAdminUser extends IUser {
  role: 'admin';
  permissions: AdminPermission[];
}

interface ISubscriberUser extends IUser {
  role: 'subscriber';
  assinante?: boolean;
  subscription: {
    plan: 'basic' | 'intermediate' | 'premium';
    status: 'active' | 'inactive' | 'pending' | 'cancelled';
    startDate: Date;
    nextBilling?: Date;
    paymentMethod?: string;
    mercadoPagoId?: string;
  };
  watchHistory: string[];
}

interface ICreatorUser extends IUser {
  role: 'creator';
  profile: {
    bio?: string;
    portfolio?: string;
    approvedAt?: Date;
    status: 'pending' | 'approved' | 'rejected';
  };
  content: {
    totalVideos: number;
    totalViews: number;
    totalEarnings: number;
    monthlyEarnings: number;
  };
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'subscriber', 'creator'],
    required: true
  },
  // Admin-specific fields
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_content', 'approve_creators', 'view_analytics', 'manage_payments']
  }],
  // Subscriber-specific fields
  assinante: {
    type: Boolean,
    default: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'intermediate', 'premium']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'cancelled'],
      default: 'inactive'
    },
    startDate: Date,
    nextBilling: Date,
    paymentMethod: String,
    mercadoPagoId: String
  },
  watchHistory: [String],
  // Creator-specific fields
  profile: {
    bio: String,
    portfolio: String,
    approvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  content: {
    totalVideos: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    monthlyEarnings: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform method to remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser, IAdminUser, ISubscriberUser, ICreatorUser };
